import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/UI/popover';
import { Trash2 } from 'lucide-react';
import { PopoverArrow } from '@radix-ui/react-popover';
import toast from 'react-hot-toast';
import ToastMessage from '../../../components/ToastNotification/ToastMessage';
import { deviceService } from '../../../services/deviceService';
import { Spinner } from '../../../components/UI/spinner';

interface DeleteDeviceButtonProps {
  deviceId: string | number;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteDeviceButton: React.FC<DeleteDeviceButtonProps> = (props) => {
  const { deviceId, setRefresh } = props;

  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteDevice = async () => {
    try {
      setLoading(true);
      await deviceService.deleteDevice(deviceId);
      setRefresh((prev) => !prev);
      toast.success(
        <ToastMessage
          mainMessage="Xóa thành công"
        />
      );
    } catch (error) {
      toast.success(
        <ToastMessage
          mainMessage="Xóa không thành công"
          description="Vui lòng thử lại"
        />
      );
    } finally {
      setOpenDeleteConfirm(false);
      setLoading(false);
    }
  };

  return (
    <Popover open={openDeleteConfirm} onOpenChange={setOpenDeleteConfirm}>
      <PopoverContent
        className="w-auto p-4 z-50 bg-white shadow-md rounded-md"
        align="center"
        sideOffset={3}
        side="top"
      >
        <PopoverArrow className="fill-white" height={8} />
        <div className="text-center">
          <p className="text-sm text-gray-700 mb-4">
            Bạn có chắc chắn muốn xóa?
          </p>
          <div className="flex justify-center gap-2">
            {/* Confirm Button */}
            <button
              onClick={() => handleDeleteDevice()}
              className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? <Spinner size="small" /> : 'Xóa'}
            </button>
            {/* Cancel Button */}
            <button
              onClick={() => setOpenDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
            >
              Hủy
            </button>
          </div>
        </div>
      </PopoverContent>
      <PopoverTrigger asChild>
        <button className="p-1 hover:bg-green-100 rounded" title="Xóa">
          <Trash2 className="h-5 w-5" />
        </button>
      </PopoverTrigger>
    </Popover>
  );
};

export default DeleteDeviceButton;
