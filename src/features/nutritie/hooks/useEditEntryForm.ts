import { useState } from 'react'
import type { MealEntry, FoodItem } from '../../../shared/types'

function entryToFood(entry: MealEntry): FoodItem {
  const g = entry.gramsEquivalent > 0 ? entry.gramsEquivalent : 100
  return {
    fdcId:        entry.fdcId,
    name:         entry.food?.name ?? entry.fdcId,
    nameRo:       entry.food?.nameRo,
    imageUrl:     entry.food?.imageUrl,
    caloriesPerG: entry.calories / g,
    proteinG:     entry.proteinG / g,
    carbsG:       entry.carbsG   / g,
    fatG:         entry.fatG     / g,
  }
}

export function useEditEntryForm(
  entry: MealEntry,
  onSave: (entryId: string, food: FoodItem, quantity: number, unit: string) => void,
  onClose: () => void,
) {
  const [food, setFood]         = useState<FoodItem>(() => entryToFood(entry))
  const [quantity, setQuantity] = useState(String(entry.quantity))
  const [unit, setUnit]         = useState(entry.unit)

  const previewGrams   = unit === 'pounds' ? (parseFloat(quantity) || 0) * 453.59 : parseFloat(quantity) || 0
  const previewKcal    = Math.round(food.caloriesPerG * previewGrams)
  const previewProtein = Math.round(food.proteinG * previewGrams * 10) / 10
  const previewCarbs   = Math.round(food.carbsG   * previewGrams * 10) / 10
  const previewFat     = Math.round(food.fatG     * previewGrams * 10) / 10

  function handleSave() {
    const qty = parseFloat(quantity)
    if (isNaN(qty) || qty <= 0) return
    onSave(entry.id, food, qty, unit)
    onClose()
  }

  return {
    food, setFood,
    quantity, setQuantity,
    unit, setUnit,
    previewKcal, previewProtein, previewCarbs, previewFat,
    handleSave,
  }
}
