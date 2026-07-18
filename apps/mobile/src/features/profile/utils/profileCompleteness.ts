import {ProfileData} from '@/features/profile/types/ProfileData';
import profilePersonalSchema from '@/features/forms/data/profile-personal.json';
import {FormField, FormSchema} from '@/features/forms/types/formTypes';

const PERSONAL_SCHEMA = profilePersonalSchema as FormSchema;

function isFieldVisible(field: FormField, personal: Record<string, unknown>): boolean {
  if (!field.dependsOn) {
    return true;
  }

  return personal[field.dependsOn.fieldId] === field.dependsOn.value;
}

function isFieldValuePresent(fieldId: string, value: unknown): boolean {
  if (value === undefined || value === null || value === '') {
    return false;
  }

  if (
    fieldId === 'phoneNumber' &&
    typeof value === 'object' &&
    value !== null
  ) {
    const phone = value as {countryCode?: string; number?: string};
    return Boolean(phone.countryCode && phone.number);
  }

  return true;
}

/**
 * Checks if the profile is complete by validating all required fields in the personal section.
 * Returns true only if all required fields have truthy values.
 */
export function isProfileComplete(profileData: ProfileData | null): boolean {
  if (!profileData || !profileData.personal) {
    return false;
  }

  const personal = profileData.personal;

  for (const field of PERSONAL_SCHEMA.fields) {
    if (field.required !== true || !isFieldVisible(field, personal)) {
      continue;
    }

    if (!isFieldValuePresent(field.id, personal[field.id])) {
      return false;
    }
  }

  return true;
}
