import {act} from 'react';
import {Alert} from 'react-native';

import {useDashboardScreen} from '@/features/dashboard/hooks/useDashboardScreen';
import {createTieSteps} from '@/test/fixtures/tieSteps';
import {createUserProgress} from '@/test/fixtures/userProgress';
import {createMockNavigation} from '@/test/navigation';
import {renderHook} from '@/test/renderHook';

const mockShowToast = jest.fn();
const mockUseProcessReadiness = jest.fn();

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

jest.mock('@/contexts/EntitlementsContext', () => ({
  useEntitlements: () => ({
    hasPaidService: () => true,
    canUseAutomation: () => true,
    isLoading: false,
    refreshEntitlements: jest.fn(),
  }),
}));

jest.mock('@/hooks/useProcessReadiness', () => ({
  useProcessReadiness: () => mockUseProcessReadiness(),
}));

jest.mock('@/utils/entitlementAccess', () => ({
  canUseAutomationEntitlement: () => true,
}));

jest.mock('@/navigation/navigationRef', () => ({
  navigateToProfile: jest.fn(),
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
  const clearAutomationRequirement = jest.fn();
  const completeFormRequirement = jest.fn();

  beforeEach(() => {
    mockShowToast.mockReset();
    completeStep.mockReset();
    toggleSelfDeclaredRequirement.mockReset();
    completeAutomationRequirement.mockReset();
    clearAutomationRequirement.mockReset();
    completeFormRequirement.mockReset();

    mockUseProcessReadiness.mockReturnValue({
      canStartProcess: true,
      missing: [],
      isLoading: false,
    });

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
      clearAutomationRequirement,
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
    expect(getHookState().stepActionLabel).toBeDefined();
  });

  it('shows prerequisites button when not ready', () => {
    // Set mock before rendering hook
    mockUseProcessReadiness.mockReturnValue({
      canStartProcess: false,
      missing: ['payment', 'profile'],
      isLoading: false,
    });

    const navigation = createMockNavigation() as Parameters<
      typeof useDashboardScreen
    >[0];
    const getHookState = renderHook(() => useDashboardScreen(navigation));

    expect(getHookState().canStartProcess).toBe(false);
    expect(getHookState().stepActionLabel).toBe('See prerequisites');
    expect(getHookState().showPrerequisitesModal).toBe(false);

    act(() => {
      getHookState().onCompleteStep();
    });

    expect(getHookState().showPrerequisitesModal).toBe(true);
    expect(completeStep).not.toHaveBeenCalled();

    act(() => {
      getHookState().onClosePrerequisitesModal();
    });

    expect(getHookState().showPrerequisitesModal).toBe(false);

    // Restore default mock for other tests
    mockUseProcessReadiness.mockReturnValue({
      canStartProcess: true,
      missing: [],
      isLoading: false,
    });
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
