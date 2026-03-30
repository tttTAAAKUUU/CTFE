export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  userName: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}
