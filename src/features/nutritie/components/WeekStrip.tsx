import { formatDate } from '../utils/nutritionHelpers'

const DAY_LABELS = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D']

function getWeekDays(dateStr: string): string[] {
  const d = new Date(dateStr)
  const dow = d.getDay()
  const mondayOffset = dow === 0 ? -6 : 1 - dow
  const monday = new Date(d)
  monday.setDate(d.getDate() + mondayOffset)
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    return formatDate(day)
  })
}

export function getMondayOf(dateStr: string): string {
  const d = new Date(dateStr)
  const dow = d.getDay()
  const offset = dow === 0 ? -6 : 1 - dow
  d.setDate(d.getDate() + offset)
  return formatDate(d)
}

interface WeekStripProps {
  selectedDate: string
  today: string
  onSelect: (date: string) => void
}

export function WeekStrip({ selectedDate, today, onSelect }: WeekStripProps) {
  const days = getWeekDays(selectedDate)

  return (
    <div className="flex items-center bg-gray-900 rounded-2xl px-1 py-2">
      {days.map((day, i) => {
        const isSelected = day === selectedDate
        const isToday = day === today
        const isFuture = day > today
        const dayNum = new Date(day).getDate()

        return (
          <button
            key={day}
            onClick={() => !isFuture && onSelect(day)}
            disabled={isFuture}
            className="flex-1 flex flex-col items-center gap-1.5 disabled:pointer-events-none"
          >
            <span
              className={`text-[10px] font-semibold leading-none ${
                isToday && !isSelected ? 'text-orange-400' : 'text-gray-600'
              }`}
            >
              {DAY_LABELS[i]}
            </span>

            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                isSelected
                  ? 'bg-orange-500 shadow-md shadow-orange-500/40'
                  : isToday
                    ? 'ring-1 ring-orange-500/60'
                    : isFuture
                      ? ''
                      : 'hover:bg-gray-800 active:bg-gray-700'
              }`}
            >
              <span
                className={`text-[13px] font-bold leading-none ${
                  isSelected
                    ? 'text-white'
                    : isToday
                      ? 'text-orange-400'
                      : isFuture
                        ? 'text-gray-700'
                        : 'text-gray-400'
                }`}
              >
                {dayNum}
              </span>
            </div>

            {/* dot indicator for today when not selected */}
            <div className={`w-1 h-1 rounded-full transition-opacity ${isToday && !isSelected ? 'bg-orange-500 opacity-100' : 'opacity-0'}`} />
          </button>
        )
      })}
    </div>
  )
}
