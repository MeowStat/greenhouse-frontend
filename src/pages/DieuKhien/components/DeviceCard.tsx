import React, { useState } from 'react'

import ToggleSwitch from '../../../components/UI/ToggleSwitch'

interface DeviceCardProps {
  name: string
  description: string
}

const DeviceCard: React.FC<DeviceCardProps> = (props) => {
  const { name, description } = props

  const [on, setOn] = useState(false)

  return (
    <>
      <div className="bg-green-100 min-h-2xl rounded-lg py-4 px-8 mb-6 shadow-md relative">
        <div className="grid grid-cols-16 items-center gap-4">
          {/* Device Info */}
          <div className="col-span-4 flex flex-col items-start justify-center border-r-[2px] border-black pr-4">
            <span className="text-3xl font-bold text-gray-800">{name}</span>
            <span className="text-base text-gray-600">{description}</span>
          </div>
  
            {/* Device Details */}
          <div className="col-span-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {/* {data.name} */}
            </h2>
            <p className="text-gray-700 mb-1"></p>
            <p className="text-gray-500 text-sm">
              {/* Thời gian cập nhật: {data.timestamp} */}
            </p>
            <div className="flex items-center gap-4">
            <ToggleSwitch
              checked={on}
              onChange={setOn}
              enableText="Bật"
              disableText="Tắt"
            />
            </div>
            </div>
        </div>

        {/* More Info Button */}
        <button
          // onClick={() => setShowInfo(true)}
          className="absolute bottom-4 right-4 text-gray-500 hover:text-gray-700 hover:cursor-pointer hover:underline"
        >
          <span className="text-sm italic">Thông tin thêm &gt;&gt;</span>
        </button>
      </div>

      {/* Modal */}
      {/* <ThongTinQuanTracModal
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        data={data}
      /> */}
    </>
  )
}

export default DeviceCard
