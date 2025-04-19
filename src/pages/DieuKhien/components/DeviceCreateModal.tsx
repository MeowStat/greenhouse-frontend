import { useForm, Controller } from 'react-hook-form';
import { Check, Plus } from 'lucide-react';
import { useModal } from '../../../hooks/useModal';
import { Modal } from '../../../components/Modal/modal';
import toast from 'react-hot-toast';
import ToastMessage from '../../../components/ToastNotification/ToastMessage';
import { deviceService } from '../../../services/deviceService';
import { Spinner } from '../../../components/UI/spinner';
import { useState } from 'react';

interface FormData {
  name: string;
  feed: string;
  type: 0 | 1;
  description: string;
  prefixMessage: string;
}

interface DeviceCreateModalProps {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeviceCreateModal: React.FC<DeviceCreateModalProps> = (props) => {
  const { setRefresh } = props;
  const [loading, setLoading] = useState(false);

  const modal = useModal();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      feed: '',
      type: 0,
      description: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const formattedData = {...data, prefixMessage: ''};
      await deviceService.createDevice(formattedData);
      reset();
      setRefresh((prev) => !prev);
      modal.close();
      toast.success(
          <ToastMessage
              mainMessage="Tạo mới thành công"
          />
      );
    } catch {
        toast.error(
            <ToastMessage
              mainMessage="Tạo mới không thành công"
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
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">Thêm mới thiết bị điều khiển</span>
      </button>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        onBackdropClick={modal.handleBackdropClick}
        title="Thêm thiết bị điều khiển"
      >
        <div className="overflow-y-auto max-h-[80vh]">
          <form
            id="createSensorForm"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 px-4 py-4"
          >
            {/* Name Field */}
            <div className="space-y-1">
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
                    } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    placeholder="Nhập tên feed"
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
          <Spinner show={loading}/>
          <button
            type="submit"
            className={`px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md text-lg font-medium
              ${loading? "cursor-not-allowed opacity-30" : ""}
              `}
            form="createSensorForm"
          >
            Lưu
          </button>
        </div>
        
      </Modal>
    </>
  );
};

export default DeviceCreateModal;
