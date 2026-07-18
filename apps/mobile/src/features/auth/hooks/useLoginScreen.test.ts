import { act } from 'react';

import { useLoginScreen } from '@/features/auth/hooks/useLoginScreen';
import { createMockNavigation } from '@/test/navigation';
import { renderHook } from '@/test/renderHook';
import { ProfileStackParamList } from '@/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const mockSignInWithGoogle = jest.fn();
const mockShowAlert = jest.fn();

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    signInWithGoogle: mockSignInWithGoogle,
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

type LoginScreenNavigation = NativeStackNavigationProp<
  ProfileStackParamList,
  'Login'
>;

describe('useLoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('signs in with Google and navigates back on success', async () => {
    mockSignInWithGoogle.mockResolvedValue(undefined);

    const navigation = createMockNavigation<
      ProfileStackParamList,
      'Login'
    >() as LoginScreenNavigation;
    const getHookState = renderHook(() => useLoginScreen(navigation));

    await act(async () => {
      await getHookState().onGoogleSignInPress();
    });

    expect(mockSignInWithGoogle).toHaveBeenCalled();
    expect(navigation.goBack).toHaveBeenCalled();
  });

  it('shows a dialog when Google sign-in fails', async () => {
    mockSignInWithGoogle.mockRejectedValue(new Error('Google sign-in failed'));

    const navigation = createMockNavigation<
      ProfileStackParamList,
      'Login'
    >() as LoginScreenNavigation;
    const getHookState = renderHook(() => useLoginScreen(navigation));

    await act(async () => {
      await getHookState().onGoogleSignInPress();
    });

    expect(mockShowAlert).toHaveBeenCalledWith(
      'Sign in failed',
      'Google sign-in failed',
    );
    expect(navigation.goBack).not.toHaveBeenCalled();
  });
});
