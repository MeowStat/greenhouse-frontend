export interface IDeviceServiceApiResponse<TData> {
    status: boolean;
    message?: string;
    data: TData;
}

export type IDeviceList = IDeviceServiceApiResponse<
IDevice[]
>;

export interface IDevice {
    id: string;
    name: string;
    feed: string;
    prefixMessage: string;
    description: string;
    power: number;
    status: boolean;
}

export interface IDeviceConfig {
id: number;
name: string;
feed: string;
description: string;
action: boolean;
deviceId: string;
schedulerConfig: {
    id: string;
    start: string;
    end: string;
    repitation: string;
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

export interface IDeviceUpdatePayload {
    name?: string;
    feed?: string;
    description?: string;
    power?: number;
    status?: boolean;
}

export interface IResponseDeviveInfo extends IDeviceServiceApiResponse<IDevice> {}

export interface IResponseDeviceConfig
extends IDeviceServiceApiResponse<IDeviceConfig[]> {}

export interface IResponseTurnOnOffDevice
extends IDeviceServiceApiResponse<IDevice> {}