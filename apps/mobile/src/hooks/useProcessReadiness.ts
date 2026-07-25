import {useCallback, useMemo} from 'react';

import {useConsent} from '@/contexts/ConsentContext';
import {useEntitlements} from '@/contexts/EntitlementsContext';
import {useProfileCompletion} from '@/contexts/ProfileCompletionContext';
import {
  PROCESS_READINESS_ITEM_ORDER,
  type ProcessReadinessMissing,
} from '@/hooks/processReadinessTypes';

export type {ProcessReadinessMissing} from '@/hooks/processReadinessTypes';
export {PROCESS_READINESS_ITEM_ORDER} from '@/hooks/processReadinessTypes';

export type UseProcessReadinessResult = {
  canStartProcess: boolean;
  missing: ProcessReadinessMissing[];
  isLoading: boolean;
  refreshReadiness: () => Promise<void>;
};

/**
 * Checks if the user is ready to start the TIE process.
 * Requires personal information, payment, and legal consent.
 * This is the single source of truth for gating step 1.
 */
export function useProcessReadiness(): UseProcessReadinessResult {
  const {
    hasPaidService,
    isLoading: isLoadingEntitlements,
    refreshEntitlements,
  } = useEntitlements();
  const {isProfileComplete, isLoading: isLoadingProfile, refreshCompletion} =
    useProfileCompletion();
  const {hasConsent, isLoading: isLoadingConsent, refreshConsent} =
    useConsent();

  const refreshReadiness = useCallback(async () => {
    await Promise.all([
      refreshCompletion(),
      refreshConsent(),
      refreshEntitlements(),
    ]);
  }, [refreshCompletion, refreshConsent, refreshEntitlements]);

  const isLoading =
    isLoadingEntitlements || isLoadingProfile || isLoadingConsent;

  return useMemo<UseProcessReadinessResult>(() => {
    const missingByItem: Record<ProcessReadinessMissing, boolean> = {
      personalInformation: !isProfileComplete,
      legalPrivacy: !hasConsent,
      payment: !hasPaidService(),
    };

    const missing = PROCESS_READINESS_ITEM_ORDER.filter(
      item => missingByItem[item],
    );

    return {
      canStartProcess: missing.length === 0,
      missing,
      isLoading,
      refreshReadiness,
    };
  }, [
    hasPaidService,
    isProfileComplete,
    hasConsent,
    isLoading,
    refreshReadiness,
  ]);
}
