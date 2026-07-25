import React from 'react';
import {act} from 'react';
import renderer from 'react-test-renderer';

import {ConsentProvider} from '@/contexts/ConsentContext';
import {useConsentStatus} from './useConsentStatus';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/services/consentService', () => ({
  consentService: {
    hasAcceptedConsent: jest.fn(),
  },
}));

import {useAuth} from '@/contexts/AuthContext';
import {consentService} from '@/services/consentService';

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockHasAcceptedConsent =
  consentService.hasAcceptedConsent as jest.MockedFunction<
    typeof consentService.hasAcceptedConsent
  >;

function renderConsentStatusHook(enabled = true) {
  let hookResult: ReturnType<typeof useConsentStatus> | null = null;

  const Harness = () => {
    hookResult = useConsentStatus({enabled});
    return null;
  };

  act(() => {
    renderer.create(
      <ConsentProvider>
        <Harness />
      </ConsentProvider>,
    );
  });

  if (!hookResult) {
    throw new Error('Hook did not run');
  }

  return () => hookResult as ReturnType<typeof useConsentStatus>;
}

async function flushAsyncEffects(): Promise<void> {
  await act(async () => {
    await Promise.resolve();
  });
}

describe('useConsentStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: {id: 'user-1'},
    } as never);
    mockHasAcceptedConsent.mockResolvedValue(true);
  });

  it('loads consent for signed-in users', async () => {
    const getHookState = renderConsentStatusHook();
    await flushAsyncEffects();

    expect(mockHasAcceptedConsent).toHaveBeenCalledTimes(1);
    expect(getHookState().hasConsent).toBe(true);
  });

  it('returns false when disabled even if consent is loaded', async () => {
    const getHookState = renderConsentStatusHook(false);
    await flushAsyncEffects();

    expect(getHookState().hasConsent).toBe(false);
    expect(getHookState().isLoading).toBe(false);
  });
});
