import {TieStepDetail} from '@/features/home/types/TieStepDetail';

import {tieStepsDetail} from '../data/stepsData';

export async function fetchTieSteps(): Promise<TieStepDetail[]> {
  // TODO: replace with API call when BE endpoint is ready
  return tieStepsDetail;
}
