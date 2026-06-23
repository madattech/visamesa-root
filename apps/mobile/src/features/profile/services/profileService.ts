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
  billing: null,
  residenceRegistration: null,
};

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
    return await cryptoService.decrypt<ProfileData>(payload);
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
