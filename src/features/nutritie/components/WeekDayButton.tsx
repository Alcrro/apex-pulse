import { DAY_LABELS } from '../utils/weekStrip'

interface WeekDayButtonProps {
  day: string
  index: number
  selectedDate: string
  today: string
  onSelect: (date: string) => void
}

export function WeekDayButton({ day, index, selectedDate, today, onSelect }: WeekDayButtonProps) {
  const isSelected = day === selectedDate
  const isToday    = day === today
  const isFuture   = day > today
  const dayNum     = new Date(day).getDate()

  return (
    <button
      onClick={() => !isFuture && onSelect(day)}
      disabled={isFuture}
      className="flex-1 flex flex-col items-center gap-1.5 disabled:pointer-events-none"
    >
      <span className={`text-[10px] font-semibold leading-none ${isToday && !isSelected ? 'text-orange-400' : 'text-gray-600'}`}>
        {DAY_LABELS[index]}
      </span>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
        isSelected
          ? 'bg-orange-500 shadow-md shadow-orange-500/40'
          : isToday  ? 'ring-1 ring-orange-500/60'
          : isFuture ? ''
          : 'hover:bg-gray-800 active:bg-gray-700'
      }`}>
        <span className={`text-[13px] font-bold leading-none ${
          isSelected ? 'text-white' : isToday ? 'text-orange-400' : isFuture ? 'text-gray-700' : 'text-gray-400'
        }`}>
          {dayNum}
        </span>
      </div>
      <div className={`w-1 h-1 rounded-full transition-opacity ${isToday && !isSelected ? 'bg-orange-500 opacity-100' : 'opacity-0'}`} />
    </button>
  )
}
