import React, { useState } from 'react';
import { Card } from '../../../components/UI/card';
import ToggleSwitch from '../../../components/UI/ToggleSwitch';
import { deviceService } from '../../../services/deviceService';
import { Spinner } from '../../../components/UI/spinner';
import DeleteSchedulerConfig from './DeleteSchedulerConfig';
import SchedulerConfigEditModal from './SchedulerConfigEditModal';
import { DAY_OF_WEEK } from '../../../utils/constants';
import { IDeviceConfig } from '../../../types/DeviceTypes';

interface SchedulerCardProps {
  config: IDeviceConfig;
  deviceType: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const SchedulerCard: React.FC<SchedulerCardProps> = ({ config, deviceType, setRefresh }) => {
  const [on, setOn] = useState<boolean>(config.action);
  const [loadingSwitch, setLoadingSwitch] = useState<boolean>(false);

  const activeDays = config.schedulerConfig.repitation.map((day) => day.slice(0, 3).toUpperCase());

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
      className={`rounded-2xl p-6 border border-green-800 bg-green-50 shadow-sm transition hover:shadow-md ${
        loadingSwitch ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h3 className='text-4xl font-bold text-green-900'>
          {config.schedulerConfig.start} - {config.schedulerConfig.end}
        </h3>
        <div className='flex items-center gap-3'>
          <Spinner show={loadingSwitch} />
          <ToggleSwitch
            disabled={loadingSwitch}
            width={60}
            height={30}
            checked={on}
            onChange={() => handleSchedulerOn()}
          />
          <SchedulerConfigEditModal
            config={config}
            deviceType={deviceType}
            setRefresh={setRefresh}
          />
          <DeleteSchedulerConfig
            configId={config.id}
            setRefresh={setRefresh}
            setLoading={setLoadingSwitch}
          />
        </div>
      </div>

      <div>
        {/* Status */}
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

        {/* Repeat Days */}
        <div className='flex items-center justify-between'>
          <p className='font-semibold text-green-900'>Lặp lại:</p>
          <div className='flex flex-wrap gap-2'>
            {DAY_OF_WEEK.map(({ label, code }) => {
              const isActive = activeDays.includes(code);
              return (
                <div
                  key={code}
                  className={`h-8 w-8 rounded-full text-sm font-semibold flex items-center justify-center border-2 transition-all
                    ${isActive
                      ? 'bg-green-800 text-white border-green-800'
                      : 'text-green-900 border-green-300 bg-white opacity-40'}
                  `}
                >
                  {label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SchedulerCard;
