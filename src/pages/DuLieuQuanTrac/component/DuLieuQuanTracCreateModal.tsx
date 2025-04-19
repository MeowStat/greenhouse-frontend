import { useForm, Controller } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { useModal } from '../../../hooks/useModal';
import { Modal } from '../../../components/Modal/modal';
import { useEffect, useState } from 'react';
import { sensorDataService } from '../../../services/sensorDataService';
import { ComboBox } from '../../../components/UI/combobox';
import toast from 'react-hot-toast';
import ToastMessage from '../../../components/ToastNotification/ToastMessage';

interface FormData {
  name: string;
  feed: string;
  upperbound: number;
  lowerbound: number;
  unit: string;
  description: string;
}

const createNewMonitor = async (data: FormData) => {
  try {
    const response = await sensorDataService.createNewMonitor(data);
    toast.success(
      <ToastMessage
        mainMessage="Tạo mới thành công"
        description="Đã tạo mới quan trắc thành công"
      />
    );
    return response;
  } catch (error) {
    toast.error(
      <ToastMessage
        mainMessage="Tạo mới không thành công"
        description={(error as Error).message}
      />
    );
    throw error;
  }
};

interface ThemMoiQuanTracProps {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThemMoiQuanTrac: React.FC<ThemMoiQuanTracProps> = (props) => {
  const { setRefresh } = props;

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
      upperbound: 0,
      lowerbound: 0,
      unit: '',
      description: '',
    },
  });

  const [feedList, setFeedList] = useState<string[]>([]);

  useEffect(() => {
    const fetchFeedList = async () => {
      try {
        const response = await sensorDataService.getAllFeed();
        setFeedList(response.data);
      } catch (error) {
        console.error('Error fetching feed list:', error);
      }
    };
    fetchFeedList();
  }, []);

  const handleCreateNewFeed = (newFeed: string) => {
    setFeedList((prev) => [...prev, newFeed]);
  };

  const onSubmit = async (data: FormData) => {
    const formattedData = {
      ...data,
      upperbound: Number(data.upperbound), // Convert to number
      lowerbound: Number(data.lowerbound), // Convert to number
    };

    console.log('Form Data:', formattedData);
    await createNewMonitor(formattedData);
    reset();
    setRefresh((prev) => !prev);
    modal.close();
  };

  return (
    <>
      {/* Add New Button */}
      <button
        onClick={modal.open}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">Thêm mới quan trắc</span>
      </button>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        onBackdropClick={modal.handleBackdropClick}
        title="Thêm mới quan trắc"
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
                Tên <span className="text-red-500">*</span>
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
                Feed <span className="text-red-500">*</span>
              </label>
              <Controller
                name="feed"
                control={control}
                rules={{ required: 'Feed là bắt buộc' }}
                render={({ field }) => (
                  <ComboBox
                    options={feedList} // Dynamic options
                    selected={field.value} // Controlled value
                    onChange={field.onChange} // Controlled onChange
                    onCreateNew={handleCreateNewFeed} // Handle creating a new feed
                    placeholder="Chọn feed"
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
                  Thông số thấp nhất <span className="text-red-500">*</span>
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
                  Thông số cao nhất <span className="text-red-500">*</span>
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
                Đơn vị <span className="text-red-500">*</span>
              </label>
              <Controller
                name="unit"
                control={control}
                rules={{ required: 'Đơn vị là bắt buộc' }}
                render={({ field }) => (
                  <input
                    {...field}
                    className={`w-full border ${
                      errors.unit ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                    placeholder="Nhập đơn vị đo lường"
                  />
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
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md text-lg font-medium"
            form="createSensorForm"
            onClick={handleSubmit(onSubmit)}
          >
            Lưu
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ThemMoiQuanTrac;
