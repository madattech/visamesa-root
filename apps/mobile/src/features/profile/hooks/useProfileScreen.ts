import { useState } from 'react'

import { useToast } from '@/components/Toast/ToastProvider'
import { useAuth } from '@/contexts/AuthContext'
import { useProfile } from '@/features/profile/hooks/useProfile'
import { ProfileStackParamList, RootStackParamList } from '@/navigation/types'
import { CompositeNavigationProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type ProfileScreenNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<ProfileStackParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export type ProfileSectionId =
  | 'personal'
  | 'billing'
  | 'residenceRegistration';

export type UseProfileScreenResult = {
  isAuthLoading: boolean;
  userEmail: string | null;
  isProfileLoading: boolean;
  profileError: Error | null;
  expandedSection: ProfileSectionId | null;
  onExpandedChange: (sectionId: ProfileSectionId | null) => void;
  personalInitialValues: Record<string, unknown>;
  billingInitialValues: Record<string, unknown>;
  residenceInitialValues: Record<string, unknown>;
  isSubmittingPersonal: boolean;
  isSubmittingBilling: boolean;
  isSubmittingResidenceRegistration: boolean;
  onPersonalSubmit: (data: Record<string, unknown>) => Promise<void>;
  onBillingSubmit: (data: Record<string, unknown>) => Promise<void>;
  onResidenceSubmit: (data: Record<string, unknown>) => Promise<void>;
  onSignInPress: () => void;
  onSignOutPress: () => Promise<void>;
};

export function useProfileScreen(
  navigation: ProfileScreenNavigation,
): UseProfileScreenResult {
  const {user, isLoading: isAuthLoading, logout} = useAuth();
  const {showToast} = useToast();
  const [expandedSection, setExpandedSection] =
    useState<ProfileSectionId | null>('personal');

  const {
    profileData,
    isLoading: isProfileLoading,
    error: profileError,
    personalInitialValues,
    isSubmittingPersonal,
    isSubmittingBilling,
    isSubmittingResidenceRegistration,
    submitPersonal,
    submitBilling,
    submitResidenceRegistration,
  } = useProfile(!!user);

  const onSignInPress = () => {
    navigation.navigate('Login');
  };

  const onSignOutPress = async () => {
    try {
      await logout();
      setExpandedSection('personal');
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
    expandedSection,
    onExpandedChange: setExpandedSection,
    personalInitialValues,
    billingInitialValues: profileData?.billing ?? {},
    residenceInitialValues: profileData?.residenceRegistration ?? {},
    isSubmittingPersonal,
    isSubmittingBilling,
    isSubmittingResidenceRegistration,
    onPersonalSubmit: submitPersonal,
    onBillingSubmit: submitBilling,
    onResidenceSubmit: submitResidenceRegistration,
    onSignInPress,
    onSignOutPress,
  };
}
