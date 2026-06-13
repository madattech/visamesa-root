import {RouteProp} from '@react-navigation/native';

import {useTieSteps} from '@/features/home/hooks/useTieSteps';
import {DashboardStackParamList} from '@/navigation/types';

type DashboardStepDetailRoute = RouteProp<
  DashboardStackParamList,
  'StepDetail'
>;

export function useDashboardStepDetailScreen(route: DashboardStepDetailRoute) {
  const {steps, isLoading, error} = useTieSteps();
  const step = steps.find(item => item.id === route.params.stepId);

  return {
    step,
    isLoading,
    error:
      error ??
      (!isLoading && !step ? new Error('Step not found') : null),
  };
}
