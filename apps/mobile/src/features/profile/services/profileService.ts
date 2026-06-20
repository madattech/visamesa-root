import { API_ENDPOINTS } from '@/config/api';
import apiClient from '@/services/api';
import { cryptoService } from '@/services/cryptoService';
import { EncryptedPayload } from '@/types/encrypted';

import { ProfileData, ProfileSection } from '../types/ProfileData';

const EMPTY_PROFILE: ProfileData = {
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

export async function getProfile(): Promise<ProfileData> {
  const payload = await fetchEncryptedPayload();

  if (!payload) {
    return EMPTY_PROFILE;
  }

  return cryptoService.decrypt<ProfileData>(payload);
}

export async function updateProfile(
  section: ProfileSection,
  data: Record<string, unknown>,
): Promise<ProfileData> {
  const payload = await fetchEncryptedPayload();
  const current = payload
    ? await cryptoService.decrypt<ProfileData>(payload)
    : EMPTY_PROFILE;
  const updated: ProfileData = { ...current, [section]: data };
  const encrypted = await cryptoService.encrypt(updated);

  await apiClient.put(API_ENDPOINTS.encryptedDetails, encrypted);

  return updated;
}
