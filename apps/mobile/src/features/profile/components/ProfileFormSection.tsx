import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {AccordionItem} from '@/components/Accordion/Accordion';
import {DynamicForm} from '@/features/forms/components/DynamicForm';
import {useFormSchema} from '@/features/forms/hooks/useFormSchema';
import {Text} from '@/components/ui/Text';

type ProfileFormSectionProps = {
  id: string;
  title: string;
  formId: string;
  expanded?: boolean;
  onToggle?: () => void;
  initialValues: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isSubmitting: boolean;
};

export function ProfileFormSection({
  id,
  title,
  formId,
  expanded = false,
  onToggle = () => {},
  initialValues,
  onSubmit,
  isSubmitting,
}: ProfileFormSectionProps) {
  const {styles, theme} = useStyles(stylesheet);
  const {schema, isLoading, error} = useFormSchema(formId);

  return (
    <AccordionItem id={id} title={title} expanded={expanded} onToggle={onToggle}>
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      ) : error ? (
        <Text variant="bodyMedium" color="error">
          {error.message}
        </Text>
      ) : schema ? (
        <DynamicForm
          schema={schema}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          initialValues={initialValues}
          submitButtonText="Save"
        />
      ) : null}
    </AccordionItem>
  );
}

const stylesheet = createStyleSheet(theme => ({
  centered: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
}));
