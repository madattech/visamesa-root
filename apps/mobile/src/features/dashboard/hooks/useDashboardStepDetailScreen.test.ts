import {RouteProp} from '@react-navigation/native';

import {useDashboardStepDetailScreen} from '@/features/dashboard/hooks/useDashboardStepDetailScreen';
import {createTieSteps} from '@/test/fixtures/tieSteps';
import {DashboardStackParamList} from '@/navigation/types';
import {renderHookAsync} from '@/test/renderHook';

jest.mock('@/features/home/hooks/useTieSteps', () => ({
  useTieSteps: jest.fn(),
}));

const {useTieSteps} = jest.requireMock('@/features/home/hooks/useTieSteps') as {
  useTieSteps: jest.Mock;
};

const createRoute = (stepId: number): RouteProp<DashboardStackParamList, 'StepDetail'> =>
  ({
    key: 'step-detail',
    name: 'StepDetail',
    params: {stepId},
  }) as RouteProp<DashboardStackParamList, 'StepDetail'>;

describe('useDashboardStepDetailScreen', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns the requested step when loaded', async () => {
    const steps = createTieSteps(6);
    useTieSteps.mockReturnValue({
      steps,
      isLoading: false,
      error: null,
    });

    const getHookState = await renderHookAsync(
      () => useDashboardStepDetailScreen(createRoute(2)),
      state => !state.isLoading,
    );

    expect(getHookState().step?.id).toBe(2);
    expect(getHookState().error).toBeNull();
  });

  it('returns an error when the step is not found', async () => {
    useTieSteps.mockReturnValue({
      steps: createTieSteps(6),
      isLoading: false,
      error: null,
    });

    const getHookState = await renderHookAsync(
      () => useDashboardStepDetailScreen(createRoute(99)),
      state => !state.isLoading,
    );

    expect(getHookState().step).toBeUndefined();
    expect(getHookState().error?.message).toBe('Step not found');
  });
});
