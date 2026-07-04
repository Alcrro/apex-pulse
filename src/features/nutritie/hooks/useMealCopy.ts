import { useState } from 'react'
import { supabase } from '../../../shared/lib/supabase'
import { useAuth } from '../../../shared/context/AuthContext'
import type { MealEntry, MealType, FoodItem } from '../../../shared/types'

export function useMealCopy() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  async function fetchDayMealEntries(date: string, mealType: MealType): Promise<MealEntry[]> {
    if (!user) return []
    try {
      const { data: logRow } = await supabase
        .from('nutrition_logs')
        .select('id')
        .eq('user_id', user.id)
        .eq('log_date', date)
        .is('deleted_at', null)
        .maybeSingle()

      if (!logRow) return []

      const { data } = await supabase
        .from('meal_entries')
        .select('*, food_cache(name, name_ro, image_url)')
        .eq('log_id', logRow.id)
        .eq('meal_type', mealType)
        .is('deleted_at', null)
        .order('added_at', { ascending: true })

      return (data ?? []).map((r: any) => ({
        id: r.id,
        fdcId: r.fdc_id,
        mealType: r.meal_type as MealType,
        quantity: Number(r.quantity),
        unit: r.unit,
        gramsEquivalent: Number(r.grams_equivalent),
        calories: Number(r.calories),
        proteinG: Number(r.protein_g),
        carbsG: Number(r.carbs_g),
        fatG: Number(r.fat_g),
        addedAt: r.added_at,
        food: r.food_cache
          ? { name: r.food_cache.name, nameRo: r.food_cache.name_ro ?? undefined, imageUrl: r.food_cache.image_url ?? undefined }
          : undefined,
      }))
    } catch {
      return []
    }
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
          fdcId: entry.fdcId,
          name: entry.food?.name ?? entry.fdcId,
          nameRo: entry.food?.nameRo,
          imageUrl: entry.food?.imageUrl,
          caloriesPerG: entry.gramsEquivalent > 0 ? entry.calories / entry.gramsEquivalent : 0,
          proteinG: entry.gramsEquivalent > 0 ? entry.proteinG / entry.gramsEquivalent : 0,
          carbsG: entry.gramsEquivalent > 0 ? entry.carbsG / entry.gramsEquivalent : 0,
          fatG: entry.gramsEquivalent > 0 ? entry.fatG / entry.gramsEquivalent : 0,
        }
        await addFoodEntry(food, entry.quantity, entry.unit, mealType)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { fetchDayMealEntries, copyEntries, isLoading }
}
