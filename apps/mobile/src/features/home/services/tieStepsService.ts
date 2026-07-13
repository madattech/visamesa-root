import {buildTieSteps} from '@visamesa/content/tieSteps/detail';
import {i18n} from '@visamesa/content/i18n';

import {TieStepDetail} from '@/features/home/types/TieStepDetail';

export async function fetchTieSteps(): Promise<TieStepDetail[]> {
  // TODO: replace with API call when BE endpoint is ready
  return buildTieSteps((key, options) => i18n.t(key, options));
}
