import { Download, Utensils, Dumbbell } from 'lucide-react'
import { useAuth } from '../../../shared/context/AuthContext'
import { useWorkouts } from '../../workouts/hooks/useWorkouts'
import { useSessions } from '../../session/hooks/useSessions'
import { useInstallPWA } from '../../../shared/hooks/useInstallPWA'
import { getWeeklyCount } from '../utils/formatters'
import { DashboardGreeting } from '../components/DashboardGreeting'
import { StatsGrid } from '../components/StatsGrid'
import { LastSessionCard } from '../components/LastSessionCard'
import { WeeklyRhythmStrip } from '../components/WeeklyRhythmStrip'
import { DashboardNutritieCard } from '../components/DashboardNutritieCard'

export function DashboardPage() {
  const { user } = useAuth()
  const { workouts } = useWorkouts()
  const { sessions } = useSessions()

  const { canInstall, isIOS, install } = useInstallPWA()
  const name = (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0] ?? 'Sportiv'
  const lastSession = sessions.find(s => s.finished_at)

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

      {isIOS && (
        <div className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/30 rounded-2xl px-4 py-3">
          <Download className="text-orange-500 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-semibold text-white">Instalează aplicația</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Apasă <span className="text-white font-medium">Share</span> (
              <span className="text-white">⎙</span>) din Safari → <span className="text-white font-medium">Add to Home Screen</span>
            </p>
          </div>
        </div>
      )}

      <section className="space-y-3">
        <h3 className="text-orange-500 text-xs font-semibold tracking-widest uppercase flex items-center gap-2">
          <Utensils size={12} />
          Nutriție
        </h3>
        <DashboardNutritieCard />
      </section>

      <section className="space-y-3">
        <h3 className="text-forge-gold text-xs font-semibold tracking-widest uppercase flex items-center gap-2">
          <Dumbbell size={12} />
          Antrenamente
        </h3>
        <StatsGrid
          weeklyCount={getWeeklyCount(sessions)}
          totalCount={sessions.filter(s => s.finished_at).length}
          plansCount={workouts.length}
        />
        {lastSession && <LastSessionCard session={lastSession} />}
        <WeeklyRhythmStrip sessions={sessions} />
      </section>
    </div>
  )
}
