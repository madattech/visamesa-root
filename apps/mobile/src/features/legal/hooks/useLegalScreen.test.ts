import {act} from 'react';

import {AppAlertButton} from '@/contexts/AppDialogContext';
import {useLegalScreen} from '@/features/legal/hooks/useLegalScreen';
import {accountService} from '@/features/legal/services/accountService';
import {flushAsyncEffects, renderHook} from '@/test/renderHook';

const mockShowAlert = jest.fn();
const mockLogout = jest.fn();
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
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

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

jest.mock('@/contexts/ConsentContext', () => ({
  useConsent: () => ({
    hasPrivacyConsent: false,
    hasTermsConsent: true,
  }),
}));

jest.mock('@/features/profile/context/ProfileDataContext', () => ({
  useProfileData: () => ({
    profileData: null,
  }),
}));

jest.mock('@/features/legal/services/accountService', () => ({
  accountService: {
    exportData: jest.fn(),
    deleteAccount: jest.fn(),
  },
}));

describe('useLegalScreen', () => {
  beforeEach(() => {
    mockShowAlert.mockReset();
    mockLogout.mockReset();
    mockNavigate.mockReset();
    mockShowAlert.mockImplementation((_title, _message, buttons) => {
      buttons?.find((button: AppAlertButton) => button.style === 'destructive')?.onPress?.();
    });
    (accountService.deleteAccount as jest.Mock).mockResolvedValue(undefined);
  });

  it('opens legal documents in the app', async () => {
    const getHookState = renderHook(() => useLegalScreen());
    await flushAsyncEffects();

    act(() => {
      getHookState().onOpenDocument('privacy');
    });

    expect(mockNavigate).toHaveBeenCalledWith('LegalDocument', {
      documentId: 'privacy',
    });
  });

  it('deletes the account after confirmation', async () => {
    const getHookState = renderHook(() => useLegalScreen());

    await act(async () => {
      getHookState().onDeleteAccountPress();
    });

    expect(accountService.deleteAccount).toHaveBeenCalled();
  });
});
