import {useProfileData} from '@/features/profile/context/ProfileDataContext';

type ProfileCompletionContextValue = {
  isProfileComplete: boolean;
  isLoading: boolean;
  refreshCompletion: () => Promise<boolean>;
};

export function useProfileCompletion(): ProfileCompletionContextValue {
  const {isProfileComplete, isLoading, refreshProfile} = useProfileData();

  return {
    isProfileComplete,
    isLoading,
    refreshCompletion: refreshProfile,
  };
}
