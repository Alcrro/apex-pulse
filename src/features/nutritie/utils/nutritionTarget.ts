import type { NutritionGoals, GoalType } from '../../../shared/types'
import { GOAL_OFFSETS, GOAL_MACRO_SPLIT } from './nutritionHelpers'

export const DEFAULT_SPLIT = { protein: 25, carbs: 45, fat: 30 }

interface NutritionGoalsRow {
  goal_type?: string | null
  tdee_estimated?: number | null
  target_calories?: number | null
  is_manual_override?: boolean | null
  target_protein_pct?: number | null
  target_carbs_pct?: number | null
  target_fat_pct?: number | null
}

export function parseGoals(row: NutritionGoalsRow): NutritionGoals {
  return {
    goalType:         row.goal_type         ?? null,
    tdeeEstimated:    row.tdee_estimated    ?? undefined,
    targetCalories:   row.target_calories   ?? undefined,
    isManualOverride: row.is_manual_override ?? false,
    targetProteinPct: row.target_protein_pct ?? DEFAULT_SPLIT.protein,
    targetCarbsPct:   row.target_carbs_pct   ?? DEFAULT_SPLIT.carbs,
    targetFatPct:     row.target_fat_pct     ?? DEFAULT_SPLIT.fat,
  }
}

export function buildGoalTypeRow(userId: string, type: GoalType, tdee: number) {
  const s = GOAL_MACRO_SPLIT[type]
  return {
    user_id:            userId,
    goal_type:          type,
    target_calories:    tdee + GOAL_OFFSETS[type],
    target_protein_pct: s.protein,
    target_carbs_pct:   s.carbs,
    target_fat_pct:     s.fat,
    is_manual_override: false,
    updated_at:         new Date().toISOString(),
  }
}

export function buildManualCaloriesRow(userId: string, kcal: number) {
  return {
    user_id:            userId,
    target_calories:    kcal,
    is_manual_override: true,
    updated_at:         new Date().toISOString(),
  }
}

export function buildCustomMacroRow(userId: string, protein: number, carbs: number, fat: number) {
  return {
    user_id:            userId,
    target_protein_pct: protein,
    target_carbs_pct:   carbs,
    target_fat_pct:     fat,
    updated_at:         new Date().toISOString(),
  }
}
