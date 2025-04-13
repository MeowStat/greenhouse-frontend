import { PenLine } from 'lucide-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deviceService } from '../../services/deviceService';
import Skeleton from 'react-loading-skeleton';
import DeviceCard from './components/DeviceCard';
import toast from 'react-hot-toast';
import { IDevice } from '../../types/DeviceTypes';

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
    fetchAllDevice().then((devices) => {
      setDevices(devices || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col w-full items-center px-15">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-900">
            Điều khiển thiết bị
          </h1>
          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => navigate('/dieu-khien/edit')}
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
                id={device.id}
                name={device.name}
                description={device.description}
                power={device.power}
                status={device.status}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DieuKhien;
