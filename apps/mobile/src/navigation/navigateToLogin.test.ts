import { navigateToLoginFromTab } from '@/navigation/navigateToLogin';
import { createMockNavigation } from '@/test/navigation';

describe('navigateToLoginFromTab', () => {
  it('navigates to Login through the Profile tab', () => {
    const tabNavigation = {
      navigate: jest.fn(),
    };
    const navigation = {
      getParent: jest.fn().mockReturnValue(tabNavigation),
      navigate: jest.fn(),
    };

    navigateToLoginFromTab(navigation as never);

    expect(tabNavigation.navigate).toHaveBeenCalledWith('ProfileTab', {
      screen: 'Login',
    });
  });
});
