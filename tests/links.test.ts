import { describe, expect, it } from 'vitest'
import {
  buildInstagramUrl,
  buildMailtoUrl,
  buildWhatsAppProfileUrl,
  buildWhatsAppUrl,
} from '../src/lib/links'

describe('WhatsApp links', () => {
  it('encodes the whole message, including new lines and symbols', () => {
    const message = 'Hello NOIA!\nI want 50% cream & blush? https://noia.az/?a=1#top'
    const url = buildWhatsAppUrl('994501234567', message)

    expect(url.startsWith('https://wa.me/994501234567?text=')).toBe(true)
    const encoded = url.split('?text=')[1]!
    expect(encoded).not.toContain(' ')
    expect(encoded).not.toContain('\n')
    expect(encoded).not.toContain('&')
    expect(decodeURIComponent(encoded)).toBe(message)
  })

  it('builds a chat link without a message', () => {
    expect(buildWhatsAppProfileUrl('994501234567')).toBe('https://wa.me/994501234567')
  })
})

describe('e-mail links', () => {
  it('encodes subject and body separately', () => {
    const url = buildMailtoUrl('hello@noia.az', 'Custom order & question', 'Line one\nLine two')
    expect(url.startsWith('mailto:hello@noia.az?subject=')).toBe(true)

    const params = new URLSearchParams(url.split('?')[1])
    expect(params.get('subject')).toBe('Custom order & question')
    expect(params.get('body')).toBe('Line one\nLine two')
  })
})

describe('Instagram links', () => {
  it('builds a profile URL', () => {
    expect(buildInstagramUrl('noia.crochet')).toBe('https://www.instagram.com/noia.crochet/')
  })
})
