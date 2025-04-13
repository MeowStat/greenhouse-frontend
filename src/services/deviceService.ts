import { api } from './apiClient';

export interface IDeviceServiceApiResponse<TData> {
  status: boolean;
  data: TData;
}

export type IDevice = IDeviceServiceApiResponse<
  {
    id: string;
    name: string;
    feed: string;
    prefixMessage: string;
    description: string;
    power: number;
    status: boolean;
  }[]
>;

export const deviceService = {
  getAllDevice: async (): Promise<IDevice> => {
    return await api.get<IDevice>('/device');
  },
};

export interface DeviceHistoryItem {
  info: string;
  date: string;
  deviceId: string;
}

export interface DeviceHistoryResponse {
  status: boolean;
  totalOfRecord: number;
  data: DeviceHistoryItem[];
}

export interface DeviceHistoryParams {
  page: number;
  pageSize: number;
  deviceId?: string;
  startDate?: string;
  endDate?: string;
  typeAction?: string;
}

export const deviceHistoryService = {
  getDeviceHistory: async (
    params: DeviceHistoryParams
  ): Promise<DeviceHistoryResponse> => {
    return await api.get<DeviceHistoryResponse>('/data/device/history', params);
  },
};
