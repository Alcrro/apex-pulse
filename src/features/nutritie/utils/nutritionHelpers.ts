import type { FoodItem, GoalType, MealType, NutritionPhase } from '../../../shared/types'

export interface UsdaNutrient {
  nutrientId?: number
  nutrientNumber?: string | number
  nutrientName?: string
  value?: number
}

interface UsdaFoodItem {
  fdcId?: number | string
  description?: string
  brandOwner?: string
  brandName?: string
  foodNutrients?: UsdaNutrient[]
}

export interface FoodCacheRow {
  fdc_id: string
  name: string
  name_ro?: string | null
  brand?: string | null
  image_url?: string | null
  calories_per_g: number | string
  protein_g: number | string
  carbs_g: number | string
  fat_g: number | string
  sugar_g?: number | string | null
  fiber_g?: number | string | null
  sodium_mg?: number | string | null
}

export function getMealLabel(mealType: string): string {
  const num = mealType.replace('masa_', '')
  return `Masa ${num}`
}

export const MAX_MEALS = 8
export const DEFAULT_MEALS = 3

export const GOAL_LABELS: Record<GoalType, string> = {
  mentinere: 'Menținere',
  deficit_usor: 'Deficit ușor',
  deficit_moderat: 'Deficit moderat',
  surplus: 'Surplus',
}

export const GOAL_OFFSETS: Record<GoalType, number> = {
  mentinere: 0,
  deficit_usor: -300,
  deficit_moderat: -500,
  surplus: 300,
}

export const GOAL_MACRO_SPLIT: Record<GoalType, { protein: number; carbs: number; fat: number }> = {
  mentinere:        { protein: 25, carbs: 45, fat: 30 },
  deficit_usor:     { protein: 30, carbs: 40, fat: 30 },
  deficit_moderat:  { protein: 35, carbs: 35, fat: 30 },
  surplus:          { protein: 25, carbs: 50, fat: 25 },
}

export function computeMacroTargets(targetKcal: number, split: { protein: number; carbs: number; fat: number }) {
  return {
    proteinG: Math.round((targetKcal * split.protein) / 100 / 4),
    carbsG:   Math.round((targetKcal * split.carbs)   / 100 / 4),
    fatG:     Math.round((targetKcal * split.fat)      / 100 / 9),
  }
}

export function parseUsdaFood(food: UsdaFoodItem): FoodItem {
  const getNutrientById = (id: number) =>
    food.foodNutrients?.find(n => n.nutrientId === id || n.nutrientNumber === String(id))?.value ?? 0

  const getNutrientByName = (name: string) =>
    food.foodNutrients?.find(n =>
      n.nutrientName?.toLowerCase().includes(name.toLowerCase())
    )?.value ?? 0

  const kcal = getNutrientById(1008) || getNutrientByName('energy')
  const protein = getNutrientById(1003) || getNutrientByName('protein')
  const fat = getNutrientById(1004) || getNutrientByName('total lipid')
  const carbs = getNutrientById(1005) || getNutrientByName('carbohydrate')
  const sugar = getNutrientById(2000) || getNutrientByName('sugar')
  const fiber = getNutrientById(1079) || getNutrientByName('fiber')
  const sodium = getNutrientById(1093) || getNutrientByName('sodium')

  return {
    fdcId: String(food.fdcId),
    name: food.description ?? 'Aliment necunoscut',
    brand: food.brandOwner || food.brandName || undefined,
    caloriesPerG: kcal / 100,
    proteinG: protein / 100,
    carbsG: carbs / 100,
    fatG: fat / 100,
    sugarG: sugar ? sugar / 100 : undefined,
    fiberG: fiber ? fiber / 100 : undefined,
    sodiumMg: sodium ? sodium / 100 : undefined,
  }
}

export function toFoodCacheRow(item: FoodItem) {
  return {
    fdc_id: item.fdcId,
    name: item.name,
    name_ro: item.nameRo ?? null,
    brand: item.brand ?? null,
    image_url: item.imageUrl ?? null,
    calories_per_g: item.caloriesPerG,
    protein_g: item.proteinG,
    carbs_g: item.carbsG,
    fat_g: item.fatG,
    sugar_g: item.sugarG ?? 0,
    fiber_g: item.fiberG ?? 0,
    sodium_mg: item.sodiumMg ?? 0,
    data_source: 'usda',
  }
}

export function parseFoodCacheRow(row: FoodCacheRow): FoodItem {
  return {
    fdcId: row.fdc_id,
    name: row.name,
    nameRo: row.name_ro ?? undefined,
    brand: row.brand ?? undefined,
    imageUrl: row.image_url ?? undefined,
    caloriesPerG: Number(row.calories_per_g),
    proteinG: Number(row.protein_g),
    carbsG: Number(row.carbs_g),
    fatG: Number(row.fat_g),
    sugarG: row.sugar_g ? Number(row.sugar_g) : undefined,
    fiberG: row.fiber_g ? Number(row.fiber_g) : undefined,
    sodiumMg: row.sodium_mg ? Number(row.sodium_mg) : undefined,
  }
}

export function calcNutrients(food: FoodItem, grams: number) {
  return {
    calories: Math.round(food.caloriesPerG * grams),
    proteinG: Math.round(food.proteinG * grams * 10) / 10,
    carbsG:   Math.round(food.carbsG   * grams * 10) / 10,
    fatG:     Math.round(food.fatG     * grams * 10) / 10,
  }
}

export function toGrams(quantity: number, unit: string): number {
  if (unit === 'pounds') return Math.round(quantity * 453.59)
  return Math.round(quantity) // grame și ml 1:1 pentru simplitate
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return formatDate(d)
}

export function displayDate(dateStr: string): string {
  const today = formatDate(new Date())
  const yesterday = addDays(today, -1)
  if (dateStr === today) return 'Azi'
  if (dateStr === yesterday) return 'Ieri'
  return new Date(dateStr).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long' })
}

export function getDayLabel(dateStr: string): string {
  const today = formatDate(new Date())
  const yesterday = addDays(today, -1)
  if (dateStr === today) return 'Azi'
  if (dateStr === yesterday) return 'Ieri'
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('ro-RO', {
    weekday: 'long', day: 'numeric', month: 'short',
  })
}

export interface NutritionNotification {
  id: string
  kind: 'warning' | 'info'
  title: string
  description: string
}

export function buildNotifications(phase: NutritionPhase, avgCalories: number | null): NutritionNotification[] {
  const list: NutritionNotification[] = []
  if (phase === 'discovery') {
    list.push({ id: 'no-goal', kind: 'warning', title: 'Obiectiv caloric nesetat', description: 'Setează un obiectiv pentru a urmări caloriile și macronutrienții.' })
  }
  if (avgCalories === null) {
    list.push({ id: 'no-tdee', kind: 'info', title: 'TDEE neestimat', description: 'Loghează alimente câteva zile pentru a-ți estima metabolismul de bază.' })
  }
  return list
}
