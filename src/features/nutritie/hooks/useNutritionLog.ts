import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../shared/lib/supabase'
import { useAuth } from '../../../shared/context/AuthContext'
import type { NutritionLog, MealEntry, MealType, FoodItem } from '../../../shared/types'
import { calcNutrients, toGrams } from '../utils/nutritionHelpers'
import {
  parseEntries,
  ensureNutritionLog,
  buildMealEntryRow,
  buildOptimisticEntry,
  applyAddEntry,
  applyRemoveEntry,
  applyUpdateEntry,
} from '../utils/nutritionLog'

export function useNutritionLog(date: string) {
  const { user } = useAuth()
  const [log, setLog] = useState<NutritionLog | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchLog = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data: logRow } = await supabase
        .from('nutrition_logs')
        .select('id, log_date, water_ml, water_target_ml')
        .eq('user_id', user.id)
        .eq('log_date', date)
        .is('deleted_at', null)
        .maybeSingle()

      if (!logRow) { setLog(null); return }

      const { data: entryRows } = await supabase
        .from('meal_entries')
        .select('*, food_cache(name, name_ro, image_url)')
        .eq('log_id', logRow.id)
        .is('deleted_at', null)
        .order('added_at', { ascending: true })

      const entries = parseEntries(entryRows ?? [])
      setLog({
        id: logRow.id,
        logDate: logRow.log_date,
        totalCalories: entries.reduce((s, e) => s + e.calories, 0),
        totalProteinG: entries.reduce((s, e) => s + e.proteinG, 0),
        totalCarbsG:   entries.reduce((s, e) => s + e.carbsG, 0),
        totalFatG:     entries.reduce((s, e) => s + e.fatG, 0),
        waterMl:       Number(logRow.water_ml),
        waterTargetMl: Number(logRow.water_target_ml),
        entries,
      })
    } catch {
      setLog(null)
    } finally {
      setLoading(false)
    }
  }, [user, date])

  useEffect(() => { fetchLog() }, [fetchLog])

  async function addFoodEntry(food: FoodItem, quantity: number, unit: string, mealType: MealType) {
    if (!user) return
    const grams = toGrams(quantity, unit)
    const nutrients = calcNutrients(food, grams)
    const logId = await ensureNutritionLog(user.id, date, log?.id ?? null)
    if (!logId) return

    const tempEntry = buildOptimisticEntry(`temp_${Date.now()}`, food, mealType, quantity, unit, grams, nutrients)
    setLog(prev => applyAddEntry(prev, logId, date, tempEntry))

    const { error } = await supabase
      .from('meal_entries')
      .insert(buildMealEntryRow(user.id, logId, food, quantity, unit, grams, nutrients, mealType))
    if (!error) fetchLog()
  }

  async function removeFoodEntry(entryId: string) {
    setLog(prev => prev ? applyRemoveEntry(prev, entryId) : prev)
    await supabase
      .from('meal_entries')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', entryId)
  }

  async function addWater(ml: number) {
    if (!user) return
    const newMl = (log?.waterMl ?? 0) + ml
    setLog(prev => prev
      ? { ...prev, waterMl: newMl }
      : { id: 'local', logDate: date, totalCalories: 0, totalProteinG: 0, totalCarbsG: 0, totalFatG: 0, waterMl: newMl, waterTargetMl: 2000, entries: [] }
    )
    try {
      const logId = await ensureNutritionLog(user.id, date, log?.id ?? null)
      if (logId) await supabase.from('nutrition_logs').update({ water_ml: newMl }).eq('id', logId)
    } catch { /* silent */ }
  }

  async function updateFoodEntry(entryId: string, food: FoodItem, quantity: number, unit: string) {
    const grams = toGrams(quantity, unit)
    const nutrients = calcNutrients(food, grams)
    setLog(prev => prev ? applyUpdateEntry(prev, entryId, food, quantity, unit, grams, nutrients) : prev)
    await supabase
      .from('meal_entries')
      .update({
        fdc_id: food.fdcId,
        quantity, unit,
        grams_equivalent: grams,
        calories:  nutrients.calories,
        protein_g: nutrients.proteinG,
        carbs_g:   nutrients.carbsG,
        fat_g:     nutrients.fatG,
      })
      .eq('id', entryId)
  }

  return { log, loading, addFoodEntry, updateFoodEntry, removeFoodEntry, addWater, refetch: fetchLog }
}
