import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {Text} from '@/components/ui/Text';
import {ProfileActions} from '@/features/profile/components/ProfileActions';
import {ProfileHeader} from '@/features/profile/components/ProfileHeader';
import {ProfileSectionList} from '@/features/profile/components/ProfileSectionList';
import {ProfileUnauthenticated} from '@/features/profile/components/ProfileUnauthenticated';
import {useProfileScreen} from '@/features/profile/hooks/useProfileScreen';
import {
  ProfileStackParamList,
  RootStackParamList,
} from '@/navigation/types';

type ProfileScreenNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<ProfileStackParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type ProfileScreenProps = {
  navigation: ProfileScreenNavigation;
};

const ProfileScreen = ({navigation}: ProfileScreenProps) => {
  const {styles, theme} = useStyles(stylesheet);
  const {
    isAuthLoading,
    userEmail,
    isProfileLoading,
    profileError,
    expandedSection,
    onExpandedChange,
    personalInitialValues,
    billingInitialValues,
    residenceInitialValues,
    isSubmittingPersonal,
    isSubmittingBilling,
    isSubmittingResidenceRegistration,
    onPersonalSubmit,
    onBillingSubmit,
    onResidenceSubmit,
    onSignInPress,
    onSignOutPress,
  } = useProfileScreen(navigation);

  if (isAuthLoading || (userEmail && isProfileLoading)) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!userEmail) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ProfileUnauthenticated onSignInPress={onSignInPress} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <ProfileHeader />

          {profileError ? (
            <Text variant="bodyMedium" color="error" style={styles.error}>
              {profileError.message}
            </Text>
          ) : null}

          <ProfileSectionList
            expandedSection={expandedSection}
            onExpandedChange={onExpandedChange}
            personalInitialValues={personalInitialValues}
            billingInitialValues={billingInitialValues}
            residenceInitialValues={residenceInitialValues}
            isSubmittingPersonal={isSubmittingPersonal}
            isSubmittingBilling={isSubmittingBilling}
            isSubmittingResidenceRegistration={isSubmittingResidenceRegistration}
            onPersonalSubmit={onPersonalSubmit}
            onBillingSubmit={onBillingSubmit}
            onResidenceSubmit={onResidenceSubmit}
          />

          <ProfileActions onSignOutPress={onSignOutPress} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.lg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    textAlign: 'center',
  },
}));

export default ProfileScreen;
