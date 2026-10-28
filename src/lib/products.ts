import { products } from '../data/products'
import { CATEGORY_IDS, type CategoryId, type Product } from '../types/product'

/**
 * Pure functions for looking up and filtering products.
 * Keeping this logic out of components makes it easy to test and reuse.
 */

export type CategoryFilter = CategoryId | 'all'

/** Type guard for category values coming from the URL (?category=home). */
export function isCategoryId(value: string | null): value is CategoryId {
  return value !== null && (CATEGORY_IDS as readonly string[]).includes(value)
}

export interface ProductQuery {
  /** Free text typed by the visitor. */
  search: string
  category: CategoryFilter
}

/**
 * Folds accents and case so that "sapka", "Şapka" and "ŞAPKA" match.
 * Azerbaijani letters such as ə, ş, ı therefore behave predictably.
 */
export function normalizeSearchTerm(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/** Finds products matching both the search text and the chosen category. */
export function filterProducts(
  list: Product[],
  query: ProductQuery,
  locale: keyof Product['name'],
): Product[] {
  const terms = normalizeSearchTerm(query.search).split(' ').filter(Boolean)

  return list.filter((product) => {
    if (query.category !== 'all' && product.category !== query.category) {
      return false
    }
    if (terms.length === 0) return true

    const searchableText = normalizeSearchTerm(
      [
        product.name[locale],
        product.shortDescription[locale],
        product.description[locale],
        product.materials[locale],
      ].join(' '),
    )

    return terms.every((term) => searchableText.includes(term))
  })
}

export function findProductBySlug(slug: string | undefined): Product | undefined {
  if (!slug) return undefined
  return products.find((product) => product.slug === slug)
}

export function getFeaturedProducts(limit = 3): Product[] {
  return products.filter((product) => product.featured).slice(0, limit)
}

/** Related products share the category when possible. */
export function getRelatedProducts(product: Product, limit = 3): Product[] {
  const sameCategory = products.filter(
    (item) => item.slug !== product.slug && item.category === product.category,
  )
  const others = products.filter(
    (item) => item.slug !== product.slug && item.category !== product.category,
  )

  return [...sameCategory, ...others].slice(0, limit)
}
