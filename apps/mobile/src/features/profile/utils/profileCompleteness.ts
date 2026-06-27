import {ProfileData} from '@/features/profile/types/ProfileData';
import profilePersonalSchema from '@/features/forms/data/profile-personal.json';
import {FormSchema} from '@/features/forms/types/formTypes';

const PERSONAL_SCHEMA = profilePersonalSchema as FormSchema;

/**
 * Checks if the profile is complete by validating all required fields in the personal section.
 * Returns true only if all required fields have truthy values.
 */
export function isProfileComplete(profileData: ProfileData | null): boolean {
  if (!profileData || !profileData.personal) {
    return false;
  }

  const personal = profileData.personal;
  const requiredFields = PERSONAL_SCHEMA.fields
    .filter(field => field.required === true)
    .map(field => field.id);

  // Check that all required fields exist and have truthy values
  for (const fieldId of requiredFields) {
    const value = personal[fieldId];

    // Handle different types of empty values
    if (value === undefined || value === null || value === '') {
      return false;
    }

    // For phone number objects (countryCode + number)
    if (
      fieldId === 'phoneNumber' &&
      typeof value === 'object' &&
      value !== null
    ) {
      const phone = value as {countryCode?: string; number?: string};
      if (!phone.countryCode || !phone.number) {
        return false;
      }
    }
  }

  return true;
}
