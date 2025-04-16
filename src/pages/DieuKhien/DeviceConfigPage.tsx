import React from 'react'
import { useParams } from 'react-router-dom';
import { IDevice, IDeviceConfig } from '../../types/DeviceTypes';
import { deviceService } from '../../services/deviceService';
import { Button } from '../../components/UI/button';
import { CirclePlus, Save, Trash } from 'lucide-react';
import { Card } from '../../components/UI/card';
import CheckBox from '../../components/UI/checkbox';
import SchedulerCard from './components/SchedulerCard';
import SchedulerConfigCreateModal from './components/SchedulerConfigCreateModal';
import toast from 'react-hot-toast';
import ToastMessage from '../../components/ToastNotification/ToastMessage';
import { Spinner } from '../../components/UI/spinner';

const DeviceConfigPage: React.FC = () => {

  const { deviceId } = useParams<{ deviceId: string }>();

  const [deviceInfo, setDeviceInfo] = React.useState<IDevice | null>(null);
  const [deviceConfig, setDeviceConfig] = React.useState<IDeviceConfig[]>([]);

  const [loading, setLoading] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);

  const deviceSchedulerConfig: IDeviceConfig[] = (deviceConfig ?? []).filter(
    (config) => config?.automationConfig == null
  );

  const fetchDeviceInfo = async (deviceId: string) => {
    try {
      setLoading(true);
      const response = await deviceService.getDeviceById(deviceId);
      setDeviceInfo(response.data);  
    } catch (error) {
      toast.error(<ToastMessage mainMessage='Lỗi' description='Vui lòng thử lại'/>)
      setLoading(false);
    }
  }

  const fetchDeviceConfig = async (deviceId: string) => {
    try {
      const response = await deviceService.getDeviceConfig(deviceId);
      setDeviceConfig(response.data);
    } catch (error) {
      toast.error(<ToastMessage mainMessage='Lỗi' description='Vui lòng thử lại'/>)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (deviceId) {
      fetchDeviceInfo(deviceId);
    }
  }, [deviceId]);

  React.useEffect(() => {
      if (deviceInfo && deviceId) {
        setLoading(true);
        fetchDeviceConfig(deviceId);
      }
    }, [deviceInfo, deviceId, refresh]);

  return (
    <div className="flex flex-col w-full items-center px-15">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-green-900">
              Điều khiển thiết bị
            </h1>
            <h2 className="text-2xl text-green-800">{deviceInfo?.name}</h2>
          </div>
          
          <div className="flex items-end gap-4">
            <Button
              className="bg-red-600 text-base w-25 cursor-pointer"
              onClick={() => console.log('Edit Device')}
            >
              <Trash />
              <span>Xóa</span>
            </Button>
            <Button
              className="bg-green-600 text-base w-25 cursor-pointer"
              onClick={() => console.log('Edit Device')}
            >
              <Save />
              <span>Lưu</span>
            </Button>
          </div>
        </div>

        <div className='flex items-center gap-x-20 flex-wrap'>
          <Card className={`flex-1 bg-green-100 shadow-md rounded-lg p-6 mb-6 max-w-xl min-w-[500px] h-120
            ${loading ? 'opacity-40' : ''}  
          `}>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-800">Hẹn giờ</span>
                {deviceInfo && (
                  <SchedulerConfigCreateModal 
                    setRefresh={setRefresh} 
                    deviceId={deviceInfo.id} 
                    deviceType={deviceInfo.type} 
                  />
                )}
              </div>
            </div>
            <Spinner show={loading} size="medium" />

            <div className='flex flex-col gap-y-4 overflow-y-auto max-h-[400px] pr-2 scroll-smooth scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-green-100 px-2 py-1 rounded-md'>
              {!loading && deviceSchedulerConfig.length === 0 ? (
                <div className="w-full text-center py-8 text-green-800 font-medium text-lg border-2 border-dashed border-green-400 rounded-lg bg-green-50">
                  Empty
                </div>
              ) : (
                deviceSchedulerConfig.map((config) => {
                  const { id, start, end, repitation } = config.schedulerConfig;
                  return (
                    <SchedulerCard
                      key={id}
                      id={id}
                      start={start}
                      end={end}
                      repitation={repitation}
                      action={config.action}
                      setRefresh={setRefresh}
                      changePower={config.changePower || 100}
                      deviceType={deviceInfo?.type || 0}
                    />
                  );
                })
              )}
            </div>

            
          </Card>
          
          <Card className="flex-1 bg-green-100 shadow-md rounded-lg p-6 mb-6 max-w-xl min-w-[500px] h-120">
            <div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <CheckBox checked={deviceConfig[0]?.action} onChange={function (_): void {
                    throw new Error('Function not implemented.');
                  } } />
                  <span className="text-2xl font-semibold text-gray-800">Tự động</span>
                </div>
                <CirclePlus className="h-6 w-6 hover:text-green-500 text-green-900 cursor-pointer" />
              </div>
              <p>Trạng thái điều chỉnh: Bật</p>
            </div>

            <table className="w-full mt-4">
              <thead>
                <tr>
                  <th className="text-left p-2 border-r border-b border-black">Điều kiện</th>
                  <th className="text-left p-2 border-r border-b border-black">Hành động</th>
                  <th className="text-left p-2 border-b border-black">Mô tả</th>
                </tr>
              </thead>
              <tbody>
                {deviceConfig[0]?.automationConfig?.Condition?.map((condition, index) => (
                  <tr key={index} className="border-black">
                    <td className="p-2 border-r border-black">{`${condition.sensorId} ${condition.condition} ${condition.threshold}`}</td>
                    <td className="p-2 border-r border-black">...</td>
                    <td className="p-2">{condition.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
              
            
          </Card>

        </div>

      </div>
    </div>
  );
}

export default DeviceConfigPage