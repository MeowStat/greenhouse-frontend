'use client';

import { useEffect, useState } from 'react';
import {
  User,
  Mail,
  Eye,
  EyeOff,
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
    <div className="flex items-center justify-center bg-gray-50 max-w-4xl mx-auto px-4 py-6">
      <Card className="w-full max-w-3xl overflow-hidden border-0 shadow rounded-xl">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Left: Avatar */}
            <div className="flex items-center justify-center p-6 bg-[#e6e0ff] md:w-2/5">
              <div className="w-32 h-32 border-4 border-white rounded-md overflow-hidden bg-[#4f3d97] flex items-center justify-center">
                <UserCircle className="w-20 h-20 text-white" />
              </div>
            </div>

            {/* Right: Info */}
            <div className="p-6 md:p-8 md:w-3/5">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Thông tin tài khoản
              </h1>

              <div className="space-y-6">
                {/* Username */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-[#4f3d97]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tên người dùng</p>
                    <p className="text-lg font-medium">
                      {hideInfo ? '••••••••' : userData.name}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-[#4f3d97]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg font-medium">
                      {hideInfo ? '••••••••' : userData.email}
                    </p>
                  </div>
                </div>

                {/* Notifications */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-[#4f3d97]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nhận thông báo</p>
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

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 mt-8">
                <Button
                  className="bg-[#6baa7f] hover:bg-[#5a9a6e] text-white px-4 py-3 h-auto text-sm font-medium"
                  onClick={toggleInfoVisibility}
                >
                  {hideInfo ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
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
