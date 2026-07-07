import { supabase } from '../../../shared/lib/supabase'
import type { FoodItem } from '../../../shared/types'
import { parseFoodCacheRow } from './nutritionHelpers'

const FOOD_CACHE_COLUMNS = 'fdc_id, name, name_ro, brand, image_url, calories_per_g, protein_g, carbs_g, fat_g, sugar_g, fiber_g, sodium_mg'

export async function lookupCachedBarcode(barcode: string): Promise<FoodItem | null> {
  const { data } = await supabase
    .from('food_cache')
    .select(FOOD_CACHE_COLUMNS)
    .eq('barcode', barcode)
    .maybeSingle()
  return data ? parseFoodCacheRow(data) : null
}

export async function cacheBarcode(barcode: string, food: FoodItem): Promise<void> {
  try {
    await supabase.from('food_cache').upsert(
      {
        fdc_id: food.fdcId,
        name: food.name,
        name_ro: food.nameRo ?? null,
        brand: food.brand ?? null,
        image_url: null,
        calories_per_g: food.caloriesPerG,
        protein_g: food.proteinG,
        carbs_g: food.carbsG,
        fat_g: food.fatG,
        sugar_g: food.sugarG ?? 0,
        fiber_g: food.fiberG ?? 0,
        sodium_mg: food.sodiumMg ?? 0,
        barcode,
        data_source: 'off',
      },
      { onConflict: 'fdc_id', ignoreDuplicates: true }
    )
  } catch { /* cache write best-effort */ }
}
