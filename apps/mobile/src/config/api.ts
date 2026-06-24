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
  encryptedDetails: '/users/me/encrypted-details',

  // Appointments
  pendingAppointments: (userId: string) => `/appointments/pending/${userId}`,
  allCases: (userId: string) => `/appointments/cases/${userId}`,
  appointmentStatus: (caseId: string) => `/appointments/status/${caseId}`,
  checkAvailability: '/appointments/check-availability',
  bookResult: '/appointments/book-result',

  // Forms (future BE)
  formSchema: (formId: string) => `/forms/schema/${formId}`,

  // Payments
  paymentEntitlements: '/payments/entitlements',
};
