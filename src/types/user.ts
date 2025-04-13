//front-new\src\types\user.ts

export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  email: string;
  userName: string;
  cognitoId?: string;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  userName: string;
  password: string;
}

export interface ConfirmEmailCredentials {
  email: string;
  code: string;
}

export interface AuthResponse {
  access_token: string;
  id_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    userName: string;
    role: Role;
  };
}