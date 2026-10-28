import { Suspense, type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { LocaleProvider } from '../../i18n/LocaleProvider'
import { useLocale } from '../../i18n/locale-context'
import type { Locale } from '../../i18n/locales'
import { PageLoader } from '../ui/PageLoader'
import { DemoNotice } from './DemoNotice'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

interface SiteLayoutProps {
  locale: Locale
  /** Used by the 404 route; normal routes render their page through <Outlet>. */
  children?: ReactNode
}

export function SiteLayout({ locale, children }: SiteLayoutProps) {
  return (
    <LocaleProvider locale={locale}>
      <SiteChrome>{children}</SiteChrome>
    </LocaleProvider>
  )
}

function SiteChrome({ children }: { children?: ReactNode }) {
  const { t } = useLocale()

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="skip-link">
        {t.common.skipToContent}
      </a>
      <DemoNotice />
      <SiteHeader />

      <main id="main" tabIndex={-1} className="flex-1 focus-visible:outline-none">
        {children ?? (
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
