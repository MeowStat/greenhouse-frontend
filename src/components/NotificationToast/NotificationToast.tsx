import React from 'react';
import {
  NotificationItem,
  ISchedulerNotification,
  IAutoNotification,
  INotification,
} from '../../services/notificationService';

interface NotificationToastProps {
  notification: NotificationItem;
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
}) => {
  // Render different notification types
  // Check for specific types first
  if (notification.type === 'Scheduler') {
    // Explicitly cast or use type guard if needed, but TS should infer here
    const schedulerNotification = notification as ISchedulerNotification;
    return (
      <div className="flex flex-col">
        <div className="font-medium">{schedulerNotification.deviceName}</div>
        <div className="text-sm">{schedulerNotification.configDescription}</div>
        <div className="text-sm">
          Thời gian: {schedulerNotification.scheduleStart} -{' '}
          {schedulerNotification.scheduleEnd}
        </div>
      </div>
    );
  } else if (notification.type === 'Auto') {
    const autoNotification = notification as IAutoNotification;
    return (
      <div className="flex flex-col">
        <div className="font-medium">{autoNotification.deviceName}</div>
        <div className="text-sm">{autoNotification.configDescription}</div>
        <div className="text-sm">
          Điều kiện: {autoNotification.conditionDescription} (
          {autoNotification.conditionOperator}{' '}
          {autoNotification.conditionThreshold})
        </div>
      </div>
    );
  } else {
    // Assume it's INotification (Data type) if not Scheduler or Auto
    // Check if it has properties expected for INotification before accessing
    const dataNotification = notification as INotification;
    if (
      dataNotification.name !== undefined &&
      dataNotification.value !== undefined
    ) {
      return (
        <div className="flex flex-col">
          <div className="font-medium">{dataNotification.name}</div>
          <div className="text-sm">{dataNotification.description}</div>
          <div className="text-sm">
            Giá trị: {dataNotification.value} {dataNotification.unit} (Ngưỡng:{' '}
            {dataNotification.lowerbound} - {dataNotification.upperbound})
          </div>
        </div>
      );
    }
  }

  // Default fallback if type is unrecognized or doesn't match expected properties
  return (
    <div className="flex flex-col">
      <div className="font-medium">Thông báo mới</div>
      <div className="text-sm">Bạn có thông báo mới</div>
    </div>
  );
};

export default NotificationToast;
