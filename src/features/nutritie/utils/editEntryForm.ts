import type { MealEntry, FoodItem } from '../../../shared/types'

export function entryToFood(entry: MealEntry): FoodItem {
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
