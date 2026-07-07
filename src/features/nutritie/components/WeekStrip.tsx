import { getWeekDays } from '../utils/weekStrip'
import { WeekDayButton } from './WeekDayButton'

export { getMondayOf } from '../utils/weekStrip'

interface WeekStripProps {
  selectedDate: string
  today: string
  onSelect: (date: string) => void
}

export function WeekStrip({ selectedDate, today, onSelect }: WeekStripProps) {
  const days = getWeekDays(selectedDate)
  return (
    <div className="flex items-center bg-gray-900 rounded-2xl px-1 py-2">
      {days.map((day, i) => (
        <WeekDayButton key={day} day={day} index={i} selectedDate={selectedDate} today={today} onSelect={onSelect} />
      ))}
    </div>
  )
}
