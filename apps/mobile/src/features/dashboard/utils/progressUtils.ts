import {TieStepDetail} from '@/features/home/types/TieStepDetail';
import {
  RequirementProgress,
  StepStatus,
  UserProgress,
} from '@/features/dashboard/types/UserProgress';

export function getStepProgress(
  progress: UserProgress,
  stepId: number,
): UserProgress['steps'][number] | undefined {
  return progress.steps.find(step => step.stepId === stepId);
}

export function getStepStatus(
  progress: UserProgress,
  stepId: number,
): StepStatus {
  return getStepProgress(progress, stepId)?.status ?? 'not_started';
}

export function isStepCompleted(progress: UserProgress, stepId: number): boolean {
  return getStepStatus(progress, stepId) === 'completed';
}

export function getEffectiveRequirementProgress(
  progress: UserProgress,
  step: TieStepDetail,
  requirementKey: string,
): RequirementProgress {
  const stored =
    getStepProgress(progress, step.id)?.requirements[requirementKey];

  if (stored?.completed) {
    return stored;
  }

  const requirement = step.requirements.find(
    item => item.key === requirementKey,
  );

  if (
    requirement?.referencesStepId &&
    isStepCompleted(progress, requirement.referencesStepId)
  ) {
    return {
      completed: true,
      source: {
        type: 'referenced_step',
        stepId: requirement.referencesStepId,
      },
    };
  }

  return stored ?? {completed: false};
}

export function areAllRequirementsComplete(
  progress: UserProgress,
  step: TieStepDetail,
): boolean {
  return step.requirements.every(requirement =>
    getEffectiveRequirementProgress(progress, step, requirement.key)
      .completed,
  );
}

export function getNextIncompleteStepId(
  progress: UserProgress,
  steps: TieStepDetail[],
): number {
  const next = steps.find(
    step => getStepStatus(progress, step.id) !== 'completed',
  );

  return next?.id ?? steps[steps.length - 1]?.id ?? 1;
}

export function isStepAccessible(
  progress: UserProgress,
  stepId: number,
  steps: TieStepDetail[],
): boolean {
  const index = steps.findIndex(step => step.id === stepId);

  if (index <= 0) {
    return true;
  }

  return steps
    .slice(0, index)
    .every(priorStep => isStepCompleted(progress, priorStep.id));
}

export function getCompletedStepIds(progress: UserProgress): number[] {
  return progress.steps
    .filter(step => step.status === 'completed')
    .map(step => step.stepId);
}
