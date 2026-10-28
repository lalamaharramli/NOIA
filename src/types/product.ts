import type { Locale } from '../i18n/locales'

/**
 * Product domain types.
 * These describe the shape of the objects in src/data/products.ts.
 */

export type CategoryId = 'accessories' | 'home' | 'gifts'

export const CATEGORY_IDS: CategoryId[] = ['accessories', 'home', 'gifts']

export type AvailabilityStatus = 'in-stock' | 'made-to-order' | 'sold-out'

/** The same text in every supported language. */
export type LocalizedText = Record<Locale, string>

export interface ProductOptionValue {
  /** Stable identifier used in enquiry messages and URLs. */
  id: string
  label: LocalizedText
  /** Optional colour swatch shown next to the label, e.g. '#E7CFC3'. */
  swatch?: string
}

export interface ProductOption {
  id: string
  label: LocalizedText
  values: ProductOptionValue[]
}

export interface ProductImage {
  /** Path inside the public folder, e.g. '/images/products/tote-1.svg'. */
  src: string
  alt: LocalizedText
}

export interface Product {
  /** URL-friendly unique name. Used as /kolleksiya/<slug>. */
  slug: string
  name: LocalizedText
  category: CategoryId
  shortDescription: LocalizedText
  description: LocalizedText
  /** Price in AZN, or null when the price is only available on request. */
  priceAzn: number | null
  availability: AvailabilityStatus
  /** Optional colours, sizes, etc. Keys are option ids, values are value ids. */
  options?: ProductOption[]
  images: ProductImage[]
  materials: LocalizedText
  care: LocalizedText
  /** Featured products appear on the home page. */
  featured?: boolean
}

/** Selected option values, keyed by option id. Example: { colour: 'cream' }. */
export type ProductSelections = Record<string, string>
