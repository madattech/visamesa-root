import {useEffect, useMemo, useState} from 'react';
import {Alert, Linking} from 'react-native';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useToast} from '@/components/Toast/ToastProvider';
import {WEBSITE_PRICING_URL} from '@/config/website';
import {useAuth} from '@/contexts/AuthContext';
import {useEntitlements} from '@/contexts/EntitlementsContext';
import {RequirementWithProgress} from '@/features/dashboard/components/RequirementsChecklist';
import {
  DASHBOARD_COMPLETE_PREVIOUS_STEP_HINT,
  getAppointmentDetailsMessage,
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
import {PREREQUISITES_BUTTON_LABEL} from '@/features/home/data/prerequisitesContent';
import {useProcessReadiness, ProcessReadinessMissing} from '@/hooks/useProcessReadiness';
import { navigateToLoginFromTab } from '@/navigation/navigateToLogin';
import { navigateToProfile } from '@/navigation/navigationRef';
import {
  DashboardStackParamList,
  RootStackParamList,
  WebViewAutomationKind,
} from '@/navigation/types';

type DashboardScreenNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<DashboardStackParamList, 'Dashboard'>,
  NativeStackNavigationProp<RootStackParamList>
>;

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
  stepActionLabel: string;
  currentStepRequirements: RequirementWithProgress[];
  canStartProcess: boolean;
  processMissing: ProcessReadinessMissing[];
  showPrerequisitesModal: boolean;
  onSignInPress: () => void;
  onStepPress: (stepId: number) => void;
  onStepDetailPress: () => void;
  onCompleteStep: () => void;
  onSelfDeclaredToggle: (label: string) => void;
  onAutomationPress: (automationId: AutomationId, label: string) => void;
  onViewAppointmentPress: (label: string) => void;
  onClearAutomationPress: (label: string) => void;
  onFormPress: (formId: string, label: string) => void;
  onClosePrerequisitesModal: () => void;
  onGetServicePress: () => void;
  onCompleteProfilePress: () => void;
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
  const {canUseAutomation: canUseAutomationEntitlement} = useEntitlements();
  const {showToast} = useToast();
  const {steps, isLoading: isStepsLoading, error: stepsError} = useTieSteps();
  const {
    progress,
    isLoading: isProgressLoading,
    error: progressError,
    completeStep,
    toggleSelfDeclaredRequirement,
    clearAutomationRequirement,
    completeFormRequirement,
  } = useUserProgress();
  const {canStartProcess, missing: processMissing} = useProcessReadiness();

  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [showPrerequisitesModal, setShowPrerequisitesModal] = useState(false);

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
      areAllRequirementsComplete(progress, currentStep) &&
      canStartProcess,
  );

  const canInteractWithRequirements =
    !isCurrentStepCompleted && canStartProcess;

  const stepActionLabel = useMemo(() => {
    if (!canStartProcess && processMissing.length > 0) {
      return PREREQUISITES_BUTTON_LABEL;
    }
    return currentStep?.cta.complete ?? 'Complete step';
  }, [canStartProcess, processMissing, currentStep]);

  const stepActionDisabledHint = useMemo(() => {
    if (!isCurrentStepCompleted && currentStepId !== activeStepId) {
      return DASHBOARD_COMPLETE_PREVIOUS_STEP_HINT;
    }

    return undefined;
  }, [
    isCurrentStepCompleted,
    currentStepId,
    activeStepId,
  ]);

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
    // If prerequisites not met, show modal instead
    if (!canStartProcess && processMissing.length > 0) {
      setShowPrerequisitesModal(true);
      return;
    }

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

  const onAutomationPress = (automationId: AutomationId, _label: string) => {
    if (!currentStep || isCurrentStepCompleted) {
      return;
    }

    if (!canUseAutomationEntitlement(automationId)) {
      Alert.alert(
        'VisaMesa service required',
        'Appointment automation is included in our paid service. Complete payment on our website, then sign in here with the same Google account.',
        [
          {text: 'Not now', style: 'cancel'},
          {
            text: 'Get service',
            onPress: () => {
              void Linking.openURL(WEBSITE_PRICING_URL);
            },
          },
        ],
      );
      return;
    }

    navigation.navigate('WebsiteWebView', {
      automation: AUTOMATION_KIND[automationId],
    });
  };

  const onViewAppointmentPress = (label: string) => {
    if (!progress || !currentStep) {
      return;
    }

    const requirementProgress = progress.steps
      .find(step => step.stepId === currentStep.id)
      ?.requirements[label];

    const appointment =
      requirementProgress?.source?.type === 'automation'
        ? requirementProgress.source.appointment
        : undefined;

    Alert.alert('Appointment details', getAppointmentDetailsMessage(appointment));
  };

  const onClearAutomationPress = async (label: string) => {
    if (!currentStep || isCurrentStepCompleted) {
      return;
    }

    await clearAutomationRequirement(currentStep.id, label);
    showToast('Booking status reset');
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

  const onClosePrerequisitesModal = () => {
    setShowPrerequisitesModal(false);
  };

  const onGetServicePress = () => {
    setShowPrerequisitesModal(false);
    void Linking.openURL(WEBSITE_PRICING_URL);
  };

  const onCompleteProfilePress = () => {
    setShowPrerequisitesModal(false);
    navigateToProfile();
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
    stepActionLabel,
    currentStepRequirements,
    canStartProcess,
    processMissing,
    showPrerequisitesModal,
    onSignInPress,
    onStepPress,
    onStepDetailPress,
    onCompleteStep,
    onSelfDeclaredToggle,
    onAutomationPress,
    onViewAppointmentPress,
    onClearAutomationPress,
    onFormPress,
    onClosePrerequisitesModal,
    onGetServicePress,
    onCompleteProfilePress,
  };
}
