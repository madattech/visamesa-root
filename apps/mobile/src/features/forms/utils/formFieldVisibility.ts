import type {FormField} from '@/features/forms/types/formTypes';

export function isFieldVisible(
  field: FormField,
  values: Record<string, unknown>,
): boolean {
  if (!field.dependsOn) {
    return true;
  }

  return values[field.dependsOn.fieldId] === field.dependsOn.value;
}
