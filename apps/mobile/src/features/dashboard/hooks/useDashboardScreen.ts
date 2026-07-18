import {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useToast} from '@/components/Toast/ToastProvider';
import {useAppDialog} from '@/contexts/AppDialogContext';
import {useAuth} from '@/contexts/AuthContext';
import {useEntitlements} from '@/contexts/EntitlementsContext';
import {useProfileCompletion} from '@/contexts/ProfileCompletionContext';
import {usePricingLink} from '@/hooks/usePricingLink';
import {RequirementWithProgress} from '@/features/dashboard/components/RequirementsChecklist';
import {formatAppointmentDetailsMessage} from '@/features/dashboard/data/dashboardContent';
import {syncEmpadronamientoStepFromProfile} from '@/features/dashboard/services/empadronamientoProgressService';
import {
  reconcileStepStatuses,
} from '@/features/dashboard/services/progressReconciliationService';
import {saveUserProgress, subscribeToProgressReset} from '@/features/dashboard/services/progressService';
import {useUserProgress} from '@/features/dashboard/hooks/useUserProgress';
import {ProgressContext, UserProgress} from '@/features/dashboard/types/UserProgress';
import {formatCompletedInHint} from '@/features/dashboard/utils/completionHints';
import {getRequirementToggleState} from '@/features/dashboard/utils/requirementDependencies';
import {
  areAllRequirementsComplete,
  arePreviousStepsCompleted,
  getCompletedStepIds,
  getEffectiveRequirementProgress,
  getFirstIncompleteStepId,
  getStepStatus,
  isRequirementExternallyCompleted,
} from '@/features/dashboard/utils/progressUtils';
import {getProfile} from '@/features/profile/services/profileService';
import {useTieSteps} from '@/features/home/hooks/useTieSteps';
import {AutomationId, TieStepDetail} from '@/features/home/types/TieStepDetail';
import {useProcessReadiness} from '@/hooks/useProcessReadiness';
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
  showCompleteProfileDialog: boolean;
  onSignInPress: () => void;
  onStepPress: (stepId: number) => void;
  onStepDetailPress: () => void;
  onCompleteStep: () => void;
  onRequirementCheckboxToggle: (requirementKey: string) => void;
  onAutomationPress: (automationId: AutomationId, label: string) => void;
  onViewAppointmentPress: (label: string) => void;
  onClearAutomationPress: (label: string) => void;
  onDevMarkAutomationBookedPress?: (automationId: AutomationId, label: string) => void;
  onDevConfirmFormPress?: (formId: string, label: string) => void;
  onFormPress: (formId: string, label: string) => void;
  onCloseCompleteProfileDialog: () => void;
  onCompleteProfilePress: () => void;
};

function buildRequirementsWithProgress(
  progress: UserProgress,
  step: TieStepDetail,
  context: ProgressContext,
  steps: TieStepDetail[],
  tDashboard: (key: string, options?: Record<string, unknown>) => string,
): RequirementWithProgress[] {
  return step.requirements.map(requirement => {
    const effectiveProgress = getEffectiveRequirementProgress(
      progress,
      step,
      requirement.key,
      context,
    );

    const isReferenced = isRequirementExternallyCompleted(effectiveProgress);
    const hint = isReferenced
      ? formatCompletedInHint(tDashboard, effectiveProgress.source)
      : undefined;
    const toggleState = getRequirementToggleState(
      progress,
      step,
      requirement.key,
      context,
      steps,
    );

    return {
      ...requirement,
      progress: effectiveProgress,
      hint,
      isReferenced,
      canCheck: isReferenced ? false : toggleState.canCheck,
      canUncheck: isReferenced ? false : toggleState.canUncheck,
      showDocumentActions: toggleState.showDocumentActions,
    };
  });
}

