import { API_CONFIG } from '../config/config';

import { apiClient } from './apiClient';

interface LoginPayload {
  username: string;
  password: string;
}

export interface UserInfoResponse {
  id: number;
  email: string;
  name: string;
  receiveNotification: boolean;
}

export const authService = {
  login: async ({ username, password }: LoginPayload) => {
    try {
      const response = await apiClient.post('/user/login', {
        username,
        password,
      });

      if (response.data.data) {
        localStorage.setItem(
          API_CONFIG.tokenStorageKey,
          response.data.data.token
        );
        localStorage.setItem('username', response.data.data.username);
        localStorage.setItem('email', response.data.data.email);

        // Store user ID if available
        if (response.data.data.id) {
          localStorage.setItem('userId', response.data.data.id.toString());
        }

        return response.data.data;
      }
      throw new Error('Invalid credentials');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  logout: (): Promise<void> => {
    localStorage.removeItem(API_CONFIG.tokenStorageKey);
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    return Promise.resolve();
  },

  getIdentity: async (): Promise<{ id: string; email: string } | undefined> => {
    const token = localStorage.getItem(API_CONFIG.tokenStorageKey);
    if (!token) return Promise.reject();

    try {
      const response = await apiClient.get<{ id: string; email: string }>(
        '/auth/me'
      );
      return response.data;
    } catch {
      return Promise.reject();
    }
  },

  getUserInfo: async (): Promise<UserInfoResponse> => {
    try {
      const response = await apiClient.get<{
        statusCode: boolean;
        data: UserInfoResponse;
        message: string;
      }>('/user/info');

      if (!response.data || !response.data.data) {
        throw new Error('Failed to fetch user info');
      }

      // Store user ID if it wasn't stored yet
      if (response.data.data.id) {
        localStorage.setItem('userId', response.data.data.id.toString());
      }

      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      throw error;
    }
  },

  updateUserNotification: async (
    receiveNotification: boolean
  ): Promise<boolean> => {
    try {
      const response = await apiClient.patch<{
        status: boolean;
        message: string;
      }>(`/user/notification`, { value: receiveNotification });

      return response.data.status === true;
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      throw error;
    }
  },

  checkError: (error: any): Promise<void> => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem(API_CONFIG.tokenStorageKey);
      return Promise.reject();
    }
    return Promise.resolve();
  },
};
