import {
  Search,
  Filter,
  PenLine,
  ChevronDown,
  Trash2,
  Info,
} from 'lucide-react'
import { ThemMoiQuanTrac } from './component/DuLieuQuanTracCreateModal'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { sensorDataService } from '../../services/sensorDataService'
import { EMPTY_STRING } from '../../utils/constants'
import { ISensor } from '../../types/SensorTypes'
import toast from 'react-hot-toast'
import ToastMessage from '../../components/ToastNotification/ToastMessage'
import Skeleton from 'react-loading-skeleton'

export function QuanLyQuanTracEdit() {
  const [allSensor, setAllSensor] = useState<ISensor[]>([])

  const [loading, setLoading] = useState(false)

  const fetchAllSensor = async () => {
    try {
      const data = await sensorDataService.getAllSensor();
      setAllSensor(data.data || []);
    } catch (error: any) {
      toast.error(<ToastMessage mainMessage='Failed to fetch sensors' description={error.message} />);
      console.error('Error fetching sensors:', error.message);
    }
  };

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchAllSensor();
      setLoading(false)
    };

    fetchData();
  }, []);

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

        <div className="bg-[#e8f5e9] rounded-lg overflow-hidden">
          { 
            loading? 
              <Skeleton height={300} /> 
              : 
              <>
                {allSensor.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <p>No sensors available. Please add new sensors.</p>
                  </div>
                )}
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
                            {/* {sensor.isHidden ? (
                              <button className="p-1 hover:bg-green-100 rounded">
                                <EyeOff className="h-5 w-5" />
                              </button>
                            ) : (
                              <button className="p-1 hover:bg-green-100 rounded">
                                <Eye className="h-5 w-5" />
                              </button>
                            )} */}
                            <button className="p-1 hover:bg-green-100 rounded">
                              <Trash2 className="h-5 w-5" />
                            </button>
                            <button className="p-1 hover:bg-green-100 rounded">
                              <PenLine className="h-5 w-5" />
                            </button>
                            <button
                              className="p-1 hover:bg-green-100 rounded"
                              onClick={() =>
                                navigate(
                                  `/du-lieu-quan-trac/visualization?subject=${encodeURIComponent(sensor.name)}`,
                                )
                              }
                            >
                              <Info className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
          }
        </div>
      </div>
    </div>
  )
}
