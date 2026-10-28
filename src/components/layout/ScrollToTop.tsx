import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Single-page apps keep the scroll position between routes unless we reset it.
 * This also moves focus to the main region, which tells screen readers that a
 * new page has loaded.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    // A #hash means the visitor wants a specific section, so don't jump to top.
    if (!hash) {
      window.scrollTo({ top: 0, left: 0 })
      document.getElementById('main')?.focus({ preventScroll: true })
    }
  }, [pathname, hash])

  return null
}
