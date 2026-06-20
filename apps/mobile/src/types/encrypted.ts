export type EncryptedAlgorithm = 'AES-256-GCM' | 'AES-GCM' | 'XCHACHA20-POLY1305';

export type EncryptedPayload = {
  id?: string;
  ciphertext: string;
  nonce: string;
  authTag?: string;
  algorithm: EncryptedAlgorithm;
  keyId: string;
  version: number;
  createdAt?: string;
  updatedAt?: string;
};
