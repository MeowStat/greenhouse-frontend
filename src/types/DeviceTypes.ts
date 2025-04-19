export interface IDeviceServiceApiResponse<TData> {
  status: boolean;
  message?: string;
  data: TData;
}

export type IDeviceList = IDeviceServiceApiResponse<IDevice[]>;

export interface IDevice {
  id: string;
  name: string;
  feed: string;
  prefixMessage: string;
  description: string;
  power: number;
  status: boolean;
  type: number;
}

export interface IDeviceConfig {
  id: number;
  name: string;
  feed: string;
  description: string;
  action: boolean;
  deviceId: string;
  defaultPower?: number;
  changePower?: number;
  schedulerConfig: {
    id: string;
    start: string;
    end: string;
    repitation: string[];
  };
  automationConfig: {
    id: number;
    Condition: [
      {
        id: number;
        sensorId: string;
        condition: string;
        threshold: string;
        description: string;
        automationConfigId: number;
      },
    ];
  };
}

// export interface IDeviceConfig {

//   };
// }

export interface IDeviceUpdatePayload {
  name?: string;
  feed?: string;
  description?: string;
  power?: number;
  status?: boolean;
}

export interface IResponseDeviveInfo
  extends IDeviceServiceApiResponse<IDevice> {}

export interface IPayloadCreateConfig {
  name?: string;
  deviceId?: string | number;
  description?: string;
  changePower?: number;
}

export interface IPayloadUpdateConfig {
  name?: string;
  description?: string;
  changePower?: number;
}

export interface IPayloadCreateUpdateSchedulerConfig {
  configId?: number | string;
  start: string;
  end: string;
  repetition: string[];
}

export interface IResponseDeviveInfo
  extends IDeviceServiceApiResponse<IDevice> {}

export interface IResponseDeviceConfig
  extends IDeviceServiceApiResponse<IDeviceConfig[]> {}

export interface IResponseTurnOnOffDevice
  extends IDeviceServiceApiResponse<IDevice> {}

export interface DeviceHistoryItem {
  id: string;
  deviceId: string;
  date: string;
  info: string;
  typeAction: 'Auto' | 'Scheduler' | 'Manual';
  device: {
    name: string;
  };
}

export interface DeviceHistoryResponse {
  data: DeviceHistoryItem[];
  totalOfRecord: number;
}

export interface DeviceHistoryQueryParams {
  page?: number;
  pageSize?: number;
  deviceId?: string;
  startDate?: string;
  endDate?: string;
  typeAction?: string;
}
// extends IDeviceServiceApiResponse<IDevice> {}

export interface IResponseTurnDeviceConfig
  extends IDeviceServiceApiResponse<IDeviceConfig> {}

export interface IResponseDeleteDeviceConfig
  extends IDeviceServiceApiResponse<IDeviceConfig> {}

export interface IResponseCreateDeviceConfig
  extends IDeviceServiceApiResponse<IDeviceConfig> {}
