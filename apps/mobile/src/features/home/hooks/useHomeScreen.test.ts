import {act} from 'react';

import {useHomeScreen} from '@/features/home/hooks/useHomeScreen';
import {createTieSteps} from '@/test/fixtures/tieSteps';
import {HomeStackParamList} from '@/navigation/types';
import {createMockNavigation} from '@/test/navigation';
import {flushAsyncEffects, renderHook} from '@/test/renderHook';

const mockRefreshReadiness = jest.fn(() => Promise.resolve());

jest.mock('@/features/home/hooks/useTieSteps', () => ({
  useTieSteps: jest.fn(),
}));

jest.mock('@/hooks/useProcessReadiness', () => ({
  useProcessReadiness: jest.fn(),
}));

jest.mock('@/navigation/navigationRef', () => ({
  navigateToDashboard: jest.fn(),
}));

const {useTieSteps} = jest.requireMock('@/features/home/hooks/useTieSteps') as {
  useTieSteps: jest.Mock;
};

const {useProcessReadiness} = jest.requireMock(
  '@/hooks/useProcessReadiness',
) as {
  useProcessReadiness: jest.Mock;
};

const {navigateToDashboard} = jest.requireMock('@/navigation/navigationRef') as {
  navigateToDashboard: jest.Mock;
};

describe('useHomeScreen', () => {
  beforeEach(() => {
    navigateToDashboard.mockReset();
    mockRefreshReadiness.mockReset();
    mockRefreshReadiness.mockResolvedValue(undefined);
    useTieSteps.mockReturnValue({
      steps: createTieSteps(6),
      isLoading: false,
      error: null,
    });
    useProcessReadiness.mockReturnValue({
      canStartProcess: true,
      missing: [],
      refreshReadiness: mockRefreshReadiness,
    });
  });

  it('defaults to step 1 and updates the active step', () => {
    const navigation = createMockNavigation<HomeStackParamList, 'Home'>();
    const getHookState = renderHook(() => useHomeScreen(navigation));

    expect(getHookState().activeStepId).toBe(1);
    expect(getHookState().activeStep?.title).toBe('Step 1 Title Here');

    act(() => {
      getHookState().onStepPress(2);
    });

    expect(getHookState().activeStepId).toBe(2);
    expect(getHookState().activeStep?.id).toBe(2);
  });

  it('navigates to dashboard when prerequisites are complete', async () => {
    const navigation = createMockNavigation<HomeStackParamList, 'Home'>();
    const getHookState = renderHook(() => useHomeScreen(navigation));

    await act(async () => {
      getHookState().onPrimaryPress();
    });

    expect(navigateToDashboard).toHaveBeenCalled();
    expect(getHookState().showPrerequisitesDialog).toBe(false);
  });

  it('shows prerequisites dialog when prerequisites are incomplete', async () => {
    useProcessReadiness.mockReturnValue({
      canStartProcess: false,
      missing: ['personalInformation', 'legalPrivacy', 'payment'],
      refreshReadiness: mockRefreshReadiness,
    });

    const navigation = createMockNavigation<HomeStackParamList, 'Home'>();
    const getHookState = renderHook(() => useHomeScreen(navigation));
    await flushAsyncEffects();

    act(() => {
      getHookState().onPrimaryPress();
    });

    expect(navigateToDashboard).not.toHaveBeenCalled();
    expect(getHookState().showPrerequisitesDialog).toBe(true);
    expect(mockRefreshReadiness).toHaveBeenCalledTimes(1);
  });

  it('navigates to the process overview screen from the secondary action', () => {
    const navigation = createMockNavigation<HomeStackParamList, 'Home'>();
    const getHookState = renderHook(() => useHomeScreen(navigation));

    act(() => {
      getHookState().onSecondaryPress();
    });

    expect(navigation.navigate).toHaveBeenCalledWith('ProcessOverview');
  });
});
