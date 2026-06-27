import {API_ENDPOINTS} from '@/config/api';

import {consentService} from './consentService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

const AsyncStorage = jest.requireMock(
  '@react-native-async-storage/async-storage',
) as {
  getItem: jest.Mock;
  setItem: jest.Mock;
  removeItem: jest.Mock;
};

const apiClient = jest.requireMock('@/services/api').default as {
  post: jest.Mock;
};

describe('consentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hasAcceptedConsent', () => {
    it('returns true when consent version matches', async () => {
      AsyncStorage.getItem.mockResolvedValue('v1.0');

      await expect(consentService.hasAcceptedConsent()).resolves.toBe(true);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        '@visamesa_consent_accepted',
      );
    });

    it('returns false when consent version does not match', async () => {
      AsyncStorage.getItem.mockResolvedValue('v0.9');

      await expect(consentService.hasAcceptedConsent()).resolves.toBe(false);
    });

    it('returns false when no consent recorded', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);

      await expect(consentService.hasAcceptedConsent()).resolves.toBe(false);
    });

    it('returns false and logs error on AsyncStorage failure', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      AsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      await expect(consentService.hasAcceptedConsent()).resolves.toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('recordConsent', () => {
    it('records consent locally and on backend', async () => {
      apiClient.post.mockResolvedValue({data: {}});

      await consentService.recordConsent();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@visamesa_consent_accepted',
        'v1.0',
      );
      expect(apiClient.post).toHaveBeenCalledTimes(2);
      expect(apiClient.post).toHaveBeenCalledWith(
        API_ENDPOINTS.userConsent,
        {
          type: 'privacy_policy',
          policyVersion: 'v1.0',
        },
      );
      expect(apiClient.post).toHaveBeenCalledWith(
        API_ENDPOINTS.userConsent,
        {
          type: 'terms_of_service',
          policyVersion: 'v1.0',
        },
      );
    });

    it('throws and logs error when backend fails', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const error = new Error('API error');
      apiClient.post.mockRejectedValue(error);

      await expect(consentService.recordConsent()).rejects.toThrow('API error');
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('clearConsent', () => {
    it('removes consent from AsyncStorage', async () => {
      await consentService.clearConsent();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        '@visamesa_consent_accepted',
      );
    });

    it('logs error when AsyncStorage fails', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      AsyncStorage.removeItem.mockRejectedValue(
        new Error('Storage error'),
      );

      await consentService.clearConsent();

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getConsentVersion', () => {
    it('returns current consent version', () => {
      expect(consentService.getConsentVersion()).toBe('v1.0');
    });
  });
});
