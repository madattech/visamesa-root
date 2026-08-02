import {i18n} from '@visamesa/content/i18n';

export class ProfileDecryptionError extends Error {
  constructor() {
    super(i18n.t('otherDeviceMessage', {ns: 'profile'}));
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
