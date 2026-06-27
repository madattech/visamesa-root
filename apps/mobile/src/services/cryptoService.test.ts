import { cryptoService } from '@/services/cryptoService';

jest.mock('react-native-keychain', () => ({
  ACCESS_CONTROL: {
    BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE: 'BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE',
  },
  ACCESSIBLE: {
    WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: 'WHEN_PASSCODE_SET_THIS_DEVICE_ONLY',
  },
  getSupportedBiometryType: jest.fn().mockResolvedValue('FaceID'),
  getGenericPassword: jest.fn(),
  setGenericPassword: jest.fn(),
}));

jest.mock('react-native-quick-crypto', () => {
  const { randomBytes, createCipheriv, createDecipheriv } = require('crypto');

  return {
    randomBytes,
    createCipheriv,
    createDecipheriv,
  };
});

const Keychain = jest.requireMock('react-native-keychain') as {
  getGenericPassword: jest.Mock;
  setGenericPassword: jest.Mock;
};

let storedPassword: string | null = null;

describe('cryptoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storedPassword = null;

    Keychain.getGenericPassword.mockImplementation(async () => {
      if (!storedPassword) {
        return false;
      }

      return {
        username: 'device-key-v1',
        password: storedPassword,
      };
    });

    Keychain.setGenericPassword.mockImplementation(async (_user, password) => {
      storedPassword = password;
      return true;
    });
  });

  it('encrypts and decrypts profile payloads', async () => {
    const profile = {
      personal: { firstName: 'Ada' },
    };

    const encrypted = await cryptoService.encrypt(profile);
    const decrypted = await cryptoService.decrypt(encrypted);

    expect(decrypted).toEqual(profile);
    expect(encrypted.algorithm).toBe('AES-256-GCM');
    expect(encrypted.keyId).toBe('device-key-v1');
  });

  it('reports biometrics availability', async () => {
    await expect(cryptoService.isBiometricsAvailable()).resolves.toBe(true);
  });
});
