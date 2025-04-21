import { useEffect, useState, useCallback, useRef } from 'react';
import { Menu, MenuButton, MenuItems } from '@headlessui/react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Check } from 'lucide-react';

import NotiIcon from '@/assets/notification.svg?react';
import {
  type INotification,
  // type NotificationItem,
  notificationService,
} from '../../services/notificationService';
import ToastMessage from '../ToastNotification/ToastMessage';
import NotificationToast from '../NotificationToast/NotificationToast';

function NotificationDropdown() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const pollingIntervalRef = useRef<number | null>(null);
  const [markingAsRead, setMarkingAsRead] = useState<number[]>([]);

  const fetchNotifications = useCallback(
    async (currentPage = 1) => {
      try {
        setLoading(true);
        const response = await notificationService.getAllNotifications(
          currentPage,
          pageSize
        );

        if (response && response.data) {
          if (currentPage === 1) {
            setNotifications(response.data);
          } else {
            setNotifications((prev) => [...prev, ...response.data]);
          }

          // Set total count from the API response
          setTotalCount(response.totalOfRecord || 0);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        toast.error(
          <ToastMessage
            mainMessage="Lỗi"
            description="Không thể tải thông báo"
          />
        );
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    // If already marked as read or in process of marking, do nothing
    if (
      notifications.find((n) => n.id === notificationId)?.read ||
      markingAsRead.includes(notificationId)
    ) {
      return;
    }

    try {
      // Add to marking as read array to show animation
      setMarkingAsRead((prev) => [...prev, notificationId]);

      // Use the PATCH /notification/status/{id} endpoint with value: true
      await notificationService.markAsRead(notificationId);

      // Update the notification to mark it as read in the UI
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      toast.error(
        <ToastMessage
          mainMessage="Lỗi"
          description="Không thể đánh dấu đã đọc"
        />
      );
    } finally {
      // Remove from marking as read array
      setMarkingAsRead((prev) => prev.filter((id) => id !== notificationId));
    }
  };

  // Poll for new notifications every 5 seconds
  const pollForNotifications = useCallback(async () => {
    try {
      const response = await notificationService.pollNotifications();

      if (response.status && response.data && response.data.length > 0) {
        // Show toast notifications for new notifications
        response.data.forEach((notification) => {
          toast.success(<NotificationToast notification={notification} />, {
            duration: 5000,
            position: 'top-right',
          });
        });

        // Refresh the notification list to include the new notifications
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error polling for notifications:', error);
    }
  }, [fetchNotifications]);

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Set up polling interval
    pollingIntervalRef.current = window.setInterval(pollForNotifications, 5000);

    // Clean up interval on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [fetchNotifications, pollForNotifications]);

  // Count unread notifications
  const unreadCount =
    notifications?.filter((notification) => !notification.read)?.length || 0;

  return (
    <Menu>
      <div className="relative">
        <MenuButton className="flex">
          <NotiIcon className="block h-6.5 cursor-pointer hover:fill-green-800 transition-colors duration-200" />
          <div>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        </MenuButton>
      </div>
      <MenuItems
        transition
        anchor={{ to: 'bottom end', gap: 8 }}
        className="z-40 mt-2 w-72 bg-white shadow-lg rounded-md border border-gray-200 text-left cursor-pointer"
      >
        {/* Fixed height container with scrolling */}
        <div
          className="max-h-[240px] overflow-y-auto"
          style={{ maxHeight: '240px' }}
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            // If we're near the bottom and not already loading and have more to load
            if (
              target.scrollHeight - target.scrollTop - target.clientHeight <
                50 &&
              !loading &&
              notifications.length < totalCount
            ) {
              handleLoadMore();
            }
          }}
        >
          {!notifications || notifications.length === 0 ? (
            <div className="px-3 py-2 text-center text-gray-500 text-sm">
              Không có thông báo
            </div>
          ) : (
            <>
              {notifications?.map((notification) => {
                const isMarking = markingAsRead.includes(notification.id);
                const isRead = notification.read;

                return (
                  <div
                    key={notification.id}
                    className={`relative border-b border-gray-100 px-3 py-2 hover:bg-green-50 transition-all duration-300 
                      ${isRead ? 'bg-white' : 'bg-green-50'} 
                      ${isMarking ? 'opacity-70' : 'opacity-100'}`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    {isMarking && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-5 z-10">
                        <div className="h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}

                    <div className="flex justify-between items-start">
                      <div className="font-medium text-sm">
                        {notification.name}
                      </div>
                      {isRead && (
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0 ml-1" />
                      )}
                    </div>

                    <div className="text-xs text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
                      {notification.description} • {notification.value}{' '}
                      {notification.unit}
                    </div>
                    <div className="text-xs text-gray-400">
                      {format(new Date(notification.date), 'dd/MM/yyyy HH:mm')}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="px-3 py-2 text-center text-gray-500 text-sm border-t border-gray-100">
            Đang tải...
          </div>
        )}
      </MenuItems>
    </Menu>
  );
}

export default NotificationDropdown;
