import React from 'react';
import {Pressable, StyleProp, ViewStyle} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Icon} from '@/components/ui/Icon';

export type CheckboxProps = {
  checked: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

/**
 * Interactive checkbox toggle.
 * - checked: green check circle
 * - unchecked: empty circle
 */
export function Checkbox({
  checked,
  onToggle,
  size = 'lg',
  disabled = false,
  style,
  accessibilityLabel,
}: CheckboxProps) {
  const {theme} = useStyles(stylesheet);

  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{checked, disabled}}
      accessibilityLabel={accessibilityLabel}
      android_ripple={{
        color: theme.colors.primaryContainer,
        borderless: true,
        radius: 20,
      }}
      style={style}>
      <Icon
        name={checked ? 'check-circle' : 'radio-button-unchecked'}
        size={size}
        color={checked ? 'success' : 'onSurfaceVariant'}
      />
    </Pressable>
  );
}

const stylesheet = createStyleSheet(() => ({}));
