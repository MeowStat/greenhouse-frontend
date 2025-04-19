import { Calendar, CirclePlus } from 'lucide-react';
import { useModal } from '../../../hooks/useModal';
import { Modal } from '../../../components/Modal/modal';
import toast from 'react-hot-toast';
import ToastMessage from '../../../components/ToastNotification/ToastMessage';
import { DAY_OF_WEEK, DEVICE_ON_OFF, FULL_DAY_VI } from '../../../utils/constants';
import { Input } from '../../../components/UI/input';
import { useState } from 'react';
import { deviceService } from '../../../services/deviceService';
import { Spinner } from '../../../components/UI/spinner';

interface ThemMoiQuanTracProps {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  deviceId: string | number | null;
  deviceType: number | null;
}

function calculateEndTime(start: string, duration: string): string {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [durationHour, durationMinute] = duration.split(":").map(Number);

  let endMinutes = startMinute + durationMinute;
  let endHour = startHour + durationHour;

  if (endMinutes >= 60) {
    endHour += Math.floor(endMinutes / 60);
    endMinutes = endMinutes % 60;
  }

  endHour = endHour % 24; // wrap around if over 24

  const paddedHour = String(endHour).padStart(2, "0");
  const paddedMinute = String(endMinutes).padStart(2, "0");

  return `${paddedHour}:${paddedMinute}`;
}


