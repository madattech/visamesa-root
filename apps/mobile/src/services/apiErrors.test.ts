import {AxiosError} from 'axios';

import {getAxiosApiErrorMessage} from './apiErrors';

jest.mock('@visamesa/content/i18n', () => ({
  i18n: {
    t: (key: string, options?: {ns?: string}) =>
      options?.ns ? `${options.ns}:${key}` : key,
  },
}));

describe('getAxiosApiErrorMessage', () => {
  it('maps known API error codes to localized messages', () => {
    const error = new AxiosError('Conflict');
    error.response = {
      status: 409,
      data: {code: 'ALREADY_ENTITLED', error: 'Already entitled'},
      statusText: 'Conflict',
      headers: {},
      config: {} as never,
    };

    expect(getAxiosApiErrorMessage(error)).toBe('checkout:errors.alreadyEntitled');
  });

  it('returns a localized network error message', () => {
    const error = new AxiosError('Network Error');
    error.message = 'Network Error';

    expect(getAxiosApiErrorMessage(error)).toBe('auth:networkCannotReachServer');
  });

  it('falls back to profile copy for unknown errors', () => {
    expect(getAxiosApiErrorMessage('unknown', 'profile:account.exportFailedMessage')).toBe(
      'profile:account.exportFailedMessage',
    );
  });
});
