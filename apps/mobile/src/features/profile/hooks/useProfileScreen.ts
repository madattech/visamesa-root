import {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useToast} from '@/components/Toast/ToastProvider';
import {useAuth} from '@/contexts/AuthContext';
import {useEntitlements} from '@/contexts/EntitlementsContext';
import {useProfileData} from '@/features/profile/context/ProfileDataContext';
import {usePricingLink} from '@/hooks/usePricingLink';
import {ProfileSectionId} from '@/features/profile/data/profileSections';
import {ProfileStackParamList, RootStackParamList} from '@/navigation/types';

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
  hasPaid: boolean;
  onSectionPress: (sectionId: ProfileSectionId) => void;
  onSignInPress: () => void;
  onSignOutPress: () => Promise<void>;
  onPaymentPress: () => void;
  showAlreadyPaidDialog: boolean;
  onDismissAlreadyPaidDialog: () => void;
  onSeePaymentStatus: () => void;
};

export function useProfileScreen(
  navigation: ProfileScreenNavigation,
): UseProfileScreenResult {
  const {user, isLoading: isAuthLoading, logout} = useAuth();
  const {hasPaidService, refreshEntitlements} = useEntitlements();
  const {showToast} = useToast();
  const {openPricing, openPricingStatus} = usePricingLink();
  const [showAlreadyPaidDialog, setShowAlreadyPaidDialog] = useState(false);
  const {isLoading: isProfileLoading, error: profileError} = useProfileData();

  useFocusEffect(
    useCallback(() => {
      void refreshEntitlements();
    }, [refreshEntitlements]),
  );

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

  const isPaid = hasPaidService();

  const onPaymentPress = () => {
    if (isPaid) {
      setShowAlreadyPaidDialog(true);
      return;
    }

    void openPricing();
  };

  const onDismissAlreadyPaidDialog = () => {
    setShowAlreadyPaidDialog(false);
  };

  const onSeePaymentStatus = () => {
    setShowAlreadyPaidDialog(false);
    void openPricingStatus();
  };

  return {
    isAuthLoading,
    userEmail: user?.email ?? null,
    isProfileLoading,
    profileError,
    hasPaid: isPaid,
    onSectionPress,
    onSignInPress,
    onSignOutPress,
    onPaymentPress,
    showAlreadyPaidDialog,
    onDismissAlreadyPaidDialog,
    onSeePaymentStatus,
  };
}
