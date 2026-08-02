import {API_ENDPOINTS} from '@/config/api';
import {STORAGE_KEYS} from '@visamesa/types';

import {consentService} from './consentService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
  removeMany: jest.fn(),
}));

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
}));

const AsyncStorage = jest.requireMock(
  '@react-native-async-storage/async-storage',
) as {
  getItem: jest.Mock;
  setItem: jest.Mock;
  removeItem: jest.Mock;
  multiRemove: jest.Mock;
  removeMany: jest.Mock;
};

const apiClient = jest.requireMock('@/services/api').default as {
  post: jest.Mock;
  get: jest.Mock;
};

const bothConsents = {
  consents: [
    {
      type: 'privacy_policy',
      policyVersion: 'v1.0',
      acceptedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      type: 'terms_of_service',
      policyVersion: 'v1.0',
      acceptedAt: '2026-01-02T00:00:00.000Z',
    },
  ],
};

describe('consentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getConsentStatus', () => {
    it('returns backend consent flags when authenticated', async () => {
      AsyncStorage.getItem.mockResolvedValue('jwt-token');
      apiClient.get.mockResolvedValue({data: bothConsents});

      await expect(consentService.getConsentStatus()).resolves.toEqual({
        privacyPolicy: true,
        termsOfService: true,
        privacyAcceptedAt: '2026-01-01T00:00:00.000Z',
        termsAcceptedAt: '2026-01-02T00:00:00.000Z',
      });
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@visamesa_consent_accepted',
        'v1.0',
      );
    });

    it('returns empty status when signed out', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);

      await expect(consentService.getConsentStatus()).resolves.toEqual({
        privacyPolicy: false,
        termsOfService: false,
        privacyAcceptedAt: null,
        termsAcceptedAt: null,
      });
      expect(apiClient.get).not.toHaveBeenCalled();
    });
  });

  describe('hasAcceptedConsent', () => {
    it('uses backend as source of truth when authenticated', async () => {
      AsyncStorage.getItem.mockResolvedValue('jwt-token');
      apiClient.get.mockResolvedValue({data: bothConsents});

      await expect(consentService.hasAcceptedConsent()).resolves.toBe(true);
      expect(apiClient.get).toHaveBeenCalledWith(API_ENDPOINTS.userConsent);
    });

    it('clears stale local consent when backend has none', async () => {
      AsyncStorage.getItem.mockImplementation(async (key: string) => {
        if (key === STORAGE_KEYS.AUTH_TOKEN) {
          return 'jwt-token';
        }
        return 'v1.0';
      });
      apiClient.get.mockResolvedValue({data: {consents: []}});

      await expect(consentService.hasAcceptedConsent()).resolves.toBe(false);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        '@visamesa_consent_accepted',
      );
    });

    it('falls back to local cache when signed out', async () => {
      AsyncStorage.getItem.mockImplementation(async (key: string) => {
        if (key === STORAGE_KEYS.AUTH_TOKEN) {
          return null;
        }
        return 'v1.0';
      });

      await expect(consentService.hasAcceptedConsent()).resolves.toBe(true);
      expect(apiClient.get).not.toHaveBeenCalled();
    });

    it('falls back to local cache when offline with a token', async () => {
      AsyncStorage.getItem.mockImplementation(async (key: string) => {
        if (key === STORAGE_KEYS.AUTH_TOKEN) {
          return 'jwt-token';
        }
        return 'v1.0';
      });
      apiClient.get.mockRejectedValue(new Error('Network error'));

      await expect(consentService.hasAcceptedConsent()).resolves.toBe(true);
    });

    it('returns false when signed out and no local consent', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);

      await expect(consentService.hasAcceptedConsent()).resolves.toBe(false);
      expect(apiClient.get).not.toHaveBeenCalled();
    });
  });

  describe('recordConsentType', () => {
    it('records a single consent type and refreshes status', async () => {
      apiClient.post.mockResolvedValue({data: {}});
      AsyncStorage.getItem.mockResolvedValue('jwt-token');
      apiClient.get.mockResolvedValue({
        data: {
          consents: [
            {
              type: 'privacy_policy',
              policyVersion: 'v1.0',
              acceptedAt: '2026-01-01T00:00:00.000Z',
            },
          ],
        },
      });

      await consentService.recordConsentType('privacy_policy');

      expect(apiClient.post).toHaveBeenCalledWith(API_ENDPOINTS.userConsent, {
        type: 'privacy_policy',
        policyVersion: 'v1.0',
      });
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        '@visamesa_consent_accepted',
      );
    });
  });

  describe('recordConsent', () => {
    it('records consent on backend and refreshes cached status', async () => {
      apiClient.post.mockResolvedValue({data: {}});
      AsyncStorage.getItem.mockResolvedValue('jwt-token');
      apiClient.get.mockResolvedValue({
        data: {
          consents: [
            {
              type: 'privacy_policy',
              policyVersion: 'v1.0',
              acceptedAt: '2026-01-01T00:00:00.000Z',
            },
            {
              type: 'terms_of_service',
              policyVersion: 'v1.0',
              acceptedAt: '2026-01-01T00:00:00.000Z',
            },
          ],
        },
      });

      await consentService.recordConsent();

      expect(apiClient.post).toHaveBeenCalledTimes(2);
      expect(apiClient.get).toHaveBeenCalled();
    });
  });

  describe('clearConsent', () => {
    it('removes consent from AsyncStorage', async () => {
      await consentService.clearConsent();

      expect(AsyncStorage.removeMany).toHaveBeenCalledWith([
        '@visamesa_consent_accepted',
        '@visamesa_consent_status_cache',
      ]);
    });
  });

  describe('getConsentVersion', () => {
    it('returns current consent version', () => {
      expect(consentService.getConsentVersion()).toBe('v1.0');
    });
  });
});
