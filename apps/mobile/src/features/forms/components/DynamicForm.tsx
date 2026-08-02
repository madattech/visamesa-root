import React, {useEffect, useMemo} from 'react';
import {View} from 'react-native';
import {
  FormProvider,
  useForm,
  useFormContext,
  useFormState,
  useWatch,
} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useTranslation} from 'react-i18next';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Button} from '@/components/ui/Button';
import {Text} from '@/components/ui/Text';
import {FormFieldRenderer} from '@/features/forms/components/FormFieldRenderer';
import {generateDefaultValues} from '@/features/forms/utils/defaultValuesGenerator';
import {isFieldVisible} from '@/features/forms/utils/formFieldVisibility';
import {generateZodSchema} from '@/features/forms/utils/schemaGenerator';
import {FormSchema} from '@/features/forms/types/formTypes';

type Props = {
  schema: FormSchema;
  onSubmit: (data: Record<string, unknown>) => void;
  isSubmitting: boolean;
  initialValues?: Record<string, unknown>;
  submitButtonText?: string;
};

function FormSubmitErrorHint({schema}: {schema: FormSchema}) {
  const {styles} = useStyles(stylesheet);
  const {t} = useTranslation('forms');
  const {control} = useFormContext();
  const values = useWatch({control}) ?? {};
  const {errors, isSubmitted, submitCount} = useFormState();
  const hasVisibleErrors = schema.fields.some(
    field => isFieldVisible(field, values) && Boolean(errors[field.id]),
  );
  const shouldShow = (isSubmitted || submitCount > 0) && hasVisibleErrors;

  if (!shouldShow) {
    return null;
  }

  return (
    <Text
      variant="bodySmall"
      color="error"
      style={styles.formError}
      accessibilityRole="alert">
      {t('validation.reviewForm')}
    </Text>
  );
}

function DynamicFormContent({
  schema,
  onSubmit,
  isSubmitting,
  initialValues = {},
  submitButtonText,
}: Props) {
  const {styles} = useStyles(stylesheet);
  const {t} = useTranslation('forms');
  const validationSchema = useMemo(
    () =>
      generateZodSchema(schema, (key, options) =>
        t(key, options as Record<string, string>),
      ),
    [schema, t],
  );
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

  const saveLabel = submitButtonText ?? t('actions.save');

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

        <FormSubmitErrorHint schema={schema} />

        <Button
          label={isSubmitting ? t('actions.saving') : saveLabel}
          onPress={methods.handleSubmit(onSubmit)}
          disabled={isSubmitting}
          fullWidth
        />
      </View>
    </FormProvider>
  );
}

export function DynamicForm(props: Props) {
  const {i18n} = useTranslation('forms');

  return <DynamicFormContent key={i18n.language} {...props} />;
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
