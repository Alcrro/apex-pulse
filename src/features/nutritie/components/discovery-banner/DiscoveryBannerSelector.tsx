import { X } from 'lucide-react'
import type { GoalType } from '../../../../shared/types'
import { GoalSelector } from '../GoalSelector'

interface DiscoveryBannerSelectorProps {
  avgCalories: number | null
  selectedGoal: GoalType | null
  onSelect: (goal: GoalType) => void
  onConfirm: () => void
  onClose: () => void
}

export function DiscoveryBannerSelector({ avgCalories, selectedGoal, onSelect, onConfirm, onClose }: DiscoveryBannerSelectorProps) {
  return (
    <div className="bg-gray-800 rounded-2xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-bold text-white text-sm">Ce vrei să faci?</p>
        <button onClick={onClose} className="text-gray-500 hover:text-white">
          <X size={16} />
        </button>
      </div>
      {avgCalories && (
        <p className="text-xs text-gray-400">
          Mănânci în medie <span className="text-orange-500 font-bold">{avgCalories} kcal/zi</span>.
          Selectează obiectivul tău:
        </p>
      )}
      <GoalSelector selected={selectedGoal} tdee={avgCalories ?? 2000} onSelect={onSelect} />
      <button
        onClick={onConfirm}
        disabled={!selectedGoal}
        className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold disabled:opacity-40 transition-colors"
      >
        Setează obiectivul
      </button>
    </div>
  )
}
