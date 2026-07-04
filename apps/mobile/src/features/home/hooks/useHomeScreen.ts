import {useMemo, useState} from 'react';
import {Alert} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useAuth} from '@/contexts/AuthContext';
import {useTieSteps} from '@/features/home/hooks/useTieSteps';
import {TieStepDetail} from '@/features/home/types/TieStepDetail';
import {HomeStackParamList} from '@/navigation/types';
import {configureLayoutAnimation} from '@/utils/layoutAnimation';
import {useProcessReadiness} from '@/hooks/useProcessReadiness';
import {navigateToDashboard, navigateToProfile} from '@/navigation/navigationRef';
import {usePricingLink} from '@/hooks/usePricingLink';

const DEFAULT_STEP_ID = 1;

type HomeScreenNavigation = NativeStackNavigationProp<
  HomeStackParamList,
  'Home'
>;

export type UseHomeScreenResult = {
  steps: TieStepDetail[];
  isLoading: boolean;
  error: Error | null;
  activeStepId: number;
  activeStep: TieStepDetail | undefined;
  onStepPress: (stepId: number) => void;
  onPrimaryPress: () => void;
  onSecondaryPress: () => void;
  showCompleteProfileDialog: boolean;
  onCloseCompleteProfileDialog: () => void;
  onCompleteProfilePress: () => void;
};

export function useHomeScreen(
  navigation: HomeScreenNavigation,
): UseHomeScreenResult {
  const {steps, isLoading, error} = useTieSteps();
  const {user} = useAuth();
  const {canStartProcess} = useProcessReadiness();
  const {openPricing} = usePricingLink();
  const [activeStepId, setActiveStepId] = useState(DEFAULT_STEP_ID);
  const [showCompleteProfileDialog, setShowCompleteProfileDialog] = useState(false);

  const activeStep = useMemo(
    () => steps.find(step => step.id === activeStepId),
    [activeStepId, steps],
  );

  const onStepPress = (stepId: number) => {
    configureLayoutAnimation();
    setActiveStepId(stepId);
  };

  const onPrimaryPress = () => {
    if (!user) {
      Alert.alert(
        'Get VisaMesa service',
        'You will complete payment on our website. After paying, return to the app and sign in with the same Google account to unlock your service.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Continue', onPress: () => { openPricing().catch(() => {}); }},
        ],
      );
      return;
    }

    // If user has paid and completed profile, navigate to dashboard
    if (canStartProcess) {
      navigateToDashboard();
      return;
    }

    // Otherwise, show complete profile dialog
    setShowCompleteProfileDialog(true);
  };

  const onSecondaryPress = () => {
    navigation.navigate('Steps');
  };

  const onCloseCompleteProfileDialog = () => {
    setShowCompleteProfileDialog(false);
  };

  const onCompleteProfilePress = () => {
    setShowCompleteProfileDialog(false);
    navigateToProfile();
  };

  return {
    steps,
    isLoading,
    error,
    activeStepId,
    activeStep,
    onStepPress,
    onPrimaryPress,
    onSecondaryPress,
    showCompleteProfileDialog,
    onCloseCompleteProfileDialog,
    onCompleteProfilePress,
  };
}
