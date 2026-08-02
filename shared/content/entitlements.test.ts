import { describe, expect, it } from 'vitest'

import {
  EntitlementType,
  hasEntitlement,
  hasPaidService,
  isProductAlreadyCovered,
} from './entitlements'

describe('entitlements', () => {
  const fullService = [
    {
      type: EntitlementType.FULL_SERVICE,
      grantedAt: '2026-01-01T00:00:00.000Z',
      expiresAt: null,
    },
  ]

  it('detects paid service from active entitlements', () => {
    expect(hasPaidService(fullService)).toBe(true)
    expect(hasPaidService([])).toBe(false)
  })

  it('treats full service as covering every product type', () => {
    expect(hasEntitlement(fullService, EntitlementType.GUIDANCE)).toBe(true)
    expect(
      isProductAlreadyCovered(EntitlementType.CITA_PREVIA_AUTO, fullService),
    ).toBe(true)
  })

  it('ignores expired entitlements', () => {
    expect(
      hasPaidService([
        {
          type: EntitlementType.GUIDANCE,
          grantedAt: '2020-01-01T00:00:00.000Z',
          expiresAt: '2020-02-01T00:00:00.000Z',
        },
      ]),
    ).toBe(false)
  })
})
