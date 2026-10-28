import { describe, expect, it } from 'vitest'
import { fillTemplate, formatDate, formatPrice, todayAsIsoDate } from '../src/lib/format'

describe('formatPrice', () => {
  it('uses the manat sign for AZ and RU', () => {
    expect(formatPrice(85, 'az')).toBe('85 ₼')
    expect(formatPrice(85, 'ru')).toBe('85 ₼')
  })

  it('spells out AZN in English', () => {
    expect(formatPrice(85, 'en')).toBe('85 AZN')
  })

  it('does not show decimals', () => {
    expect(formatPrice(1499.6, 'en')).toBe('1,500 AZN')
  })
})

describe('formatDate', () => {
  it('formats an ISO date for the current language', () => {
    expect(formatDate('2026-04-18', 'en')).toContain('2026')
    expect(formatDate('2026-04-18', 'en')).toContain('April')
    expect(formatDate('2026-04-18', 'ru')).toContain('2026')
  })

  it('returns the input when the date is invalid', () => {
    expect(formatDate('not-a-date', 'en')).toBe('not-a-date')
  })
})

describe('fillTemplate', () => {
  it('replaces named placeholders, including repeats', () => {
    expect(fillTemplate('{count} items: {count}', { count: 3 })).toBe('3 items: 3')
  })

  it('leaves unknown placeholders visible', () => {
    expect(fillTemplate('Hello {name}', {})).toBe('Hello {name}')
  })
})

describe('todayAsIsoDate', () => {
  it('returns the local calendar date in YYYY-MM-DD form', () => {
    const today = todayAsIsoDate()
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/)

    const now = new Date()
    const expected = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-')
    expect(today).toBe(expected)
  })
})
