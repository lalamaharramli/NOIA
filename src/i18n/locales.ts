/**
 * URL and language helpers.
 *
 * The language is part of the URL:
 *   /                → Azerbaijani (default)
 *   /en, /en/shop    → English
 *   /ru, /ru/shop    → Russian
 *
 * Keeping the language in the URL means a shared link opens in the same
 * language, browser history works, and search engines can index every
 * version separately. No cookies or localStorage are required.
 */

export const LOCALES = ['az', 'en', 'ru'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'az'

/** Short labels for the language switcher. */
export const LOCALE_LABELS: Record<Locale, string> = {
  az: 'AZ',
  en: 'EN',
  ru: 'RU',
}

/** Full names, used as accessible labels. */
export const LOCALE_NAMES: Record<Locale, string> = {
  az: 'Azərbaycanca',
  en: 'English',
  ru: 'Русский',
}

/** BCP 47 tags for <html lang>, Intl formatting and meta tags. */
export const LOCALE_TAGS: Record<Locale, string> = {
  az: 'az-Latn-AZ',
  en: 'en',
  ru: 'ru',
}

export type RouteKey = 'home' | 'shop' | 'product' | 'about' | 'customOrder' | 'contact'

export const ROUTE_KEYS: RouteKey[] = ['home', 'shop', 'product', 'about', 'customOrder', 'contact']

/**
 * Translates route segments so URLs feel native in each language.
 * Product slugs are shared between languages to keep the data file simple.
 */
const routeSegments: Record<Locale, Record<RouteKey, string>> = {
  az: {
    home: '',
    shop: 'kolleksiya',
    product: 'mehsul',
    about: 'haqqimizda',
    customOrder: 'ferdi-sifaris',
    contact: 'elaqe',
  },
  en: {
    home: '',
    shop: 'shop',
    product: 'product',
    about: 'about',
    customOrder: 'custom-order',
    contact: 'contact',
  },
  ru: {
    home: '',
    shop: 'kolleksiya',
    product: 'tovar',
    about: 'o-brende',
    customOrder: 'zakaz',
    contact: 'kontakty',
  },
}

export interface BuildPathOptions {
  /** Product slug, used by the `product` route. */
  slug?: string
  /** Query string values. Empty values are skipped. */
  query?: Record<string, string | undefined>
}

/** Builds a localized path, for example buildPath('en', 'shop') → '/en/shop'. */
export function buildPath(locale: Locale, route: RouteKey, options: BuildPathOptions = {}): string {
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`
  const segments = routeSegments[locale]

  let path = prefix
  if (segments[route]) path += `/${segments[route]}`
  if (route === 'product' && options.slug) path += `/${encodeURIComponent(options.slug)}`
  if (!path) path = '/'

  if (options.query) {
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(options.query)) {
      if (value) search.set(key, value)
    }
    const queryString = search.toString()
    if (queryString) path += `?${queryString}`
  }

  return path
}

export interface RouteMatch {
  locale: Locale
  route: RouteKey
  slug?: string
}

/**
 * Reads a pathname and tells us which language and page it represents.
 * Returns null for unknown paths, which lets the app show a 404 page.
 */
export function matchRoute(pathname: string): RouteMatch | null {
  const withoutTrailingSlash = pathname.replace(/\/+$/, '') || '/'

  // Try prefixed languages first so '/en/shop' is not mistaken for AZ.
  const localesBySpecificity = [...LOCALES].sort(
    (a, b) => Number(b !== DEFAULT_LOCALE) - Number(a !== DEFAULT_LOCALE),
  )

  for (const locale of localesBySpecificity) {
    const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`

    if (
      prefix &&
      withoutTrailingSlash !== prefix &&
      !withoutTrailingSlash.startsWith(`${prefix}/`)
    ) {
      continue
    }

    const rest = withoutTrailingSlash.slice(prefix.length).replace(/^\/+/, '')
    if (!rest) return { locale, route: 'home' }

    const [firstSegment, secondSegment, ...extraSegments] = rest.split('/')
    const segments = routeSegments[locale]

    for (const route of ROUTE_KEYS) {
      if (segments[route] !== firstSegment) continue

      if (route === 'product') {
        if (!secondSegment || extraSegments.length > 0) return null

        try {
          return { locale, route, slug: decodeURIComponent(secondSegment) }
        } catch {
          // A malformed escape sequence (for example "/mehsul/%") is a 404,
          // not a crash.
          return null
        }
      }

      // Extra path segments (e.g. /shop/extra) are not valid routes.
      return secondSegment ? null : { locale, route }
    }
  }

  return null
}

/**
 * Best-effort language detection for unknown URLs (404 page).
 * `/en/typo` still shows the English chrome instead of jumping to AZ.
 */
export function guessLocaleFromPath(pathname: string): Locale {
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) return locale
  }
  return DEFAULT_LOCALE
}

/** Language switcher target for the current page. */
export function buildLocaleSwitchPath(
  pathname: string,
  search: string,
  targetLocale: Locale,
): string {
  const match = matchRoute(pathname)
  if (!match) return buildPath(targetLocale, 'home')

  const path = buildPath(targetLocale, match.route, { slug: match.slug })
  return `${path}${search}`
}
