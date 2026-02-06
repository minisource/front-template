import { api } from '../client';
import { BaseApi } from '../base';

/**
 * User types
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  avatar?: string;
}

/**
 * User API service
 */
class UserApi extends BaseApi {
  constructor() {
    super('/users');
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    return api.get<User>(this.url('/profile'));
  }

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<User> {
    return api.get<User>(this.url(`/${id}`));
  }

  /**
   * Get all users (admin only)
   */
  async getAll(params?: { page?: number; limit?: number }): Promise<User[]> {
    return api.get<User[]>(this.url(), params);
  }

  /**
   * Create a new user
   */
  async create(data: CreateUserDto): Promise<User> {
    return api.post<User>(this.url(), data);
  }

  /**
   * Update user
   */
  async update(id: string, data: UpdateUserDto): Promise<User> {
    return api.patch<User>(this.url(`/${id}`), data);
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<void> {
    return api.delete(this.url(`/${id}`));
  }
}

export const userApi = new UserApi();
