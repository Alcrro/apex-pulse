import { useState } from 'react'
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import type { GoalType } from '../../../shared/types'
import { GOAL_OFFSETS, GOAL_MACRO_SPLIT, computeMacroTargets } from '../utils/nutritionHelpers'
import { GoalSelector } from './GoalSelector'
import { OnboardingStepIndicator } from './onboarding-caloric/OnboardingStepIndicator'
import { OnboardingCalorieProfile } from './onboarding-caloric/OnboardingCalorieProfile'
import { OnboardingConfirmation } from './onboarding-caloric/OnboardingConfirmation'

const STEP_TITLES = ['Profilul tău caloric', 'Alege obiectivul', 'Confirmare']

interface OnboardingCaloricProps {
  avgCalories: number | null
  onSetGoal: (type: GoalType) => void
  onDismiss: () => void
}

export function OnboardingCaloric({ avgCalories, onSetGoal, onDismiss }: OnboardingCaloricProps) {
  const [step, setStep] = useState(1)
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null)

  const tdee = avgCalories ?? 2000
  const targetCalories = selectedGoal ? tdee + GOAL_OFFSETS[selectedGoal] : null
  const macros = selectedGoal && targetCalories
    ? computeMacroTargets(targetCalories, GOAL_MACRO_SPLIT[selectedGoal])
    : null

  function handleConfirm() {
    if (!selectedGoal) return
    onSetGoal(selectedGoal)
    onDismiss()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950">
      <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-gray-800">
        {step > 1 ? (
          <button onClick={() => setStep((s) => s - 1)} className="p-2 rounded-xl hover:bg-gray-800 text-gray-400">
            <ChevronLeft size={20} />
          </button>
        ) : (
          <div className="w-9" />
        )}
        <h2 className="flex-1 text-center font-bold text-white text-base">{STEP_TITLES[step - 1]}</h2>
        <button onClick={onDismiss} className="p-2 rounded-xl hover:bg-gray-800 text-gray-400">
          <X size={20} />
        </button>
      </div>

      <OnboardingStepIndicator currentStep={step} totalSteps={3} />

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {step === 1 && <OnboardingCalorieProfile avgCalories={avgCalories} />}
        {step === 2 && <GoalSelector selected={selectedGoal} tdee={tdee} onSelect={setSelectedGoal} />}
        {step === 3 && selectedGoal && targetCalories && macros && (
          <OnboardingConfirmation selectedGoal={selectedGoal} targetCalories={targetCalories} macros={macros} />
        )}
      </div>

      <div className="px-4 pb-safe pb-6 pt-3 border-t border-gray-800">
        {step < 3 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 2 && !selectedGoal}
            className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
          >
            Continuă
            <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleConfirm}
            className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base transition-colors flex items-center justify-center gap-2"
          >
            <Check size={18} />
            Confirmă obiectivul
          </button>
        )}
      </div>
    </div>
  )
}
