import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {API_ENDPOINTS} from '@/config/api';
import apiClient from '@/services/api';
import {consentService} from '@/services/consentService';
import {profileCompletionService} from '@/features/profile/services/profileCompletionService';

const KEYCHAIN_SERVICE = 'visamesa_encryption_key';

/**
 * Account management operations (deletion and data export)
 */
export const accountService = {
  /**
   * Deletes the user's account and all associated data on the backend,
   * then clears all local data including the encryption key.
   */
  async deleteAccount(): Promise<void> {
    try {
      // Delete on backend (cascades to encrypted details, payments, entitlements, cases)
      await apiClient.delete(API_ENDPOINTS.userDelete);

      // Clear all local data
      await this.clearAllLocalData();
    } catch (error) {
      console.error('Failed to delete account:', error);
      throw error;
    }
  },

  /**
   * Exports all user data that the backend has access to.
   * The client-side encrypted profile must be merged separately (only this device can decrypt).
   */
  async exportData(): Promise<Record<string, unknown>> {
    try {
      const response = await apiClient.get<Record<string, unknown>>(
        API_ENDPOINTS.userExport,
      );
      return response.data;
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  },

  /**
   * Clears all local storage including AsyncStorage, Keychain encryption key,
   * auth token, and other app data.
   */
  async clearAllLocalData(): Promise<void> {
    try {
      // Clear AsyncStorage (auth token, progress, consent, profile completion)
      // This removes all keys, including @visamesa_profile_complete and @visamesa_consent_accepted
      await AsyncStorage.clear();

      // Clear Keychain encryption key (not in AsyncStorage)
      await Keychain.resetGenericPassword({service: KEYCHAIN_SERVICE});
    } catch (error) {
      console.error('Failed to clear local data:', error);
      throw error;
    }
  },
};
