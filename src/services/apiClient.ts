import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

import { API_CONFIG } from '../config/config'

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem(API_CONFIG.tokenStorageKey)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
)

export const api = {
  get: async <T>(url: string, params?: Record<string, any>): Promise<T> => {
    try {
      const response = await apiClient.get<T>(url, {params})
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch data')
    }
  },

  post: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.post<T>(url, data)
    return response.data
  },

  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await apiClient.put<T>(url, data)
    return response.data
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await apiClient.delete<T>(url)
    return response.data
  },
}
