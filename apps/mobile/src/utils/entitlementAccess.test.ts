import {
  canUseAutomation,
  hasEntitlement,
  hasPaidService,
} from '@/utils/entitlementAccess';
import { EntitlementType } from '@/types/entitlements';

describe('entitlementAccess', () => {
  const fullService = [
    { type: EntitlementType.FULL_SERVICE, grantedAt: '', expiresAt: null },
  ];

  const empadronamientoOnly = [
    {
      type: EntitlementType.EMPADRONAMIENTO_AUTO,
      grantedAt: '',
      expiresAt: null,
    },
  ];

  it('grants all automations with full service', () => {
    expect(canUseAutomation(fullService, 'empadronamiento')).toBe(true);
    expect(canUseAutomation(fullService, 'cita-previa')).toBe(true);
  });

  it('grants only matching automation tiers', () => {
    expect(canUseAutomation(empadronamientoOnly, 'empadronamiento')).toBe(true);
    expect(canUseAutomation(empadronamientoOnly, 'cita-previa')).toBe(false);
  });

  it('treats full service as access to any entitlement type', () => {
    expect(hasEntitlement(fullService, EntitlementType.GUIDANCE)).toBe(true);
  });

  it('detects when user has any paid service', () => {
    expect(hasPaidService(fullService)).toBe(true);
    expect(hasPaidService([])).toBe(false);
  });
});
