import { API_ENDPOINTS } from '@/config/api';
import apiClient from '@/services/api';
import { cryptoService } from '@/services/cryptoService';
import {
  ProfileDecryptionError,
  isProfileDecryptionFailure,
} from '@/services/profileCryptoErrors';
import { EncryptedPayload } from '@/types/encrypted';

import { ProfileData, ProfileSection } from '../types/ProfileData';

export const EMPTY_PROFILE: ProfileData = {
  personal: null,
};

/**
 * Migrates legacy profile data from the old three-section format to the new single-section format.
 * Maps residenceRegistration fields into personal section where they don't conflict.
 */
function migrateLegacyProfile(data: unknown): ProfileData {
  if (!data || typeof data !== 'object') {
    return EMPTY_PROFILE;
  }

  const legacy = data as Record<string, unknown>;

  // Start with the personal section
  let personal = legacy.personal as Record<string, unknown> | null;

  // If we have legacy residenceRegistration data, merge relevant fields
  if (legacy.residenceRegistration && typeof legacy.residenceRegistration === 'object') {
    const residence = legacy.residenceRegistration as Record<string, unknown>;
    const merged = {...(personal || {})};

    // Only merge if personal doesn't already have these fields (don't overwrite)
    if (residence.address && !merged.address) {
      merged.address = residence.address;
    }
    if (residence.city && !merged.city) {
      merged.city = residence.city;
    }
    if (residence.postalCode && !merged.postalCode) {
      merged.postalCode = residence.postalCode;
    }
    if (residence.dateOfDocumentIssuance && !merged.dateOfDocumentIssuance) {
      merged.dateOfDocumentIssuance = residence.dateOfDocumentIssuance;
    }

    personal = Object.keys(merged).length > 0 ? merged : null;
  }

  return {personal};
}

async function fetchEncryptedPayload(): Promise<EncryptedPayload | null> {
  const response = await apiClient.get<EncryptedPayload | null>(
    API_ENDPOINTS.encryptedDetails,
  );

  return response.data;
}

async function decryptProfilePayload(
  payload: EncryptedPayload,
): Promise<ProfileData> {
  try {
    const decrypted = await cryptoService.decrypt<unknown>(payload);
    return migrateLegacyProfile(decrypted);
  } catch (error) {
    if (isProfileDecryptionFailure(error)) {
      throw new ProfileDecryptionError();
    }

    throw error;
  }
}

export async function getProfile(): Promise<ProfileData> {
  const payload = await fetchEncryptedPayload();

  if (!payload) {
    return EMPTY_PROFILE;
  }

  return decryptProfilePayload(payload);
}

/**
 * Loads only the personal section for WebView automations.
 * Returns null when unavailable or encrypted on another device (no throw).
 */
export async function getPersonalForAutomation(): Promise<
  Record<string, unknown> | null
> {
  const payload = await fetchEncryptedPayload();

  if (!payload) {
    return null;
  }

  try {
    const profile = await decryptProfilePayload(payload);
    return profile.personal;
  } catch (error) {
    if (isProfileDecryptionFailure(error)) {
      return null;
    }

    throw error;
  }
}

export async function updateProfile(
  section: ProfileSection,
  data: Record<string, unknown>,
): Promise<ProfileData> {
  const payload = await fetchEncryptedPayload();
  let current = EMPTY_PROFILE;

  if (payload) {
    try {
      current = await decryptProfilePayload(payload);
    } catch (error) {
      if (!isProfileDecryptionFailure(error)) {
        throw error;
      }
    }
  }

  const updated: ProfileData = { ...current, [section]: data };
  const encrypted = await cryptoService.encrypt(updated);

  await apiClient.put(API_ENDPOINTS.encryptedDetails, encrypted);

  return updated;
}
