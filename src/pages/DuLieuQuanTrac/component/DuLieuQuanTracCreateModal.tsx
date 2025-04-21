import { useForm, Controller } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { useModal } from '../../../hooks/useModal';
import { Modal } from '../../../components/Modal/modal';
import { useEffect, useState } from 'react';
import { sensorDataService } from '../../../services/sensorDataService';
import toast from 'react-hot-toast';
import ToastMessage from '../../../components/ToastNotification/ToastMessage';
import { Spinner } from '../../../components/UI/spinner';
import { useDebounce } from "use-debounce";
import { UNITS } from '../../../utils/constants';

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
      upperbound: 0,
      lowerbound: 0,
      unit: '',
      description: '',
    },
  });

  const [feedList, setFeedList] = useState<string[]>([]);

  const [feedValue, setFeedValue] = useState('');
  const [debouncedFeed] = useDebounce(feedValue, 500);
  const [feedStatus, setFeedStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');


  useEffect(() => {
    const fetchFeedList = async () => {
      try {
        const response = await sensorDataService.getAllFeed();
        setFeedList(response.data);
      } catch (error) {
        toast.error('Error fetching feed list:');
      }
    };
    fetchFeedList();
  }, []);

  useEffect(() => {
    if (!debouncedFeed) {
      setFeedStatus('idle');
      return;
    }
  
    setFeedStatus('checking');
    const isTaken = feedList.includes(debouncedFeed);
    setFeedStatus(isTaken ? 'taken' : 'available');
  }, [debouncedFeed, feedList]);

  useEffect(() => {
    if (modal.isOpen) {
      reset({
        name: '',
        feed: '',
        upperbound: 0,
        lowerbound: 0,
        unit: '',
        description: '',
      });
      setFeedValue('');
      setFeedStatus('idle');
    }
  }, [modal.isOpen]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const formattedData = {
        ...data,
        upperbound: Number(data.upperbound), // Convert to number
        lowerbound: Number(data.lowerbound), // Convert to number
      };
      await createNewMonitor(formattedData);
      reset();
      setRefresh((prev) => !prev);
      modal.close();
      toast.success(<ToastMessage mainMessage="Thêm thành công" />);
    } catch {
      toast.error(<ToastMessage mainMessage="Thêm không thành công" description='Vui lòng thử lại' />);
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
        <span className="font-medium">Thêm quan trắc</span>
      </button>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        onBackdropClick={modal.handleBackdropClick}
        title="Thêm quan trắc"
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
                rules={{
                  required: 'Feed là bắt buộc',
                  validate: () =>
                    feedStatus === 'available' || !feedValue ? true : 'Feed đã được sử dụng',
                }}
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      value={feedValue}
                      onChange={(e) => {
                        field.onChange(e);
                        setFeedValue(e.target.value);
                      }}
                      className={`w-full border ${
                        errors.feed
                          ? 'border-red-500'
                          : feedStatus === 'taken'
                          ? 'border-red-500'
                          : feedStatus === 'available'
                          ? 'border-green-500'
                          : 'border-gray-300'
                      } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                        feedStatus === 'available'
                          ? 'focus:ring-green-500'
                          : feedStatus === 'taken'
                          ? 'focus:ring-red-500'
                          : 'focus:ring-green-500'
                      }`}
                      placeholder="Nhập feed"
                    />

                    {/* Feed status feedback */}
                    <div className="text-sm mt-1 h-5">
                      {feedStatus === 'checking' && (
                        <span className="text-gray-500 animate-pulse">Đang kiểm tra...</span>
                      )}
                      {feedStatus === 'available' && (
                        <span className="text-green-600">✔ Feed hợp lệ</span>
                      )}
                      {feedStatus === 'taken' && (
                        <span className="text-red-500">✖ Feed đã tồn tại</span>
                      )}
                    </div>

                    {errors.feed && (
                      <p className="text-red-500 text-sm mt-1">{errors.feed.message}</p>
                    )}
                  </>
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
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || feedStatus === 'taken' || feedStatus === 'checking'}
            className={`px-6 py-2 bg-green-600 text-white rounded-lg transition-colors shadow-md text-lg font-medium 
              ${
                loading || feedStatus === 'taken' || feedStatus === 'checking'
                  ? 'cursor-not-allowed opacity-50'
                  : 'hover:bg-green-700 cursor-pointer'
              }`}
            form="createSensorForm"
          >
            {loading ? <Spinner size="small" /> : 'Lưu'}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ThemMoiQuanTrac;
