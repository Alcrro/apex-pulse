import { supabase } from '../../../shared/lib/supabase'
import type { NutritionLog, MealEntry, MealType, FoodItem } from '../../../shared/types'

interface MealEntryRow {
  id: string
  fdc_id: string
  meal_type: string
  quantity: number | string
  unit: string
  grams_equivalent: number | string
  calories: number | string
  protein_g: number | string
  carbs_g: number | string
  fat_g: number | string
  added_at: string
  food_cache?: { name: string; name_ro?: string | null; image_url?: string | null } | null
}

export function parseEntries(rows: MealEntryRow[]): MealEntry[] {
  return (rows ?? []).map(r => ({
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

export async function ensureNutritionLog(
  userId: string,
  date: string,
  existingLogId: string | null
): Promise<string | null> {
  if (existingLogId) return existingLogId
  try {
    const { data } = await supabase
      .from('nutrition_logs')
      .upsert({ user_id: userId, log_date: date }, { onConflict: 'user_id,log_date' })
      .select('id')
      .single()
    return data?.id ?? null
  } catch {
    return null
  }
}

export function buildMealEntryRow(
  userId: string,
  logId: string,
  food: FoodItem,
  quantity: number,
  unit: string,
  grams: number,
  nutrients: { calories: number; proteinG: number; carbsG: number; fatG: number },
  mealType: MealType
) {
  return {
    user_id: userId,
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
}

export function buildOptimisticEntry(
  tempId: string,
  food: FoodItem,
  mealType: MealType,
  quantity: number,
  unit: string,
  gramsEquivalent: number,
  nutrients: { calories: number; proteinG: number; carbsG: number; fatG: number }
): MealEntry {
  return {
    id: tempId,
    fdcId: food.fdcId,
    mealType,
    quantity,
    unit,
    gramsEquivalent,
    ...nutrients,
    addedAt: new Date().toISOString(),
    food: { name: food.name, nameRo: food.nameRo, imageUrl: food.imageUrl },
  }
}

export function applyAddEntry(
  prev: NutritionLog | null,
  logId: string,
  date: string,
  entry: MealEntry
): NutritionLog {
  const base = prev ?? {
    id: logId, logDate: date,
    totalCalories: 0, totalProteinG: 0, totalCarbsG: 0, totalFatG: 0,
    waterMl: 0, waterTargetMl: 2000, entries: [],
  }
  return {
    ...base,
    totalCalories: base.totalCalories + entry.calories,
    totalProteinG: base.totalProteinG + entry.proteinG,
    totalCarbsG:   base.totalCarbsG   + entry.carbsG,
    totalFatG:     base.totalFatG     + entry.fatG,
    entries: [...base.entries, entry],
  }
}

export function applyRemoveEntry(prev: NutritionLog, entryId: string): NutritionLog {
  const entry = prev.entries.find(e => e.id === entryId)
  if (!entry) return prev
  return {
    ...prev,
    totalCalories: prev.totalCalories - entry.calories,
    totalProteinG: prev.totalProteinG - entry.proteinG,
    totalCarbsG:   prev.totalCarbsG   - entry.carbsG,
    totalFatG:     prev.totalFatG     - entry.fatG,
    entries: prev.entries.filter(e => e.id !== entryId),
  }
}

export function applyUpdateEntry(
  prev: NutritionLog,
  entryId: string,
  food: FoodItem,
  quantity: number,
  unit: string,
  gramsEquivalent: number,
  nutrients: { calories: number; proteinG: number; carbsG: number; fatG: number }
): NutritionLog {
  const entries = prev.entries.map(e =>
    e.id !== entryId ? e : {
      ...e,
      fdcId: food.fdcId,
      quantity, unit,
      gramsEquivalent,
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
}
