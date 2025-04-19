import { Info } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
// import { useModal } from '../../hooks/useModal';
import { IDevice } from '../../types/DeviceTypes';
import { deviceService } from '../../services/deviceService';
import DeviceCreateModal from './components/DeviceCreateModal';
import DeleteDeviceButton from './components/DeleteDeviceButton';
import DeviceShowModal from './components/DeviceShowModal';
import DeviceEditModal from './components/DeviceEditModal';
import { Spinner } from '../../components/UI/spinner';
// import EditQuanTrac from './component/DuLieuQuanTracEditModal';
// import ThemMoiQuanTrac from './component/DuLieuQuanTracCreateModal';
// import DeleteQuanTracButton from './component/DeleteQuanTracButton';

export function DeviceListPage() {
  // const editModal = useModal();

  const [devices, setDevices] = useState<IDevice[]>([]);

  const [refresh, setRefresh] = useState(false);

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
  }, [refresh]);

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

        <DeviceCreateModal setRefresh={setRefresh} />

        <div className="bg-[#e8f5e9] overflow-hidden">
          {loading ? (
            <Skeleton height={300} />
          ) : (
            <div>
              <Spinner show={loading} size="large" />
              {devices.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <p>No sensors available. Please add new sensors.</p>
                </div>
              )}
              <table className="w-full">
                <thead>
                  <tr className="bg-green-900 text-white">
                    <th className="text-left px-6 py-3">Tên</th>
                    <th className="text-left px-6 py-3">Feed</th>
                    <th className="text-center px-6 py-3">Loại</th>
                    <th className="text-left px-6 py-3">Mô tả</th>
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
                      <td className="px-6 py-4">{device.feed}</td>
                      <td className="text-center px-6 py-4">{device.type}</td>
                      <td className="px-6 py-4">
                        {device.description}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <DeviceShowModal deviceId={device.id} />
                          <DeviceEditModal setRefresh={setRefresh} deviceId={device.id}/>
                          <DeleteDeviceButton deviceId={device.id} setRefresh={setRefresh}/>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-6 bg-green-50 border-t-1 border-green-800 text-base text-green-800">
                <span>Tổng số thiết bị: <strong>{devices.length}</strong></span>
                <div className="mt-5 flex items-start gap-2 text-sm text-green-800">
                  <Info className="h-4 w-4 mt-0.5 text-green-700" />
                  <p>
                    <strong>Ghi chú:</strong> Loại <strong>0</strong> là Bật/Tắt, loại <strong>1</strong> là Theo cường độ.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
