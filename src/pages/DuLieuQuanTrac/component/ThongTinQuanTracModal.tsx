import { Modal } from '../../../components/Modal/modal';
import { ISensorVisualData } from '../../../types/SensorTypes';
import { EMPTY_STRING } from '../../../utils/constants';
import {
  Bell,
  TrendingDown,
  TrendingUp,
  FileText,
  AlarmClock,
  Mail,
  Thermometer,
} from 'lucide-react';

interface ThongTinQuanTracModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ISensorVisualData;
}

export function ThongTinQuanTracModal({
  isOpen,
  onClose,
  data,
}: ThongTinQuanTracModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onBackdropClick={onClose}
      title="Thông tin quan trắc"
    >
      <div className="space-y-6 text-base text-gray-800">
        {/* Sensor Name */}
        <div className="text-center border-b pb-4">
          <h3 className="text-2xl font-bold text-green-700">{data.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{data.description}</p>
        </div>

        {/* Alert Information */}
        <div className="space-y-2 border-b pb-4">
          <div className="flex items-center gap-2 text-green-700 font-semibold">
            <Bell className="w-5 h-5" />
            Cảnh báo khi vượt ngưỡng lý tưởng
          </div>
          <div className="grid grid-cols-1 gap-2 pl-6 mt-2 text-gray-700">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Thấp nhất:</span>{' '}
              {data.lowerbound ?? EMPTY_STRING}
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Cao nhất:</span>{' '}
              {data.upperbound ?? EMPTY_STRING}
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Mô tả cảnh báo:</span>{' '}
              {data.alertDes ?? EMPTY_STRING}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Nhận thông báo:</span>{' '}
              {data.email ? 'Email' : EMPTY_STRING}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-3 text-gray-700">
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Đơn vị:</span> {data.unit}
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Giá trị gần nhất:</span>{' '}
            {data.value} {data.unit}
          </div>
          <div className="flex items-center gap-2">
            <AlarmClock className="w-5 h-5 text-gray-500" />
            <span className="font-medium">Cập nhật:</span>{' '}
            {data.date.toLocaleString('en-GB')}
          </div>
        </div>
      </div>
    </Modal>
  );
}
