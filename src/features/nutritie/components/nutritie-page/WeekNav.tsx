import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getMondayOf } from '../WeekStrip'
import { addDays } from '../../utils/nutritionHelpers'

interface Props {
  date: string
  today: string
  onChange: (d: string) => void
}

export function WeekNav({ date, today, onChange }: Props) {
  const monthLabel = new Date(date).toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })
  const sameWeekAsToday = getMondayOf(date) === getMondayOf(today)

  return (
    <div className="flex items-center justify-between px-1">
      <span className="text-white font-bold text-base capitalize">{monthLabel}</span>
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => onChange(addDays(date, -7))}
          className="p-1.5 rounded-xl hover:bg-gray-800 text-gray-500 hover:text-white transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => onChange(addDays(date, 7))}
          disabled={sameWeekAsToday}
          className="p-1.5 rounded-xl hover:bg-gray-800 text-gray-500 hover:text-white transition-colors disabled:opacity-25 disabled:pointer-events-none"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
