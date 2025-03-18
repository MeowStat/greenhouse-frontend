import { Modal } from '../../../components/Modal/modal'
import { EMPTY_STRING } from '../../../utils/constants'

interface ThongTinQuanTracModalProps {
  isOpen: boolean
  onClose: () => void
  data: {
    id: string
    name: string
    value: number
    unit?: string
    description: string
    timestamp: string
    warning?: string
    lowerbound?: number
    upperbound?: number
  }
}

export function ThongTinQuanTracModal({
  isOpen,
  onClose,
  data,
}: ThongTinQuanTracModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onBackdropClick={onClose}
      title="Thông tin quan trắc"
    >
      <div className="space-y-4 text-lg">
        <div>
          <h3 className="text-2xl font-semibold">Tên: {data.name}</h3>
        </div>

        <div>
          <h4 className="font-medium mb-2">
            Kích hoạt cảnh báo khi vượt ngưỡng lý tưởng
          </h4>
          <div className="space-y-2 pl-6">
            <p>
              + Thông số lý tưởng thấp nhất: {data.lowerbound ?? EMPTY_STRING}
            </p>
            <p>
              + Thông số lý tưởng cao nhất: {data.upperbound ?? EMPTY_STRING}
            </p>
            <p>+ Mô tả cảnh báo: Độ ẩm ở mức báo động</p>
            <p>+ Nhận thông báo: website, email, telegram</p>
          </div>
        </div>

        <p>Đơn vị: {data.unit}</p>
        <p>Mô tả: {data.description}</p>
        <p>Hiện trên bảng tổng hợp</p>
        <p>
          Giá trị gần nhất: {data.value} {data.unit}
        </p>
        <p>Thời gian cập nhật: {data.timestamp}</p>
      </div>
    </Modal>
  )
}
