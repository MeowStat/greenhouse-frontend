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
import { CalendarSync, SquareFunction } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: -10 },
};

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
      <div className="flex flex-col w-full items-center">
        <div className="w-full max-w-screen-xl px-4 sm:px-6 xl:px-8">
          {/* Title */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-green-900">Điều khiển thiết bị</h1>
              <h2 className="text-xl text-green-800">{deviceInfo?.name}</h2>
            </div>
          </div>
    
          {/* Config Cards */}
          <div className="flex flex-col xl:flex-row gap-6">
            {[deviceSchedulerConfig, deviceAutoConfig].map((configList, idx) => (
              <Card
                key={idx}
                className={`bg-green-100 shadow-md rounded-lg p-6 flex-1 h-auto min-h-[380px] ${
                  loading ? 'opacity-40' : ''
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-2 text-2xl font-semibold text-gray-800 border-b-3 border-green-800 pb-2 pr-4">
                    {idx === 0 ? (<CalendarSync className='w-8 h-8'/>) : (<SquareFunction className='w-8 h-8'/>)}
                    {idx === 0 ? ('Hẹn giờ') : 'Tự động'}
                  </span>
                  {deviceInfo &&
                    (idx === 0 ? (
                      <SchedulerConfigCreateModal
                        setRefresh={setRefresh}
                        deviceId={deviceInfo.id}
                        deviceType={deviceInfo.type}
                      />
                    ) : (
                      <AutoConfigCreateModal
                        setRefresh={setRefresh}
                        deviceId={deviceInfo.id}
                        deviceType={deviceInfo.type}
                      />
                    ))}
                </div>
    
                {/* Spinner */}
                <Spinner show={loading} size="medium" />
    
                {/* Config List */}
                <div className="flex-1 flex flex-col gap-y-4 overflow-y-auto max-h-[400px] pr-2 scroll-smooth scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-green-100 px-2 py-1 rounded-md">
                  {!loading && configList.length === 0 ? (
                    <div className="w-full text-center py-8 text-green-800 font-medium text-lg border-2 border-dashed border-green-400 rounded-lg bg-green-50">
                      Empty
                    </div>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {configList.map((config) => (
                        <motion.div
                          key={config.id}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          transition={{ duration: 0.3 }}
                          layout // animate position changes (e.g. after edit or reorder)
                        >
                          {idx === 0 ? (
                            <SchedulerCard
                              config={config}
                              deviceType={deviceInfo?.type || 0}
                              setRefresh={setRefresh}
                            />
                          ) : (
                            <AutomationCard
                              config={config}
                              deviceType={deviceInfo?.type || 0}
                              setRefresh={setRefresh}
                            />
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
}

export default DeviceConfigPage