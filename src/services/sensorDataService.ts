import { apiClient } from './apiClient'

interface SensorVisualDataPayload {
  subject: string
  page?: number
  pageSize?: number
}

export const sensorDataService = {
  getAllSensor: async () => {
    try {
      const response = await apiClient.get('/monitor/all')
      return response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to get all sensor',
      )
    }
  },

  getSensorVisualData: async ({
    subject,
    page,
    pageSize,
  }: SensorVisualDataPayload) => {
    try {
      const response = await apiClient.get('/data/visualize', {
        params: { subject, page, pageSize },
      })
      return response.data.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to get sensor data',
      )
    }
  },
}
