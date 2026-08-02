import { Platform } from 'react-native';

// For development on physical device, use your computer's local IP.
// iOS simulator: http://localhost:3000
// Android emulator: http://10.0.2.2:3000

export const API_BASE_URL = __DEV__
  ? Platform.select({
      ios: 'http://localhost:3000',
      android: 'http://10.0.2.2:3000',
      default: 'http://localhost:3000',
    })!
  : 'https://visamesa-be-1052558133908.europe-west1.run.app';

export const API_ENDPOINTS = {
  // Auth
  googleAuth: '/auth/google',

  // Users
  usersMe: '/users/me',
  userDelete: '/users/me',
  userExport: '/users/me/export',
  encryptedDetails: '/users/me/encrypted-details',
  userConsent: '/users/me/consent',
  userProgress: '/users/me/progress',
  clientErrors: '/users/me/client-errors',

  // Forms (future BE)
  formSchema: (formId: string) => `/forms/schema/${formId}`,

  // Payments
  paymentEntitlements: '/payments/entitlements',
  paymentCheckoutSync: '/payments/checkout/sync',
};
