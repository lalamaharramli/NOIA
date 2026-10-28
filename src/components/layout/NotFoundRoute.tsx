import { useLocation } from 'react-router-dom'
import { guessLocaleFromPath, type Locale } from '../../i18n/locales'
import NotFoundPage from '../../pages/NotFoundPage'
import { SiteLayout } from './SiteLayout'

/**
 * Unknown URLs still get the normal header/footer, the closest language
 * (based on the /en or /ru prefix) and a no-index 404 page.
 */
export function NotFoundRoute({ defaultLocale }: { defaultLocale: Locale }) {
  const location = useLocation()
  const locale = guessLocaleFromPath(location.pathname) ?? defaultLocale

  return (
    <SiteLayout locale={locale}>
      <NotFoundPage />
    </SiteLayout>
  )
}
