import { Dumbbell, ChevronRight, Trash2 } from 'lucide-react'
import type { WorkoutPlan } from '../../../shared/types'
import { WorkoutPlanMiniStats } from './WorkoutPlanMiniStats'
import type { PlanStats } from '../hooks/useWorkoutStats'

const GOLD = '#D4B96A'

interface WorkoutCardProps {
  workout: WorkoutPlan
  planStats?: PlanStats
  onClick: () => void
  onDelete: (e: React.MouseEvent) => void
}

export function WorkoutCard({ workout, planStats, onClick, onDelete }: WorkoutCardProps) {
  return (
    <div
      className="px-4 py-3 cursor-pointer hover:bg-gray-800 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: GOLD + '1A' }}>
          <Dumbbell size={18} style={{ color: GOLD }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white truncate">{workout.name}</div>
          {workout.description && (
            <div className="text-xs text-gray-500 truncate">{workout.description}</div>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-colors"
          >
            <Trash2 size={15} />
          </button>
          <ChevronRight size={17} className="text-gray-600" />
        </div>
      </div>
      <WorkoutPlanMiniStats
        sessionCount={planStats?.sessionCount ?? 0}
        lastSessionDate={planStats?.lastSessionDate ?? null}
        avgDurationMinutes={planStats?.avgDurationMinutes ?? null}
        exerciseCount={workout.workout_exercises?.[0]?.count ?? 0}
        editCount={workout.edit_count ?? 0}
      />
    </div>
  )
}
