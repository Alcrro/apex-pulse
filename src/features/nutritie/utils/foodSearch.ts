import { supabase } from '../../../shared/lib/supabase'
import type { FoodItem } from '../../../shared/types'
import { parseUsdaFood, toFoodCacheRow, parseFoodCacheRow } from './nutritionHelpers'
import { USDA_API_KEY } from './usdaApi'

const USDA_SEARCH = 'https://api.nal.usda.gov/fdc/v1/foods/search'

const RO_TO_EN: Record<string, string> = {
  'pui': 'chicken', 'piept de pui': 'chicken breast', 'pulpa pui': 'chicken thigh',
  'vita': 'beef', 'carne de vita': 'beef meat', 'porc': 'pork', 'cotlet': 'pork chop',
  'oua': 'eggs', 'ou': 'egg', 'lapte': 'milk', 'iaurt': 'yogurt', 'branza': 'cheese',
  'telemea': 'feta cheese', 'cascaval': 'yellow cheese', 'smantana': 'sour cream',
  'unt': 'butter', 'orez': 'rice', 'paste': 'pasta', 'paine': 'bread',
  'cartofi': 'potatoes', 'tomate': 'tomatoes', 'rosii': 'tomatoes',
  'ardei': 'bell pepper', 'morcovi': 'carrots', 'varza': 'cabbage',
  'salata': 'lettuce', 'castraveti': 'cucumber', 'ceapa': 'onion', 'usturoi': 'garlic',
  'mere': 'apple', 'banane': 'banana', 'portocale': 'orange', 'struguri': 'grapes',
  'capsuni': 'strawberries', 'kiwi': 'kiwi', 'avocado': 'avocado',
  'ton': 'tuna', 'somon': 'salmon', 'pastrav': 'trout', 'crap': 'carp',
  'ulei': 'oil', 'ulei de masline': 'olive oil', 'faina': 'flour',
  'zahar': 'sugar', 'miere': 'honey', 'ciocolata': 'chocolate',
  'fulgi de ovaz': 'oatmeal', 'ovaz': 'oats', 'nuca': 'walnut', 'migdale': 'almonds',
  'fasole': 'beans', 'linte': 'lentils', 'naut': 'chickpeas',
}

export function translateQuery(q: string): string {
  return RO_TO_EN[q.toLowerCase().trim()] || q
}

export async function searchFoodCache(query: string): Promise<FoodItem[]> {
  try {
    const { data } = await supabase
      .from('food_cache')
      .select('fdc_id, name, name_ro, brand, image_url, calories_per_g, protein_g, carbs_g, fat_g, sugar_g, fiber_g, sodium_mg')
      .or(`name.ilike.%${query}%,name_ro.ilike.%${query}%`)
      .limit(20)
    return (data ?? []).map(parseFoodCacheRow)
  } catch {
    return []
  }
}

export async function searchUsdaFoods(query: string): Promise<FoodItem[]> {
  const url = `${USDA_SEARCH}?query=${encodeURIComponent(translateQuery(query))}&pageSize=20&api_key=${USDA_API_KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('USDA error')
  const json = await res.json()
  return (json.foods ?? []).map(parseUsdaFood)
}

export async function cacheFoodItems(items: FoodItem[]): Promise<void> {
  if (items.length === 0) return
  try {
    await supabase
      .from('food_cache')
      .upsert(items.map(toFoodCacheRow), { onConflict: 'fdc_id', ignoreDuplicates: true })
  } catch { /* cache is best-effort */ }
}
