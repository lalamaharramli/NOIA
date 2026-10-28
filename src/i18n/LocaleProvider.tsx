import { useMemo, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { LocaleContext, type LocaleContextValue } from './locale-context'
import {
  buildLocaleSwitchPath,
  buildPath,
  type BuildPathOptions,
  type Locale,
  type RouteKey,
} from './locales'
import { translations } from './translations'

interface LocaleProviderProps {
  locale: Locale
  children: ReactNode
}

/**
 * Provides the current language, its dictionary and URL helpers.
 * The language comes from the route (see App.tsx), so the URL is the
 * single source of truth — no context can drift out of sync with the address bar.
 */
export function LocaleProvider({ locale, children }: LocaleProviderProps) {
  const location = useLocation()

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      t: translations[locale],
      path: (route: RouteKey, options?: BuildPathOptions) => buildPath(locale, route, options),
      switchLocalePath: (targetLocale) =>
        buildLocaleSwitchPath(location.pathname, location.search, targetLocale),
    }),
    [locale, location.pathname, location.search],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
