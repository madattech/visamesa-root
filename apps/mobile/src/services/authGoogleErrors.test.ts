import { getGoogleSignInErrorMessage } from '@/services/authGoogleErrors';
import { statusCodes } from '@react-native-google-signin/google-signin';
import { AxiosError } from 'axios';

jest.mock('@react-native-google-signin/google-signin', () => ({
  statusCodes: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
    SIGN_IN_REQUIRED: 'SIGN_IN_REQUIRED',
    NULL_PRESENTER: 'NULL_PRESENTER',
  },
}));

describe('getGoogleSignInErrorMessage', () => {
  it('maps network errors to a helpful message', () => {
    const error = new AxiosError('Network Error');
    error.response = undefined;

    expect(getGoogleSignInErrorMessage(error)).toContain(
      'Cannot reach the server',
    );
  });

  it('maps Android developer errors to setup guidance', () => {
    expect(
      getGoogleSignInErrorMessage(new Error('DEVELOPER_ERROR')),
    ).toContain('Android OAuth client');
  });

  it('maps audience mismatch to setup guidance', () => {
    const error = new AxiosError('Request failed');
    error.response = {
      data: { error: 'Wrong recipient, payload audience != requiredAudience' },
      status: 401,
      statusText: 'Unauthorized',
      headers: {},
      config: {
        headers: {} as any,
      } as any,
    };

    expect(getGoogleSignInErrorMessage(error)).toContain(
      'GOOGLE_ANDROID_CLIENT_ID',
    );
  });

  it('maps cancelled sign-in', () => {
    expect(
      getGoogleSignInErrorMessage(
        Object.assign(new Error('cancelled'), {
          code: statusCodes.SIGN_IN_CANCELLED,
        }),
      ),
    ).toBe('Google sign-in was cancelled');
  });
});
