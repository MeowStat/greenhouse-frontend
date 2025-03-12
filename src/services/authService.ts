import { API_CONFIG } from '../config/config'
import { apiClient } from './apiClient'

interface LoginPayload {
  username: string
  password: string
}

export const authService = {
  login: async ({ username, password }: LoginPayload) => {
    try {
      const response = await apiClient.post('/user/login', {
        username,
        password,
      })
      if (response.data.data) {
        localStorage.setItem(
          API_CONFIG.tokenStorageKey,
          response.data.data.username,
        )
        localStorage.setItem('username', response.data.data.username)
        localStorage.setItem('email', response.data.data.email)
        return response.data.data
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  logout: (): Promise<void> => {
    localStorage.removeItem('accessToken')
    return Promise.resolve()
  },

  getIdentity: async (): Promise<{ id: string; email: string } | undefined> => {
    const token = localStorage.getItem('accessToken')
    if (!token) return Promise.reject()

    try {
      const response = await apiClient.get<{ id: string; email: string }>(
        '/auth/me',
      )
      return response.data
    } catch {
      return Promise.reject()
    }
  },

  checkError: (error: any): Promise<void> => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem(API_CONFIG.tokenStorageKey)
      return Promise.reject()
    }
    return Promise.resolve()
  },
}
