export interface CustomFoodFields {
  name: string
  nameRo: string
  calories: string
  protein: string
  carbs: string
  fat: string
  fiber: string
  sodium: string
}

export interface CustomFoodPayload {
  name: string
  nameRo?: string
  caloriesPerG: number
  proteinG: number
  carbsG: number
  fatG: number
  fiberG?: number
  sodiumMg?: number
}

export function parseCustomFoodFields(fields: CustomFoodFields) {
  return {
    calNum:  parseFloat(fields.calories) || 0,
    protNum: parseFloat(fields.protein)  || 0,
    carbNum: parseFloat(fields.carbs)    || 0,
    fatNum:  parseFloat(fields.fat)      || 0,
  }
}

export function validateCustomFoodForm(
  name: string,
  calNum: number,
  protNum: number,
  carbNum: number,
  fatNum: number
): boolean {
  return name.trim().length > 0 && calNum > 0 && protNum >= 0 && carbNum >= 0 && fatNum >= 0
}

export function buildCustomFoodPayload(
  fields: CustomFoodFields,
  calNum: number,
  protNum: number,
  carbNum: number,
  fatNum: number
): CustomFoodPayload {
  return {
    name:         fields.name.trim(),
    nameRo:       fields.nameRo.trim() || undefined,
    caloriesPerG: calNum  / 100,
    proteinG:     protNum / 100,
    carbsG:       carbNum / 100,
    fatG:         fatNum  / 100,
    fiberG:       fields.fiber  ? parseFloat(fields.fiber)  / 100 : undefined,
    sodiumMg:     fields.sodium ? parseFloat(fields.sodium) / 100 : undefined,
  }
}
