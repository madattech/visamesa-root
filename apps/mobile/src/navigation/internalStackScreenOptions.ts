import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {brandFontStyle} from '@/theme/fonts';

const stylesheet = createStyleSheet(() => ({}));

/** Shared native header for pushed screens inside a tab stack. */
export function useInternalStackScreenOptions(): NativeStackNavigationOptions {
  const {theme} = useStyles(stylesheet);

  return {
    headerShown: true,
    headerBackTitleVisible: false,
    headerBackTitle: '',
    headerTitleAlign: 'center',
    headerStyle: {
      backgroundColor: theme.colors.surface,
    },
    headerTintColor: theme.colors.primary,
    headerTitleStyle: brandFontStyle(
      theme.typography.titleLarge.fontWeight,
      theme.typography.titleLarge.fontSize,
      theme.typography.titleLarge.lineHeight,
    ),
    headerShadowVisible: false,
    contentStyle: {
      backgroundColor: theme.colors.background,
    },
  };
}
