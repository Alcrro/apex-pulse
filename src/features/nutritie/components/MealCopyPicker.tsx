import { X } from 'lucide-react'
import type { MealType } from '../../../shared/types'
import { useMealCopyDays } from '../hooks/useMealCopyDays'
import { CopyDayList } from './meal-copy-picker/CopyDayList'

interface MealCopyPickerProps {
  mealType: MealType
  onCopy: (fromDate: string) => void
  onClose: () => void
}

export function MealCopyPicker({ mealType, onCopy, onClose }: MealCopyPickerProps) {
  const { days, isLoading } = useMealCopyDays(mealType)

  function handleSelect(date: string) {
    onCopy(date)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950">
      <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-gray-800">
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-800 text-gray-400">
          <X size={20} />
        </button>
        <h2 className="font-bold text-white flex-1">Copiază din altă zi</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <CopyDayList days={days} isLoading={isLoading} onSelect={handleSelect} />
      </div>

      <div className="px-4 pb-safe pb-6 pt-3 border-t border-gray-800">
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-gray-800 text-gray-300 font-semibold"
        >
          Anulează
        </button>
      </div>
    </div>
  )
}
