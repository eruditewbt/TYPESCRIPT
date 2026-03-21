export interface User {
  id: string;
  email: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthSuccess {
  token: string;
  user: User;
}

export interface ErrorResponse {
  message: string;
}
