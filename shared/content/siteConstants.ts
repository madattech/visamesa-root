export const SITE_URL = 'https://visa-mesa.web.app'

/** Lowest published service price in EUR (matches visamesa_be payment.config.ts). */
export const SERVICE_STARTING_PRICE_EUR = 10
export const SITE_NAME = 'VisaMesa'
export const SITE_TAGLINE = 'TIE assistance in Barcelona'
export const SUPPORT_EMAIL = 'support@visamesa.com'
export const PRIVACY_EMAIL = 'privacy@visamesa.com'

export const PUBLIC_INDEXABLE_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/pricing', changefreq: 'weekly', priority: '0.9' },
  { path: '/privacy', changefreq: 'monthly', priority: '0.6' },
  { path: '/terms', changefreq: 'monthly', priority: '0.6' },
] as const

export const PUBLIC_DISALLOW_PREFIXES = ['/checkout/'] as const
