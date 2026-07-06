import { useState, useEffect } from 'react'
import type { MealEntry } from '../../../shared/types'
import { DEFAULT_MEALS, MAX_MEALS } from '../utils/nutritionHelpers'

const getMealCountKey = (date: string) => `mealCount_${date}`

export function useMealCount(date: string, entries: MealEntry[] | undefined) {
  const [mealCount, setMealCount] = useState(() => {
    const saved = localStorage.getItem(getMealCountKey(date))
    return saved ? Math.max(DEFAULT_MEALS, parseInt(saved)) : DEFAULT_MEALS
  })

  // Restore persisted count when date changes
  useEffect(() => {
    const saved = localStorage.getItem(getMealCountKey(date))
    setMealCount(saved ? Math.max(DEFAULT_MEALS, parseInt(saved)) : DEFAULT_MEALS)
  }, [date])

  // Persist whenever count or date changes
  useEffect(() => {
    localStorage.setItem(getMealCountKey(date), String(mealCount))
  }, [mealCount, date])

  // Expand count if log has entries in meals beyond current visible count
  useEffect(() => {
    if (!entries?.length) return
    const maxFromLog = entries.reduce((max, e) => {
      const n = parseInt(e.mealType.replace('masa_', ''))
      return isNaN(n) ? max : Math.max(max, n)
    }, 0)
    if (maxFromLog > 0) setMealCount((c) => Math.max(c, maxFromLog))
  }, [entries])

  function addMeal() {
    setMealCount((c) => Math.min(c + 1, MAX_MEALS))
  }

  return { mealCount, addMeal }
}
