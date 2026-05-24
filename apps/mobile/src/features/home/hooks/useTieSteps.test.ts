import {useTieSteps} from '@/features/home/hooks/useTieSteps';
import {createTieSteps} from '@/test/fixtures/tieSteps';
import {renderHookAsync} from '@/test/renderHook';

jest.mock('@/features/home/services/tieStepsService', () => ({
  fetchTieSteps: jest.fn(),
}));

const {fetchTieSteps} = jest.requireMock(
  '@/features/home/services/tieStepsService',
) as {
  fetchTieSteps: jest.Mock;
};

describe('useTieSteps', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('loads steps from the service', async () => {
    const steps = createTieSteps(6);
    fetchTieSteps.mockResolvedValue(steps);

    const getHookState = await renderHookAsync(useTieSteps, state => !state.isLoading);

    expect(getHookState().steps).toEqual(steps);
    expect(getHookState().error).toBeNull();
  });

  it('stores an error when loading fails', async () => {
    fetchTieSteps.mockRejectedValue(new Error('Network error'));

    const getHookState = await renderHookAsync(
      useTieSteps,
      state => !state.isLoading,
    );

    expect(getHookState().steps).toEqual([]);
    expect(getHookState().error?.message).toBe('Network error');
  });
});
