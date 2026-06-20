import { NavigationProp, ParamListBase } from '@react-navigation/native';

/**
 * Opens Login in the Profile tab. Use from tabs/stacks where Login is not mounted locally.
 */
export function navigateToLoginFromTab(
  navigation: NavigationProp<ParamListBase>,
): void {
  const tabNavigation = navigation.getParent();

  if (tabNavigation) {
    tabNavigation.navigate('ProfileTab', { screen: 'Login' });
    return;
  }

  navigation.navigate('ProfileTab', { screen: 'Login' });
}
