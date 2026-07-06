import { useState } from 'react'
import { CheckCircle2, ChevronRight } from 'lucide-react'
import type { GoalType } from '../../../../shared/types'
import { GoalSelector } from '../GoalSelector'
import { ModalSection } from './ModalSection'

interface Props {
  hasGoal: boolean
  targetKcal: number
  goalLabel: string | null
  tdee: number
  currentGoal: GoalType | null
  onSetGoal: (g: GoalType) => void
}

export function GoalSection({ hasGoal, targetKcal, goalLabel, tdee, currentGoal, onSetGoal }: Props) {
  const [changeGoalOpen, setChangeGoalOpen] = useState(false)
  const [pendingGoal, setPendingGoal] = useState<GoalType | null>(null)

  function handleConfirm() {
    if (!pendingGoal) return
    onSetGoal(pendingGoal)
    setChangeGoalOpen(false)
    setPendingGoal(null)
  }

  function handleCancel() {
    setChangeGoalOpen(false)
    setPendingGoal(null)
  }

  return (
    <ModalSection icon={<CheckCircle2 size={15} className="text-orange-500" />} title="Obiectivul tău">
      {!changeGoalOpen ? (
        <button
          onClick={() => setChangeGoalOpen(true)}
          className="w-full flex items-center justify-between p-4 bg-gray-800/60 hover:bg-gray-800 rounded-xl transition-colors group"
        >
          <div className="text-left">
            <p className="text-sm font-semibold text-white">
              {hasGoal ? goalLabel : 'Fără obiectiv'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {hasGoal ? `${targetKcal.toLocaleString('ro-RO')} kcal/zi` : 'Apasă pentru a seta un obiectiv'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-orange-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Schimbă
            </span>
            <ChevronRight size={16} className="text-gray-600" />
          </div>
        </button>
      ) : (
        <div className="space-y-3">
          <GoalSelector
            selected={pendingGoal ?? currentGoal}
            tdee={tdee}
            onSelect={setPendingGoal}
          />
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm font-semibold transition-colors"
            >
              Anulează
            </button>
            <button
              onClick={handleConfirm}
              disabled={!pendingGoal}
              className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-colors disabled:opacity-40"
            >
              Salvează
            </button>
          </div>
        </div>
      )}
    </ModalSection>
  )
}
