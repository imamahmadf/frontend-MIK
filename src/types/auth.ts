export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
