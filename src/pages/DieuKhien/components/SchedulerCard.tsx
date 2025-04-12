import React from 'react'
import { Card } from '../../../components/UI/card'
import { Settings } from 'lucide-react'

enum DaysOfWeek {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
}

const SchedulerCard: React.FC = () => {
  return (
    <Card className='bg-green-200 rounded-lg p-4 shadow-none border-green-900 border-[1px]'>
      <div className='flex items-center justify-between'>
        <div className="text-4xl font-semibold text-green-950">
          {/* {deviceConfig[0]?.schedulerConfig?.start + " - " + deviceConfig[0]?.schedulerConfig?.end} */}
        </div>
        <button>
          <Settings className="h-6 w-6 text-green-900 cursor-pointer" />
        </button>
      </div>
      
      <div className='flex items-center justify-between'>
        <p>Repeat</p>
        <div className='flex flex-wrap justify-center'>
          {/* {days.map((day) => (
            <div key={day} className="h-8 w-8 text-sm font-medium flex items-center justify-center border-2 border-green-900 rounded-full m-1">
              <span>{day.charAt(0)}</span>
            </div>
          ))} */}
        </div>
      </div>            
    </Card>
  )
}

export default SchedulerCard