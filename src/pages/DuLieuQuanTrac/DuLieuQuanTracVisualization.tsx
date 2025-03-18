import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import {
  Download,
  ChevronDown,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../components/UI/popover'
import { Button } from '../../components/UI/button'
import { Calendar } from '../../components/UI/calendar'
import { Card } from '../../components/UI/card'
import { sensorDataService } from '../../services/sensorDataService'
import { useSearchParams } from 'react-router-dom'

interface SensorData {
  value: string
  date: string
}

interface SensorDetails {
  id: number
  name: string
  description: string
  upperbound: number
  lowerbound: number
  Data: SensorData[]
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function DataMonitoringDashboard() {
  const [searchParams] = useSearchParams()
  const subject = searchParams.get('subject') || 'Air Quality'

  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)
  const [fromDateOpen, setFromDateOpen] = useState(false)
  const [toDateOpen, setToDateOpen] = useState(false)
  const [sensorData, setSensorData] = useState<SensorDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sensorDataService.getSensorVisualData({
          subject,
          page: 1,
          pageSize: 30,
        })
        setSensorData(response)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    fetchData()
  }, [subject])

  const chartData = {
    labels:
      sensorData?.Data.map((item) => format(new Date(item.date), 'HH:mm')) ||
      [],
    datasets: [
      {
        data: sensorData?.Data.map((item) => Number(item.value)) || [],
        backgroundColor: 'rgb(0, 0, 200)',
        barPercentage: 0.9,
        categoryPercentage: 0.9,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          stepSize: 50,
          max: sensorData?.upperbound || 500,
          min: sensorData?.lowerbound || 0,
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  }

  const calculateStats = () => {
    if (!sensorData?.Data.length) return { max: 0, min: 0, avg: 0 }

    const values = sensorData.Data.map((item) => Number(item.value))
    return {
      max: Math.max(...values),
      min: Math.min(...values),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
    }
  }

  const stats = calculateStats()

  return (
    <div className="max-w-6xl mx-auto p-4 bg-[#f8f8f0]">
      <div className="mb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-[#2c4c2c]">
            Dữ liệu quan trắc
          </h1>
          <h2 className="text-xl text-[#2c4c2c]">
            {sensorData?.name || 'Loading...'}
          </h2>
          <div className="flex items-center mt-1">
            <Settings className="h-5 w-5 mr-2 text-[#2c4c2c]" />
            <span className="text-sm text-[#2c4c2c]">Cài đặt cảnh báo</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 mt-3">
          <div className="flex items-center gap-1 relative">
            <span className="text-sm whitespace-nowrap">Từ ngày</span>
            <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 px-3 py-1 bg-white border-gray-300 hover:bg-gray-50 text-gray-700 w-[140px] justify-start font-normal transition-colors cursor-pointer"
                >
                  {fromDate ? format(fromDate, 'dd/MM/yyyy') : 'Chọn ngày'}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 z-50"
                align="start"
                sideOffset={4}
              >
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={(date) => {
                    setFromDate(date)
                    setFromDateOpen(false)
                  }}
                  initialFocus
                  className="rounded-md border-0 shadow-md bg-white"
                  classNames={{
                    day: 'hover:cursor-pointer',
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-1 ml-3 relative">
            <span className="text-sm whitespace-nowrap">Đến ngày</span>
            <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 px-3 py-1 bg-white border-gray-300 hover:bg-gray-50 text-gray-700 w-[140px] justify-start font-normal transition-colors cursor-pointer"
                >
                  {toDate ? format(toDate, 'dd/MM/yyyy') : 'Chọn ngày'}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 z-50"
                align="start"
                sideOffset={4}
              >
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={(date) => {
                    setToDate(date)
                    setToDateOpen(false)
                  }}
                  initialFocus
                  className="rounded-md border-0 shadow-md bg-white"
                  classNames={{
                    day: 'hover:cursor-pointer',
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button className="bg-[#4a8c4a] hover:bg-[#3a7a3a] text-white ml-3 h-9 px-4 transition-colors cursor-pointer">
            <Search className="h-4 w-4 mr-2" />
            Tìm kiếm
          </Button>

          <Button
            variant="outline"
            className="bg-[#f8f8d0] hover:bg-[#f0f0c0] text-black border-[#e0e0a0] h-9 px-4 transition-colors cursor-pointer"
            onClick={() => {
              setFromDate(undefined)
              setToDate(undefined)
            }}
          >
            Bỏ tìm kiếm
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="border border-blue-500 p-0 overflow-hidden bg-white rounded-md shadow-sm">
          <div className="h-[240px] p-3">
            <Bar options={chartOptions} data={chartData} />
          </div>
        </Card>

        <Card className="p-4 bg-white rounded-md flex flex-col items-center justify-center shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Giá trị lớn nhất</h3>
          <p className="text-5xl font-bold">{stats.max}</p>
        </Card>

        <Card className="p-4 bg-white rounded-md flex flex-col items-center justify-center shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Giá trị nhỏ nhất</h3>
          <p className="text-5xl font-bold">{stats.min}</p>
        </Card>
      </div>

      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold mb-1">Giá trị trung bình</h3>
        <p className="text-5xl font-bold">{stats.avg.toFixed(1)}</p>
      </div>

      <div className="mb-4">
        <div className="bg-[#2c4c2c] text-white p-2 flex justify-between items-center">
          <div className="font-medium">Giá trị</div>
          <div className="flex items-center font-medium cursor-pointer transition-colors hover:text-gray-200">
            Thời gian quan trắc
            <ChevronDown className="ml-1 h-4 w-4" />
          </div>
        </div>
        <div className="h-[200px] bg-[#d0e8d0]"></div>
      </div>

      <div className="flex justify-end gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 cursor-pointer"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" className="h-8 cursor-pointer">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled className="h-8">
          1/1
        </Button>
        <Button variant="outline" size="sm" className="h-8 cursor-pointer">
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
