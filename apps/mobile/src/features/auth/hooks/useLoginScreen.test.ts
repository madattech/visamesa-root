import { act } from 'react';
import { Alert } from 'react-native';

import { useLoginScreen } from '@/features/auth/hooks/useLoginScreen';
import { createMockNavigation } from '@/test/navigation';
import { renderHook } from '@/test/renderHook';
import { ProfileStackParamList } from '@/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const mockSignInWithGoogle = jest.fn();

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    signInWithGoogle: mockSignInWithGoogle,
  }),
}));

type LoginScreenNavigation = NativeStackNavigationProp<
  ProfileStackParamList,
  'Login'
>;

describe('useLoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
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

  it('shows an alert when Google sign-in fails', async () => {
    mockSignInWithGoogle.mockRejectedValue(new Error('Google sign-in failed'));

    const navigation = createMockNavigation<
      ProfileStackParamList,
      'Login'
    >() as LoginScreenNavigation;
    const getHookState = renderHook(() => useLoginScreen(navigation));

    await act(async () => {
      await getHookState().onGoogleSignInPress();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Sign In Failed',
      'Google sign-in failed',
    );
    expect(navigation.goBack).not.toHaveBeenCalled();
  });
});
