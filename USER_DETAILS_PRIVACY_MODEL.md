# VisaMesa User Details Privacy Model

## Scope

This model only protects **user/applicant details** stored on the backend.

Everything else stays on-device for now:

- form filling
- PDF generation
- WebView automation
- appointment interaction
- local drafts/cache

---

## Core Rule

> The backend stores only encrypted user details. The mobile app owns the key and decrypts locally.

The server can store and sync the encrypted record, but it must not be able to read applicant personal information.

---

## Recommended Storage Architecture

```txt
Mobile app
  ├─ stores encryption key in Keychain/Keystore via react-native-keychain
  ├─ encrypts user details locally
  └─ sends encrypted payload to backend

Backend
  ├─ PostgreSQL
  ├─ stores account/auth data
  └─ stores encrypted user details blob
```

Recommended package for secure key storage:

```txt
react-native-keychain
```

Important clarification:

> Keychain stores the encryption key securely. It does not replace payload encryption. The app still encrypts/decrypts the user details JSON using a crypto library.

Use a crypto library for actual encryption, for example:

```txt
react-native-libsodium / libsodium
```

Preferred encryption algorithm:

```txt
XChaCha20-Poly1305
```

Acceptable alternative:

```txt
AES-256-GCM
```

---

## Is SQLite a Problem?

### SQLite on mobile

SQLite is fine for local mobile storage.

Use it for:

- encrypted local cache
- offline drafts
- local automation state
- local form data before upload

But store encryption keys in Keychain/Keystore, not SQLite.

### SQLite on backend

SQLite is okay for prototypes, but not recommended for the production backend.

For a multi-user backend, use **PostgreSQL** because it is better for:

- concurrent users
- concurrent writes
- backups
- migrations
- monitoring
- multi-instance deployments
- future reporting/admin workflows

Recommended split:

```txt
Backend production DB: PostgreSQL
Mobile local DB/cache: SQLite is fine
Encryption key storage: react-native-keychain
```

---

## Data Model

The simplified backend model has only two required tables:

```txt
users
user_details
```

A separate `user_encryption_keys` table is not required for the simple v1 model because the encryption key is stored on the user's device using Keychain/Keystore.

---

## users

Stores account/login information only. This table does not contain private applicant details.

```ts
export interface User {
  id: string;
  email: string;
  emailVerified: boolean;

  passwordHash: string;

  createdAt: string;
  updatedAt: string;
}
```

Notes:

- `email` is server-readable because it is used for login/account management.
- `passwordHash` is for authentication only.
- Never store the raw password.
- Do not store full name, NIE, passport number, address, or other applicant details here.

---

## user_details

Stores one encrypted user/applicant details blob per user.

```ts
export interface UserDetails {
  id: string;
  userId: string;

  encryptedPayload: string;
  payloadNonce: string;

  keyId: string;
  encryptionAlgorithm: 'xchacha20-poly1305' | 'aes-256-gcm';
  encryptionVersion: number;

  createdAt: string;
  updatedAt: string;
}
```

The backend can read only the wrapper fields above.

The real user details are inside `encryptedPayload` and can only be decrypted on the user's device.

---

## Decrypted Payload Shape

This shape exists only on the user's device after decryption.

```ts
export interface UserDetailsPayload {
  fullName: string;
  firstName?: string;
  lastName?: string;

  dateOfBirth?: string;
  nationality?: string;

  document: {
    type: 'nie' | 'passport' | 'other';
    number: string;
    expiryDate?: string;
  };

  contact?: {
    phone?: string;
    email?: string;
  };

  address?: {
    line1: string;
    line2?: string;
    city: string;
    province?: string;
    postalCode?: string;
    country: string;
  };

  citaPreviaDefaults?: {
    provinceOptionIndex?: number;
    tramitesOptionIndex?: number;
    nationalityOptionIndex?: number;
    documentType?: 'nie' | 'passport';
  };
}
```

---

## Minimal PostgreSQL Tables

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_details (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  encrypted_payload TEXT NOT NULL,
  payload_nonce TEXT NOT NULL,

  key_id TEXT NOT NULL,
  encryption_algorithm TEXT NOT NULL,
  encryption_version INTEGER NOT NULL DEFAULT 1,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(user_id)
);
```

Notes:

- `encrypted_payload` stores base64 ciphertext.
- `payload_nonce` stores the base64 nonce used for encryption.
- `key_id` identifies which local device key was used.
- The backend does not store the encryption key.

---

## Keychain Key Model

On the mobile app, generate one random symmetric key for user details.

```txt
User Details Key
  ├─ generated on device
  ├─ stored using react-native-keychain
  └─ used to encrypt/decrypt user_details.encryptedPayload
```

Recommended Keychain service name:

```txt
com.visamesa.user-details-key
```

Recommended key id format:

```txt
user-details-key-v1
```

The stored secret should be random bytes, base64 encoded.

---

## Mobile Encryption Flow

### First-time setup

```txt
1. User signs up or logs in for the first time on this device.
2. App generates a random 32-byte User Details Key.
3. App stores that key in Keychain using react-native-keychain.
4. User enters personal details.
5. App JSON serializes the details.
6. App encrypts the JSON with the User Details Key.
7. App uploads encrypted payload to backend.
```

### Save user details

```txt
1. App loads User Details Key from Keychain.
2. App converts user details object to JSON.
3. App encrypts JSON locally.
4. App sends encrypted payload + nonce to backend.
5. Backend upserts into user_details.
```

### Read user details

```txt
1. App downloads user_details row from backend.
2. App loads User Details Key from Keychain.
3. App decrypts encryptedPayload locally.
4. App parses JSON into UserDetailsPayload.
5. App uses the details for forms/automation on device.
```

---

## Example React Native Keychain Usage

Install:

```bash
npm install react-native-keychain
```

Example helper shape:

```ts
import * as Keychain from 'react-native-keychain';

