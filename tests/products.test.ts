import { describe, expect, it } from 'vitest'
import { products } from '../src/data/products'
import {
  filterProducts,
  findProductBySlug,
  getFeaturedProducts,
  getRelatedProducts,
  isCategoryId,
  normalizeSearchTerm,
} from '../src/lib/products'
import { CATEGORY_IDS } from '../src/types/product'

describe('normalizeSearchTerm', () => {
  it('folds case, accents and repeated spaces', () => {
    expect(normalizeSearchTerm('  ŞAPKA  ')).toBe('sapka')
    expect(normalizeSearchTerm('Café   au lait')).toBe('cafe au lait')
  })
})

describe('filterProducts', () => {
  it('returns the whole catalogue for an empty query', () => {
    expect(filterProducts(products, { search: '', category: 'all' }, 'az')).toHaveLength(
      products.length,
    )
  })

  it('filters by category', () => {
    const home = filterProducts(products, { search: '', category: 'home' }, 'en')
    expect(home.length).toBeGreaterThan(0)
    expect(home.every((product) => product.category === 'home')).toBe(true)
  })

  it('searches the current language only', () => {
    const english = filterProducts(products, { search: 'blanket', category: 'all' }, 'en')
    expect(english.map((product) => product.slug)).toContain('ripple-baby-blanket')

    const azerbaijani = filterProducts(products, { search: 'yorğan', category: 'all' }, 'az')
    expect(azerbaijani.map((product) => product.slug)).toContain('ripple-baby-blanket')

    // "yorğan" is not part of the English text.
    expect(filterProducts(products, { search: 'yorğan', category: 'all' }, 'en')).toHaveLength(0)
  })

  it('requires every word to match', () => {
    const matches = filterProducts(products, { search: 'square tote', category: 'all' }, 'en')
    expect(matches.map((product) => product.slug)).toEqual(['square-motif-tote'])

    expect(
      filterProducts(products, { search: 'square scarf', category: 'all' }, 'en'),
    ).toHaveLength(0)
  })

  it('combines search and category', () => {
    expect(
      filterProducts(products, { search: 'blanket', category: 'accessories' }, 'en'),
    ).toHaveLength(0)
  })
})

describe('catalogue lookups', () => {
  it('recognises valid category ids only', () => {
    for (const category of CATEGORY_IDS) expect(isCategoryId(category)).toBe(true)
    expect(isCategoryId('all')).toBe(false)
    expect(isCategoryId(null)).toBe(false)
    expect(isCategoryId('')).toBe(false)
  })

  it('finds a product by slug', () => {
    expect(findProductBySlug('square-motif-tote')?.name.en).toBe('Square Motif Tote')
    expect(findProductBySlug('missing')).toBeUndefined()
    expect(findProductBySlug(undefined)).toBeUndefined()
  })

  it('returns at most three featured products', () => {
    const featured = getFeaturedProducts(3)
    expect(featured.length).toBeLessThanOrEqual(3)
    expect(featured.every((product) => product.featured)).toBe(true)
  })

  it('suggests related products without repeating the current one', () => {
    const product = products[0]!
    const related = getRelatedProducts(product)
    expect(related.length).toBeLessThanOrEqual(3)
    expect(related.some((item) => item.slug === product.slug)).toBe(false)
    expect(new Set(related.map((item) => item.slug)).size).toBe(related.length)
  })
})

describe('catalogue data quality', () => {
  it('has unique slugs, two images and all three languages', () => {
    const slugs = products.map((product) => product.slug)
    expect(new Set(slugs).size).toBe(slugs.length)

    for (const product of products) {
      expect(product.slug).toMatch(/^[a-z0-9-]+$/)
      expect(product.images.length).toBeGreaterThanOrEqual(2)
      for (const key of ['az', 'en', 'ru'] as const) {
        expect(product.name[key].trim()).not.toBe('')
        expect(product.shortDescription[key].trim()).not.toBe('')
        expect(product.description[key].trim()).not.toBe('')
        expect(product.materials[key].trim()).not.toBe('')
        expect(product.care[key].trim()).not.toBe('')
      }
    }
  })
})
