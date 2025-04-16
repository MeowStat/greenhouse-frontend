import { PenLine, Info } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
// import { useModal } from '../../hooks/useModal';
import { IDevice } from '../../types/DeviceTypes';
import { deviceService } from '../../services/deviceService';
// import EditQuanTrac from './component/DuLieuQuanTracEditModal';
// import ThemMoiQuanTrac from './component/DuLieuQuanTracCreateModal';
// import DeleteQuanTracButton from './component/DeleteQuanTracButton';

export function DeviceListPage() {
  // const editModal = useModal();

  const [devices, setDevices] = useState<IDevice[]>([]);

  // const [refresh, setRefresh] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllDevice = async () => {
        try {
          setLoading(true);
          const data = await deviceService.getAllDevice();
          setDevices(data.data || []);
        } catch (error: any) {
          toast.error('Failed to fetch devices:', error.message);
        } finally {
          setLoading(false);
        }
      };
    fetchAllDevice();
  }, []);

  // const handleEditSensor = (sensor: ISensor) => {
  //   // setSelectedSensor(sensor);
  //   editModal.open();
  // };

  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full items-center min-h-screen bg-[#fafdf9] px-15">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-green-900">
              Điều khiển thiết bị
            </h1>
            <h2 className="text-2xl text-green-800">Quản lý bảng điều khiển</h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-md hover:bg-gray-100 transition-colors hover:cursor-pointer"
              onClick={() => navigate('/dieu-khien')}
            >
              <Info className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* <ThemMoiQuanTrac setRefresh={setRefresh} /> */}

        <div className="bg-[#e8f5e9] overflow-hidden">
          {loading ? (
            <Skeleton height={300} />
          ) : (
            <>
              {devices.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <p>No sensors available. Please add new sensors.</p>
                </div>
              )}
              <table className="w-full">
                <thead>
                  <tr className="bg-green-900 text-white">
                    <th className="text-left px-6 py-3">Tên</th>
                    <th className="text-left px-6 py-3">Mô tả</th>
                    {/* <th className="text-left px-6 py-3">Mức lý tưởng</th> */}
                    {/* <th className="text-left px-6 py-3">Đơn vị</th> */}
                    <th className="text-right px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device) => (
                    <tr
                      key={device.id}
                      className="border-b border-green-100 hover:bg-green-50"
                    >
                      <td className="px-6 py-4">{device.name}</td>
                      <td className="px-6 py-4">
                        {device.description}
                      </td>
                      {/* <td className="px-6 py-4">
                        {sensor.lowerbound !== null &&
                        sensor.upperbound !== null
                          ? `${sensor.lowerbound}-${sensor.upperbound}`
                          : EMPTY_STRING}
                      </td>
                      <td className="px-6 py-4">
                        {sensor.unit || EMPTY_STRING}
                      </td> */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {/* <DeleteQuanTracButton
                            key={sensor.id}
                            quanTracId={sensor.id}
                            setRefresh={setRefresh}
                          /> */}
                          <button
                            className="p-1 hover:bg-green-100 rounded"
                            title="Chỉnh sửa"
                            // onClick={() => handleEditSensor(sensor)}
                          >
                            <PenLine className="h-5 w-5" />
                          </button>
                          {/* <button
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
                              });

                              navigate(
                                `/du-lieu-quan-trac/visualization?${params.toString()}`
                              );
                            }}
                          >
                            <Info className="h-5 w-5" />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* <EditQuanTrac
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
              /> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
