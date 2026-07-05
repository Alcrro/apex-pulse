import { Dumbbell, Flame, Trophy, Star, CalendarDays, Scale, Clock, Timer } from 'lucide-react'
import type { WorkoutStats } from '../hooks/useWorkoutStats'

function formatVolume(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t`
  return Math.round(kg).toLocaleString('ro-RO')
}

const GOLD = '#D4B96A'

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-1.5 p-3 bg-gray-800 rounded-xl">
      <div style={{ color: GOLD }}>{icon}</div>
      <div className="font-black text-base text-center leading-tight" style={{ color: GOLD }}>{value}</div>
      <div className="text-gray-400 text-xs text-center leading-tight">{label}</div>
    </div>
  )
}

interface Props {
  stats: WorkoutStats | null
  loading: boolean
}

export function WorkoutStatsCard({ stats, loading }: Props) {
  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 animate-pulse">
        <div className="grid grid-cols-4 gap-px">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-800 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!stats || stats.totalSessions === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
        <Dumbbell size={32} className="text-gray-600 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Finalizează prima sesiune pentru a vedea statistici.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
      <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: GOLD }}>Statistici</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatItem icon={<Dumbbell size={18} />} label="Sesiuni totale" value={stats.totalSessions} />
        <StatItem icon={<Flame size={18} />} label="Streak curent" value={`${stats.currentStreak} zile`} />
        <StatItem icon={<Trophy size={18} />} label="Cel mai lung" value={`${stats.bestStreak} zile`} />
        <StatItem icon={<Star size={18} />} label="Plan favorit" value={stats.favoritePlanName ?? '—'} />
        <StatItem icon={<CalendarDays size={18} />} label="Sesiuni/săpt." value={stats.avgSessionsPerWeek.toFixed(1)} />
        <StatItem icon={<Scale size={18} />} label="Volum total" value={`${formatVolume(stats.totalVolumeKg)} kg`} />
        <StatItem icon={<Clock size={18} />} label="Total ore" value={`${Math.round(stats.totalHours)} h`} />
        <StatItem icon={<Timer size={18} />} label="Medie sesiune" value={`${Math.round(stats.avgSessionMinutes)} min`} />
      </div>
    </div>
  )
}
