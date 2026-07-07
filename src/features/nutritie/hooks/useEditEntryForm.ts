import { useState } from 'react'
import type { MealEntry, FoodItem } from '../../../shared/types'
import { toGrams, calcNutrients } from '../utils/nutritionHelpers'
import { entryToFood } from '../utils/editEntryForm'

export function useEditEntryForm(
  entry: MealEntry,
  onSave: (entryId: string, food: FoodItem, quantity: number, unit: string) => void,
  onClose: () => void,
) {
  const [food, setFood]         = useState<FoodItem>(() => entryToFood(entry))
  const [quantity, setQuantity] = useState(String(entry.quantity))
  const [unit, setUnit]         = useState(entry.unit)

  const previewGrams = toGrams(parseFloat(quantity) || 0, unit)
  const { calories: previewKcal, proteinG: previewProtein, carbsG: previewCarbs, fatG: previewFat } = calcNutrients(food, previewGrams)

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
