import { useState } from 'react'
import type { FoodItem, MealType } from '../../../shared/types'
import { getMealLabel } from '../utils/nutritionHelpers'
import { FoodModalHeader } from './food-search/FoodModalHeader'
import { FoodSearchView } from './food-search/FoodSearchView'
import { FoodDetailView } from './food-search/FoodDetailView'

interface FoodSearchModalProps {
  mealType: MealType
  onAdd: (food: FoodItem, quantity: number, unit: string, mealType: MealType) => void
  onClose: () => void
}

export function FoodSearchModal({ mealType, onAdd, onClose }: FoodSearchModalProps) {
  const [selected, setSelected] = useState<FoodItem | null>(null)
  const [quantity, setQuantity] = useState('100')
  const [unit, setUnit] = useState('grame')

  const title = selected
    ? selected.nameRo || selected.name
    : `Adaugă la ${getMealLabel(mealType)}`

  function handleSelect(food: FoodItem) {
    setSelected(food)
    setQuantity('100')
    setUnit('grame')
  }

  function handleAdd() {
    if (!selected) return
    const qty = parseFloat(quantity)
    if (isNaN(qty) || qty <= 0) return
    onAdd(selected, qty, unit, mealType)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950/60">
      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto bg-gray-950 min-h-0">
        <FoodModalHeader title={title} onClose={onClose} />
        {selected
          ? <FoodDetailView
              food={selected}
              quantity={quantity}
              unit={unit}
              onQuantityChange={setQuantity}
              onUnitChange={setUnit}
              onBack={() => setSelected(null)}
              onAdd={handleAdd}
              canAdd={!!quantity && parseFloat(quantity) > 0}
            />
          : <FoodSearchView onSelect={handleSelect} />
        }
      </div>
    </div>
  )
}
