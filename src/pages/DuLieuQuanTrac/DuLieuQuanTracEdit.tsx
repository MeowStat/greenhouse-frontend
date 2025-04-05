import { PenLine, Info } from 'lucide-react'

import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { sensorDataService } from '../../services/sensorDataService'
import { EMPTY_STRING } from '../../utils/constants'
import { ISensor } from '../../types/SensorTypes'
import toast from 'react-hot-toast'
import ToastMessage from '../../components/ToastNotification/ToastMessage'
import Skeleton from 'react-loading-skeleton'
import { useModal } from '../../hooks/useModal'
import EditQuanTrac from './component/DuLieuQuanTracEditModal'
import ThemMoiQuanTrac from './component/DuLieuQuanTracCreateModal'
import DeleteQuanTracButton from './component/DeleteQuanTracButton'

export function QuanLyQuanTracEdit() {
  const editModal = useModal()

  const [allSensor, setAllSensor] = useState<ISensor[]>([])

  const [refresh, setRefresh] = useState(false)

  const [selectedSensor, setSelectedSensor] = useState<ISensor | null>(null)

  const [loading, setLoading] = useState(false)

  const fetchAllSensor = async () => {
    try {
      const data = await sensorDataService.getAllSensor()
      setAllSensor(data.data || [])
    } catch (error: any) {
      toast.error(
        <ToastMessage
          mainMessage="Failed to fetch sensors"
          description={error.message}
        />,
      )
    }
  }

  const handleEditSensor = (sensor: ISensor) => {
    setSelectedSensor(sensor)
    editModal.open()
  }

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await fetchAllSensor()
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllSensor()
    }
    fetchData()
  }, [refresh])

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
            <button
              className="p-2 rounded-md hover:bg-gray-100 transition-colors hover:cursor-pointer"
              onClick={() => navigate('/du-lieu-quan-trac')}
            >
              <Info className="h-5 w-5" />
            </button>
          </div>
        </div>

        <ThemMoiQuanTrac setRefresh={setRefresh} />

        <div className="bg-[#e8f5e9] overflow-hidden">
          {loading ? (
            <Skeleton height={300} />
          ) : (
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
                      <td className="px-6 py-4" title={sensor.description}>
                        {sensor.description}
                      </td>
                      <td className="px-6 py-4">
                        {sensor.lowerbound !== null &&
                        sensor.upperbound !== null
                          ? `${sensor.lowerbound}-${sensor.upperbound}`
                          : EMPTY_STRING}
                      </td>
                      <td className="px-6 py-4">
                        {sensor.unit || EMPTY_STRING}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <DeleteQuanTracButton
                            key={sensor.id}
                            quanTracId={sensor.id}
                            setRefresh={setRefresh}
                          />
                          <button
                            className="p-1 hover:bg-green-100 rounded"
                            title="Chỉnh sửa"
                            onClick={() => handleEditSensor(sensor)}
                          >
                            <PenLine className="h-5 w-5" />
                          </button>
                          <button
                            className="p-1 hover:bg-green-100 rounded"
                            title="Xem biểu đồ"
                            onClick={() => {
                              const params = new URLSearchParams({
                                id: sensor.id,
                                name: sensor.name,
                                feed: sensor.feed,
                                lowerbound:
                                  sensor.lowerbound !== null
                                    ? String(sensor.lowerbound)
                                    : '',
                                upperbound:
                                  sensor.upperbound !== null
                                    ? String(sensor.upperbound)
                                    : '',
                              })

                              navigate(
                                `/du-lieu-quan-trac/visualization?${params.toString()}`,
                              )
                            }}
                          >
                            <Info className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <EditQuanTrac
                key={selectedSensor?.id || 'default'}
                monitorId={selectedSensor?.id || EMPTY_STRING}
                modal={editModal}
                data={{
                  name: selectedSensor?.name || EMPTY_STRING,
                  description: selectedSensor?.description || EMPTY_STRING,
                  unit: selectedSensor?.unit || EMPTY_STRING,
                  upperbound: selectedSensor?.upperbound || 0,
                  lowerbound: selectedSensor?.lowerbound || 0,
                  feed: selectedSensor?.feed || EMPTY_STRING,
                }}
                setRefresh={setRefresh}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
