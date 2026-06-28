import React, {useState} from 'react';
import {FlatList, Pressable, View, StyleProp, ViewStyle} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Text} from '@/components/ui/Text';
import {Icon} from '@/components/ui/Icon';
import {BottomSheet} from '@/components/ui/BottomSheet';
import {FormFieldOption} from '@/features/forms/types/formTypes';

export type SelectFieldProps = {
  label: string;
  value: string;
  options: FormFieldOption[];
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

export function SelectField({
  label,
  value,
  options,
  onChange,
  error,
  placeholder = 'Select an option',
  disabled = false,
  containerStyle,
}: SelectFieldProps) {
  const {styles, theme} = useStyles(stylesheet);
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel =
    options.find(option => option.value === value)?.label ?? placeholder;

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text variant="labelMedium" style={styles.label}>
        {label}
      </Text>
      <Pressable
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{disabled, expanded: isOpen}}
        accessibilityLabel={label}
        android_ripple={
          disabled
            ? undefined
            : {color: theme.colors.primaryContainer}
        }
        onPress={() => setIsOpen(true)}
        style={({pressed}) => [
          styles.trigger,
          !!error && styles.triggerError,
          disabled && styles.triggerDisabled,
          pressed && !disabled && styles.triggerPressed,
        ]}>
        <Text
          variant="bodyLarge"
          color={value ? 'onSurface' : 'onSurfaceVariant'}
          style={styles.triggerText}>
          {selectedLabel}
        </Text>
        <Icon name="expand-more" size="md" color="onSurfaceVariant" />
      </Pressable>
      {error ? (
        <Text variant="bodySmall" color="error" style={styles.error}>
          {error}
        </Text>
      ) : null}

      <BottomSheet visible={isOpen} onClose={() => setIsOpen(false)} title={label}>
        <FlatList
          data={options}
          keyExtractor={item => item.value}
          renderItem={({item}) => (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{selected: item.value === value}}
              android_ripple={{color: theme.colors.primaryContainer}}
              onPress={() => handleSelect(item.value)}
              style={({pressed}) => [
                styles.option,
                item.value === value && styles.optionSelected,
                pressed && styles.optionPressed,
              ]}>
              <Text
                variant="bodyLarge"
                color={item.value === value ? 'primary' : 'onSurface'}>
                {item.label}
              </Text>
            </Pressable>
          )}
        />
      </BottomSheet>
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
  trigger: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    borderRadius: theme.radii.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerError: {
    borderColor: theme.colors.error,
  },
  triggerDisabled: {
    opacity: 0.6,
  },
  triggerPressed: {
    opacity: 0.88,
  },
  triggerText: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  error: {
    marginTop: theme.spacing.xs / 2,
  },
  option: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  optionSelected: {
    backgroundColor: theme.colors.primaryContainer,
  },
  optionPressed: {
    opacity: 0.88,
  },
}));
