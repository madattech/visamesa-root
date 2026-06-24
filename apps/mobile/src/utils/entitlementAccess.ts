import { AutomationId } from '@/features/home/types/TieStepDetail';
import {
  EntitlementType,
  UserEntitlement,
} from '@/types/entitlements';

function activeTypes(entitlements: UserEntitlement[]): Set<string> {
  const now = Date.now();
  return new Set(
    entitlements
      .filter(entry => !entry.expiresAt || Date.parse(entry.expiresAt) > now)
      .map(entry => entry.type),
  );
}

export function hasEntitlement(
  entitlements: UserEntitlement[],
  type: EntitlementType,
): boolean {
  const types = activeTypes(entitlements);

  if (types.has(EntitlementType.FULL_SERVICE)) {
    return true;
  }

  return types.has(type);
}

export function hasPaidService(entitlements: UserEntitlement[]): boolean {
  return activeTypes(entitlements).size > 0;
}

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
