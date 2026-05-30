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
import {useTabBarInset} from '@/navigation/useTabBarInset';
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
  const tabBarInset = useTabBarInset();
  const {
    isAuthLoading,
    userEmail,
    isProfileLoading,
    profileError,
    onSectionPress,
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
          contentContainerStyle={[
            styles.scrollContent,
            {paddingBottom: theme.spacing.lg + tabBarInset},
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <ProfileHeader />

          {profileError ? (
            <Text variant="bodyMedium" color="error" style={styles.error}>
              {profileError.message}
            </Text>
          ) : null}

          <ProfileSectionList onSectionPress={onSectionPress} />

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
