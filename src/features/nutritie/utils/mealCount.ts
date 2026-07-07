import { DEFAULT_MEALS } from './nutritionHelpers'

export function getMealCountKey(date: string): string {
  return `mealCount_${date}`
}

export function getPersistedMealCount(date: string): number {
  const saved = localStorage.getItem(getMealCountKey(date))
  return saved ? Math.max(DEFAULT_MEALS, parseInt(saved)) : DEFAULT_MEALS
}
