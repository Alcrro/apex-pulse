import { useState } from 'react'
import { Play, Dumbbell } from 'lucide-react'
import type { WorkoutPlan } from '../../../shared/types'
import { getDaysSince } from '../utils/formatters'

function getAccentColor(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('umeri') || n.includes('shoulder')) return '#B9A070'
  if (n.includes('spate') || n.includes('back')) return '#7091B9'
  if (n.includes('picioare') || n.includes('leg')) return '#6A9E6A'
  if (n.includes('piept') || n.includes('chest')) return '#B97070'
  if (n.includes('biceps')) return '#8B70B9'
  if (n.includes('triceps')) return '#70B9B9'
  if (n.includes('abdomen') || n.includes('core')) return '#8B8B70'
  return '#D4B96A'
}

function getDifficulty(count: number): { label: string; level: 1 | 2 | 3 } {
  if (count <= 4) return { label: 'Ușor', level: 1 }
  if (count <= 7) return { label: 'Medie', level: 2 }
  return { label: 'Greu', level: 3 }
}

function daysSinceLabel(days: number): string {
  if (days === 0) return 'Azi'
  if (days === 1) return 'Ieri'
  return `${days}z în urmă`
}

interface WorkoutCardProps {
  workout: WorkoutPlan
  lastSessionDate: string | null
  onStart: () => void
}

function WorkoutCard({ workout, lastSessionDate, onStart }: WorkoutCardProps) {
  const exerciseCount = workout.workout_exercises?.[0]?.count ?? 0
  const color = getAccentColor(workout.name)
  const difficulty = getDifficulty(exerciseCount)
  const daysSince = lastSessionDate != null ? getDaysSince(lastSessionDate) : null

  return (
    <div
      className="bg-forge-surface rounded-xl p-4 border-l-4 flex flex-col gap-3"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-forge-text text-[0.95rem] leading-tight">{workout.name}</div>
          <div className="text-forge-muted text-xs mt-0.5">{exerciseCount} exerciții</div>
        </div>
        <div className="text-forge-muted text-xs whitespace-nowrap pt-0.5">
          {daysSince != null ? daysSinceLabel(daysSince) : 'Niciodată'}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {([1, 2, 3] as const).map(i => (
            <div
              key={i}
              className="h-[3px] w-5 rounded-full"
              style={{ backgroundColor: i <= difficulty.level ? color : '#2A2A2A' }}
            />
          ))}
          <span className="text-forge-muted text-xs ml-1">{difficulty.label}</span>
        </div>

        <button
          onClick={onStart}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity active:opacity-70"
          style={{
            backgroundColor: color + '1A',
            color,
            border: `1px solid ${color}40`,
          }}
        >
          <Play size={10} fill="currentColor" />
          Start
        </button>
      </div>
    </div>
  )
}

interface WorkoutQuickStartProps {
  workouts: WorkoutPlan[]
  lastSessionByWorkout: Record<string, string>
  onStart: (workoutId: string) => void
  onViewAll: () => void
  onCreatePlan: () => void
}

export function WorkoutQuickStart({
  workouts,
  lastSessionByWorkout,
  onStart,
  onViewAll,
  onCreatePlan,
}: WorkoutQuickStartProps) {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? workouts : workouts.slice(0, 3)

  return (
    <div>
      <h3 className="text-forge-muted text-xs font-semibold tracking-widest uppercase mb-3 flex items-center gap-2">
        <Dumbbell size={12} />
        Antrenamente
      </h3>

      {workouts.length === 0 ? (
        <div className="bg-forge-surface rounded-xl p-6 text-center">
          <p className="text-forge-muted text-sm mb-3">Niciun plan de antrenament</p>
          <button
            onClick={onCreatePlan}
            className="text-forge-gold text-sm font-semibold"
          >
            Creează primul plan →
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map(w => (
            <WorkoutCard
              key={w.id}
              workout={w}
              lastSessionDate={lastSessionByWorkout[w.id] ?? null}
              onStart={() => onStart(w.id)}
            />
          ))}
          {workouts.length > 3 && (
            <button
              onClick={() => setShowAll(p => !p)}
              className="w-full text-center text-xs text-forge-muted hover:text-forge-text py-2 tracking-wide transition-colors"
            >
              {showAll ? 'Arată mai puțin ↑' : `Vezi toate (${workouts.length}) →`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
