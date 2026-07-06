import { X } from 'lucide-react'
import type { NutritionGoals, GoalType, NutritionPhase } from '../../../shared/types'
import { GOAL_LABELS, GOAL_OFFSETS, GOAL_MACRO_SPLIT } from '../utils/nutritionHelpers'
import { CalorieTargetSection } from './nutrition-info-modal/CalorieTargetSection'
import { MacroSplitSection } from './nutrition-info-modal/MacroSplitSection'
import { MacroRolesSection } from './nutrition-info-modal/MacroRolesSection'
import { GoalSection } from './nutrition-info-modal/GoalSection'

interface Props {
  goals: NutritionGoals | null
  macroTargets: { proteinG: number; carbsG: number; fatG: number } | null
  avgCalories: number | null
  phase: NutritionPhase
  onSetGoal: (g: GoalType) => void
  onClose: () => void
}

export function NutritionInfoModal({ goals, macroTargets, avgCalories, phase, onSetGoal, onClose }: Props) {
  const hasGoal = phase === 'active' && !!goals?.goalType && !!goals.targetCalories
  const tdee       = avgCalories ?? goals?.tdeeEstimated ?? 2000
  const targetKcal = goals?.targetCalories ?? tdee
  const split      = goals?.goalType ? GOAL_MACRO_SPLIT[goals.goalType] : { protein: 25, carbs: 45, fat: 30 }
  const offset     = goals?.goalType ? GOAL_OFFSETS[goals.goalType] : 0
  const goalLabel  = goals?.goalType ? GOAL_LABELS[goals.goalType] : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-gray-900 rounded-t-3xl border-t border-gray-800 shadow-2xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-700" />
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
          <h2 className="text-base font-bold text-white">Cum sunt calculate valorile</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-800 text-gray-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-6">
          <CalorieTargetSection
            hasGoal={hasGoal}
            avgCalories={avgCalories}
            targetKcal={targetKcal}
            offset={offset}
            goalLabel={goalLabel}
          />
          <MacroSplitSection split={split} targetKcal={targetKcal} macroTargets={macroTargets} />
          <MacroRolesSection />
          <GoalSection
            hasGoal={hasGoal}
            targetKcal={targetKcal}
            goalLabel={goalLabel}
            tdee={tdee}
            currentGoal={goals?.goalType ?? null}
            onSetGoal={onSetGoal}
          />
          <div className="h-4" />
        </div>
      </div>
    </div>
  )
}
