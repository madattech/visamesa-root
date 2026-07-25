import {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useAppDialog} from '@/contexts/AppDialogContext';
import {useAuth} from '@/contexts/AuthContext';
import {useTieSteps} from '@/features/home/hooks/useTieSteps';
import {TieStepDetail} from '@/features/home/types/TieStepDetail';
import {HomeStackParamList} from '@/navigation/types';
import {configureLayoutAnimation} from '@/utils/layoutAnimation';
import {navigateToDashboard} from '@/navigation/navigationRef';
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
};

export function useHomeScreen(
  navigation: HomeScreenNavigation,
): UseHomeScreenResult {
  const {steps, isLoading, error} = useTieSteps();
  const {user} = useAuth();
  const {openPricing} = usePricingLink();
  const {showAlert} = useAppDialog();
  const {t} = useTranslation('home');
  const {t: tCommon} = useTranslation('common');
  const [activeStepId, setActiveStepId] = useState(DEFAULT_STEP_ID);

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
      showAlert(
        t('getServiceDialog.title'),
        t('getServiceDialog.message'),
        [
          {text: tCommon('actions.cancel'), style: 'cancel'},
          {text: tCommon('actions.continue'), onPress: () => { openPricing().catch(() => {}); }},
        ],
      );
      return;
    }

    navigateToDashboard();
  };

  const onSecondaryPress = () => {
    navigation.navigate('ProcessOverview');
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
  };
}
