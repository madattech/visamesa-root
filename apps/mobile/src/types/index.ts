// User types
export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Case types
export interface Case {
  id: string;
  userId: string;
  procedureId: string;
  status: string;
  createdAt: string;
  procedure: {
    id: string;
    name: string;
    description: string | null;
  };
  profile: {
    id: string;
    fullName: string;
    dateOfBirth: string;
    nationality: string;
    passportNumber: string;
    details?: {
      nie: string;
      Name: string;
      nationality: number;
      documentType?: 'nie' | 'dni' | 'passport';
    };
  };
  appointment?: Appointment;
}

// Appointment types
export interface Appointment {
  id: string;
  caseId: string;
  location: string | null;
  status: string;
  date: string | null;
  time: string | null;
  metadata: Record<string, any> | null;
  lastCheck: string | null;
  createdAt: string;
  updatedAt: string;
}

// API request/response types
export interface AppointmentSlot {
  date: string;
  time: string;
  location: string;
}

export interface CheckAvailabilityRequest {
  caseId: string;
  slots: AppointmentSlot[];
}

export interface BookResultRequest {
  caseId: string;
  success: boolean;
  appointmentDate?: string;
  appointmentTime?: string;
  location?: string;
  confirmationNumber?: string;
  errorMessage?: string;
}

// Automation types
export interface AutomationProgress {
  stage: 'idle' | 'loading' | 'checking' | 'booking' | 'complete' | 'error';
  message: string;
  slotsFound?: AppointmentSlot[];
  error?: string;
}

export interface CitaPreviaDetails {
  nie: string;
  Name: string;
  nationality: number;
  documentType?: 'nie' | 'dni' | 'passport';
}
