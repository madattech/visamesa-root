import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {DetailLinkRow} from '@/components/ui/DetailLinkRow';
import {Text} from '@/components/ui/Text';
import {PaymentAlreadyPaidDialog} from '@/features/profile/components/PaymentAlreadyPaidDialog';
import {ProfileActions} from '@/features/profile/components/ProfileActions';
import {ProfileHeader} from '@/features/profile/components/ProfileHeader';
import {ProfileUnauthenticated} from '@/features/profile/components/ProfileUnauthenticated';
import {useProfileData} from '@/features/profile/context/ProfileDataContext';
import {
  PROFILE_LEGAL_DESCRIPTION,
  PROFILE_LEGAL_TITLE,
  PROFILE_PAYMENT_DESCRIPTION,
  PROFILE_PAYMENT_TITLE,
  PROFILE_PERSONAL_DESCRIPTION,
  PROFILE_PERSONAL_TITLE,
} from '@/features/profile/data/profileContent';
import {useProfileScreen} from '@/features/profile/hooks/useProfileScreen';
import {selectProfileCompleteness} from '@/features/profile/selectors/selectProfileCompleteness';
import {ProfileStackParamList, RootStackParamList} from '@/navigation/types';
import {useTabBarInset} from '@/navigation/useTabBarInset';
import {consentService} from '@/services/consentService';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type ProfileScreenNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<ProfileStackParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type ProfileScreenProps = {
  navigation: ProfileScreenNavigation;
};

const ProfileScreen = ({navigation}: ProfileScreenProps) => {
  const {styles, theme} = useStyles(stylesheet);
  const tabBarInset = useTabBarInset();
  const {profileData} = useProfileData();
  const [hasConsent, setHasConsent] = useState(false);
  const {
    isAuthLoading,
    userEmail,
    isProfileLoading,
    profileError,
    hasPaid,
    onSectionPress,
    onSignInPress,
    onSignOutPress,
    onPaymentPress,
    showAlreadyPaidDialog,
    onDismissAlreadyPaidDialog,
    onSeePaymentStatus,
  } = useProfileScreen(navigation);

  useEffect(() => {
    if (userEmail) {
      consentService
        .hasAcceptedConsent()
        .then(setHasConsent)
        .catch(() => {});
    }
  }, [userEmail]);

  const completeness = selectProfileCompleteness(
    profileData,
    hasConsent,
    hasPaid,
  );

  const handleLegalPress = () => {
    navigation.navigate('Legal');
  };

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
        <ProfileHeader />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            {paddingBottom: theme.spacing.md + tabBarInset},
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {profileError ? (
            <Text variant="bodyMedium" color="error" style={styles.error}>
              {profileError.message}
            </Text>
          ) : null}

          <DetailLinkRow
            title={PROFILE_PERSONAL_TITLE}
            description={PROFILE_PERSONAL_DESCRIPTION}
            onPress={() => onSectionPress('personal')}
            status={completeness.personalInformation ? 'done' : 'notDone'}
          />

          <DetailLinkRow
            title={PROFILE_LEGAL_TITLE}
            description={PROFILE_LEGAL_DESCRIPTION}
            onPress={handleLegalPress}
            status={completeness.legalPrivacy ? 'done' : 'notDone'}
          />

          <DetailLinkRow
            title={PROFILE_PAYMENT_TITLE}
            description={PROFILE_PAYMENT_DESCRIPTION}
            onPress={onPaymentPress}
            status={completeness.payment ? 'done' : 'notDone'}
          />

          <ProfileActions onSignOutPress={onSignOutPress} />
        </ScrollView>
      </KeyboardAvoidingView>
      <PaymentAlreadyPaidDialog
        visible={showAlreadyPaidDialog}
        onClose={onDismissAlreadyPaidDialog}
        onSeeStatus={onSeePaymentStatus}
      />
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.layout.screenPaddingX,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.sm,
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
