import { createContext, useContext } from 'react'
import type { BuildPathOptions, Locale, RouteKey } from './locales'
import type { Translation } from './translations'

export interface LocaleContextValue {
  /** Current language, derived from the URL. */
  locale: Locale
  /** Translation dictionary for the current language. */
  t: Translation
  /** Builds a path for the current language, e.g. path('shop'). */
  path: (route: RouteKey, options?: BuildPathOptions) => string
  /** URL of the same page in another language. */
  switchLocalePath: (targetLocale: Locale) => string
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)

/**
 * Small hook used by every component that needs translated text.
 * It throws a clear error instead of silently returning `undefined`
 * if a component is rendered outside <LocaleProvider>.
 */
export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext)
  if (!value) {
    throw new Error('useLocale must be used inside <LocaleProvider>.')
  }
  return value
}
