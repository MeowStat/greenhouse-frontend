import {
  Search,
  Filter,
  PenLine,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import { useNavigate } from 'react-router'
import { SensorCard } from './component/SensorCard'

interface SensorData {
  id: string
  value: number
  unit: string
  description: string
  timestamp: string
  warning?: string
}

function DuLieuQuanTrac() {
  const sensorData: SensorData[] = [
    {
      id: 'DA_HUM_1',
      value: 10,
      unit: '%',
      description: 'Humid value from DHT20 1.',
      timestamp: '04-02-2025 09:03:41',
      warning: 'Cảnh báo khi thông số lớn hơn 50%',
    },
    {
      id: 'DA_TEMP_1',
      value: 25,
      unit: '°C',
      description: 'Temp value from DHT20 1.',
      timestamp: '04-02-2025 09:03:41',
    },
    {
      id: 'DA_SOIL_1',
      value: 13,
      unit: '',
      description: 'Soil moisture from sensor 3.',
      timestamp: '14-02-2025 09:03:41',
    },
    {
      id: 'DA_LIGHT_1',
      value: 12,
      unit: 'lux',
      description: 'Lightness value from sensor 2.',
      timestamp: '06-02-2025 08:02:41',
      warning: 'Cảnh báo khi thông số lớn hơn 40lux',
    },
    {
      id: 'DA_SOIL_2',
      value: 23,
      unit: '',
      description: 'Soil moisture from sensor 4.',
      timestamp: '14-02-2025 09:03:41',
    },
  ]

  const navigate = useNavigate()

  return (
    <div className="flex flex-col w-full items-center px-15">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-900">
            Dữ liệu quan trắc
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
          {sensorData.map((sensor) => (
            <SensorCard key={sensor.id} data={sensor} />
          ))}
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

export default DuLieuQuanTrac
