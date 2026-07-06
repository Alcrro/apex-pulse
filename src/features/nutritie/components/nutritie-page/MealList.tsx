import { Plus } from 'lucide-react'
import type { FoodItem, MealEntry, MealType } from '../../../../shared/types'
import { MAX_MEALS } from '../../utils/nutritionHelpers'
import { MealCard } from '../MealCard'

interface Props {
  mealCount: number
  entries: MealEntry[]
  onAdd: (food: FoodItem, quantity: number, unit: string, mealType: MealType) => void
  onUpdate: (entryId: string, food: FoodItem, quantity: number, unit: string) => void
  onRemove: (entryId: string) => void
  onAddMeal: () => void
}

export function MealList({ mealCount, entries, onAdd, onUpdate, onRemove, onAddMeal }: Props) {
  const mealTypes = Array.from({ length: mealCount }, (_, i) => `masa_${i + 1}` as MealType)

  return (
    <>
      {mealTypes.map((type) => (
        <MealCard
          key={type}
          mealType={type}
          entries={entries.filter((e) => e.mealType === type)}
          onAdd={onAdd}
          onUpdate={onUpdate}
          onRemove={onRemove}
        />
      ))}
      {mealCount < MAX_MEALS && (
        <button
          onClick={onAddMeal}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-gray-700 hover:border-orange-500/40 hover:bg-orange-500/5 text-gray-500 hover:text-orange-500 text-sm font-semibold transition-colors"
        >
          <Plus size={16} />
          Adaugă masă ({mealCount}/{MAX_MEALS})
        </button>
      )}
    </>
  )
}
