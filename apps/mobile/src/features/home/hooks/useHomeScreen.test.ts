import {act} from 'react';
import {Alert, Linking} from 'react-native';

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

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const {useTieSteps} = jest.requireMock('@/features/home/hooks/useTieSteps') as {
  useTieSteps: jest.Mock;
};

const {useAuth} = jest.requireMock('@/contexts/AuthContext') as {
  useAuth: jest.Mock;
};

describe('useHomeScreen', () => {
  beforeEach(() => {
    mockShowToast.mockReset();
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    useTieSteps.mockReturnValue({
      steps: createTieSteps(6),
      isLoading: false,
      error: null,
    });
    useAuth.mockReturnValue({
      user: {id: 'user-1', email: 'test@example.com'},
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
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

  it('opens the pricing website for signed-in users', async () => {
    const navigation = createMockNavigation<HomeStackParamList, 'Home'>();
    const getHookState = renderHook(() => useHomeScreen(navigation));

    await act(async () => {
      getHookState().onPrimaryPress();
    });

    expect(Linking.openURL).toHaveBeenCalled();
  });

  it('prompts unsigned users before opening the pricing website', () => {
    useAuth.mockReturnValue({user: null});
    const navigation = createMockNavigation<HomeStackParamList, 'Home'>();
    const getHookState = renderHook(() => useHomeScreen(navigation));

    act(() => {
      getHookState().onPrimaryPress();
    });

    expect(Alert.alert).toHaveBeenCalled();
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
