import { navigateToLoginFromTab } from '@/navigation/navigateToLogin';

import { profileLoginTabRoute } from '@/navigation/loginRoute';

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

    expect(tabNavigation.navigate).toHaveBeenCalledWith(
      profileLoginTabRoute.screen,
      profileLoginTabRoute.params,
    );
  });
});
