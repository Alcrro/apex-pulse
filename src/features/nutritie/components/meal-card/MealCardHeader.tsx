import { ChevronDown, ChevronUp, CopyPlus } from 'lucide-react'
import { getMealLabel } from '../../utils/nutritionHelpers'

interface Props {
  mealType: string
  open: boolean
  totalKcal: number
  hasEntries: boolean
  isCopying: boolean
  onToggle: () => void
  onOpenCopy: () => void
}

export function MealCardHeader({ mealType, open, totalKcal, hasEntries, isCopying, onToggle, onOpenCopy }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <button onClick={onToggle} className="flex items-center gap-3 flex-1 text-left">
        <span className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center text-xs font-black text-gray-400 shrink-0">
          {mealType.replace('masa_', '')}
        </span>
        <span className="flex-1 text-white font-semibold text-sm">{getMealLabel(mealType)}</span>
        {hasEntries && (
          <span className="text-xs text-orange-500 font-bold">{Math.round(totalKcal)} kcal</span>
        )}
        {open ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onOpenCopy() }}
        disabled={isCopying}
        title="Copiază din altă zi"
        className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-500 hover:text-orange-500 transition-colors disabled:opacity-40"
      >
        <CopyPlus size={15} />
      </button>
    </div>
  )
}
