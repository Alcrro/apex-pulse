import { Copy } from 'lucide-react'
import type { DayOption } from '../../hooks/useMealCopyDays'
import { CopyDayRow } from './CopyDayRow'

interface Props {
  days: DayOption[]
  isLoading: boolean
  onSelect: (date: string) => void
}

export function CopyDayList({ days, isLoading, onSelect }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (days.length === 0) {
    return (
      <div className="text-center py-12">
        <Copy size={32} className="text-gray-700 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Nicio masă de copiat în ultimele 30 de zile.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {days.map((day) => (
        <CopyDayRow key={day.date} day={day} onSelect={onSelect} />
      ))}
    </div>
  )
}
