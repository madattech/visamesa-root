# VisaMesa User Details Privacy Model

## Scope

This model only protects **user/applicant details**.

Everything else, such as form filling, PDF generation, WebView automation, and appointment interaction, happens on the user's device and does not need to be modeled as encrypted server data for now.

---

## Core Rule

> The server stores encrypted user details. The mobile app decrypts them locally when needed.

The backend can store and sync the encrypted record, but it should not be able to read the applicant's personal information.

---

## Recommended Database

Use **PostgreSQL** for the backend production database.

Reason:

- good for multi-user server applications
- reliable concurrency
- easy backups
- good indexing/querying for non-sensitive metadata
- works well with Prisma, Drizzle, TypeORM, etc.
- easier to operate safely as the product grows

SQLite is okay for:

- local mobile storage
- local development
- prototypes
- single-user embedded storage

SQLite is **not ideal as the main production server database** if VisaMesa will have multiple users/devices because concurrency, migrations, backups, and scaling are more limited than PostgreSQL.

So the recommended split is:

```txt
Mobile app local cache: SQLite or secure local storage
Backend production DB: PostgreSQL
```

---

## Data Model

### users

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

---

### user_encryption_keys

Stores encryption metadata needed by the client to unlock encrypted user details.

```ts
export interface UserEncryptionKey {
  id: string;
  userId: string;

  kdfAlgorithm: 'argon2id';
  kdfSalt: string;
  kdfMemoryCost: number;
  kdfTimeCost: number;
  kdfParallelism: number;

  encryptedUserDetailsKey: string;
  encryptedUserDetailsKeyNonce: string;

  encryptionAlgorithm: 'xchacha20-poly1305' | 'aes-256-gcm';
  encryptionVersion: number;

  createdAt: string;
  updatedAt: string;
}
```

Purpose:

```txt
User password/passphrase
  ↓ Argon2id + kdfSalt
Key Encryption Key
  ↓ decrypts encryptedUserDetailsKey
User Details Key
  ↓ decrypts user_details.encryptedPayload
Plain user details on device only
```

---

### user_details

Stores the encrypted personal/applicant details.

```ts
export interface UserDetails {
  id: string;
  userId: string;

  encryptedPayload: string;
  payloadNonce: string;

  encryptionAlgorithm: 'xchacha20-poly1305' | 'aes-256-gcm';
  encryptionVersion: number;

  createdAt: string;
  updatedAt: string;
}
```

The server can read only the wrapper fields above. The actual user details are inside `encryptedPayload`.

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

CREATE TABLE user_encryption_keys (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  kdf_algorithm TEXT NOT NULL DEFAULT 'argon2id',
  kdf_salt TEXT NOT NULL,
  kdf_memory_cost INTEGER NOT NULL,
  kdf_time_cost INTEGER NOT NULL,
  kdf_parallelism INTEGER NOT NULL,

  encrypted_user_details_key TEXT NOT NULL,
  encrypted_user_details_key_nonce TEXT NOT NULL,

  encryption_algorithm TEXT NOT NULL,
  encryption_version INTEGER NOT NULL DEFAULT 1,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(user_id)
);

CREATE TABLE user_details (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  encrypted_payload TEXT NOT NULL,
  payload_nonce TEXT NOT NULL,

  encryption_algorithm TEXT NOT NULL,
  encryption_version INTEGER NOT NULL DEFAULT 1,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(user_id)
);
```

---

## Is SQLite a Problem?

### SQLite on mobile

No problem. SQLite is a good choice for local device storage.

Use it for:

- encrypted local cache
- offline drafts
- local automation state
- local form data before upload

But still use mobile secure storage for encryption keys:

- iOS Keychain
- Android Keystore

### SQLite on backend

Not recommended for production backend if this is a multi-user SaaS/app.

It can work for a prototype, but PostgreSQL is safer for production.

Main concerns with backend SQLite:

- limited concurrent writes
- harder operational scaling
- backups/migrations need extra care
- less suitable for multi-instance deployments
- future analytics/admin workflows become harder

### Recommendation

```txt
Use PostgreSQL on the backend.
Use SQLite only locally on the mobile app if needed.
```

---

## Simplified Flow

### Save user details

```txt
1. User enters personal details on mobile.
2. App encrypts details locally.
3. App sends encrypted payload to backend.
4. Backend stores encrypted payload in user_details.
```

### Read user details

```txt
1. App downloads encrypted user_details.
2. App decrypts locally.
3. App uses details for forms/automation on device.
```

---

## Final Recommendation

For now, keep the privacy architecture simple:

```txt
users table                 plaintext account/auth fields
user_encryption_keys table  encrypted key metadata
user_details table          encrypted personal details blob
```

Use PostgreSQL for the backend and SQLite only for local mobile storage/prototyping.
