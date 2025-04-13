import React from 'react'
import { useParams } from 'react-router-dom';
import { IDevice, IDeviceConfig } from '../../types/DeviceTypes';
import { deviceService } from '../../services/deviceService';
import { Button } from '../../components/UI/button';
import { CirclePlus, Save, Settings, Trash } from 'lucide-react';
import { Card } from '../../components/UI/card';
import CheckBox from '../../components/UI/checkbox';

enum DaysOfWeek {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
}

const days = Object.values(DaysOfWeek);

const DeviceConfigPage: React.FC = () => {

  const { deviceId } = useParams<{ deviceId: string }>();

  const [deviceInfo, setDeviceInfo] = React.useState<IDevice | null>(null);
  const [deviceConfig, setDeviceConfig] = React.useState<IDeviceConfig[]>([]);

  const fetchDeviceInfo = async (deviceId: string) => {
    try {
      const response = await deviceService.getDeviceById(deviceId);
      setDeviceInfo(response.data);  
    } catch (error) {
      console.error('Error fetching device info:', error);
      return null;
    }
  }

  const fetchDeviceConfig = async (deviceId: string) => {
    try {
      const response = await deviceService.getDeviceConfig(deviceId);
      setDeviceConfig(response.data);
    } catch (error) {
      console.error('Error fetching device config:', error);
      return null;
    }
  }

  React.useEffect(() => {
    if (deviceId) {
      fetchDeviceInfo(deviceId);
    }
  }, [deviceId]);

  React.useEffect(() => {
      if (deviceInfo && deviceId) {
        fetchDeviceConfig(deviceId);
      }
    }, [deviceInfo, deviceId]);

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
          <Card className="flex-1 bg-green-100 shadow-md rounded-lg p-6 mb-6 max-w-xl min-w-[500px] h-90">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold text-gray-800">Hẹn giờ</span>
                <CirclePlus className="h-6 w-6 hover:text-green-500 text-green-900 cursor-pointer" />
              </div>
            </div>

            <Card className='bg-green-200 rounded-lg p-4 shadow-none border-green-900 border-[1px]'>
              <div className='flex items-center justify-between'>
                <div className="text-4xl font-semibold text-green-950">
                  {deviceConfig[0]?.schedulerConfig?.start + " - " + deviceConfig[0]?.schedulerConfig?.end}
                </div>
                <button>
                  <Settings className="h-6 w-6 text-green-900 cursor-pointer" />
                </button>
              </div>
              
              <div className='flex items-center justify-between'>
                <p>Repeat</p>
                <div className='flex flex-wrap justify-center'>
                  {days.map((day) => (
                    <div key={day} className="h-8 w-8 text-sm font-medium flex items-center justify-center border-2 border-green-900 rounded-full m-1">
                      <span>{day.charAt(0)}</span>
                    </div>
                  ))}
                </div>
              </div>            
            </Card>
            
          </Card>
          
          <Card className="flex-1 bg-green-100 shadow-md rounded-lg p-6 mb-6 max-w-xl min-w-[500px] h-90">
            <div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <CheckBox checked={deviceConfig[0]?.action} onChange={function (checked: boolean): void {
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