import { API_ENDPOINTS } from '@/config/api'
import apiClient from '@/services/api'

import { ProfileData, ProfileSection } from '../types/ProfileData'

export async function getProfile(): Promise<ProfileData> {
  // TEMP: skip profile API for form UI testing
  return {
    personal: null,
    billing: null,
    residenceRegistration: null,
  };

  const response = await apiClient.get<ProfileData>(API_ENDPOINTS.profile);
  return response.data;
}

export async function updateProfile(
  section: ProfileSection,
  data: Record<string, unknown>,
): Promise<ProfileData> {
  const response = await apiClient.patch<ProfileData>(API_ENDPOINTS.profile, {
    section,
    data,
  });
  return response.data;
}
