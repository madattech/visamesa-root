import {act} from 'react';
import {Alert} from 'react-native';

import {useDashboardScreen} from '@/features/dashboard/hooks/useDashboardScreen';
import {createTieSteps} from '@/test/fixtures/tieSteps';
import {createUserProgress} from '@/test/fixtures/userProgress';
import {createMockNavigation} from '@/test/navigation';
import {renderHook} from '@/test/renderHook';

const mockShowToast = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

jest.mock('@/features/home/hooks/useTieSteps', () => ({
  useTieSteps: jest.fn(),
}));

jest.mock('@/features/dashboard/hooks/useUserProgress', () => ({
  useUserProgress: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {id: 'test', email: 'test@example.com'},
    isLoading: false,
  }),
}));

jest.mock('@/components/Toast/ToastProvider', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);

const {useTieSteps} = jest.requireMock('@/features/home/hooks/useTieSteps') as {
  useTieSteps: jest.Mock;
};

const {useUserProgress} = jest.requireMock(
  '@/features/dashboard/hooks/useUserProgress',
) as {useUserProgress: jest.Mock};

describe('useDashboardScreen', () => {
  const completeStep = jest.fn();
  const toggleSelfDeclaredRequirement = jest.fn();
  const completeAutomationRequirement = jest.fn();
  const completeFormRequirement = jest.fn();

  beforeEach(() => {
    mockShowToast.mockReset();
    completeStep.mockReset();
    toggleSelfDeclaredRequirement.mockReset();
    completeAutomationRequirement.mockReset();
    completeFormRequirement.mockReset();

    useTieSteps.mockReturnValue({
      steps: createTieSteps(2),
      isLoading: false,
      error: null,
    });

    useUserProgress.mockReturnValue({
      progress: createUserProgress({
        currentStepId: 1,
        steps: [
          {
            stepId: 1,
            status: 'not_started',
            requirements: {
              Passport: {completed: false},
            },
          },
          {
            stepId: 2,
            status: 'not_started',
            requirements: {},
          },
        ],
      }),
      isLoading: false,
      error: null,
      completeStep,
      toggleSelfDeclaredRequirement,
      completeAutomationRequirement,
      completeFormRequirement,
    });
  });

  it('allows browsing future steps without enabling completion', () => {
    const navigation = createMockNavigation() as Parameters<
      typeof useDashboardScreen
    >[0];
    const getHookState = renderHook(() => useDashboardScreen(navigation));

    act(() => {
      getHookState().onStepPress(2);
    });

    expect(getHookState().currentStepId).toBe(2);
    expect(getHookState().canCompleteStep).toBe(false);
    expect(getHookState().canInteractWithRequirements).toBe(true);
    expect(getHookState().stepActionDisabledHint).toBeTruthy();
  });

  it('navigates to step detail and automation webview', () => {
    const navigation = createMockNavigation() as Parameters<
      typeof useDashboardScreen
    >[0];
    const getHookState = renderHook(() => useDashboardScreen(navigation));

    act(() => {
      getHookState().onStepDetailPress();
    });

    expect(navigation.navigate).toHaveBeenCalledWith('StepDetail', {
      stepId: 1,
    });

    act(() => {
      getHookState().onAutomationPress('empadronamiento', 'Appointment confirmation');
    });

    expect(navigation.navigate).toHaveBeenCalledWith('WebsiteWebView', {
      automation: 'empadronamiento',
    });
  });
});
