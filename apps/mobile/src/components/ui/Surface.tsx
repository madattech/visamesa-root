import React from 'react';
import {StyleProp, View, ViewProps, ViewStyle} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {createElevationStyle, ElevationLevel} from '@/theme/elevation';

export type SurfaceVariant = 'filled' | 'elevated' | 'outlined';

export type SurfaceProps = ViewProps & {
  variant?: SurfaceVariant;
  elevation?: ElevationLevel;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

export function Surface({
  variant = 'filled',
  elevation = 1,
  style,
  children,
  ...props
}: SurfaceProps) {
  const {styles, theme} = useStyles(stylesheet);
  const elevationStyle =
    variant === 'elevated' ? createElevationStyle(elevation, theme.colors) : null;

  return (
    <View
      {...props}
      style={[
        styles.base,
        variant === 'filled' && styles.filled,
        variant === 'elevated' && styles.elevated,
        variant === 'outlined' && styles.outlined,
        elevationStyle,
        style,
      ]}>
      {children}
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  base: {
    borderRadius: theme.radii.md,
  },
  filled: {
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
  },
  elevated: {
    backgroundColor: theme.colors.surface,
  },
  outlined: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    overflow: 'hidden',
  },
}));
