import {act} from 'react';

import {useLegalDocumentScreen} from '@/features/legal/hooks/useLegalDocumentScreen';
import {consentService} from '@/features/profile/services/consentService';
import {flushAsyncEffects, renderHook} from '@/test/renderHook';

const mockShowAlert = jest.fn();
const mockRefreshConsent = jest.fn().mockResolvedValue(true);
const mockPush = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/contexts/AppDialogContext', () => ({
  useAppDialog: () => ({
    showAlert: mockShowAlert,
    showDialog: jest.fn(),
    closeDialog: jest.fn(),
  }),
  AppDialogProvider: ({children}: {children: React.ReactNode}) => children,
}));

jest.mock('@/contexts/ConsentContext', () => ({
  useConsent: () => ({
    refreshConsent: mockRefreshConsent,
    consentStatus: {
      privacyPolicy: false,
      termsOfService: false,
      privacyAcceptedAt: null,
      termsAcceptedAt: null,
    },
  }),
}));

jest.mock('@/features/profile/services/consentService', () => ({
  consentService: {
    recordConsentType: jest.fn(),
  },
}));

describe('useLegalDocumentScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads privacy document content from i18n', async () => {
    const getHookState = renderHook(() => useLegalDocumentScreen('privacy'));
    await flushAsyncEffects();

    expect(getHookState().title).toBeTruthy();
    expect(getHookState().blocks.length).toBeGreaterThan(0);
    expect(getHookState().disclaimerTitle).toBeNull();
  });

  it('includes disclaimer content on the terms document', async () => {
    const getHookState = renderHook(() => useLegalDocumentScreen('terms'));
    await flushAsyncEffects();

    expect(getHookState().disclaimerTitle).toBeTruthy();
    expect(getHookState().disclaimerParagraphs.length).toBeGreaterThan(0);
  });

  it('records consent when accept is pressed', async () => {
    (consentService.recordConsentType as jest.Mock).mockResolvedValue(undefined);
    const getHookState = renderHook(() => useLegalDocumentScreen('privacy'));

    await act(async () => {
      await getHookState().onAcceptPress();
    });

    expect(consentService.recordConsentType).toHaveBeenCalledWith(
      'privacy_policy',
    );
    expect(mockRefreshConsent).toHaveBeenCalled();
  });
});
