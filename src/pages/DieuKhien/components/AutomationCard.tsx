import React, { useState } from 'react';
import { Card } from '../../../components/UI/card';
import ToggleSwitch from '../../../components/UI/ToggleSwitch';
import { deviceService } from '../../../services/deviceService';
import { Spinner } from '../../../components/UI/spinner';
import DeleteSchedulerConfig from './DeleteSchedulerConfig';
import { IDeviceConfig } from '../../../types/DeviceTypes';
import { displayComparison } from '../../../lib/utils';
import AutoConfigEditModal from './AutoConfigEditModal';
import { EMPTY_STRING } from '../../../utils/constants';
import { Leaf } from 'lucide-react';

interface AutomationCardProps {
  config: IDeviceConfig;
  deviceType: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const AutomationCard: React.FC<AutomationCardProps> = ({ config, deviceType, setRefresh }) => {
  const [on, setOn] = useState<boolean>(config.action);
  const [loadingSwitch, setLoadingSwitch] = useState<boolean>(false);

  const handleSchedulerOn = async () => {
    try {
      setLoadingSwitch(true);
      const response = await deviceService.turnOnOffDeviceConfig(config.id, !on);
      setOn(response.data.action);
    } catch {
      console.error('Error');
    } finally {
      setLoadingSwitch(false);
    }
  };

  return (
    <Card
      key={config.id}
      className={`rounded-2xl border border-green-700 bg-green-50 shadow-md transition-all hover:shadow-lg p-6 gap-2 ${
        loadingSwitch ? 'opacity-60 pointer-events-none' : ''
      }`}
    >
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='text-2xl font-bold text-green-900'>{config.name}</div>
        <div className='flex items-center gap-x-3'>
          <Spinner show={loadingSwitch} />
          <ToggleSwitch
            disabled={loadingSwitch}
            width={60}
            height={30}
            checked={on}
            onChange={() => handleSchedulerOn()}
          />
          <AutoConfigEditModal 
            setRefresh={setRefresh} 
            config={config}
            deviceType={deviceType} />
          <DeleteSchedulerConfig
            configId={config.id}
            setRefresh={setRefresh}
            setLoading={setLoadingSwitch}
          />
        </div>
      </div>

      {/* Info */}
      <div className='space-y-1 text-green-900'>
        <div className='text-green-900 mb-1'>
          <span className='font-semibold'>Hành động: </span>
          <span
            className={`ml-2 font-semibold ${
              config.changePower ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {config.changePower ? `Bật ${deviceType ? '- ' + config.changePower+'%' : ''}` : 'Tắt'}
          </span>
        </div>

        <div>
          <span className='font-semibold'>Điều kiện:</span>
          <ul className='mt-1 text-sm font-medium'>
            {config.automationConfig.Condition.map((cond) => (
              <li key={cond.id} className='flex items-center text-medium'>
                <Leaf className='inline h-4 w-4 mx-2'/>{cond.sensorId} {displayComparison(cond.condition)} {cond.threshold}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className='font-semibold'>Mô tả: </span>
          <span>{config.description || EMPTY_STRING}</span>
        </div>
      </div>
    </Card>
  );
};

export default AutomationCard;
