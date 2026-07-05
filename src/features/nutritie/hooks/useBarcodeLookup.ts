import { useState, useCallback } from 'react'
import { supabase } from '../../../shared/lib/supabase'
import type { FoodItem } from '../../../shared/types'
import { parseFoodCacheRow } from '../utils/nutritionHelpers'

const OFF_API = 'https://world.openfoodfacts.org/api/v2/product'

function parseOffProduct(barcode: string, data: any): FoodItem | null {
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
  const nameRo = product.product_name_ro || undefined
  const brand = product.brands?.split(',')[0]?.trim() || undefined

  return {
    fdcId: `off_${barcode}`,
    name,
    nameRo,
    brand,
    caloriesPerG: kcal100 / 100,
    proteinG: protein100 / 100,
    carbsG: carbs100 / 100,
    fatG: fat100 / 100,
    sugarG: n['sugars_100g'] ? n['sugars_100g'] / 100 : undefined,
    fiberG: n['fiber_100g'] ? n['fiber_100g'] / 100 : undefined,
    sodiumMg: n['sodium_100g'] ? (n['sodium_100g'] * 1000) / 100 : undefined,
  }
}

export function useBarcodeLookup() {
  const [food, setFood] = useState<FoodItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isNotFound, setIsNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lookup = useCallback(async (barcode: string) => {
    setIsLoading(true)
    setIsNotFound(false)
    setError(null)
    setFood(null)

    try {
      // 1. Check food_cache first
      const { data: cached } = await supabase
        .from('food_cache')
        .select('*')
        .eq('barcode', barcode)
        .maybeSingle()

      if (cached) {
        setFood(parseFoodCacheRow(cached))
        setIsLoading(false)
        return
      }

      // 2. Fallback: Open Food Facts API
      const res = await fetch(`${OFF_API}/${barcode}.json`)
      if (!res.ok) throw new Error('OFF API error')
      const json = await res.json()

      if (json.status === 0 || !json.product) {
        setIsNotFound(true)
        setIsLoading(false)
        return
      }

      const parsed = parseOffProduct(barcode, json)
      if (!parsed) {
        setIsNotFound(true)
        setIsLoading(false)
        return
      }

      // 3. Cache the result (best-effort)
      try {
        await supabase.from('food_cache').upsert(
          {
            fdc_id: parsed.fdcId,
            name: parsed.name,
            name_ro: parsed.nameRo ?? null,
            brand: parsed.brand ?? null,
            image_url: null,
            calories_per_g: parsed.caloriesPerG,
            protein_g: parsed.proteinG,
            carbs_g: parsed.carbsG,
            fat_g: parsed.fatG,
            sugar_g: parsed.sugarG ?? 0,
            fiber_g: parsed.fiberG ?? 0,
            sodium_mg: parsed.sodiumMg ?? 0,
            barcode,
            data_source: 'off',
          },
          { onConflict: 'fdc_id', ignoreDuplicates: true }
        )
      } catch { /* cache write best-effort */ }

      setFood(parsed)
    } catch {
      setError('Nu s-a putut identifica produsul. Încearcă din nou.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setFood(null)
    setIsNotFound(false)
    setError(null)
    setIsLoading(false)
  }, [])

  return { food, isLoading, isNotFound, error, lookup, reset }
}
