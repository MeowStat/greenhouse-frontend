import { useEffect, useState, useCallback } from 'react';
import { Menu, MenuButton, MenuItems } from '@headlessui/react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

import NotiIcon from '@/assets/notification.svg?react';
import {
  type INotification,
  notificationService,
} from '../../services/notificationService';
import ToastMessage from '../ToastNotification/ToastMessage';

function NotificationDropdown() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;

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
    try {
      await notificationService.markAsRead(notificationId);
      // Update the notification to mark it as read
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
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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
              {notifications?.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-b border-gray-100 px-3 py-2 hover:bg-green-50 ${!notification.read ? 'bg-green-50' : ''}`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="font-medium text-sm">{notification.name}</div>
                  <div className="text-xs text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
                    {notification.description} • {notification.value}{' '}
                    {notification.unit}
                  </div>
                  <div className="text-xs text-gray-400">
                    {format(new Date(notification.date), 'dd/MM/yyyy HH:mm')}
                  </div>
                </div>
              ))}
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
