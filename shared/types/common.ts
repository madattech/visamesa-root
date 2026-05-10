// Common types shared across all automations

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Base API configuration
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@visamesa_auth_token',
  USER_DATA: '@visamesa_user_data',
} as const;
