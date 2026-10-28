/**
 * ============================================================
 *  NOIA — business configuration
 * ============================================================
 *
 * This is the FIRST file to edit when you publish the site.
 * It is the only place where contact details live.
 *
 * HOW TO EDIT
 * -----------
 * 1. Fill in the fields below with the real details.
 * 2. Set `showExampleNotice` to false once the products in
 *    src/data/products.ts are real.
 * 3. Restart the dev server if it was running.
 *
 * Nothing here is secret. Everything in this file is sent to
 * the browser, so never put passwords or API keys in it.
 */

export const siteConfig = {
  name: 'NOIA',
  domain: 'noia.az',
  /** Used for canonical links, the sitemap and social previews. */
  url: 'https://noia.az',

  /**
   * Public contact e-mail address, for example 'hello@noia.az'.
   * Leave empty while unknown: the interface will hide the
   * e-mail button instead of showing a broken link.
   */
  email: '',

  /**
   * WhatsApp number in international format, digits only.
   * Example: '994501234567' (country code + number, no +, spaces or dashes).
   */
  whatsappNumber: '',

  /**
   * Instagram username without the @ symbol.
   * Example: 'noia.crochet'
   */
  instagramHandle: '',

  /**
   * Shows a small, honest "demo build" strip on the site while the
   * catalogue and contact details are still placeholders.
   * Set this to false for the public launch.
   */
  showExampleNotice: true,
} as const
