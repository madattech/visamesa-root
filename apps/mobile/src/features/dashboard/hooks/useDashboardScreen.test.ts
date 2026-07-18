import {act} from 'react';

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

jest.mock('@/contexts/ProfileCompletionContext', () => ({
  useProfileCompletion: () => ({
    isProfileComplete: true,
    isLoading: false,
    refreshCompletion: jest.fn(),
  }),
}));

jest.mock('@/features/profile/services/profileService', () => ({
  getProfile: jest.fn(() => Promise.resolve({personal: null})),
}));

jest.mock('@/features/dashboard/services/empadronamientoProgressService', () => ({
  syncEmpadronamientoStepFromProfile: jest.fn((progress: unknown) =>
    Promise.resolve(progress),
  ),
}));

jest.mock('@/features/dashboard/services/progressService', () => ({
  saveUserProgress: jest.fn((progress: unknown) => Promise.resolve(progress)),
  subscribeToProgressReset: jest.fn(() => () => {}),
}));

jest.mock('@/utils/entitlementAccess', () => ({
  canUseAutomationEntitlement: () => true,
}));

jest.mock('@/navigation/navigationRef', () => ({
  navigateToProfile: jest.fn(),
}));

jest.mock('@/hooks/usePricingLink', () => ({
  usePricingLink: () => ({
    openPricing: jest.fn(),
  }),
}));

jest.mock('@/contexts/AppDialogContext', () => ({
  useAppDialog: () => ({
    showAlert: jest.fn(),
    showDialog: jest.fn(),
    closeDialog: jest.fn(),
  }),
  AppDialogProvider: ({children}: {children: React.ReactNode}) => children,
}));

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
      refreshProgress: jest.fn(),
    });
  });

  it('allows browsing future steps without enabling completion or interaction', () => {
    const navigation = createMockNavigation() as Parameters<
      typeof useDashboardScreen
    >[0];
    const getHookState = renderHook(() => useDashboardScreen(navigation));

    act(() => {
      getHookState().onStepPress(2);
    });

    expect(getHookState().currentStepId).toBe(2);
    expect(getHookState().canCompleteStep).toBe(false);
    expect(getHookState().canInteractWithRequirements).toBe(false);
    expect(getHookState().stepActionDisabledHint).toBe(
      'Complete the previous step before marking this one done.',
    );
    expect(getHookState().stepActionLabel).toBeDefined();
  });

  it('enables completion on step 1 when all items are checked', () => {
    useUserProgress.mockReturnValue({
      progress: createUserProgress({
        currentStepId: 1,
        steps: [
          {
            stepId: 1,
            status: 'in_progress',
            requirements: {
              passport: {completed: true, source: {type: 'self_declared'}},
            },
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
      refreshProgress: jest.fn(),
    });

    const navigation = createMockNavigation() as Parameters<
      typeof useDashboardScreen
    >[0];
    const getHookState = renderHook(() => useDashboardScreen(navigation));

    expect(getHookState().canCompleteStep).toBe(true);
    expect(getHookState().stepActionDisabledHint).toBeUndefined();
  });

  it('shows complete profile dialog when not ready', () => {
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
    expect(getHookState().showCompleteProfileDialog).toBe(false);

    act(() => {
      getHookState().onCompleteStep();
    });

    expect(getHookState().showCompleteProfileDialog).toBe(true);
    expect(completeStep).not.toHaveBeenCalled();

    act(() => {
      getHookState().onCloseCompleteProfileDialog();
    });

    expect(getHookState().showCompleteProfileDialog).toBe(false);

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

  it('does not expose dev-only checklist shortcuts when __DEV__ is false', () => {
    const originalDev = (global as {__DEV__?: boolean}).__DEV__;
    (global as {__DEV__?: boolean}).__DEV__ = false;

    const navigation = createMockNavigation() as Parameters<
      typeof useDashboardScreen
    >[0];
    const getHookState = renderHook(() => useDashboardScreen(navigation));

    expect(getHookState().onDevMarkAutomationBookedPress).toBeUndefined();
    expect(getHookState().onDevConfirmFormPress).toBeUndefined();

    (global as {__DEV__?: boolean}).__DEV__ = originalDev;
  });
});
