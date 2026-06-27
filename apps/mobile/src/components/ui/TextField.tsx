import React from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Text} from '@/components/ui/Text';

export type TextFieldProps = Omit<TextInputProps, 'style'> & {
  label: string;
  helperText?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export function TextField({
  label,
  helperText,
  error,
  containerStyle,
  editable = true,
  onFocus,
  onBlur,
  ...props
}: TextFieldProps) {
  const {styles, theme} = useStyles(stylesheet);
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text variant="labelMedium" style={styles.label}>
        {label}
      </Text>
      {helperText ? (
        <Text variant="bodySmall" color="onSurfaceVariant" style={styles.helper}>
          {helperText}
        </Text>
      ) : null}
      <TextInput
        {...props}
        editable={editable}
        placeholderTextColor={theme.colors.onSurfaceVariant}
        onFocus={event => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={event => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          !!error && styles.inputError,
          !editable && styles.inputDisabled,
        ]}
      />
      {error ? (
        <Text variant="bodySmall" color="error" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    gap: theme.spacing.xs,
  },
  label: {
    color: theme.colors.onSurfaceVariant,
  },
  helper: {
    marginTop: -theme.spacing.xs / 2,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: theme.radii.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.bodyLarge.fontSize,
    lineHeight: theme.typography.bodyLarge.lineHeight,
    color: theme.colors.onSurface,
    backgroundColor: theme.colors.background,
  },
  inputFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    paddingHorizontal: theme.spacing.md - 1,
    paddingVertical: theme.spacing.sm - 1,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  error: {
    marginTop: theme.spacing.xs / 2,
  },
}));
