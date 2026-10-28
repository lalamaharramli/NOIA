import type { Locale } from '../i18n/locales'
import type { Translation } from '../i18n/translations'
import type { Product, ProductSelections } from '../types/product'
import { isEmailAddress } from './contact'
import { fillTemplate, formatDate, formatPrice, todayAsIsoDate } from './format'

/**
 * ============================================================
 *  Custom order enquiries
 * ============================================================
 *
 * There is no backend. The form turns the visitor's answers into a
 * plain-text message and opens it in WhatsApp or their e-mail app.
 * That keeps the site free, private and genuinely working without a
 * server. It also means:
 *   - the message is NOT sent until the visitor confirms it in the app;
 *   - attachments are impossible, so reference photos are sent in the chat.
 *
 * All validation and sanitising lives here so it can be unit-tested
 * without rendering React components.
 */

export const PRODUCT_TYPE_KEYS = [
  'bag',
  'hat',
  'scarf',
  'homeTextile',
  'toy',
  'accessory',
  'other',
] as const

export type ProductType = (typeof PRODUCT_TYPE_KEYS)[number]

export type ContactMethod = 'whatsapp' | 'email'

export interface InquiryDraft {
  name: string
  contactMethod: ContactMethod
  /** Phone number or e-mail address, depending on contactMethod. */
  contact: string
  productType: ProductType | ''
  colors: string
  description: string
  /** ISO date (YYYY-MM-DD) or an empty string. */
  deadline: string
}

export type InquiryField = keyof InquiryDraft

export type InquiryErrorCode =
  | 'required'
  | 'tooShort'
  | 'tooLong'
  | 'invalidEmail'
  | 'invalidPhone'
  | 'invalidDate'
  | 'invalidProduct'

export type InquiryErrors = Partial<Record<InquiryField, InquiryErrorCode>>

/** Shared limits, also used to set maxLength on the inputs. */
export const INQUIRY_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  contactMax: 120,
  colorsMax: 120,
  descriptionMin: 20,
  descriptionMax: 1200,
} as const

export const EMPTY_INQUIRY: InquiryDraft = {
  name: '',
  contactMethod: 'whatsapp',
  contact: '',
  productType: '',
  colors: '',
  description: '',
  deadline: '',
}

/**
 * Cleans text before it is validated or placed into a message link.
 * - removes control and invisible direction-override characters;
 * - normalises line endings and repeated blank lines;
 * - trims and limits the length.
 */
export function sanitizeText(value: string, maxLength: number): string {
  return (
    value
      // The control-character range is intentional: it strips invisible text
      // that could break links or reorder the message when pasted into chat.
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u202A-\u202E\u2066-\u2069]/g, '')
      .replace(/\r\n?/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
      .slice(0, maxLength)
  )
}

/** Loose international phone check: 8–15 digits, optional +, spaces and brackets. */
export function isValidPhoneNumber(value: string): boolean {
  const trimmed = value.trim()
  if (!/^\+?[\d\s()-]+$/.test(trimmed)) return false
  const digits = trimmed.replace(/\D/g, '')
  return digits.length >= 8 && digits.length <= 15
}

/**
 * True only for a real calendar date in YYYY-MM-DD form.
 * `new Date('2026-02-31')` silently becomes 3 March, so we round-trip
 * the value and compare it to the input.
 */
export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function isProductType(value: string): value is ProductType {
  return (PRODUCT_TYPE_KEYS as readonly string[]).includes(value)
}

/**
 * Validates a draft and returns one error code per invalid field.
 * `today` is injectable so tests do not depend on the current date.
 */
export function validateInquiry(
  draft: InquiryDraft,
  today: string = todayAsIsoDate(),
): InquiryErrors {
  const errors: InquiryErrors = {}

  const name = draft.name.trim()
  if (!name) errors.name = 'required'
  else if (name.length < INQUIRY_LIMITS.nameMin) errors.name = 'tooShort'
  else if (name.length > INQUIRY_LIMITS.nameMax) errors.name = 'tooLong'

  const contact = draft.contact.trim()
  if (!contact) {
    errors.contact = 'required'
  } else if (contact.length > INQUIRY_LIMITS.contactMax) {
    errors.contact = 'tooLong'
  } else if (draft.contactMethod === 'email') {
    if (!isEmailAddress(contact)) errors.contact = 'invalidEmail'
  } else if (!isValidPhoneNumber(contact)) {
    errors.contact = 'invalidPhone'
  }

  if (!isProductType(draft.productType)) errors.productType = 'invalidProduct'

  if (draft.colors.trim().length > INQUIRY_LIMITS.colorsMax) errors.colors = 'tooLong'

  const description = draft.description.trim()
  if (!description) errors.description = 'required'
  else if (description.length < INQUIRY_LIMITS.descriptionMin) errors.description = 'tooShort'
  else if (description.length > INQUIRY_LIMITS.descriptionMax) errors.description = 'tooLong'

  if (draft.deadline) {
    // ISO dates can be compared as text: '2026-05-01' > '2026-04-30'.
    // isValidIsoDate also rejects impossible dates such as 31 February.
    if (!isValidIsoDate(draft.deadline) || draft.deadline < today) {
      errors.deadline = 'invalidDate'
    }
  }

  return errors
}

export function hasErrors(errors: InquiryErrors): boolean {
  return Object.keys(errors).length > 0
}

interface CustomMessageOptions {
  labels: Translation['inquiry']
  locale: Locale
  productTypeLabel: string
  contactMethodLabel: string
}

/** Builds the plain-text WhatsApp / e-mail body for a custom order. */
export function buildCustomOrderMessage(
  draft: InquiryDraft,
  { labels, locale, productTypeLabel, contactMethodLabel }: CustomMessageOptions,
): string {
  const lines = [
    labels.greeting,
    '',
    labels.customIntro,
    `${labels.name}: ${draft.name.trim()}`,
    `${labels.contact} (${contactMethodLabel}): ${draft.contact.trim()}`,
    `${labels.productType}: ${productTypeLabel}`,
  ]

  if (draft.colors.trim()) lines.push(`${labels.colors}: ${draft.colors.trim()}`)
  if (draft.deadline) lines.push(`${labels.deadline}: ${formatDate(draft.deadline, locale)}`)

  lines.push('', `${labels.description}:`, draft.description.trim(), '', '— noia.az')

  return lines.join('\n')
}

/** Builds the message used from a product page, including selected options. */
export function buildProductInquiryMessage(
  product: Product,
  selections: ProductSelections,
  labels: Translation['inquiry'],
  locale: Locale,
  productUrl: string,
): string {
  const lines = [labels.greeting, '', labels.productIntro, `• ${product.name[locale]}`]

  if (product.priceAzn !== null) {
    lines.push(`${labels.price}: ${formatPrice(product.priceAzn, locale)}`)
  }

  for (const option of product.options ?? []) {
    const selectedId = selections[option.id]
    const selectedValue = option.values.find((value) => value.id === selectedId)
    if (selectedValue) {
      lines.push(`${option.label[locale]}: ${selectedValue.label[locale]}`)
    }
  }

  lines.push('', `${labels.link}: ${productUrl}`, '', '— noia.az')

  return lines.join('\n')
}

export function buildProductEmailSubject(
  product: Product,
  labels: Translation['inquiry'],
  locale: Locale,
): string {
  return fillTemplate(labels.emailSubjectProduct, { product: product.name[locale] })
}
