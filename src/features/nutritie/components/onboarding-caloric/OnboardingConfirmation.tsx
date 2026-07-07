import type { GoalType } from '../../../../shared/types'
import { GOAL_LABELS } from '../../utils/nutritionHelpers'

interface OnboardingConfirmationProps {
  selectedGoal: GoalType
  targetCalories: number
  macros: { proteinG: number; carbsG: number; fatG: number }
}

export function OnboardingConfirmation({ selectedGoal, targetCalories, macros }: OnboardingConfirmationProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-2xl p-5">
        <p className="text-xs text-gray-400 mb-1">Obiectiv ales</p>
        <p className="text-lg font-bold text-orange-500">{GOAL_LABELS[selectedGoal]}</p>
      </div>
      <div className="bg-gray-900 rounded-2xl p-5 text-center">
        <p className="text-xs text-gray-400 mb-1">Target zilnic</p>
        <p className="text-4xl font-black text-white tabular-nums">
          {targetCalories.toLocaleString('ro-RO')}
        </p>
        <p className="text-sm text-gray-400 mt-1">kcal/zi</p>
      </div>
      <div className="bg-gray-900 rounded-2xl p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Macronutrienți</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-xl font-black text-blue-400">{macros.proteinG}g</p>
            <p className="text-xs text-gray-500 mt-0.5">Proteine</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-yellow-400">{macros.carbsG}g</p>
            <p className="text-xs text-gray-500 mt-0.5">Carbohidrați</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-black text-red-400">{macros.fatG}g</p>
            <p className="text-xs text-gray-500 mt-0.5">Grăsimi</p>
          </div>
        </div>
      </div>
    </div>
  )
}
