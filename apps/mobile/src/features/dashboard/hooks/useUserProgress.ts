import {useCallback, useEffect, useState} from 'react';

import {
  fetchUserProgress,
  saveUserProgress,
  setCurrentStepId,
  subscribeToProgressReset,
  updateRequirementProgress,
  updateStepStatus,
} from '@/features/dashboard/services/progressService';
import {
  AutomationAppointmentSummary,
  RequirementProgress,
  StepStatus,
  UserProgress,
} from '@/features/dashboard/types/UserProgress';

type UseUserProgressResult = {
  progress: UserProgress | null;
  isLoading: boolean;
  error: Error | null;
  refreshProgress: () => Promise<void>;
  startStep: (stepId: number) => Promise<void>;
  completeStep: (stepId: number, nextStepId: number) => Promise<void>;
  toggleSelfDeclaredRequirement: (
    stepId: number,
    requirementLabel: string,
    completed: boolean,
  ) => Promise<void>;
  completeAutomationRequirement: (
    stepId: number,
    requirementLabel: string,
    automationId: string,
    appointment?: AutomationAppointmentSummary,
  ) => Promise<void>;
  clearAutomationRequirement: (
    stepId: number,
    requirementLabel: string,
  ) => Promise<void>;
  completeFormRequirement: (
    stepId: number,
    requirementLabel: string,
    formId: string,
  ) => Promise<void>;
};

export function useUserProgress(): UseUserProgressResult {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProgress = useCallback(async () => {
    try {
      const data = await fetchUserProgress();
      setProgress(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to load progress'),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  useEffect(() => {
    if (!__DEV__) {
      return;
    }

    return subscribeToProgressReset(() => {
      loadProgress();
    });
  }, [loadProgress]);

  const applyProgress = useCallback(async (next: UserProgress) => {
    const saved = await saveUserProgress(next);
    setProgress(saved);
  }, []);

  const startStep = useCallback(
    async (stepId: number) => {
      if (!progress) {
        return;
      }

      const next = await updateStepStatus(progress, stepId, 'in_progress');
      await applyProgress(next);
    },
    [applyProgress, progress],
  );

  const completeStep = useCallback(
    async (stepId: number, nextStepId: number) => {
      if (!progress) {
        return;
      }

      let next = await updateStepStatus(progress, stepId, 'completed');
      next = await setCurrentStepId(next, nextStepId);
      await applyProgress(next);
    },
    [applyProgress, progress],
  );

  const toggleSelfDeclaredRequirement = useCallback(
    async (stepId: number, requirementLabel: string, completed: boolean) => {
      if (!progress) {
        return;
      }

      const requirementProgress: RequirementProgress = completed
        ? {completed: true, source: {type: 'self_declared'}}
        : {completed: false};

      const next = await updateRequirementProgress(
        progress,
        stepId,
        requirementLabel,
        requirementProgress,
      );
      await applyProgress(next);
    },
    [applyProgress, progress],
  );

  const completeAutomationRequirement = useCallback(
    async (
      stepId: number,
      requirementLabel: string,
      automationId: string,
      appointment?: AutomationAppointmentSummary,
    ) => {
      if (!progress) {
        return;
      }

      const next = await updateRequirementProgress(
        progress,
        stepId,
        requirementLabel,
        {
          completed: true,
          source: {
            type: 'automation',
            automationId,
            completedAt: new Date().toISOString(),
            appointment,
          },
        },
      );
      await applyProgress(next);
    },
    [applyProgress, progress],
  );

  const clearAutomationRequirement = useCallback(
    async (stepId: number, requirementLabel: string) => {
      if (!progress) {
        return;
      }

      const next = await updateRequirementProgress(
        progress,
        stepId,
        requirementLabel,
        {completed: false},
      );
      await applyProgress(next);
    },
    [applyProgress, progress],
  );

  const completeFormRequirement = useCallback(
    async (stepId: number, requirementLabel: string, formId: string) => {
      if (!progress) {
        return;
      }

      const next = await updateRequirementProgress(
        progress,
        stepId,
        requirementLabel,
        {
          completed: true,
          source: {
            type: 'form',
            formId,
            confirmedAt: new Date().toISOString(),
          },
        },
      );
      await applyProgress(next);
    },
    [applyProgress, progress],
  );

  return {
    progress,
    isLoading,
    error,
    refreshProgress: loadProgress,
    startStep,
    completeStep,
    toggleSelfDeclaredRequirement,
    completeAutomationRequirement,
    clearAutomationRequirement,
    completeFormRequirement,
  };
}

export type {StepStatus, UserProgress};
