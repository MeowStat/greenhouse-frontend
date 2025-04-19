import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuSeparator,
} from '@headlessui/react';

import DropDownIcon from '@/assets/arrow_drop_down.svg?react';

import { authService } from '../../services/authService';
import { useEffect, useState } from 'react';
import NotificationDropdown from '../NotificationDropdown/NotificationDropdown';

function UserHeader() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    try {
      authService.logout();
      navigate('/login');
      toast.success('Đăng xuất thành công!');
    } catch (error: any) {
      toast.error(String(error));
    }
  };

  const navigateToProfile = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.documentElement.style.overflow = 'visible';
      document.documentElement.style.paddingRight = '0';
    } else {
      document.documentElement.style.overflow = '';
      document.documentElement.style.paddingRight = '';
    }

    return () => {
      // Cleanup on unmount
      document.documentElement.style.overflow = '';
      document.documentElement.style.paddingRight = '';
    };
  }, [isDropdownOpen]);

  return (
    <div className="text-right flex items-center gap-x-2 sticky">
      <NotificationDropdown />
      <Menu>
        <img
          className="h-10 mr-[-3px] cursor-pointer"
          src={`https://avatar.iran.liara.run/username?username=${localStorage.getItem('email')}`}
          onClick={navigateToProfile}
        />
        <MenuButton
          className="cursor-pointer"
          onClick={() => setIsDropdownOpen((prev: any) => !prev)}
        >
          <DropDownIcon />
        </MenuButton>
        <MenuItems
          transition
          anchor={{ to: 'bottom end', gap: 8 }}
          className="z-40 mt-2 w-auto bg-white shadow-lg rounded-md border border-gray-200 text-center cursor-pointer overflow-auto max-h-60"
          onClick={() => setIsDropdownOpen(false)}
        >
          <MenuItem>
            <a
              className="block px-6 py-2 hover:bg-green-200"
              onClick={navigateToProfile}
            >
              Hồ sơ người dùng
            </a>
          </MenuItem>
          <MenuItem>
            <a className="block px-6 py-2 hover:bg-green-200">Tùy chỉnh</a>
          </MenuItem>
          <MenuItem>
            <a className="block px-6 py-2 hover:bg-green-200">
              Kiểm tra kết nối
            </a>
          </MenuItem>
          <MenuSeparator className="my-1 h-px bg-gray-300" />
          <MenuItem>
            <Button
              className="w-full px-6 py-2 font-medium text-red-500 hover:bg-green-200 cursor-pointer"
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
}

export default UserHeader;
