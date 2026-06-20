import {
  ProfileDecryptionError,
  isProfileDecryptionFailure,
  mapProfileDecryptionError,
} from '@/services/profileCryptoErrors';

describe('profile crypto errors', () => {
  it('maps node crypto auth tag failures', () => {
    const error = new Error('Unsupported state or unable to authenticate data');

    expect(isProfileDecryptionFailure(error)).toBe(true);
    expect(mapProfileDecryptionError(error)).toBeInstanceOf(
      ProfileDecryptionError,
    );
  });

  it('maps quick-crypto cipher failures', () => {
    const error = new Error('Cipher.final(...): Cipher final failed');

    expect(mapProfileDecryptionError(error)).toBeInstanceOf(
      ProfileDecryptionError,
    );
  });
});
