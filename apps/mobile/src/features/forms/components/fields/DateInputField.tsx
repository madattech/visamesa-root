import React, {useState} from 'react';
import {Platform, Pressable} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {Controller, useFormContext} from 'react-hook-form';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Text} from '@/components/ui/Text';
import {FormField as SchemaFieldType} from '@/features/forms/types/formTypes';

type Props = {
  field: SchemaFieldType;
};

const formatDate = (value: string) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
};

const toIsoDate = (date: Date) => date.toISOString().split('T')[0];

export function DateInputField({field}: Props) {
  const {styles, theme} = useStyles(stylesheet);
  const {control} = useFormContext();
  const [showPicker, setShowPicker] = useState(false);

  return (
    <Controller
      control={control}
      name={field.id}
      render={({field: controllerField, fieldState}) => {
        const currentValue = String(controllerField.value ?? '');
        const pickerDate = currentValue
          ? new Date(currentValue)
          : new Date();

        const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
          if (Platform.OS === 'android') {
            setShowPicker(false);
          }

          if (event.type === 'dismissed' || !selectedDate) {
            return;
          }

          controllerField.onChange(toIsoDate(selectedDate));
        };

        return (
          <>
            <Text variant="labelMedium" style={styles.label}>
              {field.label}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={field.label}
              android_ripple={{color: theme.colors.primaryContainer}}
              onPress={() => setShowPicker(true)}
              style={({pressed}) => [
                styles.trigger,
                !!fieldState.error && styles.triggerError,
                pressed && styles.triggerPressed,
              ]}>
              <Text
                variant="bodyLarge"
                color={currentValue ? 'onSurface' : 'onSurfaceVariant'}>
                {currentValue
                  ? formatDate(currentValue)
                  : field.placeholder ?? 'Select a date'}
              </Text>
            </Pressable>
            {fieldState.error?.message ? (
              <Text variant="bodySmall" color="error" style={styles.error}>
                {fieldState.error.message}
              </Text>
            ) : null}
            {showPicker ? (
              <DateTimePicker
                value={pickerDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleChange}
              />
            ) : null}
          </>
        );
      }}
    />
  );
}

const stylesheet = createStyleSheet(theme => ({
  label: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.xs,
  },
  trigger: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: theme.radii.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
  },
  triggerError: {
    borderColor: theme.colors.error,
  },
  triggerPressed: {
    opacity: 0.88,
  },
  error: {
    marginTop: theme.spacing.xs / 2,
  },
}));
