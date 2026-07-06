import type { DayOption } from '../../hooks/useMealCopyDays'

interface Props {
  day: DayOption
  onSelect: (date: string) => void
}

export function CopyDayRow({ day, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(day.date)}
      className="w-full flex items-center gap-4 p-4 bg-gray-800 hover:bg-gray-700 rounded-2xl transition-colors text-left"
    >
      <div className="flex-1">
        <p className="text-sm font-semibold text-white capitalize">{day.label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{day.date}</p>
      </div>
      <div className="text-right shrink-0">
        <span className="text-sm font-bold text-orange-500">{day.count}</span>
        <span className="text-xs text-gray-500 ml-1">{day.count === 1 ? 'aliment' : 'alimente'}</span>
      </div>
    </button>
  )
}
