import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Test-only configuration, kept separate from vite.config.ts to make it clear
// that Vitest settings do not affect the production build.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
    css: false,
    restoreMocks: true,
  },
})
