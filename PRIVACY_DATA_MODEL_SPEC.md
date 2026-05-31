# VisaMesa Zero-Knowledge Privacy Data Model — Tech Spec

## 1. Purpose

VisaMesa stores highly sensitive immigration data: names, NIE/passport numbers, addresses, visa details, appointment details, documents, and generated forms. This specification defines a **zero-knowledge, end-to-end encrypted data model** where VisaMesa servers store and sync data but cannot decrypt private user content.

Core requirement:

> Sensitive data is encrypted before it leaves the user's device. Only the user/device can decrypt it.

---

## 2. Goals

- Store applicant/case/document/form data encrypted on servers.
- Ensure backend cannot read user personal data.
- Keep WebView/government-site automation on the user's device.
- Support future multi-device sync.
- Support future case sharing with lawyers/agencies via public-key encryption.
- Allow the backend to manage non-sensitive operational workflows: auth, billing, sync, job status, timestamps, and encrypted blob storage.

---

## 3. Non-Goals

- Backend-side PDF generation from plaintext user data.
- Backend-side appointment automation using decrypted user data.
- Server-side search over private fields such as name, NIE, passport number, or address.
- Admin/customer support access to decrypted user data.

---

## 4. Core Architecture

```txt
User Device
  ├─ derives/unlocks encryption keys locally
  ├─ decrypts case/profile/document/form data locally
  ├─ runs WebView automation locally
  ├─ generates/fills PDFs locally
  └─ uploads encrypted payloads/results

VisaMesa Backend
  ├─ authenticates users
  ├─ stores encrypted blobs
  ├─ stores non-sensitive workflow metadata
  ├─ coordinates automation job status
  └─ cannot decrypt sensitive payloads
```

---

## 5. Encryption Model

Use **envelope encryption**.

```txt
User Master Key
  └─ encrypts per-object Data Keys
        ├─ Case Data Key
        ├─ Document Data Key
        ├─ Form Data Key
        └─ Appointment Result Data Key
```

Each sensitive object has its own random data key. The data key encrypts the object payload. The data key itself is encrypted with the user's master key or a recipient public key.

### Recommended algorithms

Preferred:

```txt
XChaCha20-Poly1305
Argon2id for password-based key derivation
Ed25519/X25519 key pairs for future sharing
```

Acceptable alternative:

```txt
AES-256-GCM
PBKDF2 only if Argon2id is unavailable
```

---

## 6. Key Management

### 6.1 User Master Key

The user has a master encryption key that never leaves the client in plaintext.

Recommended setup:

```txt
User password/passphrase
  ↓ Argon2id + user-specific salt
Key Encryption Key
  ↓ decrypts
User Master Key
```

The server stores:

- KDF salt
- KDF parameters
- encrypted user master key
- optional public key
- encrypted private key

The server never stores:

- raw password
- plaintext master key
- plaintext private key

### 6.2 Device Storage

On mobile, unlocked keys may be cached using secure platform storage:

- iOS Keychain
- Android Keystore

### 6.3 Recovery

Zero-knowledge means VisaMesa cannot recover user data if keys are lost. Product must include recovery from day one.

Recommended v1 recovery:

- user-generated recovery phrase/key
- encrypted master key backup
- strong warning that losing password + recovery key loses access permanently

---

## 7. Data Classification

### Always encrypted

- full name
- NIE
- passport number
- date of birth
- nationality, if tied to case profile
- address
- phone/email used in government forms
- appointment confirmation details
- document files
- generated PDFs
- PDF form field data
- notes
- screenshots
- automation input payloads
- automation results

### May remain plaintext if needed

Keep this minimal:

- internal user id
- login email
- subscription/billing status
- object ids
- created/updated timestamps
- workflow status
- generic procedure type, e.g. `tie`, `empadronamiento`, `cita_previa`
- encryption version
- ciphertext metadata

Avoid plaintext filenames because they can leak private information.

---

