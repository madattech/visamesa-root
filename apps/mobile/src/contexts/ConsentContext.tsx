import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {useAuth} from '@/contexts/AuthContext';
import {consentService} from '@/features/profile/services/consentService';

type ConsentContextValue = {
  hasConsent: boolean;
  isLoading: boolean;
  refreshConsent: () => Promise<boolean>;
};

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

export function ConsentProvider({children}: {children: ReactNode}) {
  const {user} = useAuth();
  const [hasConsent, setHasConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const refreshConsent = useCallback(async (): Promise<boolean> => {
    if (!user) {
      setHasConsent(false);
      return false;
    }

    setIsLoading(true);

    try {
      const accepted = await consentService.hasAcceptedConsent();
      setHasConsent(accepted);
      return accepted;
    } catch {
      setHasConsent(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setHasConsent(false);
      setIsLoading(false);
      return;
    }

    refreshConsent().catch(() => {});
  }, [user, refreshConsent]);

  const value = useMemo<ConsentContextValue>(
    () => ({
      hasConsent,
      isLoading,
      refreshConsent,
    }),
    [hasConsent, isLoading, refreshConsent],
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);

  if (!context) {
    throw new Error('useConsent must be used within ConsentProvider');
  }

  return context;
}
