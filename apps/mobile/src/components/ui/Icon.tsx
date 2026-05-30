import React from 'react';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {StyleProp, TextStyle} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {AppTheme} from '@/theme';

type IconSizeToken = keyof AppTheme['sizes']['icon'];
type ColorToken = keyof AppTheme['colors'];
type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];

export type IconProps = {
  name: MaterialIconName;
  size?: IconSizeToken;
  color?: ColorToken;
  style?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
};

export function Icon({
  name,
  size = 'md',
  color = 'onSurface',
  style,
  accessibilityLabel,
}: IconProps) {
  const {theme} = useStyles(stylesheet);
  const iconSize = theme.sizes.icon[size];

  return (
    <MaterialIcons
      name={name}
      size={iconSize}
      color={theme.colors[color]}
      style={style}
      accessibilityLabel={accessibilityLabel}
    />
  );
}

const stylesheet = createStyleSheet(() => ({}));
