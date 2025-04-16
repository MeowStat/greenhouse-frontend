import {
  // DeviceHistoryItem,
  DeviceHistoryQueryParams,
  DeviceHistoryResponse,
  IDevice,
  IDeviceList,
  IDeviceUpdatePayload,
  IResponseDeviceConfig,
  IResponseDeviveInfo,
  IResponseTurnOnOffDevice, IResponseTurnDeviceConfig, IResponseDeleteDeviceConfig, IPayloadCreateConfig, IResponseCreateDeviceConfig, IPayloadCreateUpdateSchedulerConfig,
  IPayloadUpdateConfig,
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

  turnOnOffDeviceConfig: async (
    configId: string | number,
    action: boolean
  ): Promise<IResponseTurnDeviceConfig> => {
    return await api.patch<IResponseTurnDeviceConfig>(`/device/config/turn/${configId}`, { action });
  },

  deleteDeviceConfig: async (configId: string | number): Promise<IResponseDeleteDeviceConfig> => {
    return await api.delete<IResponseDeleteDeviceConfig>(`/device/config/${configId}`);
  },

  createDeviceConfig: async (payload: IPayloadCreateConfig): Promise<IResponseCreateDeviceConfig> => {
    return await api.post<IResponseCreateDeviceConfig>(`/device/config`,payload);
  },

  createDeviceSchedulerConfig: async (payload: IPayloadCreateUpdateSchedulerConfig): Promise<IResponseCreateDeviceConfig> => {
    return await api.post<IResponseCreateDeviceConfig>(`/device/config/scheduler`,payload);
  },

  updateDeviceConfig: async (configId: string | number, payload: IPayloadUpdateConfig): Promise<IResponseCreateDeviceConfig> => {
    return await api.patch<IResponseCreateDeviceConfig>(`/device/config/${configId}`,payload);
  },

  updateDeviceSchedulerConfig: async (configId: string | number, payload: IPayloadCreateUpdateSchedulerConfig): Promise<IResponseCreateDeviceConfig> => {
    return await api.patch<IResponseCreateDeviceConfig>(`/device/config/scheduler/${configId}`,payload);
  }
}

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
