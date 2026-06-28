import {ProfileData} from '../types/ProfileData';

/**
 * Determines whether the profile Personal Information section is complete.
 * Checks if all required fields are filled.
 */
export function isPersonalInformationComplete(
  profileData: ProfileData | null,
): boolean {
  if (!profileData?.personal) {
    return false;
  }

  const requiredFields = [
    'firstName',
    'lastName',
    'nationality',
    'documentType',
    'documentNumber',
    'phoneNumber',
    'address',
    'city',
    'postalCode',
  ];

  return requiredFields.every(field => {
    const value = profileData.personal?.[field];
    return value !== undefined && value !== null && String(value).trim() !== '';
  });
}

/**
 * Determines whether the Legal & Privacy section is complete.
 * Checks if consent has been accepted.
 */
export function isLegalPrivacyComplete(hasConsent: boolean): boolean {
  return hasConsent;
}

export type ProfileCompleteness = {
  personalInformation: boolean;
  legalPrivacy: boolean;
};

/**
 * Selector that computes overall profile completeness.
 */
export function selectProfileCompleteness(
  profileData: ProfileData | null,
  hasConsent: boolean,
): ProfileCompleteness {
  return {
    personalInformation: isPersonalInformationComplete(profileData),
    legalPrivacy: isLegalPrivacyComplete(hasConsent),
  };
}
