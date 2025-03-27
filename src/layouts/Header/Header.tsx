import { NavLink } from 'react-router-dom'

import UserHeader from '../../components/UserHeader/UserHeader'

const navItems = [
  { to: '/trang-chu', label: 'Trang chủ' },
  { to: '/dieu-khien', label: 'Điều khiển' },
  { to: '/du-lieu-quan-trac', label: 'Dữ liệu quan trắc' },
  { to: '/lich-su-quan-trac', label: 'Lịch sử quan trắc' },
  { to: '/huong-dan', label: 'Hướng dẫn' },
]

export const Header: React.FC = () => {
  return (
    <div className="flex flex-col">
      <div className="bg-[#FFFCD6] flex items-center justify-between p-3 pl-16 pr-16">
        <div>
          <svg
            className="h-7 w-auto"
            viewBox="0 0 294 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.351562 26.25L7.73438 25.2422C8.15625 26.9609 9.82812 27.8203 12.75 27.8203C15.1719 27.8203 16.3828 27.3516 16.3828 26.4141C16.3828 26.0078 16.1484 25.6953 15.6797 25.4766C15.2109 25.2422 14.1016 25.0078 12.3516 24.7734C7.50781 24.1016 4.48438 23.0547 3.28125 21.6328C2.07812 20.1953 1.47656 18.6016 1.47656 16.8516C1.47656 14.4141 2.49219 12.4453 4.52344 10.9453C6.55469 9.42969 9.21875 8.67188 12.5156 8.67188C18.2969 8.67188 21.9844 10.7578 23.5781 14.9297L16.5 16.2656C15.8438 14.8594 14.4609 14.1562 12.3516 14.1562C11.3516 14.1562 10.6016 14.2969 10.1016 14.5781C9.61719 14.8438 9.375 15.1094 9.375 15.375C9.375 16.1562 10.125 16.6328 11.625 16.8047C15.5312 17.2422 18.1797 17.6875 19.5703 18.1406C20.9609 18.5938 22.1484 19.4219 23.1328 20.625C24.1172 21.8281 24.6094 23.2812 24.6094 24.9844C24.6094 27.5938 23.5156 29.6641 21.3281 31.1953C19.1562 32.7266 16.1562 33.4922 12.3281 33.4922C5.875 33.4922 1.88281 31.0781 0.351562 26.25ZM64.0312 33H54.9609V18.0938C54.9609 17.0938 54.8125 16.3984 54.5156 16.0078C54.2344 15.6016 53.7266 15.3984 52.9922 15.3984C51.2422 15.3984 50.3672 16.6719 50.3672 19.2188V33H41.3906V18.0938C41.3906 16.1875 40.6562 15.2344 39.1875 15.2344C37.6719 15.2344 36.9141 16.1875 36.9141 18.0938V33H27.9141V9.16406H36.3047V12.375C37.8047 9.90625 39.9844 8.67188 42.8438 8.67188C45.9219 8.67188 48.1562 9.90625 49.5469 12.375C51.0938 9.90625 53.4688 8.67188 56.6719 8.67188C58.2031 8.67188 59.5469 8.99219 60.7031 9.63281C61.875 10.2734 62.7188 11.1016 63.2344 12.1172C63.7656 13.1172 64.0312 14.6719 64.0312 16.7812V33ZM93 33H84.0938C83.875 31.9844 83.7656 30.875 83.7656 29.6719C82.0781 32.2188 79.5234 33.4922 76.1016 33.4922C73.2891 33.4922 71.1797 32.7734 69.7734 31.3359C68.3828 29.8984 67.6875 28.25 67.6875 26.3906C67.6875 23.875 68.8281 21.8438 71.1094 20.2969C73.4062 18.7344 77.4688 17.7969 83.2969 17.4844V16.9453C83.2969 15.8984 83.0547 15.2031 82.5703 14.8594C82.1016 14.5156 81.4062 14.3438 80.4844 14.3438C78.3281 14.3438 77.125 15.2109 76.875 16.9453L68.3438 16.1484C69.5625 11.1641 73.7109 8.67188 80.7891 8.67188C82.7109 8.67188 84.4766 8.86719 86.0859 9.25781C87.6953 9.63281 88.9688 10.2266 89.9062 11.0391C90.8438 11.8516 91.4688 12.7109 91.7812 13.6172C92.1094 14.5234 92.2734 16.2656 92.2734 18.8438V28.3594C92.2734 30.1719 92.5156 31.7188 93 33ZM83.2969 21.8438C79.3125 22.2656 77.3203 23.5391 77.3203 25.6641C77.3203 27.1016 78.1094 27.8203 79.6875 27.8203C80.6875 27.8203 81.5391 27.5234 82.2422 26.9297C82.9453 26.3359 83.2969 25.0234 83.2969 22.9922V21.8438ZM106.102 33H97.1484V9.16406H104.93V14.0859C105.82 10.5078 107.891 8.71875 111.141 8.71875C111.469 8.71875 111.922 8.75 112.5 8.8125V17.1328C111.844 16.9766 111.258 16.8984 110.742 16.8984C107.648 16.8984 106.102 18.625 106.102 22.0781V33ZM131.18 9.16406V15.2344H126.422V24.0234C126.422 25.2266 126.648 25.9453 127.102 26.1797C127.555 26.3984 128.023 26.5078 128.508 26.5078C129.258 26.5078 130.148 26.375 131.18 26.1094V32.7656C129.336 33.125 127.523 33.3047 125.742 33.3047C122.867 33.3047 120.75 32.6875 119.391 31.4531C118.047 30.2188 117.375 28.25 117.375 25.5469L117.398 22.7578V15.2344H113.836V9.16406H117.398L117.539 1.40625L126.422 1.26562V9.16406H131.18ZM162.281 15.0703V33H157.477C157.086 31.6719 156.656 30.5547 156.188 29.6484C154.203 32.2109 151.266 33.4922 147.375 33.4922C143.25 33.4922 139.859 32.0547 137.203 29.1797C134.547 26.2891 133.219 22.3828 133.219 17.4609C133.219 12.6797 134.5 8.66406 137.062 5.41406C139.641 2.14844 143.469 0.515625 148.547 0.515625C152.359 0.515625 155.43 1.48437 157.758 3.42188C160.086 5.35938 161.594 8.10938 162.281 11.6719L152.766 12.6094C152.297 9.28125 150.836 7.61719 148.383 7.61719C145.164 7.61719 143.555 10.6797 143.555 16.8047C143.555 20.5078 144.07 22.9531 145.102 24.1406C146.133 25.3125 147.383 25.8984 148.852 25.8984C150.039 25.8984 151.047 25.5391 151.875 24.8203C152.719 24.1016 153.148 23.1172 153.164 21.8672H147.867V15.0703H162.281ZM191.156 33H182.25C182.031 31.9844 181.922 30.875 181.922 29.6719C180.234 32.2188 177.68 33.4922 174.258 33.4922C171.445 33.4922 169.336 32.7734 167.93 31.3359C166.539 29.8984 165.844 28.25 165.844 26.3906C165.844 23.875 166.984 21.8438 169.266 20.2969C171.562 18.7344 175.625 17.7969 181.453 17.4844V16.9453C181.453 15.8984 181.211 15.2031 180.727 14.8594C180.258 14.5156 179.562 14.3438 178.641 14.3438C176.484 14.3438 175.281 15.2109 175.031 16.9453L166.5 16.1484C167.719 11.1641 171.867 8.67188 178.945 8.67188C180.867 8.67188 182.633 8.86719 184.242 9.25781C185.852 9.63281 187.125 10.2266 188.062 11.0391C189 11.8516 189.625 12.7109 189.938 13.6172C190.266 14.5234 190.43 16.2656 190.43 18.8438V28.3594C190.43 30.1719 190.672 31.7188 191.156 33ZM181.453 21.8438C177.469 22.2656 175.477 23.5391 175.477 25.6641C175.477 27.1016 176.266 27.8203 177.844 27.8203C178.844 27.8203 179.695 27.5234 180.398 26.9297C181.102 26.3359 181.453 25.0234 181.453 22.9922V21.8438ZM204.258 33H195.305V9.16406H203.086V14.0859C203.977 10.5078 206.047 8.71875 209.297 8.71875C209.625 8.71875 210.078 8.75 210.656 8.8125V17.1328C210 16.9766 209.414 16.8984 208.898 16.8984C205.805 16.8984 204.258 18.625 204.258 22.0781V33ZM236.906 33H228.141V29.8359C226.844 32.2734 224.703 33.4922 221.719 33.4922C218.969 33.4922 216.734 32.4219 215.016 30.2812C213.312 28.125 212.461 25 212.461 20.9062C212.461 17.0781 213.32 14.0391 215.039 11.7891C216.758 9.53906 219.031 8.41406 221.859 8.41406C224.219 8.41406 226.164 9.3125 227.695 11.1094V1.00781H236.906V33ZM227.695 17.6719C227.695 15.5312 226.812 14.4609 225.047 14.4609C223.812 14.4609 223 15.1406 222.609 16.5C222.234 17.8594 222.047 19.5234 222.047 21.4922C222.047 25.3516 223.031 27.2812 225 27.2812C225.75 27.2812 226.383 26.9766 226.898 26.3672C227.43 25.7578 227.695 24.8281 227.695 23.5781V17.6719ZM257.602 24.4453L266.32 25.0312C265.805 27.375 264.484 29.375 262.359 31.0312C260.25 32.6719 257.391 33.4922 253.781 33.4922C249.766 33.4922 246.562 32.3359 244.172 30.0234C241.781 27.6953 240.586 24.8125 240.586 21.375C240.586 17.8125 241.766 14.8047 244.125 12.3516C246.484 9.89844 249.633 8.67188 253.57 8.67188C257.383 8.67188 260.461 9.82812 262.805 12.1406C265.164 14.4531 266.344 17.6016 266.344 21.5859C266.344 21.9141 266.336 22.3672 266.32 22.9453H250.359C250.391 24.4453 250.656 25.5625 251.156 26.2969C251.656 27.0156 252.609 27.375 254.016 27.375C256.047 27.375 257.242 26.3984 257.602 24.4453ZM256.992 18.2578C256.977 16.6484 256.648 15.5703 256.008 15.0234C255.383 14.4609 254.602 14.1797 253.664 14.1797C251.445 14.1797 250.336 15.5391 250.336 18.2578H256.992ZM293.297 33H283.945V18C283.945 16.7656 283.75 15.9766 283.359 15.6328C282.984 15.2891 282.508 15.1172 281.93 15.1172C280.227 15.1172 279.375 16.3047 279.375 18.6797V33H270.023V9.16406H278.695V12.5391C279.977 9.96094 282.266 8.67188 285.562 8.67188C287.297 8.67188 288.758 9.00781 289.945 9.67969C291.148 10.3359 292.008 11.1953 292.523 12.2578C293.039 13.3047 293.297 15.1328 293.297 17.7422V33Z"
              fill="#086E31"
            />
          </svg>
        </div>
        <UserHeader />
      </div>
      <div className="flex flex-wrap items-center pl-[10%] pr-[10%] bg-green-800">
        <div className="font-medium flex-1 flex flex-wrap items-center justify-center p-3 gap-x-16">
          {navItems.map((navItem) => (
            <NavLink
              key={navItem.to}
              to={navItem.to}
              className={({ isActive }: { isActive: boolean }) =>
                `relative text-lg transition-all duration-300 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#B4E8C5] hover:text-white'
                }`
              }
            >
              {navItem.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}
