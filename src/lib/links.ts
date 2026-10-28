import { contactChannels } from './contact'

/**
 * Builders for links that leave the website: WhatsApp, e-mail, Instagram.
 * Every value is URL-encoded, so text typed by a visitor cannot break out
 * of the message parameter or inject extra URL parameters.
 */

export function buildWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

/** Opens the chat without a prepared message (footer, contact page). */
export function buildWhatsAppProfileUrl(number: string): string {
  return `https://wa.me/${number}`
}

export function buildMailtoUrl(email: string, subject: string, body: string): string {
  // encodeURIComponent also encodes line breaks as %0A, which mail clients expect.
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function buildInstagramUrl(handle: string): string {
  return `https://www.instagram.com/${handle}/`
}

/**
 * Returns a ready-to-use WhatsApp link, or null when no valid number
 * is configured. Components use this to decide whether to show the button.
 */
export function getWhatsAppUrl(message: string): string | null {
  return contactChannels.whatsapp ? buildWhatsAppUrl(contactChannels.whatsapp, message) : null
}

export function getMailtoUrl(subject: string, body: string): string | null {
  return contactChannels.email ? buildMailtoUrl(contactChannels.email, subject, body) : null
}

export function getInstagramUrl(): string | null {
  return contactChannels.instagram ? buildInstagramUrl(contactChannels.instagram) : null
}

export function getWhatsAppProfileUrl(): string | null {
  return contactChannels.whatsapp ? buildWhatsAppProfileUrl(contactChannels.whatsapp) : null
}

export function getEmailUrl(): string | null {
  return contactChannels.email ? `mailto:${contactChannels.email}` : null
}
