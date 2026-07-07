import type { GoalType } from '../../../shared/types'
import { GOAL_LABELS, GOAL_OFFSETS, GOAL_MACRO_SPLIT } from '../utils/nutritionHelpers'

const GOAL_DESC: Record<GoalType, string> = {
  mentinere:        'Menții greutatea actuală',
  deficit_usor:     '-300 kcal/zi — slăbire lentă',
  deficit_moderat:  '-500 kcal/zi — slăbire constantă',
  surplus:          '+300 kcal/zi — creștere în masă',
}

interface GoalCardProps {
  goal: GoalType
  tdee: number
  isSelected: boolean
  onSelect: (goal: GoalType) => void
}

export function GoalCard({ goal, tdee, isSelected, onSelect }: GoalCardProps) {
  const target = tdee + GOAL_OFFSETS[goal]
  const split  = GOAL_MACRO_SPLIT[goal]

  return (
    <button
      onClick={() => onSelect(goal)}
      className={`w-full text-left p-4 rounded-2xl border transition-colors ${
        isSelected ? 'bg-orange-500/10 border-orange-500' : 'bg-gray-800 border-gray-700 hover:border-gray-500'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`font-semibold text-sm ${isSelected ? 'text-orange-500' : 'text-white'}`}>
            {GOAL_LABELS[goal]}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{GOAL_DESC[goal]}</p>
        </div>
        <span className={`text-lg font-black ${isSelected ? 'text-orange-500' : 'text-gray-300'}`}>
          {target} kcal
        </span>
      </div>
      <div className="flex gap-3 mt-2">
        <span className="text-xs text-blue-400">P {split.protein}%</span>
        <span className="text-xs text-yellow-400">C {split.carbs}%</span>
        <span className="text-xs text-red-400">G {split.fat}%</span>
      </div>
    </button>
  )
}
