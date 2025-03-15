'use client'

import type React from 'react'

import { useState } from 'react'
import { useModal } from '../../../hooks/useModal'
import { Modal } from '../../../components/Modal/modal'

interface FormData {
  name: string
  hasIdealCondition: boolean
  minValue: string
  maxValue: string
  unit: string
  description: string
  isHidden: boolean
}

const initialFormData: FormData = {
  name: '',
  hasIdealCondition: false,
  minValue: '',
  maxValue: '',
  unit: '',
  description: '',
  isHidden: false,
}

export function ThemMoiQuanTrac() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const modal = useModal()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormData(initialFormData)
    modal.close()
  }

  return (
    <>
      <button
        onClick={modal.open}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <span>Thêm mới quan trắc</span>
      </button>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        onBackdropClick={modal.handleBackdropClick}
        title="Thêm mới quan trắc"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xl">
              Tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-green-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="idealCondition"
              checked={formData.hasIdealCondition}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hasIdealCondition: e.target.checked,
                })
              }
              className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="idealCondition" className="text-xl">
              Điều kiện lý tưởng
            </label>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xl">Thông số thấp nhất</label>
              <input
                type="number"
                value={formData.minValue}
                onChange={(e) =>
                  setFormData({ ...formData, minValue: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xl">Thông số cao nhất</label>
              <input
                type="number"
                value={formData.maxValue}
                onChange={(e) =>
                  setFormData({ ...formData, maxValue: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xl">Đơn vị</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-green-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xl">Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-green-500 min-h-[100px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hideFromSummary"
              checked={formData.isHidden}
              onChange={(e) =>
                setFormData({ ...formData, isHidden: e.target.checked })
              }
              className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="hideFromSummary" className="text-xl">
              Ẩn khỏi bảng tổng hợp dữ liệu quan trắc
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xl"
            >
              Lưu
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
