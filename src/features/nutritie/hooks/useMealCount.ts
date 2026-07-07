import { useState, useEffect } from 'react'
import type { MealEntry } from '../../../shared/types'
import { MAX_MEALS } from '../utils/nutritionHelpers'
import { getMealCountKey, getPersistedMealCount } from '../utils/mealCount'

export function useMealCount(date: string, entries: MealEntry[] | undefined) {
  const [mealCount, setMealCount] = useState(() => getPersistedMealCount(date))

  useEffect(() => {
    setMealCount(getPersistedMealCount(date))
  }, [date])

  useEffect(() => {
    localStorage.setItem(getMealCountKey(date), String(mealCount))
  }, [mealCount, date])

  useEffect(() => {
    if (!entries?.length) return
    const maxFromLog = entries.reduce((max, e) => {
      const n = parseInt(e.mealType.replace('masa_', ''))
      return isNaN(n) ? max : Math.max(max, n)
    }, 0)
    if (maxFromLog > 0) setMealCount(c => Math.max(c, maxFromLog))
  }, [entries])

  function addMeal() {
    setMealCount(c => Math.min(c + 1, MAX_MEALS))
  }

  return { mealCount, addMeal }
}
