interface ISensorServiceApiResponse<TData> {
  status: boolean;
  data: TData;
}

export interface SensorVisualDataPayload {
  id: string | number;
  page?: number;
  pageSize?: number;
  startDate?: string;
  endDate?: string;
}

export interface IMonitorCreatePayload {
  name: string;
  feed: string;
  upperbound: number;
  lowerbound: number;
  unit: string;
  description: string;
}

export interface IAlertConfig {
  alertDes: string;
  alertUpperbound: number;
  alertLowerbound: number;
  status: boolean;
  email: boolean;
}

export interface IResponseApiPost {
  status: boolean;
  message: string;
}

export interface ISensor {
  id: string;
  name: string;
  description: string;
  unit: string;
  upperbound: number;
  lowerbound: number;
  feed: string;
  warning: boolean;
  alertDes?: string;
  alertupperbound?: number;
  alertlowerbound?: number;
  email: boolean;
  delete: boolean;
}

export interface ISensorData {
  value: number;
  date: Date;
}

export interface IResponseSensorList
  extends ISensorServiceApiResponse<ISensor[]> {}

export interface IResponseSensorData
  extends ISensorServiceApiResponse<ISensorData[]> {}

export interface ISensorVisualData extends ISensor, ISensorData {}

export interface IResponseFeedList
  extends ISensorServiceApiResponse<string[]> {}
