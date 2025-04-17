import React, { useState } from 'react'
import { Card } from '../../../components/UI/card'
import ToggleSwitch from '../../../components/UI/ToggleSwitch';
import { deviceService } from '../../../services/deviceService';
import { Spinner } from '../../../components/UI/spinner';
import DeleteSchedulerConfig from './DeleteSchedulerConfig';
import { DAY_OF_WEEK } from '../../../utils/constants';
import SchedulerConfigEditModal from './SchedulerConfigEditModal';
import { IDeviceConfig } from '../../../types/DeviceTypes';

interface SchedulerCardProps {
  config: IDeviceConfig;
  deviceType: number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
}

const SchedulerCard: React.FC<SchedulerCardProps> = (props) => {
  const { config, deviceType, setRefresh } = props;
  const [ on, setOn ] = useState<boolean>(config.action);
  const [ loadingSwitch, setLoadingSwitch] = useState<boolean>(false);

  const activeDays = config.schedulerConfig.repitation.map(day => day.slice(0, 3).toUpperCase());

  const handleSchedulerOn = async() => {
    try {
      setLoadingSwitch(true);
      const response = await deviceService.turnOnOffDeviceConfig(config.id,!on);
      setOn(response.data.action);
    }
    catch {
      console.error('Error')
    } finally {
      setLoadingSwitch(false);
    }
  }

  return (
    <Card key={config.id} className={`bg-green-200 rounded-lg p-4 shadow-none border-green-900 border-[1px] ${loadingSwitch ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div className='flex items-center justify-between'>
        <div className="text-4xl font-semibold text-green-950">
          {`${config.schedulerConfig.start} - ${config.schedulerConfig.end}`}
        </div>
        <div className='flex align-center gap-x-4'>
          <Spinner show={loadingSwitch}/>
          <ToggleSwitch disabled={loadingSwitch} width={60} height={30} checked={on} onChange={(_) => handleSchedulerOn()}/>
          <SchedulerConfigEditModal config={config} deviceType={deviceType} setRefresh={setRefresh}/>
          <DeleteSchedulerConfig configId={config.id} setRefresh={setRefresh} setLoading={setLoadingSwitch}/>
        </div>
      </div>
      
      <div className='flex items-center justify-between'>
        <p>Lặp lại</p>
        <div className='flex flex-wrap justify-center'>
          {DAY_OF_WEEK.map(({ label, code }) => {
            const isActive = activeDays.includes(code);
            return (
              <div
                key={code}
                className={`h-8 w-8 text-sm font-medium flex items-center justify-center rounded-full m-1 border-2
                  ${isActive ? 'bg-green-900 text-white border-green-900' : 'text-green-900 border-green-900 opacity-30'}
                `}
              >
                <span>{label}</span>
              </div>
            )
          })}
        </div>
      </div>   
      <p>
        Trạng thái điều chỉnh:{' '}
        <span className='font-semibold'>
          {config.changePower? `Bật ${deviceType? '- ' + config.changePower : ''}` : 'Tắt'}
        </span>
      </p>         
    </Card>
  )
}

export default SchedulerCard