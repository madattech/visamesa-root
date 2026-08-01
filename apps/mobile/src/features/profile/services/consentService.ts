import AsyncStorage from '@react-native-async-storage/async-storage';
import {CONSENT_POLICY_VERSION} from '@visamesa/content/checkout';
import {API_ENDPOINTS} from '@/config/api';
import apiClient from '@/services/api';

const CONSENT_ACCEPTED_KEY = '@visamesa_consent_accepted';

export type ConsentType = 'privacy_policy' | 'terms_of_service';

export type ConsentRecord = {
  type: ConsentType;
  policyVersion: string;
  acceptedAt: string;
};

/**
 * Manages user consent for privacy policy and terms of service.
 */
export const consentService = {
  async hasAcceptedConsent(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(CONSENT_ACCEPTED_KEY);
      return value === CONSENT_POLICY_VERSION;
    } catch (error) {
      console.error('Failed to read consent status:', error);
      return false;
    }
  },

  async recordConsent(): Promise<void> {
    try {
      // Record locally
      await AsyncStorage.setItem(CONSENT_ACCEPTED_KEY, CONSENT_POLICY_VERSION);

      // Record on backend (two separate calls for privacy policy and terms)
      // TODO: Consider creating a batch endpoint if this becomes a performance concern
      await apiClient.post(API_ENDPOINTS.userConsent, {
        type: 'privacy_policy',
        policyVersion: CONSENT_POLICY_VERSION,
      });

      await apiClient.post(API_ENDPOINTS.userConsent, {
        type: 'terms_of_service',
        policyVersion: CONSENT_POLICY_VERSION,
      });
    } catch (error) {
      console.error('Failed to record consent:', error);
      throw error;
    }
  },

  async clearConsent(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CONSENT_ACCEPTED_KEY);
    } catch (error) {
      console.error('Failed to clear consent:', error);
    }
  },

  getConsentVersion(): string {
    return CONSENT_POLICY_VERSION;
  },
};
