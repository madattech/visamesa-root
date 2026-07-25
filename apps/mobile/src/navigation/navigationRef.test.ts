import {mainTabsProfileLoginRoute} from '@/navigation/loginRoute';
import {navigationRef, navigateToLogin} from '@/navigation/navigationRef';

describe('navigateToLogin', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('navigates to Login through MainTabs when navigation is ready', () => {
    jest.spyOn(navigationRef, 'isReady').mockReturnValue(true);
    const navigate = jest
      .spyOn(navigationRef, 'navigate')
      .mockImplementation(() => undefined);

    navigateToLogin();

    expect(navigate).toHaveBeenCalledWith(
      mainTabsProfileLoginRoute.screen,
      mainTabsProfileLoginRoute.params,
    );
  });

  it('does nothing when navigation is not ready', () => {
    jest.spyOn(navigationRef, 'isReady').mockReturnValue(false);
    const navigate = jest
      .spyOn(navigationRef, 'navigate')
      .mockImplementation(() => undefined);

    navigateToLogin();

    expect(navigate).not.toHaveBeenCalled();
  });
});
