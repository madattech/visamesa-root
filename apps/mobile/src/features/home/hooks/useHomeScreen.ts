import {useMemo, useState} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useTieSteps} from '@/features/home/hooks/useTieSteps';
import {TieStepDetail} from '@/features/home/types/TieStepDetail';
import {useProcessReadiness} from '@/hooks/useProcessReadiness';
import {usePrerequisitesDialog} from '@/hooks/usePrerequisitesDialog';
import {HomeStackParamList} from '@/navigation/types';
import {configureLayoutAnimation} from '@/utils/layoutAnimation';
import {navigateToDashboard} from '@/navigation/navigationRef';

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
  showPrerequisitesDialog: boolean;
  readinessMissing: ReturnType<typeof useProcessReadiness>['missing'];
  onClosePrerequisitesDialog: () => void;
  onGoToProfilePress: () => void;
};

export function useHomeScreen(
  navigation: HomeScreenNavigation,
): UseHomeScreenResult {
  const {steps, isLoading, error} = useTieSteps();
  const [activeStepId, setActiveStepId] = useState(DEFAULT_STEP_ID);
  const {canStartProcess, missing: readinessMissing, refreshReadiness} =
    useProcessReadiness();
  const {
    visible: showPrerequisitesDialog,
    openDialog: openPrerequisitesDialog,
    closeDialog: onClosePrerequisitesDialog,
    onGoToProfilePress,
  } = usePrerequisitesDialog(refreshReadiness);

  const activeStep = useMemo(
    () => steps.find(step => step.id === activeStepId),
    [activeStepId, steps],
  );

  const onStepPress = (stepId: number) => {
    configureLayoutAnimation();
    setActiveStepId(stepId);
  };

  const onPrimaryPress = () => {
    if (!canStartProcess) {
      openPrerequisitesDialog();
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
    showPrerequisitesDialog,
    readinessMissing,
    onClosePrerequisitesDialog,
    onGoToProfilePress,
  };
}
