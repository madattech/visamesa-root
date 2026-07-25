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
import {useTranslation} from 'react-i18next';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {DetailLinkRow} from '@/components/ui/DetailLinkRow';
import {Text} from '@/components/ui/Text';
import {PaymentAlreadyPaidDialog} from '@/features/profile/components/PaymentAlreadyPaidDialog';
import {ProfileActions} from '@/features/profile/components/ProfileActions';
import {ProfileHeader} from '@/features/profile/components/ProfileHeader';
import {ProfileUnauthenticated} from '@/features/profile/components/ProfileUnauthenticated';
import {useProfileData} from '@/features/profile/context/ProfileDataContext';
import {useProfileScreen} from '@/features/profile/hooks/useProfileScreen';
import {selectProfileCompleteness} from '@/features/profile/selectors/selectProfileCompleteness';
import {useConsentStatus} from '@/hooks/useConsentStatus';
import {ProfileStackParamList} from '@/navigation/types';
import {useTabBarInset} from '@/navigation/useTabBarInset';

type ProfileScreenNavigation = NativeStackNavigationProp<
  ProfileStackParamList,
  'Profile'
>;

type ProfileScreenProps = {
  navigation: ProfileScreenNavigation;
};

const ProfileScreen = ({navigation}: ProfileScreenProps) => {
  const {styles, theme} = useStyles(stylesheet);
  const {t} = useTranslation('profile');
  const tabBarInset = useTabBarInset();
  const {profileData} = useProfileData();
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
  const {hasConsent} = useConsentStatus({enabled: Boolean(userEmail)});

  const completeness = selectProfileCompleteness(
    profileData,
    hasConsent,
    hasPaid,
  );

  const handleLegalPress = () => {
    navigation.navigate('Legal');
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
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
            title={t('personalTitle')}
            description={t('personalDescription')}
            onPress={() => onSectionPress('personal')}
            status={completeness.personalInformation ? 'done' : 'notDone'}
          />

          <DetailLinkRow
            title={t('legalTitle')}
            description={t('legalDescription')}
            onPress={handleLegalPress}
            status={completeness.legalPrivacy ? 'done' : 'notDone'}
          />

          <DetailLinkRow
            title={t('paymentTitle')}
            description={t('paymentDescription')}
            onPress={onPaymentPress}
            status={completeness.payment ? 'done' : 'notDone'}
          />

          <DetailLinkRow
            title={t('settingsTitle')}
            description={t('settingsDescription')}
            icon="settings"
            onPress={handleSettingsPress}
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
