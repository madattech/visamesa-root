import type {FormField, FormSchema} from '../types/formTypes';

type DefaultValue =
  | string
  | number
  | {start: string; end: string}
  | {countryCode: string; number: string};

export type DefaultValues = Record<string, DefaultValue>;

const getDefaultValueForField = (field: FormField): DefaultValue => {
  switch (field.type) {
    case 'dateRange':
    case 'timeRange':
      return {start: '', end: ''};

    case 'phone':
      return {countryCode: '', number: ''};

    case 'select':
      return field.options?.[0]?.value ?? '';

    case 'number':
      return '';

    case 'text':
    case 'date':
    default:
      return '';
  }
};

export const generateDefaultValues = (schema: FormSchema): DefaultValues => {
  return schema.fields.reduce((acc, field) => {
    acc[field.id] = getDefaultValueForField(field);
    return acc;
  }, {} as DefaultValues);
};
