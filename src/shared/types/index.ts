export interface Exercise {
  id: string
  name: string
  muscle_group: string
  equipment: string | null
  is_custom: boolean
  user_id: string | null
  created_at: string
  image_url?: string
}

export interface WorkoutPlan {
  id: string
  user_id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
  workout_exercises?: Array<{ count: number }>
}

export interface WorkoutExercise {
  id: string
  workout_plan_id: string
  exercise_id: string
  sets: number
  reps: number
  rest_seconds: number
  order_index: number
  created_at: string
  exercises?: Exercise
}

export interface Session {
  id: string
  user_id: string
  workout_plan_id: string | null
  started_at: string
  finished_at: string | null
  notes: string | null
  created_at: string
  workout_plans?: (WorkoutPlan & {
    workout_exercises: Array<WorkoutExercise & { exercises: Exercise }>
  }) | null
  session_logs?: Array<{ count: number }>
}

export interface SessionLog {
  id: string
  session_id: string
  exercise_id: string
  workout_exercise_id: string | null
  weight: number | null
  reps: number
  rpe: number | null
  notes: string | null
  logged_at: string
  sessions?: Pick<Session, 'started_at' | 'finished_at'>
}

export interface BodyWeight {
  id: string
  user_id: string
  weight: number
  recorded_at: string
  created_at: string
}

// ─── Nutriție ────────────────────────────────────────────────────────────────

export type MealType = string
export type GoalType = 'mentinere' | 'deficit_usor' | 'deficit_moderat' | 'surplus'
export type NutritionPhase = 'discovery' | 'active'

export interface FoodItem {
  fdcId: string
  name: string
  nameRo?: string
  brand?: string
  imageUrl?: string
  caloriesPerG: number
  proteinG: number
  carbsG: number
  fatG: number
  sugarG?: number
  fiberG?: number
  sodiumMg?: number
}

export interface MealEntry {
  id: string
  fdcId: string
  mealType: MealType
  quantity: number
  unit: string
  gramsEquivalent: number
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
  addedAt: string
  food?: Pick<FoodItem, 'name' | 'nameRo' | 'imageUrl'>
}

export interface NutritionLog {
  id: string
  logDate: string
  totalCalories: number
  totalProteinG: number
  totalCarbsG: number
  totalFatG: number
  waterMl: number
  waterTargetMl: number
  entries: MealEntry[]
}

export interface NutritionGoals {
  goalType: GoalType | null
  tdeeEstimated?: number
  targetCalories?: number
  isManualOverride: boolean
  targetProteinPct: number
  targetCarbsPct: number
  targetFatPct: number
}
