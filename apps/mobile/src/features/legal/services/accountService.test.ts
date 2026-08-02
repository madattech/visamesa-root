import {API_ENDPOINTS} from '@/config/api';

import {accountService} from './accountService';

jest.mock('react-native-keychain', () => ({
  resetGenericPassword: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  clear: jest.fn(),
}));

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    delete: jest.fn(),
    get: jest.fn(),
  },
}));

const Keychain = jest.requireMock('react-native-keychain') as {
  resetGenericPassword: jest.Mock;
};

const AsyncStorage = jest.requireMock(
  '@react-native-async-storage/async-storage',
) as {
  clear: jest.Mock;
};

const apiClient = jest.requireMock('@/services/api').default as {
  delete: jest.Mock;
  get: jest.Mock;
};

describe('accountService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('deleteAccount', () => {
    it('deletes account on backend and clears all local data', async () => {
      apiClient.delete.mockResolvedValue({data: {success: true}});
      AsyncStorage.clear.mockResolvedValue(undefined);
      Keychain.resetGenericPassword.mockResolvedValue(true);

      await accountService.deleteAccount();

      expect(apiClient.delete).toHaveBeenCalledWith(
        API_ENDPOINTS.userDelete,
      );
      expect(AsyncStorage.clear).toHaveBeenCalled();
      expect(Keychain.resetGenericPassword).toHaveBeenCalledWith({
        service: 'visamesa_encryption_key',
      });
    });

    it('throws error when backend deletion fails', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const error = new Error('API error');
      apiClient.delete.mockRejectedValue(error);

      await expect(accountService.deleteAccount()).rejects.toThrow('API error');
      expect(AsyncStorage.clear).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('still clears local data after backend success', async () => {
      apiClient.delete.mockResolvedValue({data: {success: true}});
      AsyncStorage.clear.mockResolvedValue(undefined);
      Keychain.resetGenericPassword.mockResolvedValue(true);

      await accountService.deleteAccount();

      expect(AsyncStorage.clear).toHaveBeenCalled();
      expect(Keychain.resetGenericPassword).toHaveBeenCalled();
    });
  });

  describe('exportData', () => {
    it('fetches user data from backend', async () => {
      const exportedData = {
        user: {id: 'test-id', email: 'test@example.com'},
        payments: [{amount: 10000, currency: 'eur'}],
      };
      apiClient.get.mockResolvedValue({data: exportedData});

      await expect(accountService.exportData()).resolves.toEqual(exportedData);
      expect(apiClient.get).toHaveBeenCalledWith(
        API_ENDPOINTS.userExport,
      );
    });

    it('throws and logs error when backend fails', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const error = new Error('API error');
      apiClient.get.mockRejectedValue(error);

      await expect(accountService.exportData()).rejects.toThrow('API error');
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('clearAllLocalData', () => {
    it('clears AsyncStorage and Keychain', async () => {
      AsyncStorage.clear.mockResolvedValue(undefined);
      Keychain.resetGenericPassword.mockResolvedValue(true);

      await accountService.clearAllLocalData();

      expect(AsyncStorage.clear).toHaveBeenCalled();
      expect(Keychain.resetGenericPassword).toHaveBeenCalledWith({
        service: 'visamesa_encryption_key',
      });
    });

    it('logs error and throws when clearing fails', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      AsyncStorage.clear.mockRejectedValue(new Error('Clear failed'));

      await expect(accountService.clearAllLocalData()).rejects.toThrow(
        'Clear failed',
      );
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});
