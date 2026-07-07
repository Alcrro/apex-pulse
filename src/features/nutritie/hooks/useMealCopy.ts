import { useState } from 'react'
import { useAuth } from '../../../shared/context/AuthContext'
import type { MealEntry, MealType, FoodItem } from '../../../shared/types'
import { fetchDayMealEntries } from '../utils/mealCopy'

export function useMealCopy() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  async function fetchDayEntries(date: string, mealType: MealType): Promise<MealEntry[]> {
    if (!user) return []
    return fetchDayMealEntries(user.id, date, mealType)
  }

  async function copyEntries(
    entries: MealEntry[],
    targetDate: string,
    mealType: MealType,
    addFoodEntry: (food: FoodItem, quantity: number, unit: string, mealType: MealType) => Promise<void>,
  ): Promise<void> {
    if (entries.length === 0) return
    setIsLoading(true)
    try {
      for (const entry of entries) {
        const food: FoodItem = {
          fdcId:        entry.fdcId,
          name:         entry.food?.name ?? entry.fdcId,
          nameRo:       entry.food?.nameRo,
          imageUrl:     entry.food?.imageUrl,
          caloriesPerG: entry.gramsEquivalent > 0 ? entry.calories  / entry.gramsEquivalent : 0,
          proteinG:     entry.gramsEquivalent > 0 ? entry.proteinG  / entry.gramsEquivalent : 0,
          carbsG:       entry.gramsEquivalent > 0 ? entry.carbsG    / entry.gramsEquivalent : 0,
          fatG:         entry.gramsEquivalent > 0 ? entry.fatG      / entry.gramsEquivalent : 0,
        }
        await addFoodEntry(food, entry.quantity, entry.unit, mealType)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { fetchDayMealEntries: fetchDayEntries, copyEntries, isLoading }
}
