import {TieStepDetail} from '@/features/home/types/TieStepDetail';
import {
  ProgressContext,
  UserProgress,
} from '@/features/dashboard/types/UserProgress';
import {areAllRequirementsComplete} from '@/features/dashboard/utils/progressUtils';

export function reconcileStepStatuses(
  progress: UserProgress,
  steps: TieStepDetail[],
  context: ProgressContext,
): UserProgress {
  return {
    ...progress,
    steps: progress.steps.map(stepProgress => {
      const stepDef = steps.find(step => step.id === stepProgress.stepId);

      if (!stepDef) {
        return stepProgress;
      }

      const allComplete = areAllRequirementsComplete(
        progress,
        stepDef,
        context,
      );

      if (stepProgress.status === 'completed' && !allComplete) {
        const hasStarted = Object.values(stepProgress.requirements).some(
          requirement => requirement.completed,
        );

        return {
          ...stepProgress,
          status: hasStarted ? 'in_progress' : 'not_started',
          completedAt: undefined,
        };
      }

      return stepProgress;
    }),
  };
}
