import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppDialog } from '@/contexts/AppDialogContext';
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
  const { showAlert } = useAppDialog();
  const { t } = useTranslation('auth');
  const [isLoading, setIsLoading] = useState(false);

  const onGoogleSignInPress = async () => {
    setIsLoading(true);

    try {
      await signInWithGoogle();
      navigation.goBack();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t('signInFailedFallback');
      showAlert(t('signInFailedTitle'), message);
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
