import {act} from 'react-test-renderer';

import {useHomeScreen} from '@/features/home/hooks/useHomeScreen';
import {createTieSteps} from '@/test/fixtures/tieSteps';
import {HomeStackParamList} from '@/navigation/types';
import {createMockNavigation} from '@/test/navigation';
import {renderHook} from '@/test/renderHook';

const mockShowToast = jest.fn();

jest.mock('@/features/home/hooks/useTieSteps', () => ({
  useTieSteps: jest.fn(),
}));

jest.mock('@/components/Toast/ToastProvider', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

const {useTieSteps} = jest.requireMock('@/features/home/hooks/useTieSteps') as {
  useTieSteps: jest.Mock;
};

describe('useHomeScreen', () => {
  beforeEach(() => {
    mockShowToast.mockReset();
    useTieSteps.mockReturnValue({
      steps: createTieSteps(6),
      isLoading: false,
      error: null,
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

  it('shows a coming soon toast for the primary action', () => {
    const navigation = createMockNavigation<HomeStackParamList, 'Home'>();
    const getHookState = renderHook(() => useHomeScreen(navigation));

    act(() => {
      getHookState().onPrimaryPress();
    });

    expect(mockShowToast).toHaveBeenCalledWith('Coming soon');
  });

  it('navigates to the steps screen from the secondary action', () => {
    const navigation = createMockNavigation<HomeStackParamList, 'Home'>();
    const getHookState = renderHook(() => useHomeScreen(navigation));

    act(() => {
      getHookState().onSecondaryPress();
    });

    expect(navigation.navigate).toHaveBeenCalledWith('Steps');
  });
});
