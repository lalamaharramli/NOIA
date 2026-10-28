import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

/**
 * Shared test setup.
 * Testing Library cleans up React trees automatically; jsdom needs a couple
 * of browser APIs that it does not implement.
 */

afterEach(() => {
  cleanup()
})

// jsdom ships scrollTo but logs "not implemented" when called. The app calls it
// on every client-side navigation, so replace it with a no-op.
Object.defineProperty(window, 'scrollTo', {
  configurable: true,
  writable: true,
  value: () => undefined,
})
