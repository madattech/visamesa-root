import {
  EntitlementType,
  UserEntitlement,
  hasEntitlement,
  hasPaidService,
} from '@visamesa/content/entitlements';

import { AutomationId } from '@/features/home/types/TieStepDetail';

export { hasEntitlement, hasPaidService, isProductAlreadyCovered } from '@visamesa/content/entitlements';

const AUTOMATION_ENTITLEMENT: Record<AutomationId, EntitlementType> = {
  empadronamiento: EntitlementType.EMPADRONAMIENTO_AUTO,
  'cita-previa': EntitlementType.CITA_PREVIA_AUTO,
};

export function canUseAutomation(
  entitlements: UserEntitlement[],
  automationId: AutomationId,
): boolean {
  const required = AUTOMATION_ENTITLEMENT[automationId];
  return hasEntitlement(entitlements, required);
}
