import type { FoodItem } from '../../../../shared/types'
import { FoodSearchResult } from '../FoodSearchResult'

interface Props {
  foods: FoodItem[]
  isLoading: boolean
  emptyMessage: string
  onSelect: (food: FoodItem) => void
}

export function FoodListTab({ foods, isLoading, emptyMessage, onSelect }: Props) {
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (foods.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <p className="text-gray-500 text-sm text-center py-8">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3">
      {foods.map((food) => (
        <FoodSearchResult key={food.fdcId} food={food} onClick={onSelect} />
      ))}
    </div>
  )
}
