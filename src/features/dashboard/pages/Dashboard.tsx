import { useNavigate } from 'react-router-dom'
import { Download } from 'lucide-react'
import { useAuth } from '../../../shared/context/AuthContext'
import { useWorkouts } from '../../workouts/hooks/useWorkouts'
import { useSessions } from '../../session/hooks/useSessions'
import { useInstallPWA } from '../../../shared/hooks/useInstallPWA'
import { getWeeklyCount } from '../utils/formatters'
import { DashboardGreeting } from '../components/DashboardGreeting'
import { StatsGrid } from '../components/StatsGrid'
import { WorkoutQuickStart } from '../components/WorkoutQuickStart'
import { LastSessionCard } from '../components/LastSessionCard'
import { WeeklyRhythmStrip } from '../components/WeeklyRhythmStrip'

export function DashboardPage() {
  const { user } = useAuth()
  const { workouts } = useWorkouts()
  const { sessions } = useSessions()
  const navigate = useNavigate()

  const { canInstall, install } = useInstallPWA()
  const name = (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0] ?? 'Sportiv'
  const lastSession = sessions.find(s => s.finished_at)

  // sessions are ordered desc by started_at — first occurrence per workout is most recent
  const lastSessionByWorkout: Record<string, string> = {}
  for (const s of sessions) {
    if (s.finished_at && s.workout_plan_id && !lastSessionByWorkout[s.workout_plan_id]) {
      lastSessionByWorkout[s.workout_plan_id] = s.started_at
    }
  }

  return (
    <div className="space-y-6 pt-2 pb-4">
      <DashboardGreeting name={name} />

      {canInstall && (
        <button
          onClick={install}
          className="w-full flex items-center gap-3 bg-orange-500/10 border border-orange-500/30 rounded-2xl px-4 py-3 text-left hover:bg-orange-500/20 transition-colors"
        >
          <Download className="text-orange-500 shrink-0" size={20} />
          <div>
            <p className="text-sm font-semibold text-white">Instalează aplicația</p>
            <p className="text-xs text-gray-400">Acces rapid de pe ecranul principal</p>
          </div>
        </button>
      )}

      <StatsGrid
        weeklyCount={getWeeklyCount(sessions)}
        totalCount={sessions.filter(s => s.finished_at).length}
        plansCount={workouts.length}
      />

      <WorkoutQuickStart
        workouts={workouts}
        lastSessionByWorkout={lastSessionByWorkout}
        onStart={id => navigate(`/sesiune/${id}`)}
        onViewAll={() => navigate('/antrenamente')}
        onCreatePlan={() => navigate('/antrenamente')}
      />

      {lastSession && <LastSessionCard session={lastSession} />}

      <WeeklyRhythmStrip sessions={sessions} />
    </div>
  )
}
