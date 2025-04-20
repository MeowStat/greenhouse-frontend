import { NavLink } from 'react-router-dom';
import { Bell, Smile } from 'lucide-react';

const navItems = [
  { to: '/trang-chu', label: 'Trang chủ' },
  { to: '/dieu-khien', label: 'Điều khiển' },
  { to: '/du-lieu-quan-trac', label: 'Dữ liệu quan trắc' },
  { to: '/lich-su-hoat-dong', label: 'Lịch sử hoạt động' },
];

export const Header: React.FC = () => {
  return (
    <header className="bg-[#FFFBEB] w-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 max-w-screen-xl mx-auto">
        <div className="text-4xl font-black text-green-800 tracking-tight">
          smart<span className="text-green-900">Garden</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-full hover:bg-[#f5f5f5] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="text-black w-5 h-5" />
          </button>
          <div className="bg-[#58D3C6] text-white rounded-full p-2">
            <Smile className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="bg-[#1B5E20] w-full">
        <div className="flex justify-center space-x-6 text-white font-medium text-[16px] max-w-screen-xl mx-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-3 rounded-t-md transition-all duration-200 text-center ${
                  isActive
                    ? 'bg-[#FFF9C4] text-green-900 font-semibold'
                    : 'hover:opacity-90'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
};
