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
}

export interface INotificationResponse {
  status: boolean;
  totalOfRecord: number;
  data: INotification[];
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
};
