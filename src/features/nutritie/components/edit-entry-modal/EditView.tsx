import type { FoodItem } from '../../../../shared/types'
import { EditFoodRow } from './EditFoodRow'
import { EditQuantityUnit } from './EditQuantityUnit'
import { EditMacroPreview } from './EditMacroPreview'

interface Props {
  food: FoodItem
  quantity: string
  unit: string
  onQuantityChange: (v: string) => void
  onUnitChange: (v: string) => void
  previewKcal: number
  previewProtein: number
  previewCarbs: number
  previewFat: number
  onSwitchToSearch: () => void
  onSave: () => void
  onDelete: () => void
  canSave: boolean
}

export function EditView({
  food, quantity, unit, onQuantityChange, onUnitChange,
  previewKcal, previewProtein, previewCarbs, previewFat,
  onSwitchToSearch, onSave, onDelete, canSave,
}: Props) {
  const foodName = food.nameRo || food.name

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <EditFoodRow foodName={foodName} onSwitch={onSwitchToSearch} />
        <EditQuantityUnit
          quantity={quantity} unit={unit}
          onQuantityChange={onQuantityChange} onUnitChange={onUnitChange}
        />
        <EditMacroPreview kcal={previewKcal} protein={previewProtein} carbs={previewCarbs} fat={previewFat} />
      </div>

      <div className="shrink-0 px-4 pb-safe pb-4 pt-3 border-t border-gray-800 flex gap-3">
        <button
          onClick={onDelete}
          className="px-5 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-sm transition-colors"
        >
          Șterge
        </button>
        <button
          onClick={onSave}
          disabled={!canSave}
          className="flex-1 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold disabled:opacity-40 transition-colors"
        >
          Salvează
        </button>
      </div>
    </div>
  )
}
