import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Text} from '@/components/ui/Text';

export type ButtonVariant = 'primary' | 'outline';
export type ButtonSize = 'default' | 'icon';

export type ButtonProps = Omit<PressableProps, 'style'> & {
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

const MIN_TOUCH_TARGET = 44;

export function Button({
  label,
  variant = 'primary',
  size = 'default',
  disabled = false,
  fullWidth = false,
  style,
  labelStyle,
  accessibilityLabel,
  children,
  ...props
}: ButtonProps) {
  const {styles, theme} = useStyles(stylesheet);

  const isIcon = size === 'icon';
  const content = children ?? (
    <Text
      variant="labelLarge"
      color={variant === 'primary' ? 'onPrimary' : 'primary'}
      style={[styles.label, disabled && styles.labelDisabled, labelStyle]}>
      {label}
    </Text>
  );

  return (
    <Pressable
      {...props}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{disabled}}
      accessibilityLabel={accessibilityLabel ?? label}
      android_ripple={
        disabled
          ? undefined
          : {
              color:
                variant === 'primary'
                  ? theme.colors.onPrimary
                  : theme.colors.primaryContainer,
            }
      }
      style={({pressed}) => [
        styles.base,
        isIcon ? styles.icon : styles.default,
        variant === 'primary' ? styles.primary : styles.outline,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}>
      {content}
    </Pressable>
  );
}

const stylesheet = createStyleSheet(theme => ({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radii.xl,
    minHeight: MIN_TOUCH_TARGET,
  },
  default: {
    paddingVertical: theme.spacing.sm + 4,
    paddingHorizontal: theme.spacing.lg,
  },
  icon: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    borderRadius: theme.radii.full,
    padding: 0,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: StyleSheet.hairlineWidth + 1,
    borderColor: theme.colors.outline,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.88,
  },
  label: {
    textAlign: 'center',
  },
  labelDisabled: {
    opacity: 0.8,
  },
}));
