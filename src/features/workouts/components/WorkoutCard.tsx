import { Card } from '../../../shared/components/atoms/Card'
import { Dumbbell, ChevronRight, Trash2 } from 'lucide-react'
import type { WorkoutPlan } from '../../../shared/types'

interface WorkoutCardProps {
  workout: WorkoutPlan
  onClick: () => void
  onDelete: (e: React.MouseEvent) => void
}

export function WorkoutCard({ workout, onClick, onDelete }: WorkoutCardProps) {
  return (
    <Card className="p-4 flex items-center gap-3" onClick={onClick}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D4B96A1A' }}>
        <Dumbbell size={20} style={{ color: '#D4B96A' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white truncate">{workout.name}</div>
        <div className="text-sm text-gray-400">
          {workout.workout_exercises?.[0]?.count ?? 0} exerciții
          {workout.description && ` • ${workout.description}`}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-colors"
        >
          <Trash2 size={16} />
        </button>
        <ChevronRight size={18} className="text-gray-600" />
      </div>
    </Card>
  )
}
