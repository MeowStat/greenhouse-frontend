import { NavLink, useLocation } from 'react-router-dom';
import UserHeader from '../../components/UserHeader/UserHeader';

const navItems = [
  { to: '/trang-chu', label: 'Trang chủ' },
  { to: '/dieu-khien', label: 'Điều khiển' },
  { to: '/du-lieu-quan-trac', label: 'Dữ liệu quan trắc' },
  { to: '/lich-su-hoat-dong', label: 'Lịch sử hoạt động' },
];

export const Header: React.FC = () => {
  const location = useLocation();

  return (
    <div className="bg-[#FFF9C4] w-full shadow-md">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 max-w-screen-xl mx-auto">
        <div className="text-4xl font-black text-green-800 tracking-tight">
          smart<span className="text-green-900">Garden</span>
        </div>

        <div className="flex items-center gap-4">
          <UserHeader />
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="bg-green-800 w-full shadow-sm">
  <div className="flex justify-center text-white font-medium text-[16px] max-w-screen-xl mx-auto">
  {navItems.map((item) => {
  const isActive = item.to === location.pathname;

  return (
    <NavLink
      key={item.to}
      to={item.to}
      className={`relative px-6 py-3 transition-all duration-300 ease-in-out text-center rounded-b-2xl
        ${isActive
          ? 'bg-[#FFF9C4] text-green-900 font-bold'
          : 'hover:text-[#FFF9C4] hover:scale-[1.05]'} group`}
    >
      {item.label}
      <span
        className={`absolute left-1/2 bottom-1 w-0 h-[2px] bg-[#FFF9C4] transition-all duration-300 
          group-hover:w-2/3 group-hover:left-1/6
          ${isActive ? 'w-2/3 left-1/6' : ''}`}
      />
    </NavLink>
  );
})}

  </div>
</nav>
    </div>
  );
};
