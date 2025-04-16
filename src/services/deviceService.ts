import { IDevice, IDeviceList, IDeviceUpdatePayload, IResponseDeviceConfig, IResponseDeviveInfo, IResponseTurnOnOffDevice, IResponseTurnDeviceConfig, IResponseDeleteDeviceConfig, IPayloadCreateConfig, IResponseCreateDeviceConfig, IPayloadCreateUpdateSchedulerConfig } from '../types/DeviceTypes';
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
    return await api.patch<IResponseTurnOnOffDevice>(`/device/turn/${deviceId}`, { status });
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
};
