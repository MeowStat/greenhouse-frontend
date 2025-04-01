import React from 'react'
import { Modal } from '../../../components/Modal/modal'
import { Controller, useForm } from 'react-hook-form'
import { useModal } from '../../../hooks/useModal';
import CheckBox from '../../../components/UI/checkbox';
import { sensorDataService } from '../../../services/sensorDataService';
import toast from 'react-hot-toast';
import ToastMessage from '../../../components/ToastNotification/ToastMessage';

interface FormData {
  alertDes: string
  alertupperbound: number
  alertlowerbound: number
  status: boolean
  email: boolean
}

interface AlertConfigModalProps {
  monitorId: string;
  data: FormData;
  modal: ReturnType<typeof useModal>;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
}

const AlertConfigModal: React.FC<AlertConfigModalProps> = (props) => {
  const { monitorId, modal, data, setRefresh } = props


  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      alertDes: data.alertDes,
      alertupperbound: data.alertupperbound,
      alertlowerbound: data.alertlowerbound,
      status: data.status,
      email: data.email,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const formattedData = {
        ...data,
        alertLowerbound: Number(data.alertlowerbound),
        alertUpperbound: Number(data.alertupperbound)
      }
      await sensorDataService.postConfigAlert(monitorId, formattedData)
      toast.success(<ToastMessage mainMessage='Cài đặt cảnh báo thành công' description=''/>)
      reset()
      modal.close()
    } catch {
      toast.error(<ToastMessage mainMessage='Cài đặt cảnh báo không thành công' description='Vui lòng thử lại'/>)
    }
  }

  return (
    <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        onBackdropClick={modal.handleBackdropClick}
        title="Cài đặt cảnh báo"
      >
        <div className='overflow-y-auto max-h-[80vh]'>
          <form 
            id='createSensorForm'
            // onSubmit={handleSubmit(onSubmit)} 
            className="space-y-4 px-4 py-4"
          >
            {/* Status Field */}
            <div className="space-y-1 flex gap-x-8">
              <label className="block text-lg font-medium text-gray-700">
                Kích hoạt cảnh báo
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <CheckBox 
                    checked= {field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* Min and Max Values */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-lg font-medium text-gray-700">
                  Thông số thấp nhất
                </label>
                <Controller
                  name="alertlowerbound"
                  control={control}
                  rules={{ required: 'Thông số thấp nhất là bắt buộc' }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      className={`w-full border ${
                        errors.alertlowerbound ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                      placeholder="Nhập giá trị thấp nhất"
                    />
                  )}
                />
                {errors.alertlowerbound && (
                  <p className="text-red-500 text-sm">
                    {errors.alertlowerbound.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="block text-lg font-medium text-gray-700">
                  Thông số cao nhất
                </label>
                <Controller
                  name="alertupperbound"
                  control={control}
                  rules={{ required: 'Thông số cao nhất là bắt buộc' }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      className={`w-full border ${
                        errors.alertupperbound ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                      placeholder="Nhập giá trị cao nhất"
                    />
                  )}
                />
                {errors.alertupperbound && (
                  <p className="text-red-500 text-sm">
                    {errors.alertupperbound.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-1">
              <label className="block text-lg font-medium text-gray-700">
                Mô tả cảnh báo
              </label>
              <Controller
                name="alertDes"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className={`w-full border ${
                      errors.alertDes ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[100px]`}
                    placeholder="Nhập mô tả chi tiết"
                  />
                )}
              />
              {errors.alertDes && (
                <p className="text-red-500 text-sm">
                  {errors.alertDes.message}
                </p>
              )}
            </div>

            {/* Status Field */}
            <div className="space-y-1 flex gap-x-8">
              <label className="block text-lg font-medium text-gray-700">
                Kênh nhận cảnh báo phụ:
              </label>
              <div className="flex gap-x-2">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <CheckBox 
                      checked= {field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <label className="block text-lg font-medium text-gray-700">
                  Email
                </label>
              </div>
            </div>
          </form>
        </div>
        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md text-lg font-medium"
            form='createSensorForm'
            onClick={handleSubmit(onSubmit)}
          >
            Lưu
          </button>
        </div>
        
      </Modal>
  )
}

export default AlertConfigModal