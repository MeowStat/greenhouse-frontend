'use client'
import {
  Search,
  Filter,
  PenLine,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Eye,
  Trash2,
  Info,
  EyeOff,
} from 'lucide-react'
import { ThemMoiQuanTrac } from './component/DuLieuQuanTracCreateModal'
import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { sensorDataService } from '../../services/sensorDataService'
import { EMPTY_STRING } from '../../utils/constants'
import Skeleton from 'react-loading-skeleton'

interface SensorConfig {
  id: string
  description: string
  idealRange?: string
  unit?: string
  isHidden?: boolean
}

interface ISensor {
  id: string
  name: string
  unit?: string
  description: string
  warning?: string
  upperbound?: number
  lowerbound?: number
}

export function QuanLyQuanTracEdit() {
  const [allSensor, setAllSensor] = useState<ISensor[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllSensor = async () => {
      try {
        const response = await sensorDataService.getAllSensor()
        setAllSensor(response.data)
        setLoading(false)
      } catch (error: any) {
        throw new Error(`Failed to fetch sensor data: ${error}`)
      }
    }

    fetchAllSensor()
  }, [])

  // const sensorConfigs: SensorConfig[] = [
  //   {
  //     id: 'DA_HUM_1',
  //     description: 'Humid value from DHT20 1.',
  //     idealRange: '50-60',
  //     unit: '%',
  //   },
  //   {
  //     id: 'DA_TEMP_2',
  //     description: 'Temp value from DHT20 2.',
  //     unit: '°C',
  //     isHidden: true,
  //   },
  //   {
  //     id: 'DA_LIGHT_1',
  //     description: 'Lightness value from sensor 2.',
  //     idealRange: '0-40',
  //     unit: 'lux',
  //   },
  //   {
  //     id: 'DA_SOIL_1',
  //     description: 'Soil moisture from sensor 3.',
  //   },
  //   {
  //     id: 'DA_SOIL_2',
  //     description: 'Soil moisture from sensor 4.',
  //   },
  //   {
  //     id: 'DA_TEMP_1',
  //     description: 'Temp value from DHT20 1',
  //     unit: '°C',
  //     isHidden: true,
  //   },
  // ]

  const navigate = useNavigate()

  return (
    <div className="flex flex-col w-full items-center min-h-screen bg-[#fafdf9] px-15">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-green-900">
              Dữ liệu quan trắc
            </h1>
            <h2 className="text-2xl text-green-800">Quản lý bảng quan trắc</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                className="pl-10 pr-4 py-2 w-[300px] bg-[#e8f5e9] rounded-md border-none focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Tìm kiếm quan trắc"
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
              className="p-2 rounded-md hover:bg-gray-100 transition-colors hover:cursor-pointer"
              onClick={() => navigate('/du-lieu-quan-trac')}
            >
              <Info className="h-5 w-5" />
            </button>
          </div>
        </div>

        <ThemMoiQuanTrac />

        {loading ? (
          <Skeleton height={300} />
        ) : (
          <div className="bg-[#e8f5e9] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-green-900 text-white">
                  <th className="text-left px-6 py-3">Tên</th>
                  <th className="text-left px-6 py-3">Mô tả</th>
                  <th className="text-left px-6 py-3">Mức lý tưởng</th>
                  <th className="text-left px-6 py-3">Đơn vị</th>
                  <th className="text-right px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {allSensor.map((sensor) => (
                  <tr
                    key={sensor.id}
                    className="border-b border-green-100 hover:bg-green-50"
                  >
                    <td className="px-6 py-4">{sensor.name}</td>
                    <td className="px-6 py-4">{sensor.description}</td>
                    <td className="px-6 py-4">
                      {sensor.lowerbound !== null && sensor.upperbound !== null
                        ? `${sensor.lowerbound}-${sensor.upperbound}`
                        : EMPTY_STRING}
                    </td>
                    <td className="px-6 py-4">{sensor.unit || EMPTY_STRING}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="p-1 hover:bg-green-100 rounded">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="p-1 hover:bg-green-100 rounded">
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <button className="p-1 hover:bg-green-100 rounded">
                          <PenLine className="h-5 w-5" />
                        </button>
                        <button className="p-1 hover:bg-green-100 rounded">
                          <Info className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end items-center gap-4 mt-6">
          <div className="flex items-center border rounded-md">
            <button className="px-2 py-1 flex items-center gap-1 hover:bg-gray-50">
              <span>10</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          <button className="flex items-center gap-1 px-3 py-1 text-sm border rounded-md hover:bg-gray-50 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>
          <span className="text-sm text-gray-600">1/1</span>
          <button className="flex items-center gap-1 px-3 py-1 text-sm border rounded-md transition-colors bg-green-600 text-white hover:bg-green-700">
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
