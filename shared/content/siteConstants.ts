import { TIE_STEP_ORDER } from './tieSteps/types'

export const SITE_URL = 'https://visa-mesa.web.app'

/** Published service price in EUR (matches visamesa_be payment.config.ts full_service). */
export const SERVICE_PRICE_EUR = 100

/** Pre-discount list price shown on the website pricing card. */
export const SERVICE_ORIGINAL_PRICE_EUR = 160

/** @deprecated Use {@link SERVICE_PRICE_EUR}. */
export const SERVICE_STARTING_PRICE_EUR = SERVICE_PRICE_EUR
export const SITE_NAME = 'VisaMesa'
export const SITE_TAGLINE = 'TIE assistance in Barcelona'
export const SUPPORT_EMAIL = 'support@visamesa.com'
export const PRIVACY_EMAIL = 'privacy@visamesa.com'

export const PUBLIC_PROCESS_STEP_PATHS = TIE_STEP_ORDER.map(
  (slug) => `/process/${slug}` as const,
)

export const PUBLIC_INDEXABLE_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/pricing', changefreq: 'weekly', priority: '0.9' },
  { path: '/privacy', changefreq: 'monthly', priority: '0.6' },
  { path: '/terms', changefreq: 'monthly', priority: '0.6' },
  ...PUBLIC_PROCESS_STEP_PATHS.map((path) => ({
    path,
    changefreq: 'monthly' as const,
    priority: '0.8' as const,
  })),
] as const

export const PUBLIC_DISALLOW_PREFIXES = ['/checkout/'] as const
