import {act} from 'react';

import {useProfileScreen} from '@/features/profile/hooks/useProfileScreen';
import {createMockNavigation} from '@/test/navigation';
import {renderHook} from '@/test/renderHook';
import {ProfileStackParamList, RootStackParamList} from '@/navigation/types';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const mockShowToast = jest.fn();
const mockLogout = jest.fn();

jest.mock('@/components/Toast/ToastProvider', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/features/profile/context/ProfileDataContext', () => ({
  useProfileData: jest.fn(),
}));

const {useProfileData} = jest.requireMock(
  '@/features/profile/context/ProfileDataContext',
) as {
  useProfileData: jest.Mock;
};

type ProfileScreenNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<ProfileStackParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const {useAuth} = jest.requireMock('@/contexts/AuthContext') as {
  useAuth: jest.Mock;
};

describe('useProfileScreen', () => {
  beforeEach(() => {
    mockShowToast.mockReset();
    mockLogout.mockReset();
    useProfileData.mockReturnValue({
      isLoading: false,
      error: null,
    });
  });

  it('returns unauthenticated state when there is no user', () => {
    useAuth.mockReturnValue({
      user: null,
      isLoading: false,
      logout: mockLogout,
    });

    const navigation = createMockNavigation<
      ProfileStackParamList,
      'Profile'
    >() as ProfileScreenNavigation;
    const getHookState = renderHook(() => useProfileScreen(navigation));

    expect(getHookState().userEmail).toBeNull();
  });

  it('navigates to login when sign in is pressed', () => {
    useAuth.mockReturnValue({
      user: null,
      isLoading: false,
      logout: mockLogout,
    });

    const navigation = createMockNavigation<
      ProfileStackParamList,
      'Profile'
    >() as ProfileScreenNavigation;
    const getHookState = renderHook(() => useProfileScreen(navigation));

    act(() => {
      getHookState().onSignInPress();
    });

    expect(navigation.navigate).toHaveBeenCalledWith('Login');
  });

  it('loads profile data when authenticated', () => {
    useAuth.mockReturnValue({
      user: {id: '1', email: 'user@example.com'},
      isLoading: false,
      logout: mockLogout,
    });

    const navigation = createMockNavigation<
      ProfileStackParamList,
      'Profile'
    >() as ProfileScreenNavigation;
    const getHookState = renderHook(() => useProfileScreen(navigation));

    expect(getHookState().userEmail).toBe('user@example.com');
  });
});