## 8. Database Model

The examples below are TypeScript-style schema definitions. They can be mapped to PostgreSQL tables, Prisma models, Drizzle schemas, or another ORM.

---

## 8.1 users

Stores account-level data and encrypted key material.

```ts
export interface User {
  id: string;
  email: string;
  emailVerified: boolean;

  passwordHash: string;

  kdf: {
    algorithm: 'argon2id';
    salt: string;
    memoryCost: number;
    timeCost: number;
    parallelism: number;
  };

  encryptedMasterKey: string;
  masterKeyNonce: string;

  publicKey?: string;
  encryptedPrivateKey?: string;
  privateKeyNonce?: string;

  createdAt: string;
  updatedAt: string;
}
```

Notes:

- `passwordHash` is only for authentication.
- `encryptedMasterKey` is for decrypting user data locally.
- Auth and encryption should be treated as separate systems.

---

## 8.2 encrypted_cases

Stores one immigration/TIE case as encrypted payload.

```ts
export interface EncryptedCase {
  id: string;
  userId: string;

  status:
    | 'draft'
    | 'ready'
    | 'automation_pending'
    | 'running_on_device'
    | 'appointment_found'
    | 'completed'
    | 'failed';

  procedureType:
    | 'tie'
    | 'empadronamiento'
    | 'cita_previa'
    | 'ex17'
    | 'fee_790'
    | 'other';

  encryptedDataKey: string;
  dataKeyNonce: string;

  encryptedPayload: string;
  payloadNonce: string;

  encryptionVersion: number;
  algorithm: 'xchacha20-poly1305' | 'aes-256-gcm';

  createdAt: string;
  updatedAt: string;
}
```

Decrypted payload shape:

```ts
export interface CasePayload {
  applicant: {
    fullName: string;
    nie?: string;
    passportNumber?: string;
    dateOfBirth?: string;
    nationality?: string;
    address?: {
      line1: string;
      line2?: string;
      city: string;
      province?: string;
      postalCode?: string;
      country: string;
    };
    phone?: string;
    email?: string;
  };

  procedure: {
    type: 'tie' | 'empadronamiento' | 'cita_previa' | 'other';
    province?: string;
    office?: string;
    tramite?: string;
  };

  automationProfile?: {
    target: 'cita_previa' | 'empadronamiento';
    documentType?: 'nie' | 'passport';
    provinceOptionIndex?: number;
    tramitesOptionIndex?: number;
    officeOptionIndex?: number;
  };

  notes?: string;
}
```

---

## 8.3 encrypted_documents

Stores encrypted user-uploaded documents.

```ts
export interface EncryptedDocument {
  id: string;
  userId: string;
  caseId?: string;

  documentType:
    | 'passport'
    | 'nie'
    | 'tie'
    | 'empadronamiento'
    | 'ex17'
    | 'fee_790'
    | 'appointment_confirmation'
    | 'other';

  encryptedDataKey: string;
  dataKeyNonce: string;

  encryptedFileUrl: string;
  encryptedMetadata: string;
  metadataNonce: string;

  fileHash: string;
  fileSizeBytes: number;

  encryptionVersion: number;
  algorithm: 'xchacha20-poly1305' | 'aes-256-gcm';

  createdAt: string;
  updatedAt: string;
}
```

Decrypted metadata shape:

```ts
export interface DocumentMetadataPayload {
  originalFilename: string;
  mimeType: string;
  label?: string;
  description?: string;
  uploadedFromDevice?: string;
}
```

---

## 8.4 encrypted_forms

Stores encrypted form field data and generated PDFs, e.g. EX-17.

```ts
export interface EncryptedForm {
  id: string;
  userId: string;
  caseId: string;

  formType: 'EX17' | '790_012' | 'other';
  formSchemaVersion: number;

  encryptedDataKey: string;
  dataKeyNonce: string;

  encryptedFormData: string;
  formDataNonce: string;

  encryptedGeneratedPdfUrl?: string;

  encryptionVersion: number;
  algorithm: 'xchacha20-poly1305' | 'aes-256-gcm';

  createdAt: string;
  updatedAt: string;
}
```

