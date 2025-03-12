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
