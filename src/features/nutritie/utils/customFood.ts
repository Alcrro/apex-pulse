import type { CustomFoodPayload } from './customFoodForm'

export function generateCustomFoodId(userId: string): string {
  return `custom_${userId.slice(0, 8)}_${Date.now()}`
}

export function buildCustomFoodRow(fdcId: string, data: CustomFoodPayload, userId: string) {
  return {
    fdc_id: fdcId,
    name: data.name,
    name_ro: data.nameRo ?? null,
    brand: null,
    image_url: null,
    calories_per_g: data.caloriesPerG,
    protein_g: data.proteinG,
    carbs_g: data.carbsG,
    fat_g: data.fatG,
    sugar_g: 0,
    fiber_g: data.fiberG ?? 0,
    sodium_mg: data.sodiumMg ?? 0,
    data_source: 'custom',
    user_id: userId,
  }
}
