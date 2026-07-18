import {
  getStepIdBySlug,
  isEmpadronamientoCertificateValid,
} from '@visamesa/content/tieSteps/detail';

import {
  updateRequirementProgress,
  updateStepStatus,
} from '@/features/dashboard/services/progressService';
import {UserProgress} from '@/features/dashboard/types/UserProgress';
import {ProfileData} from '@/features/profile/types/ProfileData';

const EMPADRONAMIENTO_STEP_ID = getStepIdBySlug('empadronamiento');

function getEmpadronamientoIssuedAt(
  personal: Record<string, unknown> | null,
): string | undefined {
  if (!personal) {
    return undefined;
  }

  const issuedAt = personal.empadronamientoIssuedAt ?? personal.dateOfDocumentIssuance;

  return typeof issuedAt === 'string' && issuedAt.length > 0 ? issuedAt : undefined;
}

export function shouldAutoCompleteEmpadronamientoStep(
  profileData: ProfileData | null,
): boolean {
  const personal = profileData?.personal;

  if (!personal || personal.hasEmpadronamiento !== 'yes') {
    return false;
  }

  const issuedAt = getEmpadronamientoIssuedAt(personal);

  if (!issuedAt) {
    return false;
  }

  return isEmpadronamientoCertificateValid(issuedAt);
}

export async function syncEmpadronamientoStepFromProfile(
  progress: UserProgress,
  profileData: ProfileData | null,
): Promise<UserProgress> {
  const shouldComplete = shouldAutoCompleteEmpadronamientoStep(profileData);
  const stepProgress = progress.steps.find(
    step => step.stepId === EMPADRONAMIENTO_STEP_ID,
  );

  if (!stepProgress) {
    return progress;
  }

  const isStoredCompleted = stepProgress.status === 'completed';

  if (shouldComplete) {
    let next = progress;

    for (const requirementKey of Object.keys(stepProgress.requirements)) {
      next = await updateRequirementProgress(next, EMPADRONAMIENTO_STEP_ID, requirementKey, {
        completed: true,
        source: {type: 'referenced_profile'},
      });
    }

    if (!isStoredCompleted) {
      return updateStepStatus(next, EMPADRONAMIENTO_STEP_ID, 'completed');
    }

    return next;
  }

  const onlyProfileSourced = Object.values(stepProgress.requirements).every(
    requirement =>
      !requirement.completed ||
      requirement.source?.type === 'referenced_profile',
  );

  if (onlyProfileSourced) {
    let next = await updateStepStatus(progress, EMPADRONAMIENTO_STEP_ID, 'not_started');

    for (const requirementKey of Object.keys(stepProgress.requirements)) {
      next = await updateRequirementProgress(next, EMPADRONAMIENTO_STEP_ID, requirementKey, {
        completed: false,
      });
    }

    return next;
  }

  if (isStoredCompleted) {
    return updateStepStatus(progress, EMPADRONAMIENTO_STEP_ID, 'in_progress');
  }

  return progress;
}
