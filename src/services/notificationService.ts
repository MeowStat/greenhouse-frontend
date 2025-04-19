import { api } from './apiClient';

export interface INotification {
  id: number;
  date: string;
  description: string;
  lowerbound: number;
  upperbound: number;
  unit: string;
  value: number;
  name: string;
  read: boolean;
  type?: string;
}

export interface ISchedulerNotification {
  deviceName: string;
  deviceDescription: string;
  configDescription: string;
  scheduleStart: string;
  scheduleEnd: string;
  repetition: string;
  type: 'Scheduler';
}

export interface IAutoNotification {
  deviceName: string;
  deviceDescription: string;
  configDescription: string;
  conditionDescription: string;
  conditionOperator: string;
  conditionThreshold: string;
  currentValue: number;
  type: 'Auto';
}

export type NotificationItem =
  | INotification
  | ISchedulerNotification
  | IAutoNotification;

export interface INotificationResponse {
  status: boolean;
  totalOfRecord: number;
  data: INotification[];
}

export interface IPollResponse {
  status: boolean;
  data: NotificationItem[];
}

export const notificationService = {
  getAllNotifications: async (
    page: number = 1,
    pageSize: number = 20
  ): Promise<INotificationResponse> => {
    return await api.get<INotificationResponse>(
      `/notification/all?page=${page}&pageSize=${pageSize}`
    );
  },

  markAsRead: async (notificationId: number): Promise<any> => {
    return await api.patch(`/notification/read/${notificationId}`);
  },

  markAllAsRead: async (): Promise<any> => {
    return await api.patch('/notification/read-all');
  },

  pollNotifications: async (): Promise<IPollResponse> => {
    return await api.get<IPollResponse>('/notification/poll');
  },
};
