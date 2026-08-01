// User types
export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Automation types
export interface CitaPreviaDetails {
  nie: string;
  Name: string;
  nationality: number;
  documentType?: 'nie' | 'dni' | 'passport';
}
