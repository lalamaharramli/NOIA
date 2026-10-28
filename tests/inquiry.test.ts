import { describe, expect, it } from 'vitest'
import { products } from '../src/data/products'
import { en } from '../src/i18n/translations/en'
import {
  EMPTY_INQUIRY,
  INQUIRY_LIMITS,
  buildCustomOrderMessage,
  buildProductEmailSubject,
  buildProductInquiryMessage,
  hasErrors,
  isValidIsoDate,
  isValidPhoneNumber,
  sanitizeText,
  validateInquiry,
  type InquiryDraft,
} from '../src/lib/inquiry'

const validDraft: InquiryDraft = {
  name: 'Aysel',
  contactMethod: 'whatsapp',
  contact: '+994 50 123 45 67',
  productType: 'bag',
  colors: 'cream',
  description: 'A roomy bag in cream cotton, please.',
  deadline: '',
}

describe('sanitizeText', () => {
  it('removes control and direction-override characters', () => {
    expect(sanitizeText('He\u0000llo\u202E world', 100)).toBe('Hello world')
  })

  it('normalises line endings and repeated blank lines', () => {
    expect(sanitizeText('Line one\r\nLine two\r\n\r\n\r\n\r\nLine three', 200)).toBe(
      'Line one\nLine two\n\nLine three',
    )
  })

  it('collapses horizontal whitespace and trims', () => {
    expect(sanitizeText('   lots \t of    spaces   ', 100)).toBe('lots of spaces')
  })

  it('limits the length after cleaning', () => {
    expect(sanitizeText('abcdefghij', 4)).toBe('abcd')
  })
})

describe('isValidPhoneNumber', () => {
  it('accepts international numbers with readable separators', () => {
    expect(isValidPhoneNumber('+994 50 123 45 67')).toBe(true)
    expect(isValidPhoneNumber('(994) 50-123-45-67')).toBe(true)
    expect(isValidPhoneNumber('0501234567')).toBe(true)
  })

  it('rejects letters, short numbers and long numbers', () => {
    expect(isValidPhoneNumber('call me')).toBe(false)
    expect(isValidPhoneNumber('1234567')).toBe(false)
    expect(isValidPhoneNumber('1234567890123456')).toBe(false)
  })
})

describe('isValidIsoDate', () => {
  it('accepts real calendar dates only', () => {
    expect(isValidIsoDate('2026-10-28')).toBe(true)
    expect(isValidIsoDate('2028-02-29')).toBe(true)
    expect(isValidIsoDate('2026-02-29')).toBe(false)
    expect(isValidIsoDate('2026-13-01')).toBe(false)
    expect(isValidIsoDate('2026-00-10')).toBe(false)
    expect(isValidIsoDate('2026-2-3')).toBe(false)
    expect(isValidIsoDate('')).toBe(false)
  })
})

