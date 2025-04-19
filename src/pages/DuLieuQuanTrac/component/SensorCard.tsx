'use client';

import { useState } from 'react';
import { ThongTinQuanTracModal } from './ThongTinQuanTracModal';
import { ISensorVisualData } from '../../../types/SensorTypes';

interface SensorCardProps {
  data: ISensorVisualData;
}

export const SensorCard: React.FC<SensorCardProps> = (props) => {
  const { data } = props;
  const [showInfo, setShowInfo] = useState(false);

  const getBackgroundColor = (unit?: string) => {
    switch (unit) {
      case 'độ C': // Temperature
        return 'bg-orange-100';
      case '%RH': // Air Humidity
        return 'bg-blue-100';
      case 'Lux': // Light Intensity
        return 'bg-yellow-100';
      case '%': // Soil Quality
        return 'bg-green-100'; // Use green for soil-related data
      default: // Default background
        return 'bg-gray-100';
    }
  };

  return (
    <>
      <div
        className={`${getBackgroundColor(
          data.unit
        )} rounded-lg py-4 px-4 mb-6 shadow-md relative`}
      >
        <div className="grid grid-cols-16 items-center gap-4">
          {/* Value and Unit */}
          <div className="col-span-3 flex flex-col items-center justify-center">
            <span className="text-6xl font-bold text-gray-800">
              {data.value}
            </span>
            <span className="text-2xl text-gray-600">{data.unit}</span>
          </div>

          {/* Sensor Details */}
          <div className="col-span-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {data.name}
            </h2>
            <p className="text-gray-700 mb-1">{data.description}</p>
            <p className="text-gray-500 text-sm">
              Thời gian cập nhật: {data.date.toLocaleString('en-GB')}
            </p>
            {data.warning && data.alertDes && (
              <div className="flex items-center mt-2">
                <div className="w-3 h-3 rounded-full bg-red-600 mr-2 animate-pulse"></div>
                <span className="text-red-600 font-medium">
                  {data.alertDes}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* More Info Button */}
        <button
          onClick={() => setShowInfo(true)}
          className="absolute bottom-4 right-4 text-gray-500 hover:text-gray-700 hover:cursor-pointer hover:underline"
        >
          <span className="text-sm italic">Thông tin thêm &gt;&gt;</span>
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
