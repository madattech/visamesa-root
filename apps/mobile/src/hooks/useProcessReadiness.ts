import {useMemo} from 'react';

import {useEntitlements} from '@/contexts/EntitlementsContext';
import {useProfileCompletion} from '@/contexts/ProfileCompletionContext';

export type ProcessReadinessMissing = 'payment' | 'profile';

export type UseProcessReadinessResult = {
  canStartProcess: boolean;
  missing: ProcessReadinessMissing[];
  isLoading: boolean;
};

/**
 * Checks if the user is ready to start the TIE process.
 * Requires both payment (entitlement) and a complete profile.
 * This is the single source of truth for gating step 1.
 */
export function useProcessReadiness(): UseProcessReadinessResult {
  const {hasPaidService, isLoading: isLoadingEntitlements} = useEntitlements();
  const {isProfileComplete, isLoading: isLoadingProfile} =
    useProfileCompletion();

  const isLoading = isLoadingEntitlements || isLoadingProfile;

  const result = useMemo<UseProcessReadinessResult>(() => {
    const missing: ProcessReadinessMissing[] = [];

    if (!hasPaidService()) {
      missing.push('payment');
    }

    if (!isProfileComplete) {
      missing.push('profile');
    }

    return {
      canStartProcess: missing.length === 0,
      missing,
      isLoading,
    };
  }, [hasPaidService, isProfileComplete, isLoading]);

  return result;
}
