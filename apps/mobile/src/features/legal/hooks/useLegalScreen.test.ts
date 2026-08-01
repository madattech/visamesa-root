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

jest.mock('@/features/profile/context/ProfileDataContext', () => ({
  useProfileData: () => ({
    profileData: null,
  }),
}));

jest.mock('@/hooks/useWebsiteLink', () => ({
  useWebsiteLink: () => ({
    openWebsitePath: jest.fn(),
  }),
}));

jest.mock('@/features/legal/services/accountService', () => ({
  accountService: {
    exportData: jest.fn(),
    deleteAccount: jest.fn(),
  },
}));

jest.mock('@/utils/openWebsiteUrl', () => ({
  openWebsiteUrl: jest.fn(() => Promise.resolve(true)),
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

  it('loads disclaimer paragraphs from i18n', async () => {
    const getHookState = renderHook(() => useLegalScreen());
    await flushAsyncEffects();

    expect(getHookState().disclaimerParagraphs.length).toBeGreaterThan(0);
    expect(getHookState().officialSources.length).toBeGreaterThan(0);
  });

  it('deletes the account after confirmation', async () => {
    const getHookState = renderHook(() => useLegalScreen());

    await act(async () => {
      getHookState().onDeleteAccountPress();
    });

    expect(accountService.deleteAccount).toHaveBeenCalled();
  });
});
