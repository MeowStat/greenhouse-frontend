import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Filter,
  PenLine,
  Search,
} from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { deviceService } from '../../services/deviceService'
import Skeleton from 'react-loading-skeleton'
import DeviceCard from './components/DeviceCard'
import toast from 'react-hot-toast'

const fetchAllDevice = async () => {
  try {
    const data = await deviceService.getAllDevice()
    return data.data
  } catch (error: any) {
    toast.error('Failed to fetch devices:', error.message)
  }
}

const DieuKhien: React.FC = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = React.useState(true)
  const [devices, setDevices] = React.useState<any[]>([])

  useEffect(() => {
    fetchAllDevice().then((devices) => {
      setDevices(devices || [])
      setLoading(false)
    })
  }, [])

  return (
    <div className="flex flex-col w-full items-center px-15">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-900">
            Điều khiển thiết bị
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                className="pl-10 pr-4 py-2 w-[300px] bg-[#e8f5e9] rounded-md border-none focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Tìm kiếm dữ liệu quan trắc"
                type="text"
              />
            </div>
            <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
              <ChevronDown className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
              <Filter className="h-5 w-5" />
            </button>
            <button
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => navigate('/du-lieu-quan-trac/edit')}
            >
              <PenLine className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <Skeleton count={5} height={80} />
          ) : (
            devices.map((device) => (
              <DeviceCard
                key={device.id}
                name={device.name}
                description={device.description}
              />
            ))
          )}
        </div>

        <div className="flex justify-end items-center gap-4 mt-6">
          <div className="flex items-center border rounded-md">
            <button className="px-2 py-1 flex items-center gap-1 hover:bg-gray-50">
              <span>5</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          <button className="flex items-center gap-1 px-3 py-1 text-sm border rounded-md hover:bg-gray-50 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>
          <span className="text-sm text-gray-600">1/2</span>
          <button className="flex items-center gap-1 px-3 py-1 text-sm border rounded-md transition-colors bg-green-600 text-white hover:bg-green-700">
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DieuKhien
