import { Dumbbell, Calendar, Clock, Activity, Pencil } from 'lucide-react'

function formatRelative(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diffMs / 86400000)
  if (days === 0) return 'azi'
  if (days === 1) return 'ieri'
  if (days < 7) return `acum ${days} zile`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `acum ${weeks} săpt.`
  const months = Math.floor(days / 30)
  if (months < 12) return `acum ${months} luni`
  return `acum ${Math.floor(days / 365)} ani`
}

interface Props {
  sessionCount: number
  lastSessionDate: string | null
  avgDurationMinutes: number | null
  exerciseCount: number
  editCount: number
}

export function WorkoutPlanMiniStats({ sessionCount, lastSessionDate, avgDurationMinutes, exerciseCount, editCount }: Props) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mt-2 pt-2 border-t border-gray-800">
      <span className="flex items-center gap-0.5">
        <Dumbbell className="w-3 h-3" />
        {sessionCount} sesiuni
      </span>
      <span className="flex items-center gap-0.5">
        <Calendar className="w-3 h-3" />
        {lastSessionDate ? formatRelative(lastSessionDate) : 'Niciodată'}
      </span>
      {avgDurationMinutes != null && avgDurationMinutes > 0 && (
        <span className="flex items-center gap-0.5">
          <Clock className="w-3 h-3" />
          {Math.round(avgDurationMinutes)} min
        </span>
      )}
      <span className="flex items-center gap-0.5">
        <Activity className="w-3 h-3" />
        {exerciseCount} exerciții
      </span>
      {editCount > 1 && (
        <span className="flex items-center gap-0.5">
          <Pencil className="w-3 h-3" />
          editat de {editCount}×
        </span>
      )}
    </div>
  )
}
