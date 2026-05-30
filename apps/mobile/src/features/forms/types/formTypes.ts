export const FIELD_TYPES = [
  'text',
  'date',
  'number',
  'select',
  'dateRange',
  'timeRange',
  'phone',
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export type FormFieldOption = {
  label: string;
  value: string;
};

export type FormField = {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  pattern?: string;
  options?: FormFieldOption[];
  dependsOn?: {
    fieldId: string;
    value: string;
  };
};

export type FormSchema = {
  formId: string;
  title: string;
  description?: string;
  fields: FormField[];
};
