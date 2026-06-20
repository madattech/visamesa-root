import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert} from 'react-native';
import {CompositeNavigationProp, useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useToast} from '@/components/Toast/ToastProvider';
import {useAuth} from '@/contexts/AuthContext';
import {RequirementWithProgress} from '@/features/dashboard/components/RequirementsChecklist';
import {
  DASHBOARD_COMPLETE_PREVIOUS_STEP_HINT,
  getCompletedInStepHint,
} from '@/features/dashboard/data/dashboardContent';
import {useUserProgress} from '@/features/dashboard/hooks/useUserProgress';
import {UserProgress} from '@/features/dashboard/types/UserProgress';
import {
  areAllRequirementsComplete,
  getCompletedStepIds,
  getEffectiveRequirementProgress,
  getNextIncompleteStepId,
  isStepCompleted,
} from '@/features/dashboard/utils/progressUtils';
import {useTieSteps} from '@/features/home/hooks/useTieSteps';
import {AutomationId, TieStepDetail} from '@/features/home/types/TieStepDetail';
import { navigateToLoginFromTab } from '@/navigation/navigateToLogin';
import {
  DashboardStackParamList,
  RootStackParamList,
  WebViewAutomationKind,
} from '@/navigation/types';

type DashboardScreenNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<DashboardStackParamList, 'Dashboard'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type PendingAutomation = {
  stepId: number;
  requirementLabel: string;
  automationId: AutomationId;
};

const AUTOMATION_KIND: Record<AutomationId, WebViewAutomationKind> = {
  empadronamiento: 'empadronamiento',
  'cita-previa': 'cita-previa',
};

export type UseDashboardScreenResult = {
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  steps: TieStepDetail[];
  isLoading: boolean;
  error: Error | null;
  currentStepId: number;
  activeStepId: number;
  currentStep: TieStepDetail | undefined;
  completedStepIds: number[];
  isCurrentStepCompleted: boolean;
  canCompleteStep: boolean;
  canInteractWithRequirements: boolean;
  stepActionDisabledHint?: string;
  currentStepRequirements: RequirementWithProgress[];
  onSignInPress: () => void;
  onStepPress: (stepId: number) => void;
  onStepDetailPress: () => void;
  onCompleteStep: () => void;
  onSelfDeclaredToggle: (label: string) => void;
  onAutomationPress: (automationId: AutomationId, label: string) => void;
  onFormPress: (formId: string, label: string) => void;
};

function buildRequirementsWithProgress(
  progress: UserProgress,
  step: TieStepDetail,
): RequirementWithProgress[] {
  return step.requirements.map(requirement => {
    const effectiveProgress = getEffectiveRequirementProgress(
      progress,
      step,
      requirement.label,
    );

    const referencedComplete =
      requirement.referencesStepId &&
      isStepCompleted(progress, requirement.referencesStepId);

    const hint = referencedComplete
      ? getCompletedInStepHint(requirement.referencesStepId!)
      : undefined;

    return {
      ...requirement,
      progress: effectiveProgress,
      hint,
      isReferenced: Boolean(referencedComplete),
    };
  });
}

