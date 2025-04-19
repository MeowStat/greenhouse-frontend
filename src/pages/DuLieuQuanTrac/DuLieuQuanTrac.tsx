import { PenLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SensorCard } from './component/SensorCard';
import { useEffect, useState } from 'react';
import { ISensor, ISensorVisualData } from '../../types/SensorTypes';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import toast from 'react-hot-toast';
import ToastMessage from '../../components/ToastNotification/ToastMessage';
import { sensorDataService } from '../../services/sensorDataService';

function DuLieuQuanTrac() {
  const navigate = useNavigate();

  const [allSensor, setAllSensor] = useState<ISensor[]>([]);
  const [sensorVisualData, setSensorVisualData] = useState<ISensorVisualData[]>(
    []
  );
  const [loading, setLoading] = useState(false);

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
      console.error('Error fetching sensors:', error.message);
    }
  };

  const fetchSensorVisualData = async () => {
    if (allSensor.length === 0) return;

    try {
      const responses = await Promise.all(
        allSensor.map((sensor) =>
          sensorDataService.getSensorVisualData({
            id: sensor.id,
            page: 1,
            pageSize: 1,
          })
        )
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchAllSensor();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (allSensor.length === 0) return;

    fetchSensorVisualData();

    const intervalId = setInterval(fetchSensorVisualData, 30000);

    return () => clearInterval(intervalId);
  }, [allSensor]);

  return (
    <div className="flex flex-col w-full items-center px-15">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-900">
            Dữ liệu quan trắc
          </h1>
          <div className="flex items-center gap-4">
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
      </div>
    </div>
  );
}

export default DuLieuQuanTrac;
