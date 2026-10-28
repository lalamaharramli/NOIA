import { siteConfig } from '../config/site'

/**
 * Contact details are validated once, when this module is loaded.
 *
 * Why validate configuration? A typo such as `+994 50 123 45 67`
 * inside a `wa.me` URL produces a dead link. Instead of silently
 * shipping broken buttons, we treat invalid values as "not configured"
 * and hide those actions.
 */

/** Keeps digits only. Returns null when the number cannot work with wa.me. */
export function parseWhatsAppNumber(rawValue: string): string | null {
  const digits = rawValue.replace(/\D/g, '')
  // wa.me accepts international numbers without a leading plus sign.
  if (digits.length < 8 || digits.length > 15) return null
  return digits
}

/** Removes a leading @ and rejects characters Instagram does not allow. */
export function parseInstagramHandle(rawValue: string): string | null {
  const handle = rawValue.trim().replace(/^@/, '')
  if (!/^[A-Za-z0-9._]{1,30}$/.test(handle)) return null
  return handle
}

/**
 * A deliberately simple check: one @, a dot in the domain, no spaces.
 * Real address validation can only happen by sending an e-mail.
 */
export function isEmailAddress(value: string): boolean {
  const trimmed = value.trim()
  if (trimmed.length > 254 || /\s/.test(trimmed)) return false
  return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(trimmed)
}

const whatsappNumber = parseWhatsAppNumber(siteConfig.whatsappNumber)
const instagramHandle = parseInstagramHandle(siteConfig.instagramHandle)
const email = isEmailAddress(siteConfig.email) ? siteConfig.email.trim() : null

/** Resolved, safe-to-use contact channels. `null` means "not configured". */
export const contactChannels = {
  whatsapp: whatsappNumber,
  instagram: instagramHandle,
  email,
} as const

export const hasAnyContactChannel = Boolean(whatsappNumber || instagramHandle || email)

// Development-only hints. They never run in the production bundle because
// `import.meta.env.DEV` is replaced by `false` during `npm run build`.
if (import.meta.env.DEV) {
  if (siteConfig.whatsappNumber && !whatsappNumber) {
    console.warn(
      '[NOIA] whatsappNumber must contain 8–15 digits in international format, e.g. "994501234567".',
    )
  }
  if (siteConfig.instagramHandle && !instagramHandle) {
    console.warn('[NOIA] instagramHandle contains characters Instagram does not allow.')
  }
  if (siteConfig.email && !email) {
    console.warn('[NOIA] email does not look like a valid e-mail address.')
  }
}
