'use client';

import { useEffect, useState } from 'react';
import {
  User,
  Mail,
  // Key,
  Eye,
  EyeOff,
  Edit,
  UserCircle,
  Bell,
} from 'lucide-react';
import { Card, CardContent } from '../../components/UI/card';
import { Button } from '../../components/UI/button';
import { authService } from '../../services/authService';
import ToggleSwitch from '../../components/UI/ToggleSwitch';
import toast from 'react-hot-toast';

interface UserProfileData {
  id: number;
  name: string;
  email: string;
  receiveNotification: boolean;
}

export default function UserProfile() {
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hideInfo, setHideInfo] = useState(false);
  const [updatingNotification, setUpdatingNotification] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await authService.getUserInfo();
        setUserData(data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Không thể tải thông tin người dùng.');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const toggleInfoVisibility = () => {
    setHideInfo(!hideInfo);
  };

  const toggleNotificationSetting = async (value: boolean) => {
    if (!userData) return;

    setUpdatingNotification(true);
    try {
      // Call the API to update the user's notification settings
      const success = await authService.updateUserNotification(value);

      if (success) {
        // Update the user data locally
        setUserData((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            receiveNotification: value,
          };
        });

        toast.success(`Đã ${value ? 'bật' : 'tắt'} nhận thông báo`);
      } else {
        toast.error('Không thể cập nhật cài đặt thông báo.');
      }
    } catch (err) {
      console.error('Failed to update notification setting:', err);
      toast.error('Không thể cập nhật cài đặt thông báo.');
    } finally {
      setUpdatingNotification(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-gray-500">Đang tải thông tin...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-gray-500">
          Không có thông tin người dùng.
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-w-screen bg-gray-50 max-w-7xl mx-auto min-h-screen">
      <Card className="w-full max-w-4xl overflow-hidden border-0 shadow-lg rounded-2xl">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="flex items-center justify-center p-8 md:p-0 bg-[#e6e0ff] md:w-2/5 relative">
              <div className="w-full h-full flex items-center justify-center py-16">
                <div className="relative">
                  <div className="w-48 h-48 border-[6px] border-white rounded-md overflow-hidden bg-[#4f3d97] flex items-center justify-center">
                    <UserCircle className="w-32 h-32 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12 md:w-3/5">
              <h1 className="text-3xl font-bold text-gray-800 mb-10">
                Thông tin tài khoản
              </h1>

              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                    <User className="w-5 h-5 text-[#4f3d97]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Tên người dùng
                    </p>
                    <p className="text-xl font-semibold">
                      {hideInfo ? '••••••••' : userData.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                    <Mail className="w-5 h-5 text-[#4f3d97]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-xl font-semibold">
                      {hideInfo ? '••••••••' : userData.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                    <Bell className="w-5 h-5 text-[#4f3d97]" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-500">
                      Nhận thông báo
                    </p>
                    <div className="mt-1">
                      <ToggleSwitch
                        checked={userData.receiveNotification}
                        onChange={toggleNotificationSetting}
                        enableText="Bật"
                        disableText="Tắt"
                        disabled={updatingNotification}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-12">
                <Button className="bg-[#6baa7f] hover:bg-[#5a9a6e] text-white border-0 rounded-md px-6 py-5 h-auto font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md">
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
                <Button
                  className="bg-[#6baa7f] hover:bg-[#5a9a6e] text-white border-0 rounded-md px-6 py-5 h-auto font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md"
                  onClick={toggleInfoVisibility}
                >
                  {hideInfo ? (
                    <Eye className="w-4 h-4 mr-2" />
                  ) : (
                    <EyeOff className="w-4 h-4 mr-2" />
                  )}
                  {hideInfo ? 'Hiện thông tin' : 'Ẩn thông tin'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
