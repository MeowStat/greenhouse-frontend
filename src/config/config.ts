export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const API_CONFIG = {
  apiUrl: API_BASE_URL,
  timeout: 5000,
  tokenStorageKey: 'accessToken',
}
