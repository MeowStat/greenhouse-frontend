import { useForm, Controller } from 'react-hook-form';
import { useModal } from '../../../hooks/useModal';
import { Modal } from '../../../components/Modal/modal';
import { sensorDataService } from '../../../services/sensorDataService';
import toast from 'react-hot-toast';
import ToastMessage from '../../../components/ToastNotification/ToastMessage';
import { UNITS } from '../../../utils/constants';
import { useEffect, useState } from 'react';
import { Spinner } from '../../../components/UI/spinner';
import { PenLine } from 'lucide-react';

interface FormData {
  name: string;
  feed: string;
  upperbound: number;
  lowerbound: number;
  unit: string;
  description: string;
}

interface EditQuanTracProps {
  monitorId: string;
  data?: FormData;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const updateMonitor = async (id: string, data: FormData) => {
  try {
    const response = await sensorDataService.updateMonitor(id, data);
    toast.success(
      <ToastMessage
        mainMessage="Cập nhật thành công"
        description="Đã cập nhật quan trắc thành công"
      />
    );
    return response;
  } catch (error) {
    toast.error(
      <ToastMessage
        mainMessage="Cập nhật không thành công"
        description={(error as Error).message}
      />
    );
    throw error;
  }
};

const EditQuanTrac: React.FC<EditQuanTracProps> = (props) => {
  const { monitorId, data, setRefresh } = props;
  const [loading, setLoading] = useState(false);

  const modal = useModal();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: data?.name || '',
      feed: data?.feed || '',
      upperbound: data?.upperbound || 0,
      lowerbound: data?.lowerbound || 0,
      unit: data?.unit || '',
      description: data?.description || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const formattedData = {
        ...data,
        upperbound: Number(data.upperbound),
        lowerbound: Number(data.lowerbound),
      };
      await updateMonitor(monitorId, formattedData);
      setRefresh((prev) => !prev);
      modal.close();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modal.isOpen) {
      reset({
        name: data?.name || '',
        feed: data?.feed || '',
        upperbound: data?.upperbound || 0,
        lowerbound: data?.lowerbound || 0,
        unit: data?.unit || '',
        description: data?.description || '',
      });
    }
  },[modal.isOpen]);

  return (
    <>
      <button
        className="p-1 hover:bg-green-100 rounded"
        title="Chỉnh sửa"
        onClick={() => modal.open()}
      >
        <PenLine className="h-5 w-5" />
      </button>
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        onBackdropClick={modal.handleBackdropClick}
        title="Chỉnh sửa thông tin quan trắc"
    >
      <div className="overflow-y-auto max-h-[80vh]">
        <form
          id="editSensorForm"
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
                  placeholder="Nhập tên quan trắc"
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

          {/* Min and Max Values */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-lg font-medium text-gray-700">
                Thông số thấp nhất
              </label>
              <Controller
                name="lowerbound"
                control={control}
                rules={{ required: 'Thông số thấp nhất là bắt buộc' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    className={`w-full border ${
                      errors.lowerbound ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    placeholder="Nhập giá trị thấp nhất"
                  />
                )}
              />
              {errors.lowerbound && (
                <p className="text-red-500 text-sm">
                  {errors.lowerbound.message}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-lg font-medium text-gray-700">
                Thông số cao nhất
              </label>
              <Controller
                name="upperbound"
                control={control}
                rules={{ required: 'Thông số cao nhất là bắt buộc' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    className={`w-full border ${
                      errors.upperbound ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    placeholder="Nhập giá trị cao nhất"
                  />
                )}
              />
              {errors.upperbound && (
                <p className="text-red-500 text-sm">
                  {errors.upperbound.message}
                </p>
              )}
            </div>
          </div>

          {/* Unit Field */}
          <div className="space-y-1">
            <label className="block text-lg font-medium text-gray-700">
              Đơn vị
            </label>
            <Controller
              name="unit"
              control={control}
              rules={{ required: 'Đơn vị là bắt buộc' }}
              render={({ field }) => (
                <select
                  {...field}
                  className={`w-full border ${errors.unit ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                >
                  {UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.unit && (
              <p className="text-red-500 text-sm">{errors.unit.message}</p>
            )}
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
          disabled={loading}
          className={`px-6 py-2 bg-green-600 text-white rounded-lg transition-colors shadow-md text-lg font-medium 
            ${
              loading
                ? 'cursor-not-allowed opacity-50'
                : 'hover:bg-green-700 cursor-pointer'
            }`}
          form="editSensorForm"
        >
          {loading ? <Spinner size="small" /> : 'Lưu'}
        </button>
      </div>
    </Modal>
    </>
  );
};

export default EditQuanTrac;
