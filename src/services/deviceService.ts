import {
  DeviceHistoryItem,
  DeviceHistoryQueryParams,
  DeviceHistoryResponse,
  IDevice,
  IDeviceList,
  IDeviceUpdatePayload,
  IResponseDeviceConfig,
  IResponseDeviveInfo,
  IResponseTurnOnOffDevice,
} from '../types/DeviceTypes';
import { api } from './apiClient';

export const deviceService = {
  getAllDevice: async (): Promise<IDeviceList> => {
    return await api.get<IDeviceList>('/device');
  },

  getDeviceById: async (deviceId: string): Promise<IResponseDeviveInfo> => {
    return await api.get<IResponseDeviveInfo>(`/device/${deviceId}`);
  },

  getDeviceConfig: async (deviceId: string): Promise<IResponseDeviceConfig> => {
    return await api.get<IResponseDeviceConfig>(`/device/config/${deviceId}`);
  },

  turnOnOffDevice: async (
    deviceId: string,
    status: boolean
  ): Promise<IResponseTurnOnOffDevice> => {
    return await api.patch<IResponseTurnOnOffDevice>(
      `/device/turn/${deviceId}`,
      { status }
    );
  },

  updateDeviceInfo: async (
    deviceId: string,
    data: IDeviceUpdatePayload
  ): Promise<IDevice> => {
    return await api.patch<IDevice>(`/device/${deviceId}`, data);
  },
};

export const deviceHistoryService = {
  getDeviceHistory: async (
    params: DeviceHistoryQueryParams
  ): Promise<DeviceHistoryResponse> => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize)
      queryParams.append('pageSize', params.pageSize.toString());
    if (params.deviceId) queryParams.append('deviceId', params.deviceId);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.typeAction) queryParams.append('typeAction', params.typeAction);

    const query = queryParams.toString();
    const url = `/data/device/history${query ? `?${query}` : ''}`;

    return await api.get<DeviceHistoryResponse>(url);
  },
};
