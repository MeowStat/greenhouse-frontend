import {
  Search,
  Filter,
  PenLine,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SensorCard } from './component/SensorCard'
import { useEffect, useState } from 'react'
import { ISensor, ISensorVisualData } from '../../types/SensorTypes'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import toast from 'react-hot-toast'
import ToastMessage from '../../components/ToastNotification/ToastMessage'
import { sensorDataService } from '../../services/sensorDataService'

function DuLieuQuanTrac() {
  const navigate = useNavigate();

  const [allSensor, setAllSensor] = useState<ISensor[]>([]);
  const [sensorVisualData, setSensorVisualData] = useState<ISensorVisualData[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all sensors
  const fetchAllSensor = async () => {
    try {
      const data = await sensorDataService.getAllSensor();
      setAllSensor(data.data || []);
    } catch (error: any) {
      toast.error(<ToastMessage mainMessage='Failed to fetch sensors' description={error.message} />);
      console.error('Error fetching sensors:', error.message);
    }
  };

  // Fetch sensor visual data
  const fetchSensorVisualData = async () => {
    if (allSensor.length === 0) return;

    try {
      const responses = await Promise.all(
        allSensor.map((sensor) =>
          sensorDataService.getSensorVisualData({
            feed: sensor.feed,
            page: 1,
            pageSize: 1,
          }),
        ),
      );

      const visualData = responses.map((response, index) => ({
        ...allSensor[index],
        value: response?.data[0]?.value || 0,
        date: new Date(response?.data[0]?.date || Date.now()),
      }));

      setSensorVisualData(visualData);
      setLoading(false);
    } catch (error: any) {
      toast.error('Failed to fetch sensor visual data');
      console.error('Error fetching sensor visual data:', error.message);
    }
  };

  // First useEffect: Fetch all sensors on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchAllSensor();
    };

    fetchData();
  }, []);

  // Second useEffect: Fetch sensor visual data and set interval
  useEffect(() => {
    if (allSensor.length === 0) return;

    fetchSensorVisualData(); // Fetch immediately

    const intervalId = setInterval(fetchSensorVisualData, 30000); // Fetch every 30 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [allSensor]);


  return (
    <div className="flex flex-col w-full items-center px-15">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-900">
            Dữ liệu quan trắc
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                className="pl-10 pr-4 py-2 w-[300px] bg-[#e8f5e9] rounded-md border-none focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Tìm kiếm dữ liệu quan trắc"
                type="text"
              />
            </div>
            <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
              <ChevronDown className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">
              <Filter className="h-5 w-5" />
            </button>
            <button
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => navigate('/du-lieu-quan-trac/edit')}
            >
              <PenLine className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <Skeleton count={5} height={80} />
          ) : (
            sensorVisualData.map((visualData) => (
              <SensorCard key={visualData.id} data={visualData} />
            ))
          )}
        </div>

        <div className="flex justify-end items-center gap-4 mt-6">
          <div className="flex items-center border rounded-md">
            <button className="px-2 py-1 flex items-center gap-1 hover:bg-gray-50">
              <span>5</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          <button className="flex items-center gap-1 px-3 py-1 text-sm border rounded-md hover:bg-gray-50 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>
          <span className="text-sm text-gray-600">1/2</span>
          <button className="flex items-center gap-1 px-3 py-1 text-sm border rounded-md transition-colors bg-green-600 text-white hover:bg-green-700">
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DuLieuQuanTrac
