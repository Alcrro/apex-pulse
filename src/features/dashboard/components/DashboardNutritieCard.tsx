import { useNavigate } from 'react-router-dom'
import { Utensils, Droplets, Flame } from 'lucide-react'
import { useNutritionLog } from '../../nutritie/hooks/useNutritionLog'
import { useNutritionTarget } from '../../nutritie/hooks/useNutritionTarget'
import { useWeeklyCalories } from '../../nutritie/hooks/useWeeklyCalories'
import { formatDate } from '../../nutritie/utils/nutritionHelpers'

function MacroChip({ label, value, target, color }: { label: string; value: number; target: number | null; color: string }) {
  return (
    <div className="flex-1 bg-gray-800/60 rounded-xl px-3 py-2 text-center">
      <div className="text-[10px] font-semibold mb-0.5" style={{ color }}>{label}</div>
      <div className="text-sm font-bold text-white tabular-nums">{Math.round(value)}g</div>
      {target != null && <div className="text-[10px] text-gray-600">/{target}g</div>}
    </div>
  )
}

export function DashboardNutritieCard() {
  const navigate = useNavigate()
  const today = formatDate(new Date())
  const { log } = useNutritionLog(today)
  const { goals, macroTargets } = useNutritionTarget()
  const { days } = useWeeklyCalories()

  const streak = (() => {
    if (!days.length) return 0
    const sorted = [...days].sort((a, b) => b.date.localeCompare(a.date))
    let count = 0
    for (const day of sorted) {
      if (day.consumed > 0) count++
      else break
    }
    return count
  })()

  const targetKcal = goals?.targetCalories ?? null
  const calories = log?.totalCalories ?? 0
  const calorieProgress = targetKcal ? Math.min(calories / targetKcal, 1) : 0

  const protein = log?.totalProteinG ?? 0
  const carbs = log?.totalCarbsG ?? 0
  const fat = log?.totalFatG ?? 0

  const waterMl = log?.waterMl ?? 0
  const waterTarget = log?.waterTargetMl ?? 2000
  const waterProgress = Math.min(waterMl / waterTarget, 1)

  return (
    <div
      onClick={() => navigate('/nutritie')}
      className="bg-gray-900 rounded-2xl p-4 cursor-pointer active:opacity-80 transition-opacity"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-orange-500 text-xs font-semibold tracking-widest uppercase flex items-center gap-2">
          <Utensils size={12} />
          Nutriție azi
        </h3>
        {streak > 0 && (
          <div className="flex items-center gap-1 text-orange-400">
            <Flame size={12} />
            <span className="text-xs font-bold">{streak}z streak</span>
          </div>
        )}
      </div>

      {/* Calories row */}
      <div className="mb-3">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-2xl font-black text-white tabular-nums">
            {calories.toLocaleString('ro-RO')}
          </span>
          {targetKcal != null ? (
            <span className="text-xs text-gray-400">/ <span className="font-bold text-gray-300">{targetKcal.toLocaleString('ro-RO')} kcal</span></span>
          ) : (
            <span className="text-xs text-gray-500">kcal</span>
          )}
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${calorieProgress * 100}%` }}
          />
        </div>
      </div>

      {/* Macros */}
      <div className="flex gap-2 mb-3">
        <MacroChip label="P" value={protein} target={macroTargets?.proteinG ?? null} color="#60a5fa" />
        <MacroChip label="C" value={carbs} target={macroTargets?.carbsG ?? null} color="#facc15" />
        <MacroChip label="G" value={fat} target={macroTargets?.fatG ?? null} color="#f97316" />
      </div>

      {/* Water */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-800/60">
        <Droplets size={13} className="text-blue-400 shrink-0" />
        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-400 rounded-full transition-all duration-500"
            style={{ width: `${waterProgress * 100}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 tabular-nums whitespace-nowrap">
          {(waterMl / 1000).toFixed(1)}L / <span className="font-bold text-gray-300">{(waterTarget / 1000).toFixed(1)}L</span>
        </span>
      </div>
    </div>
  )
}
