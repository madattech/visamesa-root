import { API_ENDPOINTS } from '@/config/api';
import { getProfile, updateProfile } from '@/features/profile/services/profileService';
import { cryptoService } from '@/services/cryptoService';
import { ProfileDecryptionError } from '@/services/profileCryptoErrors';
import apiClient from '@/services/api';

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));

jest.mock('@/services/cryptoService', () => ({
  cryptoService: {
    decrypt: jest.fn(),
    encrypt: jest.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockedCryptoService = cryptoService as jest.Mocked<typeof cryptoService>;

describe('profileService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and decrypts the current user profile', async () => {
    const profile = {
      personal: { firstName: 'Ada' },
      billing: null,
      residenceRegistration: null,
    };
    const encryptedPayload = {
      ciphertext: 'encrypted',
      nonce: 'nonce',
      authTag: 'tag',
      algorithm: 'AES-256-GCM' as const,
      keyId: 'device-key-v1',
      version: 1,
    };

    mockedApiClient.get.mockResolvedValue({ data: encryptedPayload });
    mockedCryptoService.decrypt.mockResolvedValue(profile);

    await expect(getProfile()).resolves.toEqual(profile);
    expect(mockedApiClient.get).toHaveBeenCalledWith(
      API_ENDPOINTS.encryptedDetails,
    );
    expect(mockedCryptoService.decrypt).toHaveBeenCalledWith(encryptedPayload);
  });

  it('returns an empty profile when no encrypted payload exists', async () => {
    mockedApiClient.get.mockResolvedValue({ data: null });

    await expect(getProfile()).resolves.toEqual({
      personal: null,
      billing: null,
      residenceRegistration: null,
    });
    expect(mockedCryptoService.decrypt).not.toHaveBeenCalled();
  });

  it('updates a profile section with encrypted payload', async () => {
    const updatedProfile = {
      personal: { firstName: 'Ada' },
      billing: null,
      residenceRegistration: null,
    };
    const encryptedPayload = {
      ciphertext: 'encrypted',
      nonce: 'nonce',
      authTag: 'tag',
      algorithm: 'AES-256-GCM' as const,
      keyId: 'device-key-v1',
      version: 1,
    };

    mockedApiClient.get.mockResolvedValue({ data: null });
    mockedCryptoService.encrypt.mockResolvedValue(encryptedPayload);
    mockedApiClient.put.mockResolvedValue({ data: encryptedPayload });

    await expect(
      updateProfile('personal', { firstName: 'Ada' }),
    ).resolves.toEqual(updatedProfile);

    expect(mockedCryptoService.encrypt).toHaveBeenCalledWith(updatedProfile);
    expect(mockedApiClient.put).toHaveBeenCalledWith(
      API_ENDPOINTS.encryptedDetails,
      encryptedPayload,
    );
  });

  it('rethrows when profile was encrypted on another device', async () => {
    const encryptedPayload = {
      ciphertext: 'encrypted',
      nonce: 'nonce',
      authTag: 'tag',
      algorithm: 'AES-256-GCM' as const,
      keyId: 'device-key-v1',
      version: 1,
    };

    mockedApiClient.get.mockResolvedValue({ data: encryptedPayload });
    mockedCryptoService.decrypt.mockRejectedValue(new ProfileDecryptionError());

    await expect(getProfile()).rejects.toThrow(ProfileDecryptionError);
  });

  it('overwrites unreadable remote profile when saving on a new device', async () => {
    const encryptedPayload = {
      ciphertext: 'encrypted',
      nonce: 'nonce',
      authTag: 'tag',
      algorithm: 'AES-256-GCM' as const,
      keyId: 'device-key-v1',
      version: 1,
    };
    const updatedProfile = {
      personal: { firstName: 'Ada' },
      billing: null,
      residenceRegistration: null,
    };

    mockedApiClient.get.mockResolvedValue({ data: encryptedPayload });
    mockedCryptoService.decrypt.mockRejectedValue(new ProfileDecryptionError());
    mockedCryptoService.encrypt.mockResolvedValue(encryptedPayload);
    mockedApiClient.put.mockResolvedValue({ data: encryptedPayload });

    await expect(
      updateProfile('personal', { firstName: 'Ada' }),
    ).resolves.toEqual(updatedProfile);

    expect(mockedCryptoService.encrypt).toHaveBeenCalledWith(updatedProfile);
  });
});
