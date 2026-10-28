import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { NotFoundRoute } from './components/layout/NotFoundRoute'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { SiteLayout } from './components/layout/SiteLayout'
import { DEFAULT_LOCALE, LOCALES, buildPath, type Locale } from './i18n/locales'

/*
 * Pages are loaded on demand (code splitting). The first screen therefore
 * ships less JavaScript, and SiteLayout shows a small loading state while a
 * page chunk arrives. See Suspense inside SiteLayout.
 */
const HomePage = lazy(() => import('./pages/HomePage'))
const ShopPage = lazy(() => import('./pages/ShopPage'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const CustomOrderPage = lazy(() => import('./pages/CustomOrderPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))

/**
 * The same page tree is registered once per language.
 * URLs: / (AZ), /en/... (EN), /ru/... (RU).
 */
function routesForLocale(locale: Locale) {
  const productPath = `${buildPath(locale, 'product')}/:slug`

  return (
    <Route key={locale} element={<SiteLayout locale={locale} />}>
      <Route path={buildPath(locale, 'home')} element={<HomePage />} />
      <Route path={buildPath(locale, 'shop')} element={<ShopPage />} />
      <Route path={productPath} element={<ProductPage />} />
      <Route path={buildPath(locale, 'about')} element={<AboutPage />} />
      <Route path={buildPath(locale, 'customOrder')} element={<CustomOrderPage />} />
      <Route path={buildPath(locale, 'contact')} element={<ContactPage />} />
    </Route>
  )
}

export function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {LOCALES.map((locale) => routesForLocale(locale))}
        {/* Unknown URLs get a proper 404 page, still with header and footer. */}
        <Route path="*" element={<NotFoundRoute defaultLocale={DEFAULT_LOCALE} />} />
      </Routes>
    </>
  )
}
