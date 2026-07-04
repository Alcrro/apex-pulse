import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../shared/lib/supabase'
import { useAuth } from '../../../shared/context/AuthContext'
import type { NutritionLog, MealEntry, MealType, FoodItem } from '../../../shared/types'
import { calcNutrients, toGrams, formatDate } from '../utils/nutritionHelpers'

function parseEntries(rows: any[]): MealEntry[] {
  return (rows ?? []).map((r) => ({
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
}

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

      if (!logRow) {
        setLog(null)
        return
      }

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
        waterMl: Number(logRow.water_ml),
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

  async function ensureLog(): Promise<string | null> {
    if (log) return log.id
    try {
      const { data } = await supabase
        .from('nutrition_logs')
        .upsert({ user_id: user!.id, log_date: date }, { onConflict: 'user_id,log_date' })
        .select('id')
        .single()
      return data?.id ?? null
    } catch {
      return null
    }
  }

  async function addFoodEntry(food: FoodItem, quantity: number, unit: string, mealType: MealType) {
    if (!user) return
    const grams = toGrams(quantity, unit)
    const nutrients = calcNutrients(food, grams)

    const logId = await ensureLog()
    if (!logId) return

    const newEntry = {
      user_id: user.id,
      log_id: logId,
      fdc_id: food.fdcId,
      meal_type: mealType,
      quantity,
      unit,
      grams_equivalent: grams,
      calories: nutrients.calories,
      protein_g: nutrients.proteinG,
      carbs_g: nutrients.carbsG,
      fat_g: nutrients.fatG,
    }

    // optimistic update
    const tempId = `temp_${Date.now()}`
    setLog((prev) => {
      const base = prev ?? {
        id: logId, logDate: date,
        totalCalories: 0, totalProteinG: 0, totalCarbsG: 0, totalFatG: 0,
        waterMl: 0, waterTargetMl: 2000, entries: [],
      }
      const entry: MealEntry = {
        id: tempId, fdcId: food.fdcId, mealType, quantity, unit,
        gramsEquivalent: grams, ...nutrients, addedAt: new Date().toISOString(),
        food: { name: food.name, nameRo: food.nameRo, imageUrl: food.imageUrl },
      }
      return {
        ...base,
        totalCalories: base.totalCalories + nutrients.calories,
        totalProteinG: base.totalProteinG + nutrients.proteinG,
        totalCarbsG:   base.totalCarbsG   + nutrients.carbsG,
        totalFatG:     base.totalFatG     + nutrients.fatG,
        entries: [...base.entries, entry],
      }
    })

    const { error } = await supabase.from('meal_entries').insert(newEntry)
    if (!error) fetchLog()
  }

  async function removeFoodEntry(entryId: string) {
    // optimistic
    setLog((prev) => {
      if (!prev) return prev
      const entry = prev.entries.find((e) => e.id === entryId)
      if (!entry) return prev
      return {
        ...prev,
        totalCalories: prev.totalCalories - entry.calories,
        totalProteinG: prev.totalProteinG - entry.proteinG,
        totalCarbsG:   prev.totalCarbsG   - entry.carbsG,
        totalFatG:     prev.totalFatG     - entry.fatG,
        entries: prev.entries.filter((e) => e.id !== entryId),
      }
    })
    await supabase
      .from('meal_entries')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', entryId)
  }

  async function addWater(ml: number) {
    if (!user) return
    const newMl = (log?.waterMl ?? 0) + ml

    // optimistic update — mereu, indiferent de DB
    setLog((prev) => prev
      ? { ...prev, waterMl: newMl }
      : { id: 'local', logDate: date, totalCalories: 0, totalProteinG: 0, totalCarbsG: 0, totalFatG: 0, waterMl: newMl, waterTargetMl: 2000, entries: [] }
    )

    try {
      const logId = await ensureLog()
      if (logId) await supabase.from('nutrition_logs').update({ water_ml: newMl }).eq('id', logId)
    } catch { /* silent */ }
  }

  async function updateFoodEntry(entryId: string, food: FoodItem, quantity: number, unit: string) {
    const grams = toGrams(quantity, unit)
    const nutrients = calcNutrients(food, grams)

    setLog((prev) => {
      if (!prev) return prev
      const entries = prev.entries.map((e) =>
        e.id !== entryId ? e : {
          ...e,
          fdcId: food.fdcId,
          quantity, unit,
          gramsEquivalent: grams,
          calories: nutrients.calories,
          proteinG: nutrients.proteinG,
          carbsG: nutrients.carbsG,
          fatG: nutrients.fatG,
          food: { name: food.name, nameRo: food.nameRo, imageUrl: food.imageUrl },
        }
      )
      return {
        ...prev,
        totalCalories: entries.reduce((s, e) => s + e.calories, 0),
        totalProteinG: entries.reduce((s, e) => s + e.proteinG, 0),
        totalCarbsG:   entries.reduce((s, e) => s + e.carbsG, 0),
        totalFatG:     entries.reduce((s, e) => s + e.fatG, 0),
        entries,
      }
    })

    await supabase
      .from('meal_entries')
      .update({
        fdc_id: food.fdcId,
        quantity, unit,
        grams_equivalent: grams,
        calories: nutrients.calories,
        protein_g: nutrients.proteinG,
        carbs_g: nutrients.carbsG,
        fat_g: nutrients.fatG,
      })
      .eq('id', entryId)
  }

  return { log, loading, addFoodEntry, updateFoodEntry, removeFoodEntry, addWater, refetch: fetchLog }
}

export function useLast7DaysCalories() {
  const { user } = useAuth()
  const [days, setDays] = useState<{ date: string; calories: number }[]>([])

  useEffect(() => {
    if (!user) return
    const today = formatDate(new Date())
    const from = new Date()
    from.setDate(from.getDate() - 6)
    const fromStr = formatDate(from)

    supabase
      .from('nutrition_logs')
      .select('log_date, total_calories')
      .eq('user_id', user.id)
      .gte('log_date', fromStr)
      .lte('log_date', today)
      .is('deleted_at', null)
      .order('log_date')
      .then(({ data }) => {
        const map = new Map((data ?? []).map((r: any) => [r.log_date, Number(r.total_calories)]))
        const result = []
        for (let i = 6; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          const ds = formatDate(d)
          result.push({ date: ds, calories: map.get(ds) ?? 0 })
        }
        setDays(result)
      })
      .catch(() => setDays([]))
  }, [user])

  return days
}
