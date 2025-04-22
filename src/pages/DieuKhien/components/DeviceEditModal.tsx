import { useForm, Controller } from 'react-hook-form';
import { Check, PenLine } from 'lucide-react';
import { useModal } from '../../../hooks/useModal';
import { Modal } from '../../../components/Modal/modal';
import toast from 'react-hot-toast';
import ToastMessage from '../../../components/ToastNotification/ToastMessage';
import { deviceService } from '../../../services/deviceService';
import { useEffect, useState } from 'react';
import { IDevice } from '../../../types/DeviceTypes';
import { Spinner } from '../../../components/UI/spinner';

interface FormData {
  name: string;
  feed: string;
  type: number;
  description: string;
  prefixMessage: string;
}

interface DeviceEditModalProps {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  deviceId: string | number;
}

const DeviceEditModal: React.FC<DeviceEditModalProps> = (props) => {
  const { setRefresh, deviceId } = props;
  const [deviceInfo, setDeviceInfo] = useState<IDevice | null>(null);
  const [loading, setLoading] = useState(false);

  const modal = useModal();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: deviceInfo?.name,
      feed: deviceInfo?.feed,
      type: deviceInfo?.type,
      description: deviceInfo?.description,
      prefixMessage: deviceInfo?.prefixMessage || '',
    },
  });

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        setLoading(true);
        const response = await deviceService.getDeviceById(deviceId);
        setDeviceInfo(response.data);
        reset({
            name: response.data.name,
            feed: response.data.feed,
            type: response.data.type,
            description: response.data.description,
            prefixMessage: response.data.prefixMessage || '',
          });
      } catch (error) {
        toast.error(<ToastMessage mainMessage='Lỗi' description={typeof error === 'string' ? error : 'Đã xảy ra lỗi'}/>)
      } finally {
        setLoading(false);
      }
    };

    if (modal.isOpen && deviceId) {
      fetchDevice();
    }
  }, [modal.isOpen, deviceId, reset]);

  const onSubmit = async (data: FormData) => {
    try {
        setLoading(true);
        const formattedData = {...data};
        await deviceService.updateDeviceInfo(deviceId,formattedData);
        setRefresh((prev) => !prev);
        toast.success(
            <ToastMessage
                mainMessage="Cập nhật thành công"
            />
        );
    } catch {
        toast.error(
            <ToastMessage
              mainMessage="Cập nhật không thành công"
              description="Vui lòng thử lại"
            />)
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      {/* Add New Button */}
      <button
        onClick={modal.open}
      >
        <PenLine className='h-5 w-5'/>
      </button>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        onBackdropClick={modal.handleBackdropClick}
        title="Cập nhật thông tin thiết bị"
      >
        <Spinner show={loading} />
        <div className={`overflow-y-auto max-h-[80vh] ${loading ? "opacity-40 cursor-not-allowed":""}`}>
          <form
            id="editDeviceForm"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 px-4 py-4"
          >
            {/* Name Field */}
            <div className={`space-y-1 ${loading ? "opacity-40 cursor-not-allowed":""}`}>
              <label className="block text-lg font-medium text-gray-700">
                Tên
              </label>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Tên là bắt buộc' }}
                render={({ field }) => (
                  <input
                    {...field}
                    className={`w-full border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    placeholder="Nhập tên thiết bị"
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Alias Field */}
            <div className="space-y-1">
              <label className="block text-lg font-medium text-gray-700">
                Alias
              </label>
              <Controller
                name="prefixMessage"
                control={control}
                rules={{ required: 'Alias là bắt buộc' }}
                render={({ field }) => (
                  <input
                    {...field}
                    className={`w-full border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                     disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed`}
                    disabled={true}
                  />
                )}
              />
              {errors.prefixMessage && (
                <p className="text-red-500 text-sm">{errors.prefixMessage.message}</p>
              )}
            </div>

            {/* Feed Field */}
            <div className="space-y-1">
              <label className="block text-lg font-medium text-gray-700">
                Feed
              </label>
              <Controller
                name="feed"
                control={control}
                rules={{ required: 'Feed là bắt buộc' }}
                render={({ field }) => (
                  <input
                    {...field}
                    className={`w-full border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 
                      disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed`}
                    disabled={true}
                  />

                )}
              />
              {errors.feed && (
                <p className="text-red-500 text-sm">{errors.feed.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-800">
                Cấu hình trạng thái
              </label>

              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <div className="flex items-center justify-center bg-gray-100 rounded-full p-1 w-full">
                    <button
                      type="button"
                      className={`px-4 py-2 flex-1 text-sm font-semibold rounded-full transition-all duration-200 ${
                      field.value === 0
                          ? 'bg-green-100 text-green-700 shadow-sm'
                          : 'text-gray-700'
                      }`}
                      onClick={() => field.onChange(0)}
                    >
                      <div className='flex justify-center align-center gap-4'>
                        <Check className={field.value === 0 ? "" : "hidden"}/>
                        <span>Bật/Tắt</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 flex-1 text-sm font-semibold rounded-full transition-all duration-200 ${
                      field.value === 1
                          ? 'bg-green-100 text-green-700 shadow-sm'
                          : 'text-gray-700'
                      }`}
                      onClick={() => field.onChange(1)}
                    >
                      <div className='flex justify-center align-center gap-4'>
                        <Check className={field.value === 1 ? "" : "hidden"}/>
                        <span>Theo cường độ</span>
                      </div>
                    </button>
                  </div>
                )}
              />
            </div>

            {/* Description Field */}
            <div className="space-y-1">
              <label className="block text-lg font-medium text-gray-700">
                Mô tả
              </label>
              <Controller
                name="description"
                control={control}
                rules={{ required: 'Mô tả là bắt buộc' }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className={`w-full border ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[100px]`}
                    placeholder="Nhập mô tả chi tiết"
                  />
                )}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
          </form>
        </div>
        {/* Submit Button */}
        <div className="flex justify-end gap-x-2">
          <button
            className={
              `px-6 py-2 text-green-800 border-green-800 border-1 rounded-lg  transition-colors shadow-md text-lg font-medium  
              ${loading ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-50 cursor-pointer'}`
            }
            onClick={() => reset()}
          >
            Đặt lại
          </button>
          <button
            type="submit"
            className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md text-lg font-medium
                ${loading? "cursor-not-allowed opacity-30" : ""}
                `}
            form="editDeviceForm"
            >
            {loading ? (
              <Spinner size="small" />
            ) : (
              'Lưu'
            )}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default DeviceEditModal;