const USER_DETAILS_KEY_SERVICE = 'com.visamesa.user-details-key';
const USER_DETAILS_KEY_ID = 'user-details-key-v1';

export async function saveUserDetailsKey(base64Key: string) {
  await Keychain.setGenericPassword(USER_DETAILS_KEY_ID, base64Key, {
    service: USER_DETAILS_KEY_SERVICE,
    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
}

export async function getUserDetailsKey(): Promise<string | null> {
  const credentials = await Keychain.getGenericPassword({
    service: USER_DETAILS_KEY_SERVICE,
  });

  if (!credentials) {
    return null;
  }

  return credentials.password;
}

export async function deleteUserDetailsKey() {
  await Keychain.resetGenericPassword({
    service: USER_DETAILS_KEY_SERVICE,
  });
}
```

Notes:

- `WHEN_UNLOCKED_THIS_DEVICE_ONLY` keeps the key tied to the device and avoids cloud backup.
- If the device is lost or the app is reinstalled, the key may be lost depending on platform behavior.
- For v1, this is acceptable if we are okay with device-bound encrypted data.
- If multi-device sync/recovery is required later, add a recovery-key or password-derived key flow.

---

## Example Encrypt/Decrypt Flow

Pseudo-code:

```ts
type EncryptedUserDetailsPayload = {
  encryptedPayload: string;
  payloadNonce: string;
  keyId: string;
  encryptionAlgorithm: 'xchacha20-poly1305';
  encryptionVersion: 1;
};

async function encryptUserDetails(
  userDetails: UserDetailsPayload,
): Promise<EncryptedUserDetailsPayload> {
  let base64Key = await getUserDetailsKey();

  if (!base64Key) {
    base64Key = generateRandomBase64Key(32);
    await saveUserDetailsKey(base64Key);
  }

  const plaintext = JSON.stringify(userDetails);
  const nonce = generateRandomNonce();

  const encryptedPayload = encryptWithXChaCha20Poly1305({
    key: base64Key,
    nonce,
    plaintext,
  });

  return {
    encryptedPayload,
    payloadNonce: nonce,
    keyId: USER_DETAILS_KEY_ID,
    encryptionAlgorithm: 'xchacha20-poly1305',
    encryptionVersion: 1,
  };
}

async function decryptUserDetails(
  encrypted: EncryptedUserDetailsPayload,
): Promise<UserDetailsPayload> {
  const base64Key = await getUserDetailsKey();

  if (!base64Key) {
    throw new Error('User details encryption key not found on this device');
  }

  const plaintext = decryptWithXChaCha20Poly1305({
    key: base64Key,
    nonce: encrypted.payloadNonce,
    encryptedPayload: encrypted.encryptedPayload,
  });

  return JSON.parse(plaintext) as UserDetailsPayload;
}
```

---

## API Payloads

### Upsert user details

```http
PUT /user-details
```

```json
{
  "encryptedPayload": "base64-ciphertext",
  "payloadNonce": "base64-nonce",
  "keyId": "user-details-key-v1",
  "encryptionAlgorithm": "xchacha20-poly1305",
  "encryptionVersion": 1
}
```

### Get user details

```http
GET /user-details
```

```json
{
  "id": "uuid",
  "userId": "uuid",
  "encryptedPayload": "base64-ciphertext",
  "payloadNonce": "base64-nonce",
  "keyId": "user-details-key-v1",
  "encryptionAlgorithm": "xchacha20-poly1305",
  "encryptionVersion": 1,
  "createdAt": "2026-05-31T00:00:00.000Z",
  "updatedAt": "2026-05-31T00:00:00.000Z"
}
```

---

## Backend Responsibility

The backend only validates and stores the encrypted wrapper.

It should validate:

- authenticated user owns the record
- required fields exist
- `encryptionVersion` is supported
- `encryptionAlgorithm` is supported
- payload sizes are within limits

The backend should not:

- decrypt the payload
- log encrypted payload bodies unnecessarily
- ask for plaintext personal details
- store duplicate plaintext fields like `fullName`, `nie`, `passportNumber`, or `address`

---

## Important Tradeoff

This simple Keychain-based model is device-bound.

That means:

```txt
If the user loses the device/key, the backend cannot decrypt or recover user details.
```

For v1 this is simple and private.

For future multi-device support, add one of these:

- recovery phrase
- password-derived encryption key
- encrypted key backup
- trusted-device approval

Do not add these until needed.

---

## Final Recommendation

For the current VisaMesa scope, use this simple model:

```txt
users table         plaintext account/auth only
user_details table  encrypted applicant details blob
Keychain            stores the local User Details Key
PostgreSQL          stores encrypted payload + nonce only
```

This keeps the backend model simple while still preventing the server from reading sensitive applicant details.
