'use client';

import { useState } from 'react';
import { ThongTinQuanTracModal } from './ThongTinQuanTracModal';
import { ISensorVisualData } from '../../../types/SensorTypes';
import {
  Thermometer,
  Droplets,
  Sun,
  Info,
} from 'lucide-react'; // use lucide icons

interface SensorCardProps {
  data: ISensorVisualData;
}

export const SensorCard: React.FC<SensorCardProps> = ({ data }) => {
  const [showInfo, setShowInfo] = useState(false);

  const getTheme = (unit?: string) => {
    switch (unit) {
      case '°C':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-700',
          icon: <Thermometer className="w-7 h-7 text-orange-500" />,
        };
      case '%RH':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          icon: <Droplets className="w-8 h-8 text-blue-500" />,
        };
      case 'Lux':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
          icon: <Sun className="w-8 h-8 text-yellow-500" />,
        };
      case '%':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          icon: <Droplets className="w-6 h-6 text-blue-500" />,
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          icon: <Info className="w-6 h-6 text-gray-500" />,
        };
    }
  };

  const theme = getTheme(data.unit);

  return (
    <>
      <div
        className={`${theme.bg} rounded-2xl px-6 py-2 mb-4 shadow hover:shadow-lg transition-all duration-300 relative group`}
      >
        <div className="grid grid-cols-15 items-center gap-6">
          {/* Value & Icon */}
          <div className="col-span-3 flex flex-col items-center justify-center">
            <span className="font-bold text-[clamp(2.5rem,5vw,3.75rem)] text-gray-800">
              {data.value}
            </span>
            <div className="flex items-center gap-0.5 mb-1">
              {theme.icon}
              <span className="font-bold text-2xl text-gray-500">
                {data.unit}
              </span>
            </div>
          </div>

          {/* Sensor Details */}
          <div className="col-span-12 space-y-1">
            <h2 className={`text-2xl font-semibold ${theme.text}`}>
              {data.name}
            </h2>
            <p className="text-gray-700">{data.description}</p>

            {/* Alert Box */}
            {data.warning && data.alertDes && (
              <div className="flex items-center gap-x-2 mt-2 animate-pulse">
                <div className="relative flex items-center">
                  <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
                </div>
                <span className="text-red-600 font-medium">{data.alertDes}</span>
              </div>
            )}

            <p className="text-gray-500 text-sm">
              Cập nhật: {data.date.toLocaleString('en-GB')}
            </p>
          </div>
        </div>

        {/* More Info Button */}
        <button
          onClick={() => setShowInfo(true)}
          className="absolute bottom-4 right-4 text-sm text-gray-500 hover:text-gray-700 hover:underline transition"
        >
          Thông tin thêm &gt;&gt;
        </button>
      </div>

      {/* Modal */}
      <ThongTinQuanTracModal
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        data={data}
      />
    </>
  );
};
