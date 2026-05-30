import {useToast} from '@/components/Toast/ToastProvider';
import {useAuth} from '@/contexts/AuthContext';
import {useProfileData} from '@/features/profile/context/ProfileDataContext';
import {ProfileSectionId} from '@/features/profile/data/profileSections';
import {ProfileStackParamList, RootStackParamList} from '@/navigation/types';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type ProfileScreenNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<ProfileStackParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export type {ProfileSectionId} from '@/features/profile/data/profileSections';

export type UseProfileScreenResult = {
  isAuthLoading: boolean;
  userEmail: string | null;
  isProfileLoading: boolean;
  profileError: Error | null;
  onSectionPress: (sectionId: ProfileSectionId) => void;
  onSignInPress: () => void;
  onSignOutPress: () => Promise<void>;
};

export function useProfileScreen(
  navigation: ProfileScreenNavigation,
): UseProfileScreenResult {
  const {user, isLoading: isAuthLoading, logout} = useAuth();
  const {showToast} = useToast();
  const {isLoading: isProfileLoading, error: profileError} = useProfileData();

  const onSectionPress = (sectionId: ProfileSectionId) => {
    navigation.navigate('ProfileSection', {sectionId});
  };

  const onSignInPress = () => {
    navigation.navigate('Login');
  };

  const onSignOutPress = async () => {
    try {
      await logout();
      showToast('Signed out');
    } catch {
      showToast('Failed to sign out');
    }
  };

  return {
    isAuthLoading,
    userEmail: user?.email ?? null,
    isProfileLoading,
    profileError,
    onSectionPress,
    onSignInPress,
    onSignOutPress,
  };
}