const SchedulerConfigCreateModal: React.FC<ThemMoiQuanTracProps> = (props) => {
  const { setRefresh, deviceId, deviceType } = props;
  const [selectedDays, setSelectedDays] = useState<(keyof typeof FULL_DAY_VI)[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const selectedDaysLabel = selectedDays
  .map(code => FULL_DAY_VI[code as keyof typeof FULL_DAY_VI])
  .join(', ');

  const modal = useModal();

  const toggleDay = (dayCode: string) => {
    const updated = selectedDays.includes(dayCode as keyof typeof FULL_DAY_VI)
      ? selectedDays.filter((code) => code !== dayCode)
      : [...selectedDays, dayCode];
    
    const sorted = DAY_OF_WEEK.map(d => d.code).filter(code => updated.includes(code));
    setSelectedDays(sorted as (keyof typeof FULL_DAY_VI)[]);
  };

  const isTimeSumValid = () => {
    return Number(timeHour) * 60 + Number(timeMinute) + Number(durationHour)*60 + Number(durationMinute) <= 24*60;
  }

  const [timeHour, setTimeHour] = useState('00');
  const [timeMinute, setTimeMinute] = useState('00');
  const [durationHour, setDurationHour] = useState('00');
  const [durationMinute, setDurationMinute] = useState('05');

  const [changePower, setChangePower] = useState(100);

  const resetForm = () => {
    setTimeHour('00');
    setTimeMinute('00');
    setDurationHour('00');
    setDurationMinute('05');
    setChangePower(100);
    setSelectedDays([]);
  };
  

  const hours = [...Array(24).keys()].map(h => String(h).padStart(2, '0'));
  const minutes = [...Array(60).keys()].map(m => String(m).padStart(2, '0'));

  console.log(changePower);

  const onSubmit = async () => {
    if (!isTimeSumValid()) {
      toast.error(<ToastMessage mainMessage='Lỗi' description='Thời điểm kết thúc hẹn giờ không được vượt quá 24:00' />)
      return;
    }

    if (selectedDays.length === 0) {
      toast.error(<ToastMessage mainMessage='Lỗi' description='Vui lòng chọn các ngày trong tuần!' />)
      return;
    }

    const payload = {
      start: `${timeHour}:${timeMinute}`,
      end: calculateEndTime(`${timeHour}:${timeMinute}`,`${durationHour}:${durationMinute}`),
      repetition: selectedDays.map((day)=>day.toLowerCase()),
    };

    try {
      setLoading(true);
      const response = await deviceService.createDeviceConfig({name:'',deviceId: deviceId || '',changePower: changePower,description:''});
      await deviceService.createDeviceSchedulerConfig({
        ...payload, configId: response.data.id
      })
      setRefresh(prev => !prev);
      toast.success(<ToastMessage mainMessage='Tạo mới thành công'/>)
      resetForm();
      modal.close();
    } catch (error) {
      toast.error(<ToastMessage mainMessage='Lỗi' description='Vui lòng thử lại'/>)
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {/* Add New Button */}
      <button
        onClick={modal.open}
        className="cursor-pointer hover:bg-green-100 rounded"
      >
        <CirclePlus className="h-7 w-7 text-green-900 hover:bg-green-100 rounded" />
      </button>

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        onBackdropClick={modal.handleBackdropClick}
        title="Thêm mới hẹn giờ"
      >
        <div className={`overflow-y-auto max-h-[80vh] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <form
            id={"createSchedulerConfigForm" + Date.now()}
            // onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 px-4 py-4"
          >
            {/* Time Picker Field */}
            <div className="flex items-center space-x-4 text-black">
              <label className="block text-lg font-semibold text-gray-700">
                Thời điểm:
              </label>
              <div className="flex items-center gap-1">
                <div className="relative">
                  <select
                    value={timeHour}
                    onChange={(e) => setTimeHour(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md text-xl font-bold px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {hours.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="text-xl font-bold">:</span>
                <div className="relative">
                  <select
                    value={timeMinute}
                    onChange={(e) => setTimeMinute(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md text-xl font-bold px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {minutes.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <span className="text-lg font-medium text-gray-600">(hh:mm)</span>
            </div>
            
            {/* Repeat Field */}
            <div className="space-y-2 text-black">
              <div className='flex justify-between align-center'>
                <div className='flex gap-x-2 align-center'>
                  <label className="text-lg font-semibold text-gray-700">
                    Lặp lại: 
                  </label>
                  {selectedDays.length > 0 && (
                    <span className="italic text-gray-600 p-0">
                      {selectedDays.length === 7? 'Hàng ngày' : `${selectedDaysLabel}`}
                    </span>
                  )}
                </div>
                <Calendar />
              </div>
              
              <div className='flex flex-wrap justify-between'>
              {DAY_OF_WEEK.map(({ label, code }) => {
                const isActive = selectedDays.includes(code as keyof typeof FULL_DAY_VI);
                return (
                  <div
                    key={code}
                    onClick={() => toggleDay(code)}
                    className={`h-15 w-15 text-xl font-semibold flex items-center justify-center rounded-full m-1 border-2 cursor-pointer
                      ${isActive
                        ? 'bg-green-600 text-white border-green-600'
                        : 'text-green-900 border-green-900 hover:border-green-700 hover:text-green-700 hover:bg-green-100'
                      }
                    `}
                  >
                    <span>{label}</span>
                  </div>
                );
              })}
              </div>
            </div>

            {/* Duration Picker Field */}
            <div className="flex items-center space-x-4 text-black">
              <label className="block text-lg font-semibold text-gray-700">
                Thời lượng:
              </label>
              <div className="flex items-center gap-1">
                <div className="relative">
                  <select
                    value={durationHour}
                    onChange={(e) => setDurationHour(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md text-xl font-bold px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {hours.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="text-xl font-bold">:</span>
                <div className="relative">
                  <select
                    value={durationMinute}
                    onChange={(e) => setDurationMinute(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md text-xl font-bold px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {minutes.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <span className="text-lg font-medium text-gray-600">(hh:mm)</span>
            </div>

            {/* Modified Status field*/}
            <div className="flex items-center space-x-4 text-black">
              <label className="block text-lg font-semibold text-gray-700">
                Trạng thái điều chỉnh:
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
                    <Input
                      type='number'
                      min={0}
                      max={100}
                      step={10}
                      defaultValue={changePower} 
                      onChange={(e) => setChangePower(Number(e.target.value))}
                    />
                  )
                }
              </div>  
            </div>
            
          </form>
        </div>
        {/* Submit Button */}
        <div className="flex justify-end gap-x-4">
          <Spinner show={loading} />
          <button
            type="submit"
            className={
              `px-6 py-2 bg-green-600 text-white rounded-lg  transition-colors shadow-md text-lg font-medium 
              ${loading ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-700 cursor-pointer'}`
            }
            form="createSchedulerConfigForm"
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

export default SchedulerConfigCreateModal;
