interface FoodMacros {
  caloriesPerG: number
  proteinG: number
  carbsG: number
  fatG: number
}

// Folosit în FoodSearchModal: convertește quantity + unit în preview macros
export function calcPreview(food: FoodMacros, quantity: string, unit: string) {
  const gramsNum = unit === 'pounds' ? (parseFloat(quantity) || 0) * 453.59 : parseFloat(quantity) || 0
  return {
    kcal:    Math.round(food.caloriesPerG * gramsNum),
    protein: Math.round(food.proteinG * gramsNum * 10) / 10,
    carbs:   Math.round(food.carbsG   * gramsNum * 10) / 10,
    fat:     Math.round(food.fatG     * gramsNum * 10) / 10,
  }
}

export function calcPortion(food: FoodMacros, gramsStr: string) {
  const gramsNum = Math.max(parseFloat(gramsStr) || 0, 0)
  const portion = {
    calories: Math.round(food.caloriesPerG * gramsNum),
    protein:  Math.round(food.proteinG * gramsNum * 10) / 10,
    carbs:    Math.round(food.carbsG   * gramsNum * 10) / 10,
    fat:      Math.round(food.fatG     * gramsNum * 10) / 10,
  }
  return { gramsNum, portion }
}
