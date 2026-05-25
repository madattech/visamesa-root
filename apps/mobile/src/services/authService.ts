import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient, {STORAGE_KEYS} from './api';
import {API_ENDPOINTS} from '../config/api';
import {AuthResponse, User} from '../types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.login,
      {email, password},
    );

    const {token, user} = response.data;

    // Store token and user data
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));

    return response.data;
  },

  async logout(): Promise<void> {
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

      const response = await apiClient.get<{user: User}>(API_ENDPOINTS.me);
      return response.data.user;
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
