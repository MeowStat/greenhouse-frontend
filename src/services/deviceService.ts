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
  IPayloadCreateAutoCondition,
  IPayloadCreateDevice,
  IResponseDevice,
  IDeviceServiceApiResponse,
} from '../types/DeviceTypes';
import { api } from './apiClient';

export const deviceService = {
  getAllDevice: async (): Promise<IDeviceList> => {
    return await api.get<IDeviceList>('/device');
  },

  getDeviceById: async (deviceId: string | number): Promise<IResponseDeviveInfo> => {
    return await api.get<IResponseDeviveInfo>(`/device/${deviceId}`);
  },

  getDeviceConfig: async (deviceId: string | number): Promise<IResponseDeviceConfig> => {
    return await api.get<IResponseDeviceConfig>(`/device/config/${deviceId}`);
  },

  turnOnOffDevice: async (
    deviceId: string | number,
    status: boolean
  ): Promise<IResponseTurnOnOffDevice> => {
    return await api.patch<IResponseTurnOnOffDevice>(
      `/device/turn/${deviceId}`,
      { status }
    );
  },

  updateDeviceInfo: async (
    deviceId: string | number,
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

  createDevice: async (payload: IPayloadCreateDevice): Promise<IResponseDevice> => {
    return await api.post<IResponseDevice>('/device',payload)
  },

  deleteDevice: async (deviceId: string | number): Promise<IDeviceServiceApiResponse<null>> => {
    return await api.delete<IDeviceServiceApiResponse<null>>(`/device/${deviceId}`);
  },

  createDeviceConfig: async (payload: IPayloadCreateConfig): Promise<IResponseCreateDeviceConfig> => {
    return await api.post<IResponseCreateDeviceConfig>(`/device/config`,payload);
  },

  createDeviceSchedulerConfig: async (payload: IPayloadCreateUpdateSchedulerConfig): Promise<IResponseCreateDeviceConfig> => {
    return await api.post<IResponseCreateDeviceConfig>(`/device/config/scheduler`,payload);
  },

  createDeviceAutoConfig: async (configId: number | string): Promise<IResponseCreateDeviceConfig> => {
    return await api.post<IResponseCreateDeviceConfig>(`/device/config/automation`,{configId});
  },

  createDeviceAutoCondition: async (payload: IPayloadCreateAutoCondition): Promise<IResponseCreateDeviceConfig> => {
    return await api.post<IResponseCreateDeviceConfig>(`/device/config/automation/condition`,payload);
  },

  updateDeviceConfig: async (configId: string | number, payload: IPayloadUpdateConfig): Promise<IResponseCreateDeviceConfig> => {
    return await api.patch<IResponseCreateDeviceConfig>(`/device/config/${configId}`,payload);
  },

  deleteDeviceAutoCondition: async (conditionId: string | number): Promise<IResponseCreateDeviceConfig> => {
    return await api.delete<IResponseCreateDeviceConfig>(`/device/config/automation/condition/${conditionId}`);
  },

  updateDeviceAutoCondition: async (conditionId: string | number, payload: IPayloadCreateAutoCondition): Promise<IResponseCreateDeviceConfig> => {
    return await api.patch<IResponseCreateDeviceConfig>(`/device/config/automation/condition/${conditionId}`, payload);
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
    if (params.deviceName) queryParams.append('deviceName', params.deviceName);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.typeAction) queryParams.append('typeAction', params.typeAction);

    const query = queryParams.toString();
    const url = `/data/device/history${query ? `?${query}` : ''}`;

    return await api.get<DeviceHistoryResponse>(url);
  },
};
