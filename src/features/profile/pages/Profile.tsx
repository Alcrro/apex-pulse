import { useState } from 'react'
import { useAuth } from '../../../shared/context/AuthContext'
import { useTheme } from '../../../shared/context/ThemeContext'
import { useSessions } from '../../session/hooks/useSessions'
import { useWorkouts } from '../../workouts/hooks/useWorkouts'
import { ProfileCard } from '../components/ProfileCard'
import { ProfileStats } from '../components/ProfileStats'
import { Button } from '../../../shared/components/atoms/Button'
import { getTotalMins, formatTotalTime, getWeeklyCount } from '../utils/statsUtils'
import { LogOut, Sun, Moon } from 'lucide-react'

export function ProfilePage() {
  const { user, signOut } = useAuth()
  const { theme, toggle } = useTheme()
  const { sessions } = useSessions()
  const { workouts } = useWorkouts()
  const [signingOut, setSigningOut] = useState(false)

  const finished = sessions.filter(s => s.finished_at)

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
  }

  return (
    <div className="space-y-6 pt-2">
      <ProfileCard
        name={(user?.user_metadata?.full_name as string | undefined) ?? 'Utilizator'}
        email={user?.email ?? ''}
      />

      <ProfileStats
        totalSessions={finished.length}
        weeklyCount={getWeeklyCount(finished)}
        totalTime={formatTotalTime(getTotalMins(finished))}
        plansCount={workouts.length}
      />

      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 rounded-xl text-sm"
      >
        <span className="text-gray-300 font-medium">Temă</span>
        <div className="flex items-center gap-2 text-gray-400">
          {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
          <span>{theme === 'dark' ? 'Întunecat' : 'Luminos'}</span>
        </div>
      </button>

      <Button variant="secondary" className="w-full" onClick={handleSignOut} disabled={signingOut}>
        <LogOut size={16} />
        {signingOut ? 'Se deconectează...' : 'Deconectare'}
      </Button>
    </div>
  )
}
