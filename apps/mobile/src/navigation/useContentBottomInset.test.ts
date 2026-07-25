import {useRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {useContentBottomInset} from './useContentBottomInset';
import {renderHook} from '@/test/renderHook';

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
}));

jest.mock('./useTabBarInset', () => ({
  useTabBarInset: jest.fn(),
}));

const {useTabBarInset} = jest.requireMock('./useTabBarInset') as {
  useTabBarInset: jest.Mock;
};

describe('useContentBottomInset', () => {
  beforeEach(() => {
    (useSafeAreaInsets as jest.Mock).mockReturnValue({bottom: 20});
    (useTabBarInset as jest.Mock).mockReturnValue(80);
  });

  it('returns tabBarInset when tab bar is visible', () => {
    (useRoute as jest.Mock).mockReturnValue({name: 'Home'});

    const getHookState = renderHook(() => useContentBottomInset());

    expect(getHookState()).toBe(80);
  });

  it('returns safe area bottom when tab bar is hidden', () => {
    (useRoute as jest.Mock).mockReturnValue({name: 'ProcessOverview'});

    const getHookState = renderHook(() => useContentBottomInset());

    // Should return max(insets.bottom, spacing.lg) = max(20, 24) = 24
    expect(getHookState()).toBe(24);
  });

  it('returns spacing.lg when safe area bottom is smaller', () => {
    (useSafeAreaInsets as jest.Mock).mockReturnValue({bottom: 0});
    (useRoute as jest.Mock).mockReturnValue({name: 'ProfileSection'});

    const getHookState = renderHook(() => useContentBottomInset());

    expect(getHookState()).toBe(24); // spacing.lg
  });
});
