interface ISensorServiceApiResponse<TData> {
  status: boolean
  data: TData
}

export interface SensorVisualDataPayload {
  feed: string
  page?: number
  pageSize?: number
  startDate?: string
  endDate?: string
}

export interface ISensor {
  id: string
  name: string
  description: string
  unit: string
  upperbound: number
  lowerbound: number
  feed: string
  warning: boolean
  alertDes?: string
  alertupperbound?: number
  alertlowerbound?: number
  email: boolean
  delete: boolean
}

export interface ISensorData {
  value: number
  date: Date
}

export interface IResponseSensorList extends ISensorServiceApiResponse<ISensor[]>{}

export interface IResponseSensorData extends ISensorServiceApiResponse<ISensorData[]>{}

export interface ISensorVisualData extends ISensor, ISensorData {}
