import { api } from '../client';
import { BaseApi } from '../base';

/**
 * Auth types
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

/**
 * Auth API service
 */
class AuthApi extends BaseApi {
  constructor() {
    super('/auth');
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return api.post<AuthResponse>(this.url('/login'), credentials);
  }

  /**
   * Register a new user
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return api.post<AuthResponse>(this.url('/register'), credentials);
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    return api.post(this.url('/logout'));
  }

  /**
   * Refresh tokens
   */
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    return api.post<AuthTokens>(this.url('/refresh'), { refreshToken });
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<void> {
    return api.post(this.url('/forgot-password'), { email });
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<void> {
    return api.post(this.url('/reset-password'), { token, password });
  }
}

export const authApi = new AuthApi();
