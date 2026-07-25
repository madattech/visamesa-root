import { NavigationProp, ParamListBase } from '@react-navigation/native';

import { profileLoginTabRoute } from '@/navigation/loginRoute';

/**
 * Opens Login in the Profile tab. Use from tabs/stacks where Login is not mounted locally.
 */
export function navigateToLoginFromTab(
  navigation: NavigationProp<ParamListBase>,
): void {
  const tabNavigation = navigation.getParent();

  if (tabNavigation) {
    tabNavigation.navigate(
      profileLoginTabRoute.screen,
      profileLoginTabRoute.params,
    );
    return;
  }

  navigation.navigate(
    profileLoginTabRoute.screen,
    profileLoginTabRoute.params,
  );
}
