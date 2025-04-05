import { api } from './apiClient'

export interface IDeviceServiceApiResponse<TData> {
  status: boolean
  data: TData
}

export type IDevice = IDeviceServiceApiResponse<
  {
    id: string
    name: string
    feed: string
    prefixMessage: string
    description: string
    power: number
    status: boolean
  }[]
>

export const deviceService = {
  getAllDevice: async (): Promise<IDevice> => {
    return await api.get<IDevice>('/device')
  },
}
