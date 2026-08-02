import AsyncStorage from '@react-native-async-storage/async-storage';

import {fetchTieSteps} from '@/features/home/services/tieStepsService';
import {Requirement} from '@/features/home/types/TieStepDetail';
import {
  RequirementProgress,
  StepStatus,
  UserProgress,
  UserStepProgress,
} from '@/features/dashboard/types/UserProgress';

const PROGRESS_STORAGE_KEY = '@visamesa_user_progress';

let inMemoryProgress: UserProgress | null = null;
const progressResetListeners = new Set<() => void>();

export function subscribeToProgressReset(listener: () => void): () => void {
  if (!__DEV__) {
    return () => {};
  }

  progressResetListeners.add(listener);

  return () => {
    progressResetListeners.delete(listener);
  };
}

const createEmptyRequirementProgress = (): RequirementProgress => ({
  completed: false,
});

const buildInitialStepProgress = (
  stepId: number,
  requirements: Requirement[],
): UserStepProgress => ({
  stepId,
  status: 'not_started',
  requirements: requirements.reduce<Record<string, RequirementProgress>>(
    (acc, requirement) => {
      acc[requirement.key] = createEmptyRequirementProgress();
      return acc;
    },
    {},
  ),
});

export async function createInitialProgress(): Promise<UserProgress> {
  const steps = await fetchTieSteps();

  return {
    currentStepId: 1,
    steps: steps.map(step =>
      buildInitialStepProgress(step.id, step.requirements),
    ),
  };
}

const mergeProgressWithSteps = async (
  stored: UserProgress,
): Promise<UserProgress> => {
  const steps = await fetchTieSteps();
  const migrated = migrateStoredProgress(stored, steps);

  return {
    currentStepId: migrated.currentStepId,
    steps: steps.map(stepDefinition => {
      const existing = migrated.steps.find(
        stepProgress => stepProgress.stepId === stepDefinition.id,
      );

      if (!existing) {
        return buildInitialStepProgress(
          stepDefinition.id,
          stepDefinition.requirements,
        );
      }

      const requirements = stepDefinition.requirements.reduce<
        Record<string, RequirementProgress>
      >((acc, requirement) => {
        acc[requirement.key] =
          existing.requirements[requirement.key] ??
          createEmptyRequirementProgress();
        return acc;
      }, {});

      return {
        ...existing,
        requirements,
      };
    }),
  };
};

function migrateStoredProgress(
  stored: UserProgress,
  stepDefinitions: Awaited<ReturnType<typeof fetchTieSteps>>,
): UserProgress {
  const step2 = stored.steps.find(step => step.stepId === 2);

  if (!step2) {
    return stored;
  }

  const legacyAutomation = step2.requirements['cita-previa-access'];
  const currentAutomation = step2.requirements['appointment-confirmation'];

  if (legacyAutomation?.completed && !currentAutomation?.completed) {
    return {
      ...stored,
      steps: stored.steps.map(step => {
        if (step.stepId !== 2) {
          return step;
        }

        const requirements = {...step.requirements};
        delete requirements['cita-previa-access'];
        requirements['appointment-confirmation'] = legacyAutomation;

        return {...step, requirements};
      }),
    };
  }

  if (stepDefinitions.some(step => step.id === 2)) {
    const step2Def = stepDefinitions.find(step => step.id === 2);

    if (step2Def && step2.requirements['cita-previa-access']) {
      const requirements = {...step2.requirements};
      delete requirements['cita-previa-access'];

      return {
        ...stored,
        steps: stored.steps.map(step =>
          step.stepId === 2 ? {...step, requirements} : step,
        ),
      };
    }
  }

  return stored;
}

export async function fetchUserProgress(): Promise<UserProgress> {
  if (inMemoryProgress) {
    return mergeProgressWithSteps(inMemoryProgress);
  }

  try {
    const raw = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);

    if (raw) {
      const parsed = JSON.parse(raw) as UserProgress;
      inMemoryProgress = await mergeProgressWithSteps(parsed);
      return inMemoryProgress;
    }
  } catch {
    // Fall through to initial progress
  }

  inMemoryProgress = await createInitialProgress();
  await AsyncStorage.setItem(
    PROGRESS_STORAGE_KEY,
    JSON.stringify(inMemoryProgress),
  );

  return inMemoryProgress;
}

async function persistProgress(progress: UserProgress): Promise<UserProgress> {
  inMemoryProgress = progress;
  await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));

  import('@/features/dashboard/services/progressSyncService')
    .then(({syncProgressSnapshot}) => syncProgressSnapshot(progress))
    .catch(() => {});

  return progress;
}

export async function saveUserProgress(
  progress: UserProgress,
): Promise<UserProgress> {
  return persistProgress(progress);
}

export async function updateStepStatus(
  progress: UserProgress,
  stepId: number,
  status: StepStatus,
): Promise<UserProgress> {
  const now = new Date().toISOString();

  const steps = progress.steps.map(step => {
    if (step.stepId !== stepId) {
      return step;
    }

    if (status === 'in_progress') {
      return {
        ...step,
        status,
        startedAt: step.startedAt ?? now,
      };
    }

    if (status === 'completed') {
      return {
        ...step,
        status,
        completedAt: now,
      };
    }

    return {...step, status};
  });

  return persistProgress({...progress, steps});
}

export async function updateRequirementProgress(
  progress: UserProgress,
  stepId: number,
  requirementLabel: string,
  requirementProgress: RequirementProgress,
): Promise<UserProgress> {
  const steps = progress.steps.map(step => {
    if (step.stepId !== stepId) {
      return step;
    }

    return {
      ...step,
      requirements: {
        ...step.requirements,
        [requirementLabel]: requirementProgress,
      },
    };
  });

  return persistProgress({...progress, steps});
}

export async function setCurrentStepId(
  progress: UserProgress,
  currentStepId: number,
): Promise<UserProgress> {
  return persistProgress({...progress, currentStepId});
}

/** Clears stored progress — dev and test only */
export async function resetUserProgress(): Promise<void> {
  if (!__DEV__) {
    return;
  }

  inMemoryProgress = null;
  await AsyncStorage.removeItem(PROGRESS_STORAGE_KEY);
  progressResetListeners.forEach(listener => listener());
}
