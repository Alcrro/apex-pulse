import { useState } from 'react'
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import type { GoalType } from '../../../shared/types'
import { GoalSelector } from './GoalSelector'
import { GOAL_LABELS, GOAL_OFFSETS, GOAL_MACRO_SPLIT, computeMacroTargets } from '../utils/nutritionHelpers'

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
      {/* header */}
      <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-gray-800">
        {step > 1 ? (
          <button onClick={() => setStep((s) => s - 1)} className="p-2 rounded-xl hover:bg-gray-800 text-gray-400">
            <ChevronLeft size={20} />
          </button>
        ) : (
          <div className="w-9" />
        )}
        <h2 className="flex-1 text-center font-bold text-white text-base">
          {step === 1 ? 'Profilul tău caloric' : step === 2 ? 'Alege obiectivul' : 'Confirmare'}
        </h2>
        <button onClick={onDismiss} className="p-2 rounded-xl hover:bg-gray-800 text-gray-400">
          <X size={20} />
        </button>
      </div>

      {/* step indicators */}
      <div className="flex items-center justify-center gap-2 py-4">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              s === step ? 'w-6 bg-orange-500' : s < step ? 'w-2 bg-orange-500/50' : 'w-2 bg-gray-700'
            }`}
          />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-2xl p-5 text-center">
              {avgCalories !== null ? (
                <>
                  <p className="text-xs text-gray-400 mb-2">Mănânci în medie</p>
                  <p className="text-5xl font-black text-orange-500 tabular-nums">
                    {avgCalories.toLocaleString('ro-RO')}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">kcal/zi</p>
                  <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                    Aceasta este media ta calorică bazată pe zilele logate. Vom folosi această valoare
                    ca punct de referință pentru a-ți calcula obiectivul.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-black text-gray-600 mb-2">~2000</p>
                  <p className="text-sm text-gray-400">kcal/zi (estimare implicită)</p>
                  <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                    Nu avem suficiente date pentru a-ți calcula media calorică. Vom folosi 2000 kcal
                    ca estimare. Poți ajusta manual după setarea obiectivului.
                  </p>
                </>
              )}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
              <p className="text-xs text-blue-300 leading-relaxed">
                Pe baza acestei valori îți vom sugera un target caloric adaptat obiectivului tău.
                Poți modifica oricând din Setări.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <GoalSelector
            selected={selectedGoal}
            tdee={tdee}
            onSelect={setSelectedGoal}
          />
        )}

        {step === 3 && selectedGoal && targetCalories && macros && (
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
        )}
      </div>

      {/* footer */}
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
