import {useMemo, useState} from 'react';
import {Alert, Linking} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {WEBSITE_PRICING_URL} from '@/config/website';
import {useToast} from '@/components/Toast/ToastProvider';
import {useAuth} from '@/contexts/AuthContext';
import {useTieSteps} from '@/features/home/hooks/useTieSteps';
import {TieStepDetail} from '@/features/home/types/TieStepDetail';
import {HomeStackParamList} from '@/navigation/types';
import {configureLayoutAnimation} from '@/utils/layoutAnimation';
import {useProcessReadiness} from '@/hooks/useProcessReadiness';
import {navigateToDashboard, navigateToProfile} from '@/navigation/navigationRef';

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
  showPrerequisitesModal: boolean;
  onClosePrerequisitesModal: () => void;
  onGetServicePress: () => void;
  onCompleteProfilePress: () => void;
};

export function useHomeScreen(
  navigation: HomeScreenNavigation,
): UseHomeScreenResult {
  const {steps, isLoading, error} = useTieSteps();
  const {user} = useAuth();
  const {showToast} = useToast();
  const {canStartProcess, missing} = useProcessReadiness();
  const [activeStepId, setActiveStepId] = useState(DEFAULT_STEP_ID);
  const [showPrerequisitesModal, setShowPrerequisitesModal] = useState(false);

  const activeStep = useMemo(
    () => steps.find(step => step.id === activeStepId),
    [activeStepId, steps],
  );

  const onStepPress = (stepId: number) => {
    configureLayoutAnimation();
    setActiveStepId(stepId);
  };

  const openPricingWebsite = async () => {
    try {
      const canOpen = await Linking.canOpenURL(WEBSITE_PRICING_URL);
      if (!canOpen) {
        showToast('Unable to open the VisaMesa website');
        return;
      }

      await Linking.openURL(WEBSITE_PRICING_URL);
    } catch {
      showToast('Unable to open the VisaMesa website');
    }
  };

  const onPrimaryPress = () => {
    if (!user) {
      Alert.alert(
        'Get VisaMesa service',
        'You will complete payment on our website. After paying, return to the app and sign in with the same Google account to unlock your service.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Continue', onPress: () => void openPricingWebsite()},
        ],
      );
      return;
    }

    // If user has paid and completed profile, navigate to dashboard
    if (canStartProcess) {
      navigateToDashboard();
      return;
    }

    // Otherwise, show prerequisites modal
    setShowPrerequisitesModal(true);
  };

  const onSecondaryPress = () => {
    navigation.navigate('Steps');
  };

  const onClosePrerequisitesModal = () => {
    setShowPrerequisitesModal(false);
  };

  const onGetServicePress = () => {
    setShowPrerequisitesModal(false);
    void openPricingWebsite();
  };

  const onCompleteProfilePress = () => {
    setShowPrerequisitesModal(false);
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
    showPrerequisitesModal,
    onClosePrerequisitesModal,
    onGetServicePress,
    onCompleteProfilePress,
  };
}
