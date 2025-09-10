export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface RefreshRequest {
  username: string;
}

export interface RefreshResponse {
  refresh_token: string;
  token_type: string;
}

export interface AuthUser {
  id: string;
  username: string;
  role: string;
  enabled: boolean;
}