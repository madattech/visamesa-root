import { describe, expect, it } from 'vitest'

import {
  CHECKOUT_POST_PAYMENT_STEPS,
  CONSENT_POLICY_VERSION,
  PROFILE_ALREADY_PAID_DIALOG_TITLE,
  PROFILE_ALREADY_PAID_SEE_STATUS,
  PRICING_ALREADY_PAID_TITLE,
} from './checkoutContent'

describe('checkoutContent', () => {
  it('exports shared consent version', () => {
    expect(CONSENT_POLICY_VERSION).toBe('v1.0')
  })

  it('exports post-payment steps', () => {
    expect(CHECKOUT_POST_PAYMENT_STEPS.length).toBe(3)
  })

  it('exports already paid copy', () => {
    expect(PRICING_ALREADY_PAID_TITLE).toContain('active service')
    expect(PROFILE_ALREADY_PAID_DIALOG_TITLE).toBe('Already paid')
    expect(PROFILE_ALREADY_PAID_SEE_STATUS).toBe('See status')
  })
})
