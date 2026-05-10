// API Configuration
// IMPORTANT: Change this to your actual backend URL
// For development on physical device, use your computer's local IP
// For iOS simulator: http://localhost:3000
// For Android emulator: http://10.0.2.2:3000
// For physical device: http://YOUR_LOCAL_IP:3000 (e.g., http://192.168.1.100:3000)

export const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:3000' // Android emulator (10.0.2.2 = host machine localhost)
  : 'https://your-production-api.com';

export const API_ENDPOINTS = {
  // Auth
  login: '/auth/login',
  register: '/auth/register',
  me: '/auth/me',

  // Appointments
  pendingAppointments: (userId: string) => `/appointments/pending/${userId}`,
  allCases: (userId: string) => `/appointments/cases/${userId}`,
  appointmentStatus: (caseId: string) => `/appointments/status/${caseId}`,
  checkAvailability: '/appointments/check-availability',
  bookResult: '/appointments/book-result',
};
