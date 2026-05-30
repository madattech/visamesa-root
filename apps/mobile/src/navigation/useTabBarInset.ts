import {Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

const stylesheet = createStyleSheet(() => ({}));

/** Height of the bottom tab bar including safe area — use as scroll paddingBottom. */
export function useTabBarInset(): number {
  const insets = useSafeAreaInsets();
  const {theme} = useStyles(stylesheet);

  return (
    theme.sizes.touchTargetMin +
    theme.spacing.xs +
    Math.max(insets.bottom, theme.spacing.xs) +
    (Platform.OS === 'ios' ? theme.spacing.xs : 0)
  );
}