Decrypted EX-17 payload example:

```ts
export interface Ex17FormPayload {
  applicant: {
    nie?: string;
    passportNumber?: string;
    fullName: string;
    nationality?: string;
    birthDate?: string;
    address?: string;
  };
  application: {
    reason?: string;
    cardType?: string;
    province?: string;
  };
  rawFieldValues: Record<string, string | boolean>;
}
```

---

## 8.5 automation_jobs

Tracks automation execution without exposing private data.

```ts
export interface AutomationJob {
  id: string;
  userId: string;
  caseId: string;

  target: 'cita_previa' | 'empadronamiento';

  status:
    | 'queued'
    | 'running_on_device'
    | 'slot_found'
    | 'booked'
    | 'failed'
    | 'cancelled';

  // Optional non-sensitive routing metadata only.
  provinceCode?: string;
  procedureCode?: string;

  encryptedInputRef: string;
  encryptedResultId?: string;

  lastHeartbeatAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

Important rule:

> The backend creates/tracks jobs, but the mobile app decrypts the data and performs automation locally.

---

## 8.6 encrypted_appointment_results

Stores appointment result details encrypted.

```ts
export interface EncryptedAppointmentResult {
  id: string;
  userId: string;
  caseId: string;
  automationJobId: string;

  status: 'found' | 'booked' | 'failed';

  encryptedDataKey: string;
  dataKeyNonce: string;

  encryptedPayload: string;
  payloadNonce: string;

  encryptionVersion: number;
  algorithm: 'xchacha20-poly1305' | 'aes-256-gcm';

  createdAt: string;
}
```

Decrypted payload shape:

```ts
export interface AppointmentResultPayload {
  date?: string;
  time?: string;
  location?: string;
  confirmationNumber?: string;
  screenshotDocumentId?: string;
  errorMessage?: string;
  rawAutomationMessages?: unknown[];
}
```

---

## 8.7 encrypted_audit_events

Audit events must not leak private data.

```ts
export interface AuditEvent {
  id: string;
  userId: string;
  objectId?: string;
  objectType?: 'case' | 'document' | 'form' | 'automation_job';

  eventType:
    | 'case_created'
    | 'case_updated'
    | 'document_uploaded'
    | 'automation_started'
    | 'automation_completed'
    | 'automation_failed';

  encryptedDetails?: string;
  detailsNonce?: string;

  createdAt: string;
}
```

---

## 9. Client Data Flow

### 9.1 Create case

```txt
1. User enters case details on mobile.
2. App generates random Case Data Key.
3. App encrypts CasePayload with Case Data Key.
4. App encrypts Case Data Key with User Master Key.
5. App uploads encrypted case to backend.
```

### 9.2 Read case

```txt
1. App downloads encrypted case.
2. App decrypts encryptedDataKey using User Master Key.
3. App decrypts encryptedPayload using Case Data Key.
4. App renders plaintext locally only.
```

### 9.3 Run appointment automation

```txt
1. App downloads encrypted case/job input.
2. App decrypts locally.
3. App builds automation profile locally.
4. App runs WebView automation locally.
5. App encrypts result locally.
6. App uploads encrypted result and public job status.
```

### 9.4 Generate/fill PDF

```txt
1. App decrypts case/form data locally.
2. App fills PDF locally.
3. App encrypts generated PDF file locally.
4. App uploads encrypted PDF bytes.
```

---

## 10. API Shape

Backend APIs accept encrypted payloads only.

### Create encrypted case

```http
POST /cases
```

```json
{
  "status": "draft",
  "procedureType": "tie",
  "encryptedDataKey": "base64...",
  "dataKeyNonce": "base64...",
  "encryptedPayload": "base64...",
  "payloadNonce": "base64...",
  "encryptionVersion": 1,
  "algorithm": "xchacha20-poly1305"
}
```

### Get encrypted case

```http
GET /cases/:caseId
```

Returns the same encrypted object. The server does not decrypt.

### Update automation job status

```http
PATCH /automation-jobs/:jobId
```

```json
{
  "status": "running_on_device",
  "lastHeartbeatAt": "2026-05-31T12:00:00.000Z"
}
```

### Upload encrypted appointment result

```http
POST /appointment-results
```

```json
{
  "caseId": "case_123",
  "automationJobId": "job_123",
  "status": "booked",
  "encryptedDataKey": "base64...",
  "dataKeyNonce": "base64...",
  "encryptedPayload": "base64...",
  "payloadNonce": "base64...",
  "encryptionVersion": 1,
  "algorithm": "xchacha20-poly1305"
}
```

---

## 11. Sharing Model — Future

For lawyer/agency sharing, use public-key encryption.

```txt
Case Data Key
  ├─ encrypted for user public key
  └─ encrypted for lawyer public key