export function useDashboardScreen(
  navigation: DashboardScreenNavigation,
): UseDashboardScreenResult {
  const {user, isLoading: isAuthLoading} = useAuth();
  const {showToast} = useToast();
  const {steps, isLoading: isStepsLoading, error: stepsError} = useTieSteps();
  const {
    progress,
    isLoading: isProgressLoading,
    error: progressError,
    completeStep,
    toggleSelfDeclaredRequirement,
    completeAutomationRequirement,
    completeFormRequirement,
  } = useUserProgress();

  const pendingAutomationRef = useRef<PendingAutomation | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);

  const activeStepId = progress
    ? getNextIncompleteStepId(progress, steps)
    : 1;

  useEffect(() => {
    if (progress && selectedStepId === null) {
      setSelectedStepId(activeStepId);
    }
  }, [activeStepId, progress, selectedStepId]);

  const currentStepId = selectedStepId ?? activeStepId;

  const currentStep = useMemo(
    () => steps.find(step => step.id === currentStepId),
    [currentStepId, steps],
  );

  const completedStepIds = useMemo(
    () => (progress ? getCompletedStepIds(progress) : []),
    [progress],
  );

  const isCurrentStepCompleted = progress
    ? isStepCompleted(progress, currentStepId)
    : false;

  const currentStepRequirements = useMemo(() => {
    if (!progress || !currentStep) {
      return [];
    }

    return buildRequirementsWithProgress(progress, currentStep);
  }, [currentStep, progress]);

  const canCompleteStep = Boolean(
    progress &&
      currentStep &&
      !isCurrentStepCompleted &&
      currentStepId === activeStepId &&
      areAllRequirementsComplete(progress, currentStep),
  );

  const canInteractWithRequirements = !isCurrentStepCompleted;

  const stepActionDisabledHint =
    !isCurrentStepCompleted && currentStepId !== activeStepId
      ? DASHBOARD_COMPLETE_PREVIOUS_STEP_HINT
      : undefined;

  useFocusEffect(
    useCallback(() => {
      const pending = pendingAutomationRef.current;

      if (!pending || !progress) {
        return;
      }

      pendingAutomationRef.current = null;

      Alert.alert(
        'Appointment booking',
        'Did you successfully complete the booking?',
        [
          {text: 'Not yet', style: 'cancel'},
          {
            text: 'Yes, booked',
            onPress: async () => {
              await completeAutomationRequirement(
                pending.stepId,
                pending.requirementLabel,
                pending.automationId,
              );
              showToast('Requirement marked complete');
            },
          },
        ],
      );
    }, [completeAutomationRequirement, progress, showToast]),
  );

  const onSignInPress = () => {
    navigateToLoginFromTab(navigation);
  };

  const onStepPress = (stepId: number) => {
    setSelectedStepId(stepId);
  };

  const onStepDetailPress = () => {
    if (!currentStep) {
      return;
    }

    navigation.navigate('StepDetail', {stepId: currentStep.id});
  };

  const onCompleteStep = () => {
    if (!progress || !currentStep || !canCompleteStep) {
      return;
    }

    Alert.alert('Confirm completion', currentStep.completionPrompt, [
      {text: 'Not yet', style: 'cancel'},
      {
        text: 'Yes, done',
        onPress: async () => {
          const nextStepId = getNextIncompleteStepId(
            {
              ...progress,
              steps: progress.steps.map(step =>
                step.stepId === currentStep.id
                  ? {...step, status: 'completed' as const}
                  : step,
              ),
            },
            steps,
          );
          await completeStep(currentStep.id, nextStepId);
          setSelectedStepId(nextStepId);
          showToast('Step completed');
        },
      },
    ]);
  };

  const onSelfDeclaredToggle = async (label: string) => {
    if (!progress || !currentStep || isCurrentStepCompleted) {
      return;
    }

    const current = getEffectiveRequirementProgress(
      progress,
      currentStep,
      label,
    );

    if (current.source?.type === 'referenced_step') {
      return;
    }

    await toggleSelfDeclaredRequirement(
      currentStep.id,
      label,
      !current.completed,
    );
  };

  const onAutomationPress = (automationId: AutomationId, label: string) => {
    if (!currentStep || isCurrentStepCompleted) {
      return;
    }

    pendingAutomationRef.current = {
      stepId: currentStep.id,
      requirementLabel: label,
      automationId,
    };

    navigation.navigate('WebsiteWebView', {
      automation: AUTOMATION_KIND[automationId],
    });
  };

  const onFormPress = (formId: string, label: string) => {
    if (!currentStep || isCurrentStepCompleted) {
      return;
    }

    Alert.alert(
      'Confirm form',
      'Review the pre-filled form and confirm it is ready.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Confirm',
          onPress: async () => {
            await completeFormRequirement(currentStep.id, label, formId);
            showToast('Form confirmed');
          },
        },
      ],
    );
  };

  const isLoading = isStepsLoading || isProgressLoading;
  const error = stepsError ?? progressError;

  return {
    isAuthLoading,
    isAuthenticated: Boolean(user),
    steps,
    isLoading,
    error,
    currentStepId,
    activeStepId,
    currentStep,
    completedStepIds,
    isCurrentStepCompleted,
    canCompleteStep,
    canInteractWithRequirements,
    stepActionDisabledHint,
    currentStepRequirements,
    onSignInPress,
    onStepPress,
    onStepDetailPress,
    onCompleteStep,
    onSelfDeclaredToggle,
    onAutomationPress,
    onFormPress,
  };
}
