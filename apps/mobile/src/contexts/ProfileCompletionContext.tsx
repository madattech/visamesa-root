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
import {profileCompletionService} from '@/features/profile/services/profileCompletionService';

type ProfileCompletionContextValue = {
  isProfileComplete: boolean;
  isLoading: boolean;
  refreshCompletion: () => Promise<boolean>;
};

const ProfileCompletionContext = createContext<
  ProfileCompletionContextValue | undefined
>(undefined);

export function ProfileCompletionProvider({children}: {children: ReactNode}) {
  const {user} = useAuth();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCompletion = useCallback(async (): Promise<boolean> => {
    if (!user) {
      setIsProfileComplete(false);
      return false;
    }

    setIsLoading(true);

    try {
      const complete = await profileCompletionService.getIsComplete();
      setIsProfileComplete(complete);
      return complete;
    } catch (error) {
      console.error('Failed to load profile completion status:', error);
      setIsProfileComplete(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCompletion().catch(() => {});
  }, [refreshCompletion]);

  const value = useMemo<ProfileCompletionContextValue>(
    () => ({
      isProfileComplete,
      isLoading,
      refreshCompletion,
    }),
    [isProfileComplete, isLoading, refreshCompletion],
  );

  return (
    <ProfileCompletionContext.Provider value={value}>
      {children}
    </ProfileCompletionContext.Provider>
  );
}

export function useProfileCompletion() {
  const context = useContext(ProfileCompletionContext);

  if (!context) {
    throw new Error(
      'useProfileCompletion must be used within ProfileCompletionProvider',
    );
  }

  return context;
}
