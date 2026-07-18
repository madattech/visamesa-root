import {act} from 'react';

import {useSettingsScreen} from '@/features/settings/hooks/useSettingsScreen';
import {resetUserProgress} from '@/features/dashboard/services/progressService';
import {renderHook} from '@/test/renderHook';

const mockShowToast = jest.fn();
const mockShowAlert = jest.fn();

jest.mock('@/components/Toast/ToastProvider', () => ({
  useToast: () => ({
    showToast: mockShowToast,
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

jest.mock('@/features/dashboard/services/progressService', () => ({
  resetUserProgress: jest.fn(() => Promise.resolve()),
}));

describe('useSettingsScreen', () => {
  beforeEach(() => {
    mockShowToast.mockReset();
    mockShowAlert.mockReset();
    mockShowAlert.mockImplementation((_title, _message, buttons) => {
      buttons?.find(button => button.style === 'destructive')?.onPress?.();
    });
    (resetUserProgress as jest.Mock).mockClear();
  });

  it('resets progress after confirmation in development', async () => {
    const getHookState = renderHook(() => useSettingsScreen());

    await act(async () => {
      getHookState().onResetProgressPress();
    });

    expect(mockShowAlert).toHaveBeenCalled();
    expect(resetUserProgress).toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith('Checklist progress reset');
  });
});
