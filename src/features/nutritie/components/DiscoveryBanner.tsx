import { useState } from 'react'
import { Target, X } from 'lucide-react'
import type { GoalType } from '../../../shared/types'
import { GoalSelector } from './GoalSelector'

interface DiscoveryBannerProps {
  avgCalories: number | null
  onSetGoal: (goal: GoalType) => void
}

export function DiscoveryBanner({ avgCalories, onSetGoal }: DiscoveryBannerProps) {
  const [showSelector, setShowSelector] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null)
  const baseTdee = avgCalories ?? 2000

  function handleConfirm() {
    if (selectedGoal) onSetGoal(selectedGoal)
  }

  if (showSelector) {
    return (
      <div className="bg-gray-800 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-bold text-white text-sm">Ce vrei să faci?</p>
          <button onClick={() => setShowSelector(false)} className="text-gray-500 hover:text-white">
            <X size={16} />
          </button>
        </div>
        {avgCalories && (
          <p className="text-xs text-gray-400">
            Mănânci în medie <span className="text-orange-500 font-bold">{avgCalories} kcal/zi</span>.
            Selectează obiectivul tău:
          </p>
        )}
        <GoalSelector selected={selectedGoal} tdee={baseTdee} onSelect={setSelectedGoal} />
        <button
          onClick={handleConfirm}
          disabled={!selectedGoal}
          className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold disabled:opacity-40 transition-colors"
        >
          Setează obiectivul
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
        <Target size={20} className="text-orange-500" />
      </div>
      <div className="flex-1 min-w-0">
        {avgCalories ? (
          <>
            <p className="text-sm text-white font-semibold">
              Mănânci în medie {avgCalories} kcal/zi
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Setează un obiectiv pentru a vedea progresul</p>
          </>
        ) : (
          <>
            <p className="text-sm text-white font-semibold">Începe să loghezi alimentele</p>
            <p className="text-xs text-gray-400 mt-0.5">Vom calcula targetul din datele tale reale</p>
          </>
        )}
      </div>
      <button
        onClick={() => setShowSelector(true)}
        className="shrink-0 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors"
      >
        Setează
      </button>
    </div>
  )
}
