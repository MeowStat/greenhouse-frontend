import { CirclePlus, X } from 'lucide-react';
import { useModal } from '../../../hooks/useModal';
import { Modal } from '../../../components/Modal/modal';
import toast from 'react-hot-toast';
import ToastMessage from '../../../components/ToastNotification/ToastMessage';
import { COMPARISION_OPERATORS, DEVICE_ON_OFF, POWER_LEVELS } from '../../../utils/constants';
import { Input } from '../../../components/UI/input';
import { useEffect, useRef, useState } from 'react';
import { deviceService } from '../../../services/deviceService';
import { Spinner } from '../../../components/UI/spinner';
import { Button } from '../../../components/UI/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/UI/select';
import { ISensor } from '../../../types/SensorTypes';
import { sensorDataService } from '../../../services/sensorDataService';
import { Textarea } from '../../../components/UI/textarea';

interface AutoConfigCreateModalProps {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  deviceId: string | number | null;
  deviceType: number | null;
}

interface Condition {
  sensorId: string;
  condition: string;
  threshold: string | number;
}

const AutoConfigCreateModal: React.FC<AutoConfigCreateModalProps> = ({ setRefresh, deviceId, deviceType }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const modal = useModal();
  const [changePower, setChangePower] = useState<number>(100);
  const [sensorOptions, setSensorOptions] = useState<ISensor[]>([])

  const [conditions, setConditions] = useState<Condition[]>([]);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchSensorList = async () => {
      try {
        setLoading(true);
        const response = await sensorDataService.getAllSensor();
        setSensorOptions(response.data);
      } catch {
        toast.error(<ToastMessage mainMessage='Lỗi' description='Không thể lấy danh sách cảm biến'/>)
      } finally {
        setLoading(false);
      }
    }

    fetchSensorList();
  },[])

  const resetForm = () => {
    setConditions([]);
    setChangePower(100);
  };

  const updateCondition = (index: number, key: keyof Condition, value: string | number) => {
    const newConditions = [...conditions];
    newConditions[index][key] = value as never;
    setConditions(newConditions);
  };

  const addCondition = () => {
    setConditions([...conditions, { sensorId: '', condition: '', threshold: '' }]);
  };

  const removeCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
  };

  const onSubmit = async () => {
    const payload = conditions.map(cond => {return {
      ...cond,
      description: descriptionRef.current?.value, 
    }});

    if (!titleRef.current?.value?.trim() || !descriptionRef.current?.value?.trim() ||
    conditions.some(cond =>
      !cond.sensorId || !cond.condition || cond.threshold === '' || cond.threshold === null
    )) {
      toast.error(<ToastMessage mainMessage='Lỗi' description='Vui lòng nhập đầy đủ các trường'/>);
      return;
    }
    
    if ( !conditions.length ) {
      toast.error(<ToastMessage mainMessage='Lỗi' description='Vui lòng thêm điều kiện'/>);
      return;
    }

    try {
      setLoading(true);
      const response = await deviceService.createDeviceConfig({name:titleRef.current?.value ,deviceId: deviceId || '',changePower: changePower,description: descriptionRef.current?.value});
      await deviceService.createDeviceAutoConfig(response.data.id);
      await Promise.all(
        payload.map((p) =>
          deviceService.createDeviceAutoCondition({
            configId: response.data.id,
            ...p,
            description: p.description || '',
          })
        )
      );
      toast.success(<ToastMessage mainMessage='Tạo mới thành công'/>)
      resetForm();
      modal.close();
      setRefresh(prev => !prev);
    } catch (error) {
      toast.error(<ToastMessage mainMessage='Lỗi' description='Vui lòng thử lại'/>)
    } finally {
      setLoading(false);
    }
  };

  const formId = `createAutoConfigForm-${Date.now()}`;

  useEffect(() => {
    if (modal.isOpen)
      resetForm();
  },
  [modal.isOpen])

  return (
    <>
      <button
        onClick={modal.open}
        className="cursor-pointer hover:bg-green-100 rounded"
      >
        <CirclePlus className="h-7 w-7 text-green-900 hover:bg-green-100 rounded" />
      </button>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        onBackdropClick={modal.handleBackdropClick}
        title="Thêm mới cài đặt tự động"
      >
        <div className={`overflow-y-auto max-h-[80vh] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <form
            id={formId}
            className="space-y-4 px-4 py-4"
          >
            <div className="space-y-2 text-black">
              <label className="block text-xl font-semibold text-gray-700">
                Tiêu đề
              </label>
              <Input
                type="text"
                className="border rounded px-2 py-1"
                ref={titleRef}
                placeholder="Nhập tiêu đề"
              />
            </div>

            <div className="space-y-2 text-black">
              <label className="block text-xl font-semibold text-gray-700">
                Danh sách điều kiện
              </label>
              {conditions.map((cond, index) => (
                <div key={index} className="flex items-center gap-2">
                  {/* Select sensor device (placeholder only) */}
                  <Select
                    onValueChange={(value) => updateCondition(index, 'sensorId', value)}
                  >
                    <SelectTrigger className="w-60">
                      <SelectValue placeholder="Chọn cảm biến" />
                    </SelectTrigger>
                    <SelectContent>
                      {sensorOptions.map(option => <SelectItem value={option.name}>{option.name}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select
                    onValueChange={(value) => updateCondition(index, 'condition', value)}
                  >
                    <SelectTrigger className="w-55">
                      <SelectValue placeholder="Chọn điều kiện so sánh" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPARISION_OPERATORS.map((op) => 
                        <SelectItem value={op.value}>{op.label}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    className="border rounded px-2 py-1 w-25"
                    value={cond.threshold}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateCondition(index, 'threshold', e.target.value)
                    }
                    placeholder="Ngưỡng"
                  />

                  <button
                    type="button"
                    onClick={() => removeCondition(index)}
                    className="text-gray-500 hover:text-gray-800 cursor-pointer ml-2"
                  >
                    <X />
                  </button>
                </div>
              ))}
              <div className="flex flex-col gap-1">
                <Button
                  variant="outline"
                  type="button"
                  onClick={addCondition}
                  className="w-60 text-center text-green-700 cursor-pointer"
                >
                  <CirclePlus /> Thêm điều kiện
                </Button>
              </div>
            </div>

            {/* Device Power Config */}
            <div className="flex items-center space-x-4 text-black">
              <label className="block text-lg font-semibold text-gray-700">
                Hành động
              </label>
              <div className="flex items-center gap-1">
                {
                  deviceType === 0? (
                    <select
                      value={changePower}
                      onChange={(e) => setChangePower(Number(e.target.value))}
                      className="bg-white border border-gray-300 rounded-md text-base font-medium px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >

                      {DEVICE_ON_OFF.map((item) => (
                        <option key={item.power} value={item.power}>
                          {item.status === true? 'Bật' : 'Tắt'}
                        </option>
                      ))}
                    </select> ) : (
                    <select
                      value={changePower}
                      onChange={(e) => setChangePower(Number(e.target.value))}
                      className="bg-white border border-gray-300 rounded-md text-base font-medium px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >

                      {POWER_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level} %
                        </option>
                      ))}
                    </select>
                  )
                }
              </div>
            </div>

            <div className="space-y-2 text-black">
              <label className="block text-lg font-semibold text-gray-700">
                Mô tả
              </label>
              <Textarea 
                placeholder='Nhập mô tả...'
                ref={descriptionRef}
              />
            </div>
            { deviceType ? (
              <div className='text-sm text-gray-600'>
                <span>Lưu ý:</span>
                <ul className='list-disc pl-5'>
                  <li>Các mức cường độ được hỗ trợ là 0%, 20%, 40%, 60%, 80%, 100%</li>
                  <li>Khi tất cả điều kiện được thỏa mãn, hành động mới được thực thi</li>
                </ul>
              </div>
            )
              : (<p className='text-sm text-gray-600'>
              Lưu ý: Khi tất cả điều kiện được thỏa mãn, hành động mới được thực thi
            </p>)}
          </form>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-x-4">
          <Spinner show={loading} />
          <button
            // type="submit"
            className={`px-6 py-2 bg-green-600 text-white rounded-lg transition-colors shadow-md text-lg font-medium 
              ${loading ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-700 cursor-pointer'}`}
            // form={formId}
            disabled={loading}
            onClick={() => onSubmit()}
          >
            Lưu
          </button>
        </div>
      </Modal>
    </>
  );
};

export default AutoConfigCreateModal;
