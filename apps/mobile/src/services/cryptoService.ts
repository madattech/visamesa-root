import * as Keychain from 'react-native-keychain';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from 'react-native-quick-crypto';

import {
  EncryptedAlgorithm,
  EncryptedPayload,
} from '@/types/encrypted';

const KEYCHAIN_SERVICE = 'visamesa_encryption_key';
const KEY_ID = 'device-key-v1';
const ALGORITHM: EncryptedAlgorithm = 'AES-256-GCM';
const IV_LENGTH = 12;
const KEY_LENGTH = 32;
const VERSION = 1;

const AUTHENTICATION_PROMPT = {
  title: 'Unlock your profile',
  subtitle: 'Authenticate to access your encrypted data',
};

// quick-crypto Buffer types differ from @types/node; use loose typing at the boundary.
type CryptoBytes = Uint8Array & { toString(encoding: string): string };

function toBase64(buffer: CryptoBytes): string {
  return buffer.toString('base64');
}

function fromBase64(value: string): CryptoBytes {
  return Buffer.from(value, 'base64') as CryptoBytes;
}

async function getOrCreateKeyBytes(): Promise<CryptoBytes> {
  const credentials = await Keychain.getGenericPassword({
    service: KEYCHAIN_SERVICE,
    authenticationPrompt: AUTHENTICATION_PROMPT,
  });

  if (credentials) {
    return fromBase64(credentials.password);
  }

  const newKey = randomBytes(KEY_LENGTH) as CryptoBytes;

  await Keychain.setGenericPassword(KEY_ID, toBase64(newKey), {
    service: KEYCHAIN_SERVICE,
    accessControl:
      Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
    accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
  });

  return newKey;
}

export const cryptoService = {
  async isBiometricsAvailable(): Promise<boolean> {
    const supported = await Keychain.getSupportedBiometryType();
    return supported !== null;
  },

  async encrypt(data: object): Promise<EncryptedPayload> {
    const key = await getOrCreateKeyBytes();
    const iv = randomBytes(IV_LENGTH) as CryptoBytes;
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const plaintext = Buffer.from(JSON.stringify(data), 'utf8') as CryptoBytes;
    const encrypted = Buffer.concat([
      cipher.update(plaintext) as CryptoBytes,
      cipher.final() as CryptoBytes,
    ]);
    const authTag = cipher.getAuthTag() as CryptoBytes;

    return {
      ciphertext: toBase64(encrypted as CryptoBytes),
      nonce: toBase64(iv),
      authTag: toBase64(authTag),
      algorithm: ALGORITHM,
      keyId: KEY_ID,
      version: VERSION,
    };
  },

  async decrypt<T>(payload: EncryptedPayload): Promise<T> {
    const key = await getOrCreateKeyBytes();
    const iv = fromBase64(payload.nonce);
    const ciphertext = fromBase64(payload.ciphertext);
    const decipher = createDecipheriv('aes-256-gcm', key, iv);

    if (payload.authTag) {
      decipher.setAuthTag(fromBase64(payload.authTag) as never);
    }

    const decrypted = Buffer.concat([
      decipher.update(ciphertext) as CryptoBytes,
      decipher.final() as CryptoBytes,
    ]);

    return JSON.parse(decrypted.toString('utf8')) as T;
  },
};
