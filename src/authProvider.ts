import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL; 

interface LoginPayload {
  email: string
  password: string
}

export const authProvider = {
  login: async ({ email, password }: LoginPayload): Promise<{ token: string }>  => {
    try {
      const response = await axios.post<{ token: string }>(`${API_URL}/auth/login`, {
        email,
        password,
      })

      if (response.data.token) {
        localStorage.setItem('accessToken', response.data.token)
        return { token: response.data.token }
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  logout: (): Promise<void> => {
    localStorage.clear()
    return Promise.resolve()
  },

  check: (): Promise<void> => {
    return localStorage.getItem('accessToken')
      ? Promise.resolve()
      : Promise.reject()
  },

  getIdentity: async (): Promise<{ id: string; email: string } | undefined> => {
    const token = localStorage.getItem('accessToken')
    if (!token) return Promise.reject()

    try {
      const response = await axios.get<{ id: string; email: string }>(
        `${API_URL}/auth/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      return Promise.resolve(response.data)
    } catch {
      return Promise.reject()
    }
  },

  checkError: (error: any): Promise<void> => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('authToken')
      return Promise.reject()
    }
    return Promise.resolve()
  },
}
