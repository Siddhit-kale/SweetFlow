import api from '../lib/api';

/**
 * Auth Service
 * Handles authentication API calls
 */

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * Login user and get JWT token
   */
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
};