export function useDashboardScreen(
  navigation: DashboardScreenNavigation,
): UseDashboardScreenResult {
  const {t: tDashboard} = useTranslation('dashboard');
  const {t: tHome} = useTranslation('home');
  const {t: tCommon} = useTranslation('common');
  const {user, isLoading: isAuthLoading} = useAuth();
  const {canUseAutomation: canUseAutomationEntitlement} = useEntitlements();
  const {showToast} = useToast();
  const {showAlert} = useAppDialog();
  const {openPricing} = usePricingLink();
  const {steps, isLoading: isStepsLoading, error: stepsError} = useTieSteps();
  const {
    progress,
    isLoading: isProgressLoading,
    error: progressError,
    refreshProgress,
    completeStep,
    toggleSelfDeclaredRequirement,
    clearAutomationRequirement,
    completeFormRequirement,
    completeAutomationRequirement,
  } = useUserProgress();
  const {canStartProcess} = useProcessReadiness();
  const {isProfileComplete} = useProfileCompletion();

  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [showCompleteProfileDialog, setShowCompleteProfileDialog] = useState(false);
  const [hasSyncedEmpadronamiento, setHasSyncedEmpadronamiento] = useState(false);

  const progressContext = useMemo<ProgressContext>(
    () => ({
      isProfileComplete,
      allSteps: steps,
    }),
    [isProfileComplete, steps],
  );

  useEffect(() => {
    return subscribeToProgressReset(() => {
      setHasSyncedEmpadronamiento(false);
    });
  }, []);

  useEffect(() => {
    if (!progress || !steps.length || hasSyncedEmpadronamiento) {
      return;
    }

    let cancelled = false;

    getProfile()
      .then(async profileData => {
        if (cancelled) {
          return;
        }

        let next = await syncEmpadronamientoStepFromProfile(progress, profileData);
        next = reconcileStepStatuses(next, steps, progressContext);

        if (JSON.stringify(next) !== JSON.stringify(progress)) {
          await saveUserProgress(next);
          await refreshProgress();
        }

        setHasSyncedEmpadronamiento(true);
      })
      .catch(() => {
        setHasSyncedEmpadronamiento(true);
      });

    return () => {
      cancelled = true;
    };
  }, [hasSyncedEmpadronamiento, progress, progressContext, refreshProgress, steps]);

  const activeStepId = progress ? getFirstIncompleteStepId(progress, steps) : 1;

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

  const isCurrentStepCompleted = Boolean(
    progress && getStepStatus(progress, currentStepId) === 'completed',
  );

  const currentStepRequirements = useMemo(() => {
    if (!progress || !currentStep) {
      return [];
    }

    return buildRequirementsWithProgress(
      progress,
      currentStep,
      progressContext,
      steps,
      (key, options) => tDashboard(key, options),
    );
  }, [currentStep, progress, progressContext, steps, tDashboard]);

  const canCompleteStep = Boolean(
    progress &&
      currentStep &&
      !isCurrentStepCompleted &&
      arePreviousStepsCompleted(progress, currentStepId, steps) &&
      areAllRequirementsComplete(progress, currentStep, progressContext) &&
      canStartProcess,
  );

  const canInteractWithRequirements = Boolean(
    progress &&
      currentStep &&
      !isCurrentStepCompleted &&
      (currentStepId === 1 ||
        arePreviousStepsCompleted(progress, currentStepId, steps)) &&
      canStartProcess,
  );

  const stepActionLabel = useMemo(() => {
    if (!canStartProcess) {
      return tHome('prerequisitesButton');
    }
    return currentStep?.cta.complete ?? tDashboard('completeStepFallback');
  }, [canStartProcess, currentStep, tDashboard, tHome]);

  const stepActionDisabledHint = useMemo(() => {
    if (!progress || !currentStep || isCurrentStepCompleted) {
      return undefined;
    }

    if (!arePreviousStepsCompleted(progress, currentStepId, steps)) {
      return tDashboard('completePreviousStepHint');
    }

    if (!areAllRequirementsComplete(progress, currentStep, progressContext)) {
      return tDashboard('completeAllItemsHint');
    }

    return undefined;
  }, [
    progress,
    currentStep,
    isCurrentStepCompleted,
    currentStepId,
    steps,
    progressContext,
    tDashboard,
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
    // If prerequisites not met, show dialog instead
    if (!canStartProcess) {
      setShowCompleteProfileDialog(true);
      return;
    }

    if (!progress || !currentStep || !canCompleteStep) {
      return;
    }

    showAlert(tDashboard('confirmCompletionTitle'), currentStep.completionPrompt, [
      {text: tDashboard('notYet'), style: 'cancel'},
      {
        text: tDashboard('yesDone'),
        onPress: async () => {
          const nextStepId = getFirstIncompleteStepId(
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
          showToast(tDashboard('stepCompleted'));
        },
      },
    ], {dismissable: false});
  };

  const onRequirementCheckboxToggle = async (requirementKey: string) => {
    if (!progress || !currentStep || !canInteractWithRequirements) {
      return;
    }

    const toggleState = getRequirementToggleState(
      progress,
      currentStep,
      requirementKey,
      progressContext,
      steps,
    );
    const stored =
      progress.steps.find(step => step.stepId === currentStep.id)?.requirements[
        requirementKey
      ] ?? {completed: false};

    if (stored.completed) {
      if (!toggleState.canUncheck) {
        showToast(tDashboard('requirementLockedHint'));
        return;
      }
    } else if (!toggleState.canCheck) {
      showToast(tDashboard('requirementDependencyHint'));
      return;
    }

    if (isRequirementExternallyCompleted(
      getEffectiveRequirementProgress(
        progress,
        currentStep,
        requirementKey,
        progressContext,
      ),
    )) {
      return;
    }

    await toggleSelfDeclaredRequirement(
      currentStep.id,
      requirementKey,
      !stored.completed,
    );
  };

  const onAutomationPress = (automationId: AutomationId, _label: string) => {
    if (!currentStep || !canInteractWithRequirements) {
      return;
    }

    if (!canUseAutomationEntitlement(automationId)) {
      showAlert(
        tDashboard('serviceRequiredTitle'),
        tDashboard('serviceRequiredMessage'),
        [
          {text: tCommon('actions.notNow'), style: 'cancel'},
          {
            text: tDashboard('getService'),
            onPress: () => {
              openPricing().catch(() => {});
            },
          },
        ],
        {dismissable: false},
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

    showAlert(
      tDashboard('appointmentDetailsTitle'),
      formatAppointmentDetailsMessage(
        (key, options) => tDashboard(key, options),
        appointment,
      ),
      [{text: tCommon('actions.gotIt')}],
    );
  };

  const onClearAutomationPress = async (requirementKey: string) => {
    if (!currentStep || !progress || !canInteractWithRequirements) {
      return;
    }

    const toggleState = getRequirementToggleState(
      progress,
      currentStep,
      requirementKey,
      progressContext,
      steps,
    );

    if (!toggleState.canUncheck) {
      showToast(tDashboard('requirementLockedHint'));
      return;
    }

    await clearAutomationRequirement(currentStep.id, requirementKey);
    showToast(tDashboard('bookingStatusReset'));
  };

  const onDevMarkAutomationBookedPress = async (
    automationId: AutomationId,
    requirementKey: string,
  ) => {
    if (!__DEV__ || !currentStep || !progress || !canInteractWithRequirements) {
      return;
    }

    await completeAutomationRequirement(
      currentStep.id,
      requirementKey,
      automationId,
    );
    showToast(tDashboard('devMarkAsBookedSuccess'));
  };

  const onDevConfirmFormPress = async (formId: string, requirementKey: string) => {
    if (!__DEV__ || !currentStep || !progress || !canInteractWithRequirements) {
      return;
    }

    await completeFormRequirement(currentStep.id, requirementKey, formId);
    showToast(tDashboard('devFormConfirmedSuccess'));
  };

  const onFormPress = (formId: string, requirementKey: string) => {
    if (!currentStep || !progress || !canInteractWithRequirements) {
      return;
    }

    showAlert(
      tDashboard('confirmFormTitle'),
      tDashboard('confirmFormMessage'),
      [
        {text: tCommon('actions.cancel'), style: 'cancel'},
        {
          text: tCommon('actions.confirm'),
          onPress: async () => {
            await completeFormRequirement(currentStep.id, requirementKey, formId);
            showToast(tDashboard('formConfirmed'));
          },
        },
      ],
      {dismissable: false},
    );
  };

  const onCloseCompleteProfileDialog = () => {
    setShowCompleteProfileDialog(false);
  };

  const onCompleteProfilePress = () => {
    setShowCompleteProfileDialog(false);
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
    showCompleteProfileDialog,
    onSignInPress,
    onStepPress,
    onStepDetailPress,
    onCompleteStep,
    onRequirementCheckboxToggle,
    onAutomationPress,
    onViewAppointmentPress,
    onClearAutomationPress,
    onDevMarkAutomationBookedPress: __DEV__
      ? onDevMarkAutomationBookedPress
      : undefined,
    onDevConfirmFormPress: __DEV__ ? onDevConfirmFormPress : undefined,
    onFormPress,
    onCloseCompleteProfileDialog,
    onCompleteProfilePress,
  };
}
