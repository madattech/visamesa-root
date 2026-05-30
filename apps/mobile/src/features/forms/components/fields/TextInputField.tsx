import React from 'react';
import {Controller, useFormContext} from 'react-hook-form';

import {TextField} from '@/components/ui/TextField';
import {FormField as SchemaFieldType} from '@/features/forms/types/formTypes';

type Props = {
  field: SchemaFieldType;
};

export function TextInputField({field}: Props) {
  const {control} = useFormContext();

  return (
    <Controller
      control={control}
      name={field.id}
      render={({field: controllerField, fieldState}) => (
        <TextField
          label={field.label}
          value={String(controllerField.value ?? '')}
          onChangeText={controllerField.onChange}
          onBlur={controllerField.onBlur}
          placeholder={field.placeholder}
          error={fieldState.error?.message}
          keyboardType={field.type === 'number' ? 'numeric' : 'default'}
          autoCapitalize={field.type === 'text' ? 'sentences' : 'none'}
        />
      )}
    />
  );
}
