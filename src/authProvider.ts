import axios from 'axios'

const API_URL = 'http://localhost:3001/api/v1/auth/login'

interface LoginPayload {
  email: string
  password: string
}

export const authProvider = {
  login: async ({ email, password }: LoginPayload): Promise<void> => {
    try {
      const response = await axios.post<{ token: string }>(API_URL, {
        email,
        password,
      })
      console.log(response)

      if (response.data.token) {
        localStorage.setItem('accessToken', response.data.token)
        return Promise.resolve()
      } else {
        return Promise.reject('Invalid credentials')
      }
    } catch (error: any) {
      return Promise.reject(error.response?.data?.message || 'Login failed')
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
    const token = localStorage.getItem('authToken')
    if (!token) return Promise.reject()

    try {
      const response = await axios.get<{ id: string; email: string }>(
        'http://localhost:3001/api/v1/auth/me',
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
