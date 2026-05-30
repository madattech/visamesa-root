import React from 'react';
import {Text as RNText, TextProps as RNTextProps, StyleProp, TextStyle} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {AppTheme} from '@/theme';
import {resolveBrandFontFamily} from '@/theme/fonts';

type TypographyVariant = keyof AppTheme['typography'];
type ColorToken = keyof AppTheme['colors'];

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  color?: ColorToken;
  style?: StyleProp<TextStyle>;
};

export function Text({
  variant = 'bodyMedium',
  color = 'onBackground',
  style,
  allowFontScaling = true,
  ...props
}: TextProps) {
  const {styles, theme} = useStyles(stylesheet);
  const typographyStyle = theme.typography[variant];
  const fontFamily = resolveBrandFontFamily(typographyStyle.fontWeight);

  return (
    <RNText
      {...props}
      allowFontScaling={allowFontScaling}
      style={[
        styles.base,
        {
          fontFamily,
          fontSize: typographyStyle.fontSize,
          lineHeight: typographyStyle.lineHeight,
          color: theme.colors[color],
        },
        style,
      ]}
    />
  );
}

const stylesheet = createStyleSheet(() => ({
  base: {
    includeFontPadding: false,
  },
}));
