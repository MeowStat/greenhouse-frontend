import { PenLine } from 'lucide-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deviceService } from '../../services/deviceService';
import Skeleton from 'react-loading-skeleton';
import DeviceCard from './components/DeviceCard';
import toast from 'react-hot-toast';
import { IDevice } from '../../types/DeviceTypes';

const POLL_INTERVAL = 5000;

const fetchAllDevice = async () => {
  try {
    const data = await deviceService.getAllDevice();
    return data.data;
  } catch (error: any) {
    toast.error('Failed to fetch devices:', error.message);
  }
};

const DieuKhien: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(true);
  const [devices, setDevices] = React.useState<IDevice[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchDevices = async (isFirstTime = false) => {
      const fetchedDevices = await fetchAllDevice();
      if (!isMounted) return;

      setDevices(fetchedDevices || []);

      // Only update loading on first fetch
      if (isFirstTime) {
        setLoading(false);
      }
    };

    // First-time fetch
    fetchDevices(true);

    // Polling
    const interval = setInterval(() => {
      fetchDevices();
    }, POLL_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);


  return (
    <div className="flex flex-col w-full items-center">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-green-900">
              Điều khiển thiết bị
            </h1>
            <h2 className="text-2xl text-green-800">Quản lý bảng điều khiển</h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => navigate('/dieu-khien/edit')}
            >
              <PenLine className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <Skeleton count={5} height={80} />
          ) : (
            devices.map((device) => (
              <DeviceCard
                key={device.id}
                id={device.id}
                name={device.name}
                description={device.description}
                power={device.power}
                status={device.status}
                deviceType={device.type}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DieuKhien;
