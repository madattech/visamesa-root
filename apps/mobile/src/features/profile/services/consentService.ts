import AsyncStorage from '@react-native-async-storage/async-storage';
import {isAxiosError} from 'axios';
import {
  buildConsentStatus,
  CONSENT_POLICY_VERSION,
  EMPTY_CONSENT_STATUS,
  isConsentStatusComplete,
  type ConsentAcceptanceStatus,
  type ConsentEntry,
  type ConsentType,
} from '@visamesa/content/checkout';
import {STORAGE_KEYS} from '@visamesa/types';

import {API_ENDPOINTS} from '@/config/api';
import apiClient from '@/services/api';
import {reportClientErrorFromException} from '@/services/clientErrorService';

export type {ConsentAcceptanceStatus, ConsentType};

export type ConsentRecord = ConsentEntry & {
  acceptedAt: string;
};

const CONSENT_ACCEPTED_KEY = '@visamesa_consent_accepted';
const CONSENT_STATUS_CACHE_KEY = '@visamesa_consent_status_cache';

async function fetchBackendConsent(): Promise<ConsentRecord[] | null> {
  const response = await apiClient.get<{consents: ConsentRecord[]}>(
    API_ENDPOINTS.userConsent,
  );

  return response.data.consents;
}

async function cacheConsentStatus(status: ConsentAcceptanceStatus): Promise<void> {
  await AsyncStorage.setItem(CONSENT_STATUS_CACHE_KEY, JSON.stringify(status));

  if (isConsentStatusComplete(status)) {
    await AsyncStorage.setItem(CONSENT_ACCEPTED_KEY, CONSENT_POLICY_VERSION);
    return;
  }

  await AsyncStorage.removeItem(CONSENT_ACCEPTED_KEY);
}

async function readCachedConsentStatus(): Promise<ConsentAcceptanceStatus | null> {
  const raw = await AsyncStorage.getItem(CONSENT_STATUS_CACHE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ConsentAcceptanceStatus;
  } catch {
    return null;
  }
}

async function readOfflineConsentStatus(): Promise<ConsentAcceptanceStatus> {
  const cachedStatus = await readCachedConsentStatus();

  if (cachedStatus) {
    return cachedStatus;
  }

  const legacyComplete = await AsyncStorage.getItem(CONSENT_ACCEPTED_KEY);

  if (legacyComplete === CONSENT_POLICY_VERSION) {
    return {
      privacyPolicy: true,
      termsOfService: true,
      privacyAcceptedAt: null,
      termsAcceptedAt: null,
    };
  }

  return EMPTY_CONSENT_STATUS;
}

/**
 * Manages user consent for privacy policy and terms of service.
 * When authenticated, the backend is the source of truth.
 */
export const consentService = {
  async getConsentStatus(): Promise<ConsentAcceptanceStatus> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      if (!token) {
        return EMPTY_CONSENT_STATUS;
      }

      try {
        const consents = await fetchBackendConsent();
        const status = buildConsentStatus(consents ?? []);
        await cacheConsentStatus(status);
        return status;
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
          await AsyncStorage.removeMany([
            CONSENT_ACCEPTED_KEY,
            CONSENT_STATUS_CACHE_KEY,
          ]);
          return EMPTY_CONSENT_STATUS;
        }

        reportClientErrorFromException('CONSENT_FETCH_FAILED', error);

        return readOfflineConsentStatus();
      }
    } catch (error) {
      console.error('Failed to read consent status:', error);
      return EMPTY_CONSENT_STATUS;
    }
  },

  async hasAcceptedConsent(): Promise<boolean> {
    const status = await this.getConsentStatus();

    if (isConsentStatusComplete(status)) {
      return true;
    }

    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    if (!token) {
      const legacyComplete = await AsyncStorage.getItem(CONSENT_ACCEPTED_KEY);
      return legacyComplete === CONSENT_POLICY_VERSION;
    }

    return false;
  },

  async hasAcceptedConsentType(type: ConsentType): Promise<boolean> {
    const status = await this.getConsentStatus();
    return type === 'privacy_policy'
      ? status.privacyPolicy
      : status.termsOfService;
  },

  async recordConsentType(type: ConsentType): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.userConsent, {
        type,
        policyVersion: CONSENT_POLICY_VERSION,
      });

      await this.getConsentStatus();
    } catch (error) {
      console.error('Failed to record consent:', error);
      reportClientErrorFromException('CONSENT_RECORD_FAILED', error, {type});
      throw error;
    }
  },

  async recordConsent(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.userConsent, {
        type: 'privacy_policy',
        policyVersion: CONSENT_POLICY_VERSION,
      });

      await apiClient.post(API_ENDPOINTS.userConsent, {
        type: 'terms_of_service',
        policyVersion: CONSENT_POLICY_VERSION,
      });

      await this.getConsentStatus();
    } catch (error) {
      console.error('Failed to record consent:', error);
      reportClientErrorFromException('CONSENT_RECORD_FAILED', error, {
        type: 'privacy_policy+terms_of_service',
      });
      throw error;
    }
  },

  async clearConsent(): Promise<void> {
    try {
      await AsyncStorage.removeMany([
        CONSENT_ACCEPTED_KEY,
        CONSENT_STATUS_CACHE_KEY,
      ]);
    } catch (error) {
      console.error('Failed to clear consent:', error);
    }
  },

  getConsentVersion(): string {
    return CONSENT_POLICY_VERSION;
  },
};
