import { IMonitorCreatePayload, IResponseApiPost, IResponseFeedList, IResponseSensorData, IResponseSensorList, SensorVisualDataPayload } from '../types/SensorTypes'
import { api } from './apiClient'

export const sensorDataService = {
  getAllSensor: async(): Promise<IResponseSensorList> => {
    return await api.get<IResponseSensorList>('/monitor/all')
  },

  getSensorVisualData: async (params?: SensorVisualDataPayload): Promise<IResponseSensorData> => {
    return await api.get<IResponseSensorData>('/data/visualize', { ...params })
  },

  getAllFeed: async (): Promise<IResponseFeedList> => {
    return await api.get<IResponseFeedList>('/monitor/feed/all')
  },

  createNewMonitor: async (data: IMonitorCreatePayload): Promise<IResponseApiPost> => {
    return await api.post<IResponseApiPost>('/monitor', data)
  },

  updateMonitor: async (id: string, data: IMonitorCreatePayload): Promise<IResponseApiPost> => {
    return await api.patch<IResponseApiPost>(`/monitor/${id}`, data)
  },

  deleteMonitor: async (id: string): Promise<IResponseApiPost> => {
    return await api.delete<IResponseApiPost>(`/monitor/${id}`)
  }
}
