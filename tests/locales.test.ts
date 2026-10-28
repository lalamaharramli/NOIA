import { describe, expect, it } from 'vitest'
import {
  DEFAULT_LOCALE,
  LOCALES,
  ROUTE_KEYS,
  buildLocaleSwitchPath,
  buildPath,
  guessLocaleFromPath,
  matchRoute,
} from '../src/i18n/locales'

describe('buildPath', () => {
  it('uses clean URLs for the default language', () => {
    expect(buildPath('az', 'home')).toBe('/')
    expect(buildPath('az', 'shop')).toBe('/kolleksiya')
    expect(buildPath('az', 'about')).toBe('/haqqimizda')
    expect(buildPath('az', 'customOrder')).toBe('/ferdi-sifaris')
    expect(buildPath('az', 'contact')).toBe('/elaqe')
  })

  it('prefixes translated routes for English and Russian', () => {
    expect(buildPath('en', 'home')).toBe('/en')
    expect(buildPath('en', 'shop')).toBe('/en/shop')
    expect(buildPath('ru', 'home')).toBe('/ru')
    expect(buildPath('ru', 'customOrder')).toBe('/ru/zakaz')
    expect(buildPath('ru', 'product', { slug: 'tote' })).toBe('/ru/tovar/tote')
    expect(buildPath('az', 'product', { slug: 'tote' })).toBe('/mehsul/tote')
  })

  it('encodes slugs so they cannot break the URL', () => {
    expect(buildPath('en', 'product', { slug: 'a b/c' })).toBe('/en/product/a%20b%2Fc')
  })

  it('adds only non-empty query values', () => {
    expect(
      buildPath('en', 'customOrder', {
        query: { product: 'square-motif-tote', empty: '', missing: undefined },
      }),
    ).toBe('/en/custom-order?product=square-motif-tote')
  })
})

describe('matchRoute', () => {
  it('round-trips every generated route', () => {
    for (const locale of LOCALES) {
      for (const route of ROUTE_KEYS) {
        const path = buildPath(locale, route, {
          slug: route === 'product' ? 'sample-piece' : undefined,
        })
        expect(matchRoute(path), `${locale}/${route}`).toEqual({
          locale,
          route,
          ...(route === 'product' ? { slug: 'sample-piece' } : {}),
        })
      }
    }
  })

  it('accepts a trailing slash and the bare language root', () => {
    expect(matchRoute('/en/')).toEqual({ locale: 'en', route: 'home' })
    expect(matchRoute('/ru')).toEqual({ locale: 'ru', route: 'home' })
    expect(matchRoute('/en/shop/')).toEqual({ locale: 'en', route: 'shop' })
  })

  it('does not confuse the AZ shop with an AZ product', () => {
    expect(matchRoute('/kolleksiya')).toEqual({ locale: 'az', route: 'shop' })
    expect(matchRoute('/kolleksiya/square-motif-tote')).toBeNull()
  })

  it('rejects unknown pages, extra segments and malformed escapes', () => {
    expect(matchRoute('/en/nope')).toBeNull()
    expect(matchRoute('/en/shop/extra')).toBeNull()
    expect(matchRoute('/mehsul/tote/extra')).toBeNull()
    expect(matchRoute('/mehsul/%E0%A4%A')).toBeNull()
    expect(matchRoute('/english')).toBeNull()
  })

  it('decodes product slugs', () => {
    expect(matchRoute('/en/product/a%20b')).toEqual({
      locale: 'en',
      route: 'product',
      slug: 'a b',
    })
  })
})

describe('language switching', () => {
  it('keeps the visitor on the same page', () => {
    expect(buildLocaleSwitchPath('/en/product/tote', '', 'ru')).toBe('/ru/tovar/tote')
    expect(buildLocaleSwitchPath('/ru/kolleksiya', '', 'az')).toBe('/kolleksiya')
    expect(buildLocaleSwitchPath('/haqqimizda', '', 'en')).toBe('/en/about')
  })

  it('preserves the query string', () => {
    expect(buildLocaleSwitchPath('/en/shop', '?category=home&q=blanket', 'az')).toBe(
      '/kolleksiya?category=home&q=blanket',
    )
  })

  it('falls back to the home page for an unknown path', () => {
    expect(buildLocaleSwitchPath('/en/typo', '', 'ru')).toBe('/ru')
  })
})

describe('guessLocaleFromPath', () => {
  it('detects a language prefix for 404 pages', () => {
    expect(guessLocaleFromPath('/en/missing')).toBe('en')
    expect(guessLocaleFromPath('/ru')).toBe('ru')
    expect(guessLocaleFromPath('/english')).toBe(DEFAULT_LOCALE)
    expect(guessLocaleFromPath('/missing')).toBe(DEFAULT_LOCALE)
  })
})
