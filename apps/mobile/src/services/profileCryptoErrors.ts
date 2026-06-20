export class ProfileDecryptionError extends Error {
  constructor() {
    super(
      'This profile was saved on another device. Enter your details below to set up this device. Saving will replace the encrypted copy stored for your account.',
    );
    this.name = 'ProfileDecryptionError';
  }
}

export function mapProfileDecryptionError(error: unknown): ProfileDecryptionError | null {
  if (error instanceof ProfileDecryptionError) {
    return error;
  }

  const message =
    typeof error === 'string'
      ? error
      : error instanceof Error
        ? error.message
        : '';

  const normalized = message.toLowerCase();

  if (
    normalized.includes('cipher final failed') ||
    normalized.includes('unable to authenticate data') ||
    normalized.includes('bad decrypt')
  ) {
    return new ProfileDecryptionError();
  }

  return null;
}

export function isProfileDecryptionFailure(error: unknown): boolean {
  return mapProfileDecryptionError(error) !== null;
}
