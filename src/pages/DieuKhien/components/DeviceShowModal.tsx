import { Info } from 'lucide-react';
import { Modal } from '../../../components/Modal/modal';
import { useModal } from '../../../hooks/useModal';
import { IDevice } from '../../../types/DeviceTypes';
import { EMPTY_STRING } from '../../../utils/constants';
import { useEffect, useState } from 'react';
import { deviceService } from '../../../services/deviceService';
import ToastMessage from '../../../components/ToastNotification/ToastMessage';
import toast from 'react-hot-toast';
import { Spinner } from '../../../components/UI/spinner';

interface DeviceShowModalProps {
    deviceId: string | number;
}

const DeviceShowModal: React.FC<DeviceShowModalProps> = (props) => {
  const { deviceId } = props;
  const modal = useModal();
  const [deviceInfo, setDeviceInfo] = useState<IDevice | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        setLoading(true);
        const response = await deviceService.getDeviceById(deviceId);
        setDeviceInfo(response.data);
      } catch (error) {
        toast.error(<ToastMessage mainMessage='Lỗi' description={typeof error === 'string' ? error : 'Đã xảy ra lỗi'}/>)
      } finally {
        setLoading(false);
      }
    };

    if (modal.isOpen && deviceId) {
      fetchDevice();
    }
  }, [modal.isOpen, deviceId]);

  return (
    <>
        <button onClick={modal.open}>
          <Info className='h-5 w-5'/>
        </button>
        <Modal
          isOpen={modal.isOpen}
          onClose={modal.close}
          onBackdropClick={modal.handleBackdropClick}
          title="Thông tin thiết bị"
          >
          <Spinner show={loading}/>
          <div className={`space-y-6 text-base text-gray-800 ${loading? "opacity-30" : ""}`}>
              {/* Device Name Header */}
              <div className="border-b pb-4 w-full">
                  <h3 className="text-3xl font-semibold text-green-700 flex items-center justify-center">
                    {deviceInfo?.name || EMPTY_STRING}
                  </h3>
              </div>

              {/* Info Card */}
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 p-4 bg-green-100 rounded-xl text-base">
                <span className="font-semibold text-green-900">Feed:</span>
                <span>{deviceInfo?.feed || EMPTY_STRING}</span>

                <span className="font-semibold text-green-900">Loại thiết bị:</span>
                <span>
                  <span className="inline-block px-3 py-1 border border-green-300 text-green-700 rounded-md bg-white">
                    {deviceInfo?.type ? "Theo cường độ" : "Bật/Tắt"}
                  </span>
                </span>

                <span className="font-semibold text-green-900">Mô tả:</span>
                <span className="whitespace-pre-wrap">{deviceInfo?.description || EMPTY_STRING}</span>
              </div>


              <p className="text-sm text-center text-gray-600 mt-8 italic">
                  🌱 Thiết bị này sẽ hiển thị trên bảng tổng hợp điều khiển
              </p>
          </div>
        </Modal>
    </>
    
  );
}

export default DeviceShowModal;
