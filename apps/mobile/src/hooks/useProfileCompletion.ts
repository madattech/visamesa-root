import {useProfileData} from '@/features/profile/context/ProfileDataContext';

type UseProfileCompletionResult = {
  isProfileComplete: boolean;
  isLoading: boolean;
  refreshCompletion: () => Promise<boolean>;
};

export function useProfileCompletion(): UseProfileCompletionResult {
  const {isProfileComplete, isLoading, refreshProfile} = useProfileData();

  return {
    isProfileComplete,
    isLoading,
    refreshCompletion: refreshProfile,
  };
}
