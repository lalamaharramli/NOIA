import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { siteConfig } from '../src/config/site'
import { products } from '../src/data/products'
import { LOCALES, ROUTE_KEYS, buildPath, matchRoute } from '../src/i18n/locales'

const here = dirname(fileURLToPath(import.meta.url))
const sitemap = readFileSync(resolve(here, '../public/sitemap.xml'), 'utf8')

/** All <loc> values, without the domain. */
const listedPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
  match[1]!.replace(siteConfig.url, ''),
)

const expectedPaths = LOCALES.flatMap((locale) => [
  ...ROUTE_KEYS.filter((route) => route !== 'product').map((route) => buildPath(locale, route)),
  ...products.map((product) => buildPath(locale, 'product', { slug: product.slug })),
])

describe('sitemap.xml', () => {
  it('lists every localized page and product exactly once', () => {
    expect(new Set(listedPaths).size).toBe(listedPaths.length)
    expect(new Set(listedPaths)).toEqual(new Set(expectedPaths))
  })

  it('contains only routes the app can actually render', () => {
    for (const path of listedPaths) {
      const match = matchRoute(path)
      expect(match, `unroutable sitemap entry: ${path}`).not.toBeNull()
    }
  })

  it('uses the configured domain and no query strings', () => {
    expect(siteConfig.url).toBe('https://noia.az')
    for (const path of listedPaths) {
      expect(path.startsWith('/')).toBe(true)
      expect(path).not.toContain('?')
    }
  })
})
