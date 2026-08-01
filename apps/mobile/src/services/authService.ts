import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { API_ENDPOINTS } from '@/config/api';
import {
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
} from '@/config/google';
import { getGoogleSignInErrorMessage } from '@/services/authGoogleErrors';
import apiClient, { STORAGE_KEYS } from '@/services/api';
import { AuthResponse, User } from '@visamesa/types';

let isGoogleConfigured = false;

function configureGoogleSignIn() {
  if (isGoogleConfigured) {
    return;
  }

  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID || undefined,
    iosClientId: GOOGLE_IOS_CLIENT_ID || undefined,
    offlineAccess: false,
  });

  isGoogleConfigured = true;
}

export const authService = {
  async signInWithGoogle(): Promise<AuthResponse> {
    configureGoogleSignIn();

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();

      if (signInResult.type !== 'success') {
        throw new Error('Google sign-in was cancelled');
      }

      const idToken = signInResult.data.idToken;

      if (!idToken) {
        throw new Error(
          'Google did not return an ID token. Confirm webClientId is the Web OAuth client ID (not Android/iOS client ID).',
        );
      }

      const response = await apiClient.post<AuthResponse>(
        API_ENDPOINTS.googleAuth,
        { idToken },
      );

      const { token, user } = response.data;

      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

      return response.data;
    } catch (error) {
      throw new Error(getGoogleSignInErrorMessage(error));
    }
  },

  async logout(): Promise<void> {
    configureGoogleSignIn();

    try {
      await GoogleSignin.signOut();
    } catch {
      // Ignore sign-out errors when Google session is not active.
    }

    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
    ]);
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!token) {
        return null;
      }

      const response = await apiClient.get<User>(API_ENDPOINTS.usersMe);
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },

  async getStoredUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  },
};
