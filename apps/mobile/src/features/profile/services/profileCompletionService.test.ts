import {profileCompletionService} from './profileCompletionService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const AsyncStorage = jest.requireMock(
  '@react-native-async-storage/async-storage',
) as {
  getItem: jest.Mock;
  setItem: jest.Mock;
  removeItem: jest.Mock;
};

describe('profileCompletionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getIsComplete', () => {
    it('returns true when flag is set to true', async () => {
      AsyncStorage.getItem.mockResolvedValue('true');

      await expect(profileCompletionService.getIsComplete()).resolves.toBe(
        true,
      );
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        '@visamesa_profile_complete',
      );
    });

    it('returns false when flag is set to false', async () => {
      AsyncStorage.getItem.mockResolvedValue('false');

      await expect(profileCompletionService.getIsComplete()).resolves.toBe(
        false,
      );
    });

    it('returns false when flag does not exist', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);

      await expect(profileCompletionService.getIsComplete()).resolves.toBe(
        false,
      );
    });

    it('returns false and logs error when AsyncStorage fails', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      AsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      await expect(profileCompletionService.getIsComplete()).resolves.toBe(
        false,
      );
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('setIsComplete', () => {
    it('writes true flag to AsyncStorage', async () => {
      await profileCompletionService.setIsComplete(true);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@visamesa_profile_complete',
        'true',
      );
    });

    it('writes false flag to AsyncStorage', async () => {
      await profileCompletionService.setIsComplete(false);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@visamesa_profile_complete',
        'false',
      );
    });

    it('logs error when AsyncStorage fails', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      AsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));

      await profileCompletionService.setIsComplete(true);

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('clear', () => {
    it('removes flag from AsyncStorage', async () => {
      await profileCompletionService.clear();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        '@visamesa_profile_complete',
      );
    });

    it('logs error when AsyncStorage fails', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      AsyncStorage.removeItem.mockRejectedValue(
        new Error('Storage error'),
      );

      await profileCompletionService.clear();

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});
