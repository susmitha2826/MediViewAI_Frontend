export interface User {
  id: string;
  name: string;
  email: string;
  dob: string;
  createdAt: string;
  history?: any[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface RegisterRequest {
  name: string;
  dob: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}