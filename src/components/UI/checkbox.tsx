import React from 'react'
import { Checkbox } from '@headlessui/react'

interface CheckBoxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  name?: string
}

const CheckBox: React.FC<CheckBoxProps> = ({ checked, onChange, name }) => {
  return (
    <Checkbox
      checked={checked}
      onChange={onChange} 
      name={name}
      className={`group flex items-center justify-center w-6 h-6 rounded-sm border cursor-pointer ${
        checked ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'
      } transition-colors duration-200`}
    >
      {checked && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>}
    </Checkbox>
  )
}

export default CheckBox