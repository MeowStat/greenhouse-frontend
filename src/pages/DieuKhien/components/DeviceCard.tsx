import React, { useEffect, useState } from 'react';

import ToggleSwitch from '../../../components/UI/ToggleSwitch';
import { deviceService } from '../../../services/deviceService';
import { IDeviceConfig } from '../../../types/DeviceTypes';
import { Spinner } from '../../../components/UI/spinner';
import { Slider } from '../../../components/UI/slider';
import { Settings, Zap } from 'lucide-react';
import { useDebounce } from "use-debounce";
import { useNavigate } from 'react-router-dom';
import ToastMessage from '../../../components/ToastNotification/ToastMessage';
import toast from 'react-hot-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/UI/tooltip';
import { displayComparison } from '../../../lib/utils';

interface DeviceCardProps {
  id: string | number;
  name: string;
  description: string;
  power: number;
  status: boolean;
  deviceType: number;
}

const dayMap = {
  sun: "CN", mon: "T2", tue: "T3", wed: "T4",
  thu: "T5", fri: "T6", sat: "T7",
};

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

  const schedulerConfig = dataConfig.filter((config) => config.automationConfig === null && config.action === true);
  const automationConfig = dataConfig.filter((config) => config.schedulerConfig === null && config.action === true);

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
    const fetchDeviceConfig = async (deviceId: string | number) => {
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

    if (debouncedSliderValue === power) return;
    
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
      <div className="bg-green-100 xl:max-w-screen-xl mx-auto rounded-lg px-6 py-4 mb-6 shadow-md relative">
        <div className="grid grid-cols-12 gap-2">
          {/* Device Info */}
          <div className="col-span-3 flex flex-col items-start justify-center border-r-[2px] border-black pr-3">
            <span className="text-3xl font-bold text-green-950">{name}</span>
            <span className="text-sm text-gray-600">{description}</span>
          </div>
  
          {/* Device Details */}
          <div className="col-span-9 pl-4">
            {loadingConfig ? (
              <Spinner show={loadingConfig} size="large" />
            ) : (
              <div className="flex flex-col justify-start">
                {/* Manual Control */}
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900">Thủ công</h2>
                  <p className='text-sm'>{dataConfig[0]?.description}</p>
                  <div className="flex mt-2 items-center gap-x-4">
                    {!deviceType ? (
                      <ToggleSwitch
                        checked={on}
                        onChange={() => handleSwitch(!on)}
                        enableText="Bật"
                        disableText="Tắt"
                        disabled={loadingSwitch}
                      />
                    ) : (
                      <div
                        className={`w-80 ${
                          loadingSwitch ? 'cursor-not-allowed opacity-30' : ''
                        }`}
                      >
                        <Slider
                          min={0}
                          max={100}
                          step={20}
                          value={[sliderValue]}
                          onValueChange={handleSliderChange}
                        />
                        <span className="mt-3 flex items-center gap-0.5 text-sm font-medium text-gray-800"><Zap className='h-4 w-4'/>Cường độ: {sliderValue}%</span>
                      </div>
                    )}
                    <Spinner show={loadingSwitch} size="small" />
                  </div>
                </div>
  
                {/* Automation and Scheduler */}
                <div className="flex gap-x-6">
                  {/* Automation */}
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger>
                        <div
                          className={`inline-flex items-center px-4 py-2 rounded-md border-2 text-sm ${
                            automationConfig.length
                              ? 'border-green-500 text-green-700 font-semibold bg-green-50'
                              : 'border-gray-300 text-gray-500 bg-gray-50 font-medium'
                          }`}
                        >
                          <span className="relative mr-2 flex h-3 w-3">
                            {automationConfig.length ? (
                              <>
                                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
                                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                              </>
                            ) : (
                              <span className="relative inline-flex h-3 w-3 rounded-full bg-gray-400 shadow-inner" />
                            )}
                          </span>
                          Tự động
                        </div>
                      </TooltipTrigger>
  
                      <TooltipContent className="max-h-60 overflow-y-auto max-w-[280px] px-4 bg-green-950 text-green-100 shadow-xl border border-green-700 rounded-md">
                        {automationConfig.map((a, i) => (
                          <div key={i} className="mb-2 last:mb-0">
                            <div
                              className={`font-semibold ${
                                a.changePower ? 'text-green-300' : 'text-red-400'
                              }`}
                            >
                              {a.changePower
                                ? `Bật ${deviceType ? '- ' + a.changePower + '%' : ''}`
                                : 'Tắt'}
                            </div>
                            <div className="mt-1 text-sm">
                              <ul className="list-inside mt-1 space-y-0.5 text-xs">
                                {a.automationConfig.Condition.map((cond, j) => (
                                  <li key={j}>
                                    {cond.sensorId} {displayComparison(cond.condition)}{' '}
                                    {cond.threshold}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {i < automationConfig.length - 1 && (
                              <hr className="my-2 border-green-800" />
                            )}
                          </div>
                        ))}
                        {!automationConfig.length && (
                          <div className="text-sm text-gray-200">Không kích hoạt</div>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
  
                  {/* Scheduler */}
                  <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger>
                        <div
                          className={`inline-flex items-center px-4 py-2 rounded-md border-2 text-sm ${
                            schedulerConfig.length
                              ? 'border-green-500 text-green-700 font-semibold bg-green-50'
                              : 'border-gray-300 text-gray-500 bg-gray-50 font-medium'
                          }`}
                        >
                          <span className="relative mr-2 flex h-3 w-3">
                            {schedulerConfig.length ? (
                              <>
                                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
                                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                              </>
                            ) : (
                              <span className="relative inline-flex h-3 w-3 rounded-full bg-gray-400 shadow-inner" />
                            )}
                          </span>
                          Hẹn giờ
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-h-60 overflow-y-auto max-w-[280px] px-4 bg-green-950 text-green-100 shadow-xl border border-green-700 rounded-md">
                        {schedulerConfig.map((s, i) => (
                          <div key={i} className="mb-2 last:mb-0">
                            <div
                              className={`font-semibold ${
                                s.changePower ? 'text-green-300' : 'text-red-400'
                              }`}
                            >
                              {s.changePower
                                ? `Bật ${deviceType ? '- ' + s.changePower + '%' : ''}`
                                : 'Tắt'}
                            </div>
                            <div className="font-medium">
                              {s.schedulerConfig.start} → {s.schedulerConfig.end}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1 text-xs">
                              {s.schedulerConfig.repitation.map((day) => (
                                <span
                                  key={day}
                                  className="border-gray-100 border px-1.5 py-0.5 rounded font-medium"
                                >
                                  {dayMap[day as keyof typeof dayMap]}
                                </span>
                              ))}
                            </div>
                            {i < schedulerConfig.length - 1 && (
                              <hr className="my-2 border-gray-200" />
                            )}
                          </div>
                        ))}
                        {!schedulerConfig.length && (
                          <div className="text-sm text-gray-200">Không kích hoạt</div>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            )}
          </div>
        </div>
  
        {/* Config Button */}
        <button
          onClick={() => navigate(`/dieu-khien/${id}/cau-hinh`)}
          className="absolute bottom-5 right-6 text-gray-500 hover:text-gray-700 hover:cursor-pointer hover:underline"
        >
          <Settings className="h-5 w-5 inline mr-1" />
          <span className="text-sm">Cấu hình</span>
        </button>
      </div>
    </>
  );
  
};

export default DeviceCard;
