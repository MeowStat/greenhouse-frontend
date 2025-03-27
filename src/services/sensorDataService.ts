import { IResponseSensorData, IResponseSensorList, SensorVisualDataPayload } from '../types/SensorTypes'
import { api } from './apiClient'

export const sensorDataService = {
  getAllSensor: async(): Promise<IResponseSensorList> => {
    return await api.get<IResponseSensorList>('/monitor/all')
  },

  getSensorVisualData: async (params?: SensorVisualDataPayload): Promise<IResponseSensorData> => {
    return await api.get<IResponseSensorData>('/data/visualize', { ...params })
  },
}
