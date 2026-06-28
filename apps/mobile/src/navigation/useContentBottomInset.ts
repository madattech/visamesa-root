import {useRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {TAB_BAR_HIDDEN_ROUTES} from './tabBarConfig';
import {useTabBarInset} from './useTabBarInset';

const stylesheet = createStyleSheet(() => ({}));

/**
 * Returns appropriate bottom padding for content based on tab bar visibility.
 * - When tab bar is visible: returns full tab bar inset
 * - When tab bar is hidden: returns safe area bottom or spacing.lg, whichever is larger
 *
 * Use this for scroll content paddingBottom to avoid excessive blank space
 * on screens where the tab bar is hidden.
 */
export function useContentBottomInset(): number {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const {theme} = useStyles(stylesheet);
  const tabBarInset = useTabBarInset();

  const isTabBarHidden = TAB_BAR_HIDDEN_ROUTES.has(route.name);

  if (isTabBarHidden) {
    return Math.max(insets.bottom, theme.spacing.lg);
  }

  return tabBarInset;
}
