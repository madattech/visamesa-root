import {isProfileComplete} from '@/features/profile/utils/profileCompleteness';

import {ProfileData} from '../types/ProfileData';

/**
 * Determines whether the profile Personal Information section is complete.
 * Uses the same schema-based rules as readiness gating.
 */
export function isPersonalInformationComplete(
  profileData: ProfileData | null,
): boolean {
  return isProfileComplete(profileData);
}

/**
 * Determines whether the Legal & Privacy section is complete.
 * Checks if consent has been accepted.
 */
export function isLegalPrivacyComplete(hasConsent: boolean): boolean {
  return hasConsent;
}

/**
 * Determines whether the Payment section is complete.
 * Checks if user has paid for the service.
 */
export function isPaymentComplete(hasPaid: boolean): boolean {
  return hasPaid;
}

export type ProfileCompleteness = {
  personalInformation: boolean;
  legalPrivacy: boolean;
  payment: boolean;
};

/**
 * Selector that computes overall profile completeness.
 */
export function selectProfileCompleteness(
  profileData: ProfileData | null,
  hasConsent: boolean,
  hasPaid: boolean,
): ProfileCompleteness {
  return {
    personalInformation: isPersonalInformationComplete(profileData),
    legalPrivacy: isLegalPrivacyComplete(hasConsent),
    payment: isPaymentComplete(hasPaid),
  };
}
