import { X, Salad } from 'lucide-react'
import type { MealEntry } from '../../../shared/types'

interface FoodEntryRowProps {
  entry: MealEntry
  onRemove: (id: string) => void
  onEdit: (entry: MealEntry) => void
}

export function FoodEntryRow({ entry, onRemove, onEdit }: FoodEntryRowProps) {
  const name = entry.food?.nameRo || entry.food?.name || 'Aliment'

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-9 h-9 rounded-xl bg-gray-700 flex items-center justify-center shrink-0 overflow-hidden">
        {entry.food?.imageUrl ? (
          <img src={entry.food.imageUrl} alt={name} loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <Salad size={16} className="text-gray-500" />
        )}
      </div>

      <button onClick={() => onEdit(entry)} className="flex-1 min-w-0 text-left">
        <p className="text-sm text-white font-medium truncate">{name}</p>
        <p className="text-xs text-gray-500">
          {entry.quantity}{entry.unit === 'grame' ? 'g' : entry.unit === 'ml' ? 'ml' : entry.unit === 'pounds' ? 'lb' : ' buc'}
          {' · '}P {entry.proteinG.toFixed(0)}g · C {entry.carbsG.toFixed(0)}g · G {entry.fatG.toFixed(0)}g
        </p>
      </button>

      <span className="text-sm font-semibold text-orange-500 shrink-0">{Math.round(entry.calories)} kcal</span>

      <button
        onClick={() => onRemove(entry.id)}
        className="p-1 rounded-lg hover:bg-gray-700 text-gray-500 hover:text-red-400 transition-colors shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  )
}
