'use client';

import { useEffect, useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { deviceHistoryService } from '../../services/deviceService';
import { DeviceHistoryItem } from '../../types/DeviceTypes';

export default function LichSuQuanTrac() {
  const [deviceId, setDeviceId] = useState('');
  const [typeAction, setTypeAction] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [historyData, setHistoryData] = useState<DeviceHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchDeviceHistory = async () => {
    setLoading(true);
    try {
      const response = await deviceHistoryService.getDeviceHistory({
        page: currentPage,
        pageSize: rowsPerPage,
        deviceId: deviceId || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        typeAction: typeAction !== 'all' ? typeAction : undefined,
      });

      setHistoryData(response.data || []);
      setTotalRecords(response.totalOfRecord || 0);
    } catch (error) {
      console.error('Failed to fetch device history:', error);
      setHistoryData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchDeviceHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle pagination changes
  useEffect(() => {
    if (!loading) {
      fetchDeviceHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, rowsPerPage]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    fetchDeviceHistory();
  };

  const handleClearSearch = () => {
    setDeviceId('');
    setTypeAction('all');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
    // After clearing, fetch data again
    fetchDeviceHistory();
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    } catch (error) {
      return dateString;
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1e472e] mb-6">
          Lịch sử hoạt động
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label
              htmlFor="deviceId"
              className="block text-sm font-medium text-[#1e472e] mb-1"
            >
              Mã thiết bị
            </label>
            <input
              id="deviceId"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="typeAction"
              className="block text-sm font-medium text-[#1e472e] mb-1"
            >
              Loại thao tác
            </label>
            <select
              id="typeAction"
              value={typeAction}
              onChange={(e) => setTypeAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white"
            >
              <option value="all">Tất cả</option>
              <option value="Auto">Auto</option>
              <option value="Scheduler">Scheduler</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-[#1e472e] mb-1"
                >
                  Từ ngày
                </label>
                <div className="relative">
                  <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                </div>
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-[#1e472e] mb-1"
                >
                  Đến ngày
                </label>
                <div className="relative">
                  <input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 items-end lg:col-span-2">
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-[#4a9967] hover:bg-[#3a7850] text-white rounded-md flex items-center"
            >
              <Search className="h-4 w-4 mr-2" />
              Tìm kiếm
            </button>
            <button
              onClick={handleClearSearch}
              className="px-4 py-2 bg-[#f8e16c] hover:bg-[#e6d05a] text-black border border-[#e6d05a] rounded-md flex items-center"
            >
              <X className="h-4 w-4 mr-2" />
              Bỏ tìm kiếm
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1e472e] text-white">
                <th className="py-3 px-4 text-left font-medium">Thời gian</th>
                <th className="py-3 px-4 text-left font-medium">
                  Tên thiết bị
                </th>
                <th className="py-3 px-4 text-left font-medium">Hoạt động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="bg-[#bce4c7]">
                  <td colSpan={3} className="py-20 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : historyData.length > 0 ? (
                historyData.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-[#bce4c7] border-b border-[#a5d3b2]"
                  >
                    <td className="py-3 px-4">{formatDate(item.date)}</td>
                    <td className="py-3 px-4">
                      {item.device.name || item.deviceId}
                    </td>
                    <td className="py-3 px-4">{item.info}</td>
                  </tr>
                ))
              ) : (
                <tr className="bg-[#bce4c7]">
                  <td colSpan={3} className="py-20 text-center text-gray-500">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
              {/* Fill remaining rows if needed for consistent layout */}
              {historyData &&
                historyData.length > 0 &&
                historyData.length < 5 &&
                Array(5 - historyData.length)
                  .fill(null)
                  .map((_, i) => (
                    <tr
                      key={`empty-${i}`}
                      className="bg-[#bce4c7] border-b border-[#a5d3b2]"
                    >
                      <td className="py-10 px-4"></td>
                      <td className="py-10 px-4"></td>
                      <td className="py-10 px-4"></td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button className="p-2 border border-gray-300 rounded-md">
            <Download className="h-4 w-4" />
          </button>

          <div className="flex items-center space-x-2">
            <select
              value={rowsPerPage.toString()}
              onChange={(e) => {
                setRowsPerPage(Number.parseInt(e.target.value));
                setCurrentPage(1); // Reset to first page when changing rows per page
              }}
              className="w-16 px-2 py-1 border border-gray-300 rounded-md"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-2 py-1 border border-gray-300 rounded-md flex items-center"
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <div className="px-4 py-1 border border-gray-300 rounded-md">
                {currentPage}/{totalPages || 1} ({totalRecords} records)
              </div>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className={`px-3 py-1 ${
                  currentPage < totalPages
                    ? 'bg-[#4a9967] hover:bg-[#3a7850]'
                    : 'bg-gray-300'
                } text-white rounded-md flex items-center`}
                disabled={currentPage >= totalPages}
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