```

Add table:

```ts
export interface EncryptedObjectRecipient {
  id: string;
  objectId: string;
  objectType: 'case' | 'document' | 'form' | 'appointment_result';
  recipientUserId: string;

  encryptedDataKey: string;
  dataKeyNonce: string;

  role: 'owner' | 'viewer' | 'editor';

  createdAt: string;
}
```

Revocation note:

- Removing a recipient prevents future access.
- If they already decrypted data, cryptographic revocation is impossible.
- For stronger revocation, rotate object data keys and re-encrypt for remaining recipients.

---

## 12. Security Requirements

- Never log plaintext sensitive fields.
- Never send plaintext sensitive fields to analytics/crash reporting.
- Disable screenshots or redact sensitive screens where appropriate.
- Use TLS for all API traffic even though payloads are encrypted.
- Use authenticated encryption only.
- Use unique nonces per encryption operation.
- Store encryption version on every encrypted object.
- Support future key rotation.
- Treat filenames and MIME metadata as sensitive.
- Keep decrypted data in memory for the shortest practical time.

---

## 13. Product Tradeoffs

### Benefits

- Strong privacy promise.
- Backend breach does not expose user immigration data.
- Aligns with on-device WebView automation.
- Better trust model for sensitive immigration workflows.

### Costs

- Server cannot search private fields.
- Server cannot generate PDFs from private data.
- Server cannot debug user cases by reading contents.
- Password/key recovery must be designed carefully.
- Multi-device sync requires key backup/recovery.

---

## 14. Recommended Implementation Plan

### Phase 1 — Local crypto foundation

- Add crypto library to mobile app.
- Implement key generation, encryption, decryption helpers.
- Store unlocked key material in Keychain/Keystore.
- Define encrypted payload types.

### Phase 2 — Backend encrypted storage

- Replace plaintext case/profile/document fields with encrypted payload columns.
- Add encryption metadata columns.
- Add encrypted document upload flow.

### Phase 3 — On-device automation integration

- Decrypt case locally.
- Build `CitaPreviaAutomationProfile` locally.
- Run WebView automation locally.
- Encrypt appointment results before upload.

### Phase 4 — PDF generation privacy

- Generate/fill EX-17 and other PDFs on-device.
- Encrypt generated PDFs before upload.
- Store encrypted metadata only.

### Phase 5 — Recovery and sharing

- Add recovery phrase/key flow.
- Add public/private key pairs.
- Add recipient-based encrypted data keys for lawyer/team sharing.

---

## 15. VisaMesa-Specific Rule

For this project, the key architectural rule is:

> Anything requiring personal data must happen on the user's device after local decryption.

That includes:

- Cita Previa automation
- Empadronamiento automation
- EX-17 PDF filling
- appointment result parsing
- document preview
- generated form preview

The backend should coordinate workflows, but it should not process plaintext immigration data.
