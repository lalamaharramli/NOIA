import { useEffect } from 'react'
import { siteConfig } from '../config/site'
import { DEFAULT_LOCALE, LOCALES, buildPath, matchRoute } from '../i18n/locales'

/**
 * Keeps <head> in sync with the current page: title, description,
 * canonical URL, Open Graph/Twitter tags and hreflang alternates.
 *
 * Why a hook instead of a library? The site needs exactly these tags;
 * a small dependency-free helper is easier to read and to debug.
 *
 * NOTE: search engines see the HTML before React runs. A single-page app
 * cannot match a server-rendered site for SEO. Titles and descriptions set
 * here are used by browsers, social previews that execute JavaScript, and
 * after a client-side navigation. For stronger SEO, see the "Prerendering"
 * section in DEPLOYMENT.md.
 */

export interface PageMeta {
  title: string
  description: string
  /** Path used for canonical and alternate URLs. Do not include query strings. */
  path: string
  /**
   * Optional site-relative raster preview image (PNG/JPEG/WebP/GIF).
   * Defaults to /og-image.png; SVG is rejected because social crawlers
   * generally cannot render it.
   */
  image?: string
  /** Ask search engines not to index this page (used by the 404 page). */
  noIndex?: boolean
}

const OG_LOCALES: Record<string, string> = {
  az: 'az_AZ',
  en: 'en_US',
  ru: 'ru_RU',
}

function setMeta(attribute: 'name' | 'property', key: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setCanonical(href: string): void {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }
  element.href = href
}

/** Absolute URLs are required by Open Graph and hreflang. */
function absoluteUrl(path: string): string {
  return `${siteConfig.url.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}

function replaceAlternateLinks(pathname: string): void {
  // Remove only the links this function created, not any hand-written ones.
  document.head
    .querySelectorAll('link[data-managed="hreflang"]')
    .forEach((element) => element.remove())

  const match = matchRoute(pathname)
  if (!match) return

  for (const locale of LOCALES) {
    const localizedPath = buildPath(locale, match.route, { slug: match.slug })
    const link = document.createElement('link')
    link.rel = 'alternate'
    link.hreflang = locale
    link.href = absoluteUrl(localizedPath)
    link.dataset.managed = 'hreflang'
    document.head.appendChild(link)

    if (locale === DEFAULT_LOCALE) {
      const defaultLink = document.createElement('link')
      defaultLink.rel = 'alternate'
      defaultLink.hreflang = 'x-default'
      defaultLink.href = absoluteUrl(localizedPath)
      defaultLink.dataset.managed = 'hreflang'
      document.head.appendChild(defaultLink)
    }
  }
}

function replaceOgLocales(locale: string): void {
  // Open Graph wants the page's own locale plus the other available ones.
  // Rebuild them on every route so a stale language list cannot leak across
  // client-side navigation.
  document.head.querySelectorAll('meta[property="og:locale:alternate"]').forEach((element) => {
    element.remove()
  })

  for (const otherLocale of LOCALES) {
    if (otherLocale === locale) continue

    const meta = document.createElement('meta')
    meta.setAttribute('property', 'og:locale:alternate')
    meta.content = OG_LOCALES[otherLocale] ?? otherLocale
    meta.dataset.managed = 'og-locale'
    document.head.appendChild(meta)
  }
}

export function usePageMeta({ title, description, path, image, noIndex }: PageMeta): void {
  useEffect(() => {
    document.title = title

    const canonicalUrl = absoluteUrl(path)
    // Open Graph images must be raster formats. Product artwork is currently
    // SVG, which social crawlers do not render, so those pages keep the
    // branded PNG preview until real PNG/JPEG/WebP photos are supplied.
    const socialImage = image && /\.(?:png|jpe?g|webp|gif)$/i.test(image) ? image : '/og-image.png'
    const imageUrl = absoluteUrl(socialImage)
    const locale = matchRoute(path)?.locale ?? DEFAULT_LOCALE

    document.documentElement.lang = locale
    setCanonical(canonicalUrl)
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', canonicalUrl)
    setMeta('property', 'og:image', imageUrl)
    setMeta('property', 'og:image:alt', title)
    setMeta('property', 'og:locale', OG_LOCALES[locale] ?? 'az_AZ')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', imageUrl)
    setMeta('name', 'twitter:image:alt', title)
    replaceOgLocales(locale)

    const existingRobots = document.querySelector<HTMLMetaElement>('meta[data-managed="robots"]')
    if (noIndex) {
      const robots = existingRobots ?? document.createElement('meta')
      robots.name = 'robots'
      robots.content = 'noindex, nofollow'
      robots.dataset.managed = 'robots'
      if (!existingRobots) document.head.appendChild(robots)
    } else {
      existingRobots?.remove()
    }

    replaceAlternateLinks(path)
  }, [title, description, path, image, noIndex])
}
