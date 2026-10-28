import { describe, expect, it } from 'vitest'
import { isEmailAddress, parseInstagramHandle, parseWhatsAppNumber } from '../src/lib/contact'

describe('parseWhatsAppNumber', () => {
  it('keeps digits from a readable international number', () => {
    expect(parseWhatsAppNumber('+994 50 123 45 67')).toBe('994501234567')
    expect(parseWhatsAppNumber('994-50-123-45-67')).toBe('994501234567')
  })

  it('rejects numbers that wa.me cannot use', () => {
    expect(parseWhatsAppNumber('')).toBeNull()
    expect(parseWhatsAppNumber('12345')).toBeNull()
    expect(parseWhatsAppNumber('1234567890123456')).toBeNull()
  })
})

describe('parseInstagramHandle', () => {
  it('removes the @ and accepts dots and underscores', () => {
    expect(parseInstagramHandle('@noia.crochet')).toBe('noia.crochet')
    expect(parseInstagramHandle('  noia_az  ')).toBe('noia_az')
  })

  it('rejects spaces and unsupported characters', () => {
    expect(parseInstagramHandle('noia crochet')).toBeNull()
    expect(parseInstagramHandle('noia/crochet')).toBeNull()
    expect(parseInstagramHandle('')).toBeNull()
  })
})

describe('isEmailAddress', () => {
  it('accepts ordinary addresses', () => {
    expect(isEmailAddress('hello@noia.az')).toBe(true)
    expect(isEmailAddress('  hello@noia.az  ')).toBe(true)
  })

  it('rejects incomplete or malformed addresses', () => {
    expect(isEmailAddress('hello')).toBe(false)
    expect(isEmailAddress('hello@noia')).toBe(false)
    expect(isEmailAddress('hello @noia.az')).toBe(false)
    expect(isEmailAddress('hello@noia.a')).toBe(false)
    expect(isEmailAddress('')).toBe(false)
  })
})
