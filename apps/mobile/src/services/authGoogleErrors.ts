import { isAxiosError } from 'axios';
import { statusCodes } from '@react-native-google-signin/google-signin';

type GoogleSignInError = Error & { code?: string };

export function getGoogleSignInErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const backendMessage =
      typeof error.response?.data === 'object' &&
      error.response.data !== null &&
      'error' in error.response.data
        ? String((error.response.data as { error: string }).error)
        : null;

    if (backendMessage) {
      if (
        backendMessage.includes('requiredAudience') ||
        backendMessage.includes('Wrong recipient')
      ) {
        return (
          'Backend OAuth misconfiguration: add GOOGLE_ANDROID_CLIENT_ID to visamesa_be/.env with your Android OAuth client ID from Google Cloud Console, then restart the server.'
        );
      }

      return backendMessage;
    }

    if (error.message === 'Network Error') {
      return 'Cannot reach the server. Check that visamesa_be is running and API_BASE_URL is correct for your emulator.';
    }

    return error.message;
  }

  const googleError = error as GoogleSignInError;

  if (googleError.code === statusCodes.SIGN_IN_CANCELLED) {
    return 'Google sign-in was cancelled';
  }

  if (googleError.code === statusCodes.IN_PROGRESS) {
    return 'Google sign-in is already in progress';
  }

  if (googleError.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    return 'Google Play Services is not available on this device';
  }

  const message = googleError.message ?? 'Google sign-in failed';

  if (
    message.includes('DEVELOPER_ERROR') ||
    message.toLowerCase().includes("couldn't sign in")
  ) {
    return (
      'Google Sign-In is misconfigured for Android. In Google Cloud Console, create an Android OAuth client for package com.visamesa with SHA-1 from ./gradlew :app:signingReport (Variant: debug). The Web client ID must stay in google.ts as webClientId.'
    );
  }

  return message;
}
