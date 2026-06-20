import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useLoginScreen } from '@/features/auth/hooks/useLoginScreen';
import { ProfileStackParamList } from '@/navigation/types';

type LoginScreenNavigation = NativeStackNavigationProp<
  ProfileStackParamList,
  'Login'
>;

type LoginScreenProps = {
  navigation: LoginScreenNavigation;
};

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const { styles, theme } = useStyles(stylesheet);
  const { isLoading, onGoogleSignInPress, onBackPress } =
    useLoginScreen(navigation);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>
          Sign In
        </Text>
        <Text
          variant="bodyMedium"
          color="onSurfaceVariant"
          style={styles.subtitle}>
          Sign in with Google to view and manage your profile
        </Text>

        <View style={styles.actions}>
          <View
            pointerEvents={isLoading ? 'none' : 'auto'}
            style={styles.googleButtonWrapper}>
            <GoogleSigninButton
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={onGoogleSignInPress}
              style={styles.googleButton}
            />
            {isLoading ? (
              <View style={styles.googleLoadingOverlay}>
                <ActivityIndicator color={theme.colors.primary} />
              </View>
            ) : null}
          </View>

          <Button
            label="Back"
            variant="outline"
            onPress={onBackPress}
            disabled={isLoading}
            fullWidth
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  actions: {
    gap: theme.spacing.md,
  },
  googleButtonWrapper: {
    position: 'relative',
  },
  googleButton: {
    width: '100%',
    height: theme.sizes.touchTargetMin + 4,
  },
  googleLoadingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    opacity: 0.85,
  },
}));

export default LoginScreen;
