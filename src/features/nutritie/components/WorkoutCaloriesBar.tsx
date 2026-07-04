import { Flame, Dumbbell } from 'lucide-react'
import { useWorkoutCalories } from '../hooks/useWorkoutCalories'

interface WorkoutCaloriesBarProps {
  date: string
}

export function WorkoutCaloriesBar({ date }: WorkoutCaloriesBarProps) {
  const { totalBurned, sessions, isLoading } = useWorkoutCalories(date)

  if (isLoading || sessions.length === 0) return null

  return (
    <div className="bg-gray-900 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={15} className="text-orange-500" />
          <span className="text-sm font-semibold text-white">Calorii arse</span>
        </div>
        <span className="text-lg font-black text-orange-500 tabular-nums">
          -{totalBurned.toLocaleString('ro-RO')} kcal
        </span>
      </div>

      <div className="space-y-2">
        {sessions.map((s) => (
          <div key={s.id} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
              <Dumbbell size={14} className="text-orange-400" />
            </div>
            <span className="flex-1 text-xs text-gray-300 truncate">{s.name}</span>
            <span className="text-xs font-semibold text-orange-400 shrink-0">
              ~{s.estimatedCalories} kcal
            </span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-gray-600 text-center">
        Estimare bazată pe volumul antrenamentului
      </p>
    </div>
  )
}
