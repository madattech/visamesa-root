import { useState } from 'react';
import { Alert } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { ProfileStackParamList } from '@/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type LoginScreenNavigation = NativeStackNavigationProp<
  ProfileStackParamList,
  'Login'
>;

export type UseLoginScreenResult = {
  isLoading: boolean;
  onGoogleSignInPress: () => Promise<void>;
  onBackPress: () => void;
};

export function useLoginScreen(
  navigation: LoginScreenNavigation,
): UseLoginScreenResult {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const onGoogleSignInPress = async () => {
    setIsLoading(true);

    try {
      await signInWithGoogle();
      navigation.goBack();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Google sign-in failed';
      Alert.alert('Sign In Failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    onGoogleSignInPress,
    onBackPress: () => navigation.goBack(),
  };
}
