import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import NotiIcon from '@/assets/notification.svg?react'

const UserHeader = () => {
  return (
    <div className="relative text-right flex items-center gap-x-2">
      <Menu>
        <MenuButton className="flex">
          <NotiIcon className="h-6.5 cursor-pointer hover:fill-green-800 transition-colors duration-200" />
        </MenuButton>
        <MenuButton className="inline-flex h-10">
          <img src="https://avatar.iran.liara.run/public/boy" />
        </MenuButton>
        <MenuItems
          transition
          anchor="bottom"
          className="w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
              Settings
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  )
}

export default UserHeader
