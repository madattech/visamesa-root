/** Shared consent logic for web + mobile */
export const CONSENT_POLICY_VERSION = 'v1.0'

export type ConsentType = 'privacy_policy' | 'terms_of_service'

export type ConsentEntry = {
  type: ConsentType
  policyVersion: string
  acceptedAt?: string
}

export type ConsentAcceptanceStatus = {
  privacyPolicy: boolean
  termsOfService: boolean
  privacyAcceptedAt: string | null
  termsAcceptedAt: string | null
}

export const EMPTY_CONSENT_STATUS: ConsentAcceptanceStatus = {
  privacyPolicy: false,
  termsOfService: false,
  privacyAcceptedAt: null,
  termsAcceptedAt: null,
}

export function buildConsentStatus(
  consents: ConsentEntry[],
): ConsentAcceptanceStatus {
  const current = consents.filter(
    (consent) => consent.policyVersion === CONSENT_POLICY_VERSION,
  )

  const privacy = current.find((consent) => consent.type === 'privacy_policy')
  const terms = current.find((consent) => consent.type === 'terms_of_service')

  return {
    privacyPolicy: Boolean(privacy),
    termsOfService: Boolean(terms),
    privacyAcceptedAt: privacy?.acceptedAt ?? null,
    termsAcceptedAt: terms?.acceptedAt ?? null,
  }
}

export function isConsentStatusComplete(status: ConsentAcceptanceStatus): boolean {
  return status.privacyPolicy && status.termsOfService
}

export function isConsentComplete(consents: ConsentEntry[]): boolean {
  return isConsentStatusComplete(buildConsentStatus(consents))
}

export function getMissingConsentTypes(consents: ConsentEntry[]): ConsentType[] {
  const current = consents.filter(
    (consent) => consent.policyVersion === CONSENT_POLICY_VERSION,
  )
  const recorded = new Set(current.map((consent) => consent.type))
  const missing: ConsentType[] = []

  if (!recorded.has('privacy_policy')) {
    missing.push('privacy_policy')
  }

  if (!recorded.has('terms_of_service')) {
    missing.push('terms_of_service')
  }

  return missing
}

export const CHECKOUT_SOURCE_STORAGE_KEY = 'visamesa_checkout_source'
