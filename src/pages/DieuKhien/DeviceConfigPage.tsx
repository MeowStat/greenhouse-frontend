import React from 'react'
import { useParams } from 'react-router-dom';
import { IDevice, IDeviceConfig } from '../../types/DeviceTypes';
import { deviceService } from '../../services/deviceService';
import { Card } from '../../components/UI/card';
import SchedulerCard from './components/SchedulerCard';
import SchedulerConfigCreateModal from './components/SchedulerConfigCreateModal';
import toast from 'react-hot-toast';
import ToastMessage from '../../components/ToastNotification/ToastMessage';
import { Spinner } from '../../components/UI/spinner';
import AutomationCard from './components/AutomationCard';
import AutoConfigCreateModal from './components/AutoConfigCreateModal';

const DeviceConfigPage: React.FC = () => {

  const { deviceId } = useParams<{ deviceId: string }>();

  const [deviceInfo, setDeviceInfo] = React.useState<IDevice | null>(null);
  const [deviceConfig, setDeviceConfig] = React.useState<IDeviceConfig[]>([]);

  const [loading, setLoading] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);

  const deviceSchedulerConfig: IDeviceConfig[] = (deviceConfig ?? []).filter(
    (config) => config?.automationConfig == null
  );

  const deviceAutoConfig: IDeviceConfig[] = (deviceConfig ?? []).filter(
    (config) => config?.schedulerConfig == null
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
        </div>

        <div className='flex items-center gap-x-20 flex-wrap'>
          <Card className={`flex-1 bg-green-100 shadow-md rounded-lg p-6 mb-6 min-w-[500px] h-120
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
                  return (
                    <SchedulerCard
                      config={config}
                      deviceType={deviceInfo?.type || 0}
                      setRefresh={setRefresh}
                    />
                  );
                })
              )}
            </div>
          </Card>
          
          <Card className={`flex-1 bg-green-100 shadow-md rounded-lg p-6 mb-6 max-w-xl min-w-[500px] h-120
            ${loading ? 'opacity-40' : ''}  
          `}>
            <div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <span className="text-3xl font-semibold text-gray-800">Tự động</span>
                </div>
                {deviceInfo && <AutoConfigCreateModal setRefresh={setRefresh} deviceId={deviceInfo.id} deviceType={deviceInfo?.type}/>}
              </div>
            </div>
            <Spinner show={loading} size="medium" />
            <div className='flex flex-col gap-y-4 overflow-y-auto max-h-[400px] pr-2 scroll-smooth scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-green-100 px-2 py-1 rounded-md'>
              {!loading && deviceAutoConfig.length === 0 ? (
                <div className="w-full text-center py-8 text-green-800 font-medium text-lg border-2 border-dashed border-green-400 rounded-lg bg-green-50">
                  Empty
                </div>
              ) : (
                deviceAutoConfig.map((config) => {
                  return (
                    <AutomationCard
                      key={config.id}
                      config={config}
                      deviceType={deviceInfo?.type || 0}
                      setRefresh={setRefresh}
                    />
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DeviceConfigPage