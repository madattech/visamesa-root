import React, {useEffect, useMemo} from 'react';
import {View} from 'react-native';
import {FormProvider, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Button} from '@/components/ui/Button';
import {Text} from '@/components/ui/Text';
import {FormFieldRenderer} from '@/features/forms/components/FormFieldRenderer';
import {generateDefaultValues} from '@/features/forms/utils/defaultValuesGenerator';
import {generateZodSchema} from '@/features/forms/utils/schemaGenerator';
import {FormSchema} from '@/features/forms/types/formTypes';

type Props = {
  schema: FormSchema;
  onSubmit: (data: Record<string, unknown>) => void;
  isSubmitting: boolean;
  initialValues?: Record<string, unknown>;
  submitButtonText?: string;
};

export function DynamicForm({
  schema,
  onSubmit,
  isSubmitting,
  initialValues = {},
  submitButtonText = 'Save',
}: Props) {
  const {styles} = useStyles(stylesheet);
  const validationSchema = useMemo(() => generateZodSchema(schema), [schema]);
  const defaultValues = useMemo(() => {
    const defaults = generateDefaultValues(schema);
    return {...defaults, ...initialValues};
  }, [schema, initialValues]);

  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    methods.reset(defaultValues);
  }, [defaultValues, methods]);

  const hasErrors = Object.keys(methods.formState.errors).length > 0;

  return (
    <FormProvider {...methods}>
      <View style={styles.container}>
        {schema.description ? (
          <Text variant="bodyMedium" color="onSurfaceVariant">
            {schema.description}
          </Text>
        ) : null}

        <View style={styles.fields}>
          {schema.fields.map(field => (
            <FormFieldRenderer key={field.id} field={field} />
          ))}
        </View>

        {hasErrors ? (
          <Text variant="bodySmall" color="error" style={styles.formError}>
            Please check the form fields above for errors.
          </Text>
        ) : null}

        <Button
          label={isSubmitting ? 'Saving...' : submitButtonText}
          onPress={methods.handleSubmit(onSubmit)}
          disabled={isSubmitting}
          fullWidth
        />
      </View>
    </FormProvider>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    gap: theme.spacing.md,
  },
  fields: {
    gap: theme.spacing.md,
  },
  formError: {
    textAlign: 'center',
  },
}));
