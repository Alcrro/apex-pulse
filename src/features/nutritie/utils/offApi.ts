import type { FoodItem } from '../../../shared/types'

export const OFF_API = 'https://world.openfoodfacts.org/api/v2/product'

interface OffNutriments {
  'energy-kcal_100g'?: number
  'energy_100g'?: number
  'proteins_100g'?: number
  'carbohydrates_100g'?: number
  'fat_100g'?: number
  'sugars_100g'?: number
  'fiber_100g'?: number
  'sodium_100g'?: number
}

interface OffProduct {
  nutriments?: OffNutriments
  product_name_ro?: string
  product_name?: string
  product_name_en?: string
  brands?: string
}

interface OffApiResponse {
  product?: OffProduct
}

export function parseOffProduct(barcode: string, data: OffApiResponse): FoodItem | null {
  const product = data?.product
  if (!product) return null

  const n = product.nutriments ?? {}
  const kcal100 = n['energy-kcal_100g'] ?? n['energy_100g'] ?? 0
  const protein100 = n['proteins_100g'] ?? 0
  const carbs100 = n['carbohydrates_100g'] ?? 0
  const fat100 = n['fat_100g'] ?? 0

  if (!kcal100 && !protein100 && !carbs100 && !fat100) return null

  const name =
    product.product_name_ro ||
    product.product_name ||
    product.product_name_en ||
    'Produs necunoscut'

  return {
    fdcId: `off_${barcode}`,
    name,
    nameRo: product.product_name_ro || undefined,
    brand: product.brands?.split(',')[0]?.trim() || undefined,
    caloriesPerG: kcal100 / 100,
    proteinG: protein100 / 100,
    carbsG: carbs100 / 100,
    fatG: fat100 / 100,
    sugarG: n['sugars_100g'] ? n['sugars_100g'] / 100 : undefined,
    fiberG: n['fiber_100g'] ? n['fiber_100g'] / 100 : undefined,
    sodiumMg: n['sodium_100g'] ? (n['sodium_100g'] * 1000) / 100 : undefined,
  }
}
