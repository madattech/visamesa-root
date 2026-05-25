import React from 'react';
import {Text as RNText, TextProps as RNTextProps, StyleProp, TextStyle} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {AppTheme} from '@/theme';

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

  return (
    <RNText
      {...props}
      allowFontScaling={allowFontScaling}
      style={[
        styles.base,
        {
          fontSize: typographyStyle.fontSize,
          lineHeight: typographyStyle.lineHeight,
          fontWeight: typographyStyle.fontWeight,
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
