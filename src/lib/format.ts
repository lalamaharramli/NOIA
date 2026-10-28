import { LOCALE_TAGS, type Locale } from '../i18n/locales'

/**
 * Formats a price in Azerbaijani manat (AZN).
 * `85` becomes "85 ₼" (AZ/RU) or "85 AZN" (EN).
 */
export function formatPrice(priceAzn: number, locale: Locale): string {
  const amount = new Intl.NumberFormat(LOCALE_TAGS[locale], {
    maximumFractionDigits: 0,
  }).format(priceAzn)

  return locale === 'en' ? `${amount} AZN` : `${amount} ₼`
}

/** Converts "2026-04-18" into a readable local date. */
export function formatDate(isoDate: string, locale: Locale): string {
  const date = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return isoDate

  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], { dateStyle: 'long' }).format(date)
}

/** Today as YYYY-MM-DD in the visitor's local timezone. */
export function todayAsIsoDate(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

/**
 * Replaces {placeholders} inside a translated string.
 * Missing values are left visible so mistakes are easy to spot.
 *
 * fillTemplate('Results: {count}', { count: 3 }) → 'Results: 3'
 */
export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}
