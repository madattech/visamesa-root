import React from 'react';
import {useFormContext, useWatch} from 'react-hook-form';

import {DateInputField} from '@/features/forms/components/fields/DateInputField';
import {PhoneInputField} from '@/features/forms/components/fields/PhoneInputField';
import {SelectInputField} from '@/features/forms/components/fields/SelectInputField';
import {TextInputField} from '@/features/forms/components/fields/TextInputField';
import {FormField} from '@/features/forms/types/formTypes';
import {Text} from '@/components/ui/Text';

type Props = {
  field: FormField;
};

const fieldComponentMap: Record<
  string,
  React.ComponentType<{field: FormField}>
> = {
  text: TextInputField,
  date: DateInputField,
  number: TextInputField,
  select: SelectInputField,
  phone: PhoneInputField,
};

export function FormFieldRenderer({field}: Props) {
  const {control} = useFormContext();

  const dependentValue = useWatch({
    control,
    name: field.dependsOn?.fieldId || '__nonexistent__',
  });

  if (field.dependsOn && dependentValue !== field.dependsOn.value) {
    return null;
  }

  const FieldComponent = fieldComponentMap[field.type];

  if (!FieldComponent) {
    return (
      <Text variant="bodySmall" color="error">
        Error: Unknown field type '{field.type}'
      </Text>
    );
  }

  return <FieldComponent field={field} />;
}
