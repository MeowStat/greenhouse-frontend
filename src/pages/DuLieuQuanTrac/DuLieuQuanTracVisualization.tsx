import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/UI/popover';
import { Button } from '../../components/UI/button';
import { Calendar } from '../../components/UI/calendar';
import { Card } from '../../components/UI/card';
import { sensorDataService } from '../../services/sensorDataService';
import { useSearchParams } from 'react-router-dom';
import { ISensor, ISensorData } from '../../types/SensorTypes';
import Skeleton from 'react-loading-skeleton';
import toast from 'react-hot-toast';
import ToastMessage from '../../components/ToastNotification/ToastMessage';
import AlertConfigModal from './component/AlertConfigModal';
import { Spinner } from '../../components/UI/spinner';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function getAxisBounds(data: number[], step = 5) {
  if (!data.length) return { min: 0, max: 100, stepSize: step };
  const min = Math.floor(Math.min(...data) / step) * step;
  const max = Math.ceil(Math.max(...data) / step) * step;
  const stepSize = step; // Initialize stepSize with the value of step
  return { min, max, stepSize };
}

export default function DataMonitoringDashboard() {
  const [searchParams] = useSearchParams();
  const feed = searchParams.get('feed') || '';
  const id = searchParams.get('id') || 0;
  const sensorName = searchParams.get('name') || 'Sensor';

  const [sensor, setSensor] = useState<ISensor>();
  const [allSensor, setAllSensor] = useState<ISensor[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);
  const [sensorData, setSensorData] = useState<ISensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 30;

  const fetchAllSensor = async () => {
    try {
      const data = await sensorDataService.getAllSensor();
      setAllSensor(data.data || []);
    } catch (error: any) {
      toast.error(
        <ToastMessage
          mainMessage="Failed to fetch sensors"
          description={error.message}
        />
      );
    }
  };

  const fetchSensorData = async (
    page: number,
    startDate?: Date,
    endDate?: Date,
    showLoading: boolean = false
  ) => {
    try {
      if (showLoading) setLoading(true);
      const response = await sensorDataService.getSensorVisualData({
        id,
        page,
        pageSize,
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined,
      });
      setSensorData(response.data || []);
      setTotalPages(response.totalOfRecord || 1);
      setTotalPages(Math.ceil((response.totalOfRecord || 1) / pageSize));
      if (showLoading) setLoading(false);
    } catch (error: any) {
      if (showLoading) setLoading(false);
      toast.error(
        <ToastMessage
          mainMessage="Failed to fetch sensor data"
          description={error.message}
        />
      );
    }
  };  

  useEffect(() => {
    fetchAllSensor();
  }, [refresh]);

  useEffect(() => {
    setSensor(allSensor.find((value) => value.id == id));
  }, [allSensor]);

  useEffect(() => {
    fetchSensorData(1, undefined, undefined, true); // Show loading
  }, [id, feed]);  

  useEffect(() => {
    const interval = setInterval(() => {
      fetchSensorData(currentPage, fromDate, toDate); // no loading
    }, 5000);
    return () => clearInterval(interval);
  }, [id, currentPage, fromDate, toDate]);  

  const handleSearch = () => {
    setCurrentPage(1);
    fetchSensorData(1, fromDate, toDate, true); // loading = true
  };  

  const handleClearSearch = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setCurrentPage(1);
    fetchSensorData(1, undefined, undefined, true); // loading = true
  };  

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchSensorData(page, fromDate, toDate);
    }
  };  

  const handleExport = () => {
    // Placeholder for CSV export
    toast.success('Data exported as CSV!');
  };

  const reversedSensorData = [...(sensorData || [])].reverse();

  const chartData = {
    labels: reversedSensorData.map((item) => format(new Date(item.date), 'HH:mm')),
    datasets: [
      {
        data: reversedSensorData.map((item) => Number(item.value)),
        backgroundColor: 'rgba(34, 139, 34, 0.6)', // Moss green
        borderColor: 'rgba(34, 139, 34, 1)',
        borderWidth: 1,
        barPercentage: 0.9,
        categoryPercentage: 0.9,
      },
    ],
  };

  const { min, max, stepSize } = getAxisBounds(
    sensorData?.map((item) => Number(item.value)) || [],
    5
  );

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 100, 0, 0.8)', // Dark green tooltip
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      y: {
        min,
        max,
        ticks: {
          stepSize,
          font: { size: 12 },
        },
        grid: { color: 'rgba(0, 100, 0, 0.1)' },
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 } },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart' as 'easeOutQuart',
    },
  };

  const calculateStats = () => {
    if (!sensorData.length) return { max: 0, min: 0, avg: 0 };
    const values = sensorData.map((item) => Number(item.value));
    return {
      max: Math.max(...values),
      min: Math.min(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
    };
  };

  const stats = calculateStats();

  return (
    <div className="container mx-auto min-h-screen">
      <div className="mb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-green-800">Dữ liệu quan trắc</h1>
          <h2 className="text-xl text-green-600 flex items-center">
            {sensorName || <Spinner className="h-5 w-5" />}
          </h2>
          {/* Alert Config Modal */}
          {sensor && (
            <AlertConfigModal
              key={id}
              monitorId={id ?? 0}
              data={{
                alertDes: sensor?.alertDes || '',
                alertlowerbound: sensor?.alertlowerbound || 0,
                alertupperbound: sensor?.alertupperbound || 0,
                status: sensor?.warning || false,
                email: sensor?.email || false,
              }}
              setRefresh={setRefresh}
            />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 mt-3">
          <div className="flex items-center gap-1">
            <span className="text-sm text-green-600 whitespace-nowrap">Từ ngày</span>
            <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 px-3 py-1 text-green-800 w-[140px] justify-start font-normal"
                  aria-label="Select start date"
                >
                  {fromDate ? format(fromDate, 'dd/MM/yyyy') : 'Chọn ngày'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50" align="start" sideOffset={4}>
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={(date) => {
                    setFromDate(date);
                    setFromDateOpen(false);
                  }}
                  initialFocus
                  className="rounded-md border-0 shadow-md bg-lime-50"
                  classNames={{ day: 'hover:cursor-pointer' }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-sm text-green-600 whitespace-nowrap">Đến ngày</span>
            <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 px-3 py-1 text-green-800 w-[140px] justify-start font-normal"
                  aria-label="Select end date"
                >
                  {toDate ? format(toDate, 'dd/MM/yyyy') : 'Chọn ngày'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50" align="start" sideOffset={4}>
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={(date) => {
                    setToDate(date);
                    setToDateOpen(false);
                  }}
                  initialFocus
                  className="rounded-md border-0 shadow-md bg-lime-50"
                  classNames={{ day: 'hover:cursor-pointer' }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button
            className="bg-green-700 hover:bg-green-800 text-white h-9 px-4"
            onClick={handleSearch}
            aria-label="Search garden data"
          >
            <Search className="h-4 w-4 mr-2" />
            Tìm kiếm
          </Button>

          <Button
            variant="outline"
            className="bg-lime-100 hover:bg-lime-200 text-green-800 border-green-300 h-9 px-4"
            onClick={handleClearSearch}
            aria-label="Clear search filters"
          >
            Bỏ tìm kiếm
          </Button>
        </div>
      </div>

      {/* Stats and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-10">
        <Card className="col-span-1 lg:col-span-2 p-8 bg-white shadow-sm rounded-lg">
          <h3 className="text-2xl font-bold text-green-800 mb-4">Dữ liệu cảm biến</h3>
          <div className="h-full">
            {loading ? (
              <Skeleton height={256} />
            ) : (
              <Bar options={chartOptions} data={chartData} />
            )}
          </div>
        </Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          <Card className="p-6 shadow-sm rounded-lg flex flex-col items-center">
            <h3 className="text-xl font-medium text-green-900">Giá trị lớn nhất</h3>
            <p className="text-4xl font-bold text-green-900">{stats.max}</p>
          </Card>
          <Card className="p-6 shadow-sm rounded-lg flex flex-col items-center">
            <h3 className="text-xl font-medium text-green-900">Giá trị nhỏ nhất</h3>
            <p className="text-4xl font-bold text-green-900">{stats.min}</p>
          </Card>
          <Card className="p-6 shadow-sm rounded-lg flex flex-col items-center">
            <h3 className="text-xl font-medium text-green-900">Giá trị trung bình</h3>
            <p className="text-4xl font-bold text-green-900">{stats.avg.toFixed(2)}</p>
          </Card>
        </div>
      </div>

      {/* Data Table */}
      <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <Skeleton count={5} height={48} className="mx-4 my-2" />
        ) : sensorData.length === 0 ? (
          <div className="text-center text-green-600 py-12">
            <p className="text-lg font-medium">No data available. Please adjust filters or add new sensors.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table
              className="min-w-full text-sm divide-y divide-green-200"
              role="table"
              aria-label="Sensor data table"
            >
              <thead className="bg-gradient-to-r from-green-700 to-green-600 text-white sticky top-0 z-10">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    role="columnheader"
                    aria-sort="none"
                  >
                    Thời gian quan trắc
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    role="columnheader"
                    aria-sort="none"
                  >
                    Giá trị
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {sensorData.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-lime-50 transition-colors duration-150 even:bg-green-50/50"
                    role="row"
                  >
                    <td
                      className="px-6 py-2 text-green-600 whitespace-nowrap"
                      role="cell"
                    >
                      {new Date(item.date).toLocaleString('en-GB')}
                    </td>
                    <td
                      className="px-6 py-2 text-green-800 font-medium"
                      role="cell"
                    >
                      {item.value}
                      {sensor?.unit && (
                        <span className="text-green-600 text-xs ml-1">
                          {sensor.unit}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination + Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-4 bg-lime-100 border-green-300 hover:bg-lime-200 text-green-800"
            onClick={handleExport}
            aria-label="Export data as CSV"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-4 border-green-300 text-green-800"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-green-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-4 border-green-300 text-green-800"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}