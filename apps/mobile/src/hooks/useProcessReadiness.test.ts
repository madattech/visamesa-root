import {renderHook} from '@/test/renderHook';
import {useProcessReadiness} from './useProcessReadiness';

// Mock the contexts
jest.mock('@/contexts/EntitlementsContext', () => ({
  useEntitlements: jest.fn(),
}));

jest.mock('@/contexts/ProfileCompletionContext', () => ({
  useProfileCompletion: jest.fn(),
  ProfileCompletionProvider: ({ children }: { children: React.ReactNode }) => children,
}));

import {useEntitlements} from '@/contexts/EntitlementsContext';
import {useProfileCompletion} from '@/contexts/ProfileCompletionContext';

const mockUseEntitlements = useEntitlements as jest.MockedFunction<
  typeof useEntitlements
>;
const mockUseProfileCompletion = useProfileCompletion as jest.MockedFunction<
  typeof useProfileCompletion
>;

describe('useProcessReadiness', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns canStartProcess false when payment is missing', () => {
    mockUseEntitlements.mockReturnValue({
      hasPaidService: () => false,
      isLoading: false,
    } as never);

    mockUseProfileCompletion.mockReturnValue({
      isProfileComplete: true,
      refreshCompletion: jest.fn(),
    } as never);

    const getHookState = renderHook(() => useProcessReadiness());

    expect(getHookState().canStartProcess).toBe(false);
    expect(getHookState().missing).toContain('payment');
    expect(getHookState().missing).not.toContain('profile');
  });

  it('returns canStartProcess false when profile is incomplete', () => {
    mockUseEntitlements.mockReturnValue({
      hasPaidService: () => true,
      isLoading: false,
      refreshEntitlements: jest.fn(),
    } as never);

    mockUseProfileCompletion.mockReturnValue({
      isProfileComplete: false,
      refreshCompletion: jest.fn(),
    } as never);

    const getHookState = renderHook(() => useProcessReadiness());

    expect(getHookState().canStartProcess).toBe(false);
    expect(getHookState().missing).not.toContain('payment');
    expect(getHookState().missing).toContain('profile');
  });

  it('returns canStartProcess false when both payment and profile are missing', () => {
    mockUseEntitlements.mockReturnValue({
      hasPaidService: () => false,
      isLoading: false,
      refreshEntitlements: jest.fn(),
    } as never);

    mockUseProfileCompletion.mockReturnValue({
      isProfileComplete: false,
      refreshCompletion: jest.fn(),
    } as never);

    const getHookState = renderHook(() => useProcessReadiness());

    expect(getHookState().canStartProcess).toBe(false);
    expect(getHookState().missing).toContain('payment');
    expect(getHookState().missing).toContain('profile');
  });

  it('returns canStartProcess true when both payment and profile are complete', () => {
    mockUseEntitlements.mockReturnValue({
      hasPaidService: () => true,
      isLoading: false,
      refreshEntitlements: jest.fn(),
    } as never);

    mockUseProfileCompletion.mockReturnValue({
      isProfileComplete: true,
      refreshCompletion: jest.fn(),
    } as never);

    const getHookState = renderHook(() => useProcessReadiness());

    expect(getHookState().canStartProcess).toBe(true);
    expect(getHookState().missing).toHaveLength(0);
  });

  it('returns isLoading true when entitlements are loading', () => {
    mockUseEntitlements.mockReturnValue({
      hasPaidService: () => false,
      isLoading: true,
      refreshEntitlements: jest.fn(),
    } as never);

    mockUseProfileCompletion.mockReturnValue({
      isProfileComplete: false,
      refreshCompletion: jest.fn(),
    } as never);

    const getHookState = renderHook(() => useProcessReadiness());

    expect(getHookState().isLoading).toBe(true);
  });

  it('returns isLoading true when profile completion is loading', () => {
    mockUseEntitlements.mockReturnValue({
      hasPaidService: () => false,
      isLoading: false,
      refreshEntitlements: jest.fn(),
    } as never);

    mockUseProfileCompletion.mockReturnValue({
      isProfileComplete: false,
      isLoading: true,
      refreshCompletion: jest.fn(),
    } as never);

    const getHookState = renderHook(() => useProcessReadiness());

    expect(getHookState().isLoading).toBe(true);
  });
});
