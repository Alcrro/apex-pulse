import { useState, useRef } from 'react'
import { supabase } from '../../../shared/lib/supabase'
import type { FoodItem } from '../../../shared/types'
import { parseUsdaFood, toFoodCacheRow, parseFoodCacheRow } from '../utils/nutritionHelpers'

const USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY || 'DEMO_KEY'
const USDA_SEARCH = 'https://api.nal.usda.gov/fdc/v1/foods/search'

// Dicționar simplu RO → EN pentru termeni comuni
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

function translateQuery(q: string): string {
  const lower = q.toLowerCase().trim()
  return RO_TO_EN[lower] || q
}

export function useFoodSearch() {
  const [results, setResults] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function searchSupabase(query: string): Promise<FoodItem[]> {
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

  async function searchUsda(query: string): Promise<FoodItem[]> {
    const translated = translateQuery(query)
    const url = `${USDA_SEARCH}?query=${encodeURIComponent(translated)}&pageSize=20&api_key=${USDA_API_KEY}`
    const res = await fetch(url)
    if (!res.ok) throw new Error('USDA error')
    const json = await res.json()
    return (json.foods ?? []).map(parseUsdaFood)
  }

  async function cacheItems(items: FoodItem[]) {
    if (items.length === 0) return
    try {
      await supabase
        .from('food_cache')
        .upsert(items.map(toFoodCacheRow), { onConflict: 'fdc_id', ignoreDuplicates: true })
    } catch { /* silent — cache is best-effort */ }
  }

  function search(query: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) { setResults([]); return }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      setIsError(false)

      const local = await searchSupabase(query)

      if (local.length >= 5) {
        setResults(local)
        setIsLoading(false)
        return
      }

      try {
        const remote = await searchUsda(query)
        cacheItems(remote)
        const seen = new Set(local.map((f) => f.fdcId))
        setResults([...local, ...remote.filter((f) => !seen.has(f.fdcId))])
      } catch {
        setIsError(true)
        setResults(local)
      } finally {
        setIsLoading(false)
      }
    }, 400)
  }

  return { results, isLoading, isError, search, clearResults: () => setResults([]) }
}
