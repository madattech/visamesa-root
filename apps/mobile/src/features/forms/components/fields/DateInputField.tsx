import React, {useState} from 'react';
import {Modal, Platform, Pressable, View} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
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

const toIsoDate = (date: Date) => {
  if (!date || typeof date.toISOString !== 'function') {
    return '';
  }
  return date.toISOString().split('T')[0];
};

export function DateInputField({field}: Props) {
  const {styles, theme} = useStyles(stylesheet);
  const {control} = useFormContext();
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  return (
    <Controller
      control={control}
      name={field.id}
      render={({field: controllerField, fieldState}) => {
        const currentValue = String(controllerField.value ?? '');
        const pickerDate = currentValue
          ? new Date(currentValue)
          : new Date();

        const handleValueChange = (_event: any, selectedDate?: Date) => {
          if (selectedDate && typeof selectedDate.toISOString === 'function') {
            if (Platform.OS === 'ios') {
              setTempDate(selectedDate);
            } else {
              controllerField.onChange(toIsoDate(selectedDate));
              setShowPicker(false);
            }
          }
        };

        const handleDismiss = () => {
          setShowPicker(false);
          setTempDate(null);
        };

        const handleDone = () => {
          if (tempDate) {
            controllerField.onChange(toIsoDate(tempDate));
          }
          setShowPicker(false);
          setTempDate(null);
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
            {showPicker && Platform.OS === 'android' ? (
              <DateTimePicker
                value={pickerDate}
                mode="date"
                display="default"
                onValueChange={handleValueChange}
                onDismiss={handleDismiss}
              />
            ) : null}
            {showPicker && Platform.OS === 'ios' ? (
              <Modal
                visible={showPicker}
                transparent
                animationType="fade"
                onRequestClose={handleDismiss}>
                <Pressable
                  style={styles.backdrop}
                  accessibilityRole="button"
                  accessibilityLabel="Close date picker"
                  onPress={handleDismiss}
                />
                <View style={styles.sheet}>
                  <View style={styles.sheetHeader}>
                    <Pressable onPress={handleDismiss}>
                      <Text variant="bodyLarge" color="primary">
                        Cancel
                      </Text>
                    </Pressable>
                    <Text variant="titleMedium" style={styles.sheetTitle}>
                      {field.label}
                    </Text>
                    <Pressable onPress={handleDone}>
                      <Text variant="bodyLarge" color="primary" style={styles.doneButton}>
                        Done
                      </Text>
                    </Pressable>
                  </View>
                  <DateTimePicker
                    value={tempDate || pickerDate}
                    mode="date"
                    display="spinner"
                    onValueChange={handleValueChange}
                    themeVariant={theme.colorScheme === 'dark' ? 'dark' : 'light'}
                  />
                </View>
              </Modal>
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
    backgroundColor: theme.colors.background,
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
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.scrim,
    opacity: 0.32,
  },
  sheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radii.lg,
    borderTopRightRadius: theme.radii.lg,
    paddingBottom: theme.spacing.xl,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  sheetTitle: {
    fontWeight: '600',
  },
  doneButton: {
    fontWeight: '600',
  },
}));
