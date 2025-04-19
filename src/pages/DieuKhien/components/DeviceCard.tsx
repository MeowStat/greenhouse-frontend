import React, { useEffect, useState } from 'react';

import ToggleSwitch from '../../../components/UI/ToggleSwitch';
import { deviceService } from '../../../services/deviceService';
import { IDeviceConfig } from '../../../types/DeviceTypes';
import { Spinner } from '../../../components/UI/spinner';
import { Slider } from '../../../components/UI/slider';
import { Settings } from 'lucide-react';
import { useDebounce } from "use-debounce";
import { useNavigate } from 'react-router-dom';
import ToastMessage from '../../../components/ToastNotification/ToastMessage';
import toast from 'react-hot-toast';

interface DeviceCardProps {
  id: string;
  name: string;
  description: string;
  power: number;
  status: boolean;
  deviceType: number;
}

const DeviceCard: React.FC<DeviceCardProps> = (props) => {
  const { name, description, id, power, status, deviceType } = props;

  const navigate = useNavigate();

  const [on, setOn] = useState(status);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [loadingSwitch, setLoadingSwitch] = useState(false);
  const [sliderValue, setSliderValue] = useState<number>(power);
  const [debouncedSliderValue] = useDebounce(sliderValue, 750);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const [dataConfig, setDataConfig] = useState<IDeviceConfig[]>([]);

  const handleSwitch = async (status: boolean) => {
    try {
      setLoadingSwitch(true);
      const response = await deviceService.turnOnOffDevice(id, status);
      console.log('Turn On/Off Device Response:', response.data);
      setOn(status);
    } catch (error) {
      console.error('Error turning device on/off:', error);
      return null;
    } finally {
      setLoadingSwitch(false);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0]);
  }

  useEffect(() => {
    const fetchDeviceConfig = async (deviceId: string) => {
      try {
        setLoadingConfig(true);
        const response = await deviceService.getDeviceConfig(deviceId);
        setDataConfig(response.data);
        console.log('Device Config:', response.data);
      } catch (error) {
        console.error('Error fetching device config:', error);
        return null;
      } finally {
        setLoadingConfig(false);
      }
    };

    fetchDeviceConfig(id);
  }, [id]);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return; // Skip the first execution
    }
    
    const updateDevicePower = async (power: number) => {
      try {
        setLoadingSwitch(true);
        await deviceService.updateDeviceInfo(id, { power });
        await deviceService.turnOnOffDevice(id, power? true : false)
      } catch (error) {
        toast.error(<ToastMessage mainMessage='Lỗi' description='Vui lòng thử lại'/>);
      } finally {
        setLoadingSwitch(false);
      }
    };

    updateDevicePower(debouncedSliderValue);
  },[debouncedSliderValue]);

  return (
    <>
      <div className={`bg-green-100 min-h-2xl rounded-lg py-4 px-8 mb-6 shadow-md relative`}>
        <div className="grid grid-cols-16 gap-4">
          {/* Device Info */}
          <div className="col-span-4 flex flex-col items-start justify-center border-r-[2px] border-black pr-4">
            <span className="text-3xl font-bold text-gray-800">{name}</span>
            <span className="text-base text-gray-600">{description}</span>
          </div>

          {/* Device Details */}
          <div className="flex pl-4 col-span-10">
            {loadingConfig ? (
              <Spinner show={loadingConfig} size="large" />
            ) : (
              <div className="flex flex-1 flex-col justify-start">
                {/* Scheduler Config */}
                {dataConfig.map(
                  (config) =>
                    config?.schedulerConfig && (
                      <div
                        className="flex flex-col justify-start mb-4"
                        key={config.id}
                      >
                        <h2 className="text-2xl font-semibold text-gray-900">
                          Hẹn giờ
                        </h2>
                        <p>
                          Bật trong khung giờ {config.schedulerConfig.start} -{' '}
                          {config.schedulerConfig.end}
                        </p>
                      </div>
                    )
                )}

                {/* Automation Config */}
                {dataConfig.map(
                  (config) =>
                    config?.automationConfig?.Condition?.length > 0 && (
                      <div
                        className="flex flex-col justify-start mb-4"
                        key={config.id}
                      >
                        <h2 className="text-2xl font-semibold text-gray-900">
                          Tự động
                        </h2>
                        {config.automationConfig.Condition.map(
                          (condition, index) => (
                            <p key={index}>{condition.description}</p>
                          )
                        )}
                      </div>
                    )
                )}

                {dataConfig.length && (dataConfig[0]?.schedulerConfig || dataConfig[0]?.automationConfig?.Condition?.length) ? (
                  <div className=" bg-gray-400 h-px w-full mb-2"></div>
                ) : null}

                {/* Manual Control */}
                <div className="flex flex-col justify-start mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Thủ công
                  </h2>
                  <p>{dataConfig[0]?.description}</p>
                  <div className="flex mt-4 items-center gap-x-2">
                    <Spinner show={loadingSwitch} size="small" />
                    { !deviceType ? 
                      <ToggleSwitch
                        checked={on}
                        onChange={() => handleSwitch(!on)}
                        enableText="Bật"
                        disableText="Tắt"
                        disabled={loadingSwitch}
                      />
                      :
                      <div className={`flex align-center w-100
                        ${loadingSwitch ? 'cursor-not-allowed opacity-30' : 'text-red-600'}`}>
                        <Slider
                          min={0}
                          max={100}
                          step={10}
                          title="Cường độ:"
                          value={[sliderValue]}
                          onValueChange={handleSliderChange}
                        />
                      </div>}
                  </div>
                </div> 
              </div>
            )}
          </div>
        </div>

        {/* Config Button */}
        <button
          onClick={() => navigate(`/dieu-khien/${id}/cau-hinh`)}
          className="absolute bottom-4 right-4 text-gray-500 hover:text-gray-700 hover:cursor-pointer hover:underline"
        >
          <Settings className="h-5 w-5 inline mr-1" />
          <span className="text-sm">Cấu hình</span>
        </button>
      </div>
    </>
  );
};

export default DeviceCard;
