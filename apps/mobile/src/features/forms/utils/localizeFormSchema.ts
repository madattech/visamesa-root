import type {TFunction} from 'i18next';

import type {FormField, FormSchema} from '@/features/forms/types/formTypes';

function localizeField(
  field: FormField,
  t: TFunction<'forms'>,
): FormField {
  return {
    ...field,
    label: t(field.label),
    placeholder: field.placeholder ? t(field.placeholder) : undefined,
    helperText: field.helperText ? t(field.helperText) : undefined,
    options: field.options?.map(option => ({
      ...option,
      label: t(option.label),
    })),
  };
}

export function localizeFormSchema(
  schema: FormSchema,
  t: TFunction<'forms'>,
): FormSchema {
  return {
    ...schema,
    title: t(schema.title),
    description: schema.description ? t(schema.description) : undefined,
    fields: schema.fields.map(field => localizeField(field, t)),
  };
}
