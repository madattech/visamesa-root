import {TFunction} from 'i18next';

import {RequirementProgress} from '@/features/dashboard/types/UserProgress';
import {getRequirementCompletionHintPlace} from '@/features/dashboard/utils/progressUtils';

export function formatCompletedInHint(
  tDashboard: TFunction<'dashboard'>,
  source: RequirementProgress['source'],
): string | undefined {
  const place = getRequirementCompletionHintPlace(source);

  if (!place) {
    return undefined;
  }

  if (place.type === 'profile') {
    return tDashboard('completedInHint', {
      place: tDashboard('completedInProfile'),
    });
  }

  return tDashboard('completedInHint', {
    place: tDashboard('completedInStep', {stepId: place.stepId}),
  });
}