describe('validateInquiry', () => {
  it('accepts a complete draft', () => {
    expect(validateInquiry(validDraft, '2026-10-28')).toEqual({})
    expect(hasErrors(validateInquiry(validDraft, '2026-10-28'))).toBe(false)
  })

  it('reports every required field on an empty form', () => {
    const errors = validateInquiry({ ...EMPTY_INQUIRY, contactMethod: 'email' }, '2026-10-28')
    expect(errors.name).toBe('required')
    expect(errors.contact).toBe('required')
    expect(errors.productType).toBe('invalidProduct')
    expect(errors.description).toBe('required')
    expect(errors.colors).toBeUndefined()
    expect(errors.deadline).toBeUndefined()
  })

  it('checks the name length', () => {
    expect(validateInquiry({ ...validDraft, name: 'A' }, '2026-10-28').name).toBe('tooShort')
    expect(
      validateInquiry({ ...validDraft, name: 'x'.repeat(INQUIRY_LIMITS.nameMax + 1) }, '2026-10-28')
        .name,
    ).toBe('tooLong')
  })

  it('validates the contact according to the chosen method', () => {
    expect(validateInquiry({ ...validDraft, contact: 'call me' }, '2026-10-28').contact).toBe(
      'invalidPhone',
    )

    const emailDraft: InquiryDraft = {
      ...validDraft,
      contactMethod: 'email',
      contact: 'not-an-email',
    }
    expect(validateInquiry(emailDraft, '2026-10-28').contact).toBe('invalidEmail')
    expect(
      validateInquiry({ ...emailDraft, contact: 'aysel@example.com' }, '2026-10-28').contact,
    ).toBeUndefined()
  })

  it('enforces the description limits', () => {
    expect(validateInquiry({ ...validDraft, description: 'short' }, '2026-10-28').description).toBe(
      'tooShort',
    )
    expect(
      validateInquiry(
        { ...validDraft, description: 'x'.repeat(INQUIRY_LIMITS.descriptionMax + 1) },
        '2026-10-28',
      ).description,
    ).toBe('tooLong')
  })

  it('rejects overly long colours', () => {
    expect(
      validateInquiry(
        { ...validDraft, colors: 'x'.repeat(INQUIRY_LIMITS.colorsMax + 1) },
        '2026-10-28',
      ).colors,
    ).toBe('tooLong')
  })

  it('rejects past, impossible and malformed deadlines', () => {
    expect(validateInquiry({ ...validDraft, deadline: '2026-10-27' }, '2026-10-28').deadline).toBe(
      'invalidDate',
    )
    expect(validateInquiry({ ...validDraft, deadline: '2026-02-31' }, '2026-10-28').deadline).toBe(
      'invalidDate',
    )
    expect(validateInquiry({ ...validDraft, deadline: 'soon' }, '2026-10-28').deadline).toBe(
      'invalidDate',
    )
    expect(
      validateInquiry({ ...validDraft, deadline: '2026-10-28' }, '2026-10-28').deadline,
    ).toBeUndefined()
    expect(
      validateInquiry({ ...validDraft, deadline: '2027-01-15' }, '2026-10-28').deadline,
    ).toBeUndefined()
  })
})

describe('buildCustomOrderMessage', () => {
  const labels = en.inquiry

  it('includes every answer, the readable date and the site signature', () => {
    const message = buildCustomOrderMessage(
      { ...validDraft, deadline: '2026-12-01' },
      {
        labels,
        locale: 'en',
        productTypeLabel: 'Bag',
        contactMethodLabel: 'WhatsApp',
      },
    )

    expect(message).toContain('Hello, NOIA!')
    expect(message).toContain('Name: Aysel')
    expect(message).toContain('Contact (WhatsApp): +994 50 123 45 67')
    expect(message).toContain('Type of piece: Bag')
    expect(message).toContain('Colours: cream')
    expect(message).toContain('Deadline: December 1, 2026')
    expect(message).toContain('A roomy bag in cream cotton, please.')
    expect(message.trimEnd().endsWith('— noia.az')).toBe(true)
  })

  it('omits optional lines that were left empty', () => {
    const message = buildCustomOrderMessage(
      { ...validDraft, colors: '' },
      {
        labels,
        locale: 'en',
        productTypeLabel: 'Bag',
        contactMethodLabel: 'WhatsApp',
      },
    )

    expect(message).not.toContain('Colours:')
    expect(message).not.toContain('Deadline:')
  })
})

describe('product enquiries', () => {
  const product = products.find((item) => item.slug === 'square-motif-tote')!

  it('includes the selected options, price and link', () => {
    const message = buildProductInquiryMessage(
      product,
      { colour: 'blush' },
      en.inquiry,
      'en',
      'https://noia.az/en/product/square-motif-tote',
    )

    expect(message).toContain('• Square Motif Tote')
    expect(message).toContain('Price: 85 AZN')
    expect(message).toContain('Colour: Soft blush')
    expect(message).toContain('Link: https://noia.az/en/product/square-motif-tote')
    expect(message.trimEnd().endsWith('— noia.az')).toBe(true)
  })

  it('skips options without a selection', () => {
    const message = buildProductInquiryMessage(product, {}, en.inquiry, 'en', 'https://noia.az')
    expect(message).not.toContain('Colour:')
  })

  it('builds a subject containing the product name', () => {
    expect(buildProductEmailSubject(product, en.inquiry, 'en')).toBe(
      'Product enquiry: Square Motif Tote',
    )
  })
})
