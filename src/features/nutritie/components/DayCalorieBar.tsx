const DAY_LABELS: Record<number, string> = {
  0: 'Du',
  1: 'Lu',
  2: 'Ma',
  3: 'Mi',
  4: 'Jo',
  5: 'Vi',
  6: 'Sâ',
}

interface DayCalorieBarProps {
  date: string
  consumed: number
  target: number | null
  isToday: boolean
  maxConsumed: number
}

export function DayCalorieBar({ date, consumed, target, isToday, maxConsumed }: DayCalorieBarProps) {
  const dayOfWeek = new Date(date + 'T12:00:00').getDay()
  const label = DAY_LABELS[dayOfWeek]
  const hasData = consumed > 0

  const fillPct = maxConsumed > 0 ? Math.min((consumed / maxConsumed) * 100, 100) : 0

  let barColor = 'bg-gray-700'
  if (hasData) {
    if (target && consumed > target) {
      barColor = 'bg-red-400'
    } else {
      barColor = 'bg-green-400'
    }
  }

  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <span className="text-[10px] text-gray-400 tabular-nums">
        {hasData ? `${Math.round(consumed / 100) * 100}` : '—'}
      </span>
      <div className="w-full h-20 bg-gray-800 rounded-lg overflow-hidden flex flex-col justify-end">
        <div
          className={`w-full rounded-lg transition-all duration-500 ${barColor}`}
          style={{ height: hasData ? `${Math.max(fillPct, 4)}%` : '4%', opacity: hasData ? 1 : 0.3 }}
        />
      </div>
      <span className={`text-[10px] font-semibold ${isToday ? 'text-orange-500' : 'text-gray-500'}`}>
        {label}
      </span>
      {isToday && <div className="w-1 h-1 rounded-full bg-orange-500" />}
    </div>
  )
}
