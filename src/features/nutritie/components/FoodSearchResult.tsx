import { Salad } from 'lucide-react'
import type { FoodItem } from '../../../shared/types'

interface FoodSearchResultProps {
  food: FoodItem
  onClick: (food: FoodItem) => void
}

export function FoodSearchResult({ food, onClick }: FoodSearchResultProps) {
  const name = food.nameRo || food.name
  const kcalPer100g = Math.round(food.caloriesPerG * 100)

  return (
    <button
      onClick={() => onClick(food)}
      className="flex items-center gap-3 w-full p-3 rounded-2xl hover:bg-gray-800 transition-colors text-left"
    >
      <div className="w-11 h-11 rounded-xl bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden">
        {food.imageUrl ? (
          <img src={food.imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <Salad size={18} className="text-gray-500" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate">{name}</p>
        {food.brand && <p className="text-xs text-gray-500 truncate">{food.brand}</p>}
        <div className="flex gap-2 mt-0.5">
          <span className="text-xs text-blue-400">P {Math.round(food.proteinG * 100)}g</span>
          <span className="text-xs text-yellow-400">C {Math.round(food.carbsG * 100)}g</span>
          <span className="text-xs text-red-400">G {Math.round(food.fatG * 100)}g</span>
          <span className="text-xs text-gray-500">/ 100g</span>
        </div>
      </div>

      <span className="text-sm font-bold text-orange-500 shrink-0">{kcalPer100g} kcal</span>
    </button>
  )
}
