import { describe, expect, it } from 'vitest'

import {
  CHECKOUT_SOURCE_STORAGE_KEY,
  CONSENT_POLICY_VERSION,
  buildConsentStatus,
  getMissingConsentTypes,
  isConsentComplete,
  isConsentStatusComplete,
} from './checkoutContent'

describe('checkoutContent', () => {
  it('exports shared consent version', () => {
    expect(CONSENT_POLICY_VERSION).toBe('v1.0')
  })

  it('exports checkout source storage key', () => {
    expect(CHECKOUT_SOURCE_STORAGE_KEY).toBe('visamesa_checkout_source')
  })

  it('detects complete consent for the current policy version only', () => {
    expect(isConsentComplete([])).toBe(false)
    expect(
      isConsentComplete([
        { type: 'privacy_policy', policyVersion: 'v1.0' },
        { type: 'terms_of_service', policyVersion: 'v1.0' },
      ]),
    ).toBe(true)
    expect(
      isConsentComplete([
        { type: 'privacy_policy', policyVersion: 'v0.9' },
        { type: 'terms_of_service', policyVersion: 'v0.9' },
      ]),
    ).toBe(false)
    expect(
      isConsentComplete([{ type: 'privacy_policy', policyVersion: 'v1.0' }]),
    ).toBe(false)
  })

  it('lists missing consent types for the current policy version only', () => {
    expect(getMissingConsentTypes([])).toEqual([
      'privacy_policy',
      'terms_of_service',
    ])
    expect(
      getMissingConsentTypes([
        { type: 'privacy_policy', policyVersion: 'v1.0' },
      ]),
    ).toEqual(['terms_of_service'])
    expect(
      getMissingConsentTypes([
        { type: 'privacy_policy', policyVersion: 'v1.0' },
        { type: 'terms_of_service', policyVersion: 'v1.0' },
      ]),
    ).toEqual([])
    expect(
      getMissingConsentTypes([
        { type: 'privacy_policy', policyVersion: 'v0.9' },
        { type: 'terms_of_service', policyVersion: 'v0.9' },
      ]),
    ).toEqual(['privacy_policy', 'terms_of_service'])
  })

  it('builds consent status from backend records', () => {
    expect(buildConsentStatus([])).toEqual({
      privacyPolicy: false,
      termsOfService: false,
      privacyAcceptedAt: null,
      termsAcceptedAt: null,
    })
    expect(
      buildConsentStatus([
        {
          type: 'privacy_policy',
          policyVersion: 'v1.0',
          acceptedAt: '2026-01-01T00:00:00.000Z',
        },
        {
          type: 'terms_of_service',
          policyVersion: 'v1.0',
          acceptedAt: '2026-01-02T00:00:00.000Z',
        },
      ]),
    ).toEqual({
      privacyPolicy: true,
      termsOfService: true,
      privacyAcceptedAt: '2026-01-01T00:00:00.000Z',
      termsAcceptedAt: '2026-01-02T00:00:00.000Z',
    })
  })

  it('detects complete consent status objects', () => {
    expect(
      isConsentStatusComplete({
        privacyPolicy: true,
        termsOfService: true,
        privacyAcceptedAt: null,
        termsAcceptedAt: null,
      }),
    ).toBe(true)
    expect(
      isConsentStatusComplete({
        privacyPolicy: true,
        termsOfService: false,
        privacyAcceptedAt: null,
        termsAcceptedAt: null,
      }),
    ).toBe(false)
  })
})
