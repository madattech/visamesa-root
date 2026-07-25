import {useConsent} from '@/contexts/ConsentContext';

type UseConsentStatusOptions = {
  enabled?: boolean;
};

export function useConsentStatus({enabled = true}: UseConsentStatusOptions = {}) {
  const {hasConsent, isLoading, refreshConsent} = useConsent();

  if (!enabled) {
    return {
      hasConsent: false,
      isLoading: false,
      refreshConsent,
    };
  }

  return {
    hasConsent,
    isLoading,
    refreshConsent,
  };
}
