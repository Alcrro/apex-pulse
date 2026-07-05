import { useNavigate } from 'react-router-dom'
import { Dumbbell, Settings } from 'lucide-react'
import { useWorkouts } from '../hooks/useWorkouts'
import { useSessions } from '../../session/hooks/useSessions'
import { WorkoutQuickStart } from '../../dashboard/components/WorkoutQuickStart'

export function WorkoutsPage() {
  const navigate = useNavigate()
  const { workouts } = useWorkouts()
  const { sessions } = useSessions()

  const lastSessionByWorkout: Record<string, string> = {}
  for (const s of sessions) {
    if (s.finished_at && s.workout_plan_id && !lastSessionByWorkout[s.workout_plan_id]) {
      lastSessionByWorkout[s.workout_plan_id] = s.started_at
    }
  }

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <h3 className="text-forge-gold text-xs font-semibold tracking-widest uppercase flex items-center gap-2">
          <Dumbbell size={12} />
          Antrenamente
        </h3>
        <button
          onClick={() => navigate('/antrenamente/setari')}
          className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors"
          aria-label="Setări planuri"
        >
          <Settings size={15} />
        </button>
      </div>

      <WorkoutQuickStart
        workouts={workouts}
        lastSessionByWorkout={lastSessionByWorkout}
        onStart={id => navigate(`/sesiune/${id}`)}
        onViewAll={() => {}}
        onCreatePlan={() => navigate('/antrenamente/setari')}
      />
    </div>
  )
}
