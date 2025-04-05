import { Modal } from '../../../components/Modal/modal';
import { ISensorVisualData } from '../../../types/SensorTypes';
import { EMPTY_STRING } from '../../../utils/constants';

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
      <div className="space-y-6 text-lg">
        {/* Sensor Name */}
        <div className="border-b pb-4">
          <h3 className="text-2xl font-semibold text-green-800">
            Tên: {data.name}
          </h3>
        </div>

        {/* Alert Information */}
        <div className="border-b pb-4">
          <h4 className="font-medium text-green-700 mb-3">
            Kích hoạt cảnh báo khi vượt ngưỡng lý tưởng
          </h4>
          <div className="space-y-2 pl-6 text-gray-700">
            <p>
              <span className="font-semibold">+ Thông số lý tưởng thấp nhất:</span>{' '}
              {data.lowerbound ?? EMPTY_STRING}
            </p>
            <p>
              <span className="font-semibold">+ Thông số lý tưởng cao nhất:</span>{' '}
              {data.upperbound ?? EMPTY_STRING}
            </p>
            <p>
              <span className="font-semibold">+ Mô tả cảnh báo:</span>{' '}
              {data.alertDes ?? EMPTY_STRING}
            </p>
            <p>
              <span className="font-semibold">+ Nhận thông báo:</span>{' '}
              {data.email ? 'Email' : EMPTY_STRING}
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">Đơn vị:</span> {data.unit}
          </p>
          <p>
            <span className="font-semibold">Mô tả:</span> {data.description}
          </p>
          <p>
            <span className="font-semibold">Giá trị gần nhất:</span> {data.value}{' '}
            {data.unit}
          </p>
          <p>
            <span className="font-semibold">Thời gian cập nhật:</span>{' '}
            {data.date.toLocaleString('en-GB')}
          </p>
        </div>
      </div>
    </Modal>
  );
}