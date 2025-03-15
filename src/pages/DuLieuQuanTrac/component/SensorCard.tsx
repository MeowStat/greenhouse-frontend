'use client'

import { useState } from 'react'
import { ThongTinQuanTracModal } from './ThongTinQuanTracModal'

interface SensorData {
  id: string
  value: number
  unit: string
  description: string
  timestamp: string
  warning?: string
}

interface SensorCardProps {
  data: SensorData
}

export function SensorCard({ data }: SensorCardProps) {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <>
      <div className="bg-[#e8f5e9] rounded-lg p-6 mb-4 relative">
        <div className="flex items-start justify-between">
          <div className="flex items-baseline">
            <span className="text-7xl font-bold">{data.value}</span>
            <span className="ml-1 text-lg">{data.unit}</span>
          </div>
          <div className="flex-1 ml-8">
            <h2 className="text-2xl font-semibold mb-2">{data.id}</h2>
            <p className="text-gray-600 mb-1">{data.description}</p>
            <p className="text-gray-500 text-sm">
              Thời gian cập nhật: {data.timestamp}
            </p>
            {data.warning && (
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                <span className="text-gray-700">{data.warning}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowInfo(true)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
          >
            <span className="text-sm italic">thông tin thêm &gt;&gt;</span>
          </button>
        </div>
      </div>

      <ThongTinQuanTracModal
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        data={data}
      />
    </>
  )
}
