/**
 * Every customer contact route on the storefront goes to email.
 *
 * Ordering and enquiries previously opened WhatsApp. Email keeps the whole
 * conversation in one inbox, works on desktop where WhatsApp often does not,
 * and is what Google Merchant expects to find as a contact method.
 */
export const CONTACT_EMAIL = 'info@craigesbike.com'

/**
 * A mailto: link with the subject and body pre-filled, so the customer's mail
 * client opens ready to send rather than blank.
 */
export function emailLink(subject: string, body?: string) {
  const params = new URLSearchParams({ subject })
  if (body) params.set('body', body)
  // URLSearchParams encodes spaces as "+", which mail clients render literally.
  return `mailto:${CONTACT_EMAIL}?${params.toString().replace(/\+/g, '%20')}`
}
