import { useState, useEffect } from 'react'
import { supabase } from '../../../shared/lib/supabase'
import type { FoodItem } from '../../../shared/types'
import { parseFoodCacheRow } from '../utils/nutritionHelpers'

const USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY || 'DEMO_KEY'

export interface FoodDetail extends FoodItem {
  vitamins?: Record<string, number>
  minerals?: Record<string, number>
  aminoAcids?: Record<string, number>
}

function extractMicros(nutrients: any[]): {
  vitamins: Record<string, number>
  minerals: Record<string, number>
  aminoAcids: Record<string, number>
} {
  const vitamins: Record<string, number> = {}
  const minerals: Record<string, number> = {}
  const aminoAcids: Record<string, number> = {}

  const VITAMIN_IDS: Record<number, string> = {
    1106: 'vitaminA_mcg',
    1162: 'vitaminC_mg',
    1114: 'vitaminD_mcg',
    1109: 'vitaminE_mg',
    1185: 'vitaminK_mcg',
    1165: 'vitaminB1_mg',
    1166: 'vitaminB2_mg',
    1167: 'vitaminB3_mg',
    1175: 'vitaminB6_mg',
    1177: 'vitaminB9_mcg',
    1178: 'vitaminB12_mcg',
  }
  const MINERAL_IDS: Record<number, string> = {
    1087: 'calcium_mg',
    1089: 'iron_mg',
    1090: 'magnesium_mg',
    1092: 'potassium_mg',
    1095: 'zinc_mg',
    1103: 'selenium_mcg',
    1091: 'phosphorus_mg',
  }
  const AMINO_NAMES: Record<string, string> = {
    leucine: 'leucina',
    isoleucine: 'izoleucina',
    valine: 'valina',
    lysine: 'lizina',
    methionine: 'metionina',
    phenylalanine: 'fenilalanina',
    threonine: 'treonina',
    tryptophan: 'triptofan',
    histidine: 'histidina',
    alanine: 'alanina',
    arginine: 'arginina',
    'aspartic acid': 'acid aspartic',
    cystine: 'cistina',
    'glutamic acid': 'acid glutamic',
    glycine: 'glicina',
    proline: 'prolina',
    serine: 'serina',
    tyrosine: 'tirozina',
  }

  for (const n of nutrients) {
    const id = n.nutrientId || n.nutrientNumber
    const name = (n.nutrientName || '').toLowerCase()
    const val = n.value ?? 0

    if (VITAMIN_IDS[id]) {
      vitamins[VITAMIN_IDS[id]] = val
    } else if (MINERAL_IDS[id]) {
      minerals[MINERAL_IDS[id]] = val
    } else {
      for (const [en, ro] of Object.entries(AMINO_NAMES)) {
        if (name.includes(en)) {
          aminoAcids[ro] = val
          break
        }
      }
    }
  }

  return { vitamins, minerals, aminoAcids }
}

export function useFoodDetail(fdcId: string | undefined) {
  const [food, setFood] = useState<FoodDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!fdcId) { setIsLoading(false); return }
    setIsLoading(true)

    async function load() {
      try {
        const { data } = await supabase
          .from('food_cache')
          .select('*')
          .eq('fdc_id', fdcId)
          .maybeSingle()

        if (data) {
          const base = parseFoodCacheRow(data)
          const hasVitamins = data.vitamins && Object.keys(data.vitamins).length > 0
          const hasMinerals = data.minerals && Object.keys(data.minerals).length > 0
          const hasAminos = data.amino_acids && Object.keys(data.amino_acids).length > 0

          if ((!hasVitamins || !hasMinerals) && data.data_source === 'usda' && !fdcId!.startsWith('custom_')) {
            const res = await fetch(
              `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${USDA_API_KEY}`,
            )
            if (res.ok) {
              const json = await res.json()
              const micros = extractMicros(json.foodNutrients ?? [])
              setFood({ ...base, ...micros })
              return
            }
          }

          setFood({
            ...base,
            vitamins: data.vitamins ?? undefined,
            minerals: data.minerals ?? undefined,
            aminoAcids: data.amino_acids ?? undefined,
          })
        } else if (fdcId && !fdcId.startsWith('custom_')) {
          const res = await fetch(
            `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${USDA_API_KEY}`,
          )
          if (res.ok) {
            const json = await res.json()
            const micros = extractMicros(json.foodNutrients ?? [])
            const kcal = json.foodNutrients?.find((n: any) => n.nutrientId === 1008)?.value ?? 0
            const protein = json.foodNutrients?.find((n: any) => n.nutrientId === 1003)?.value ?? 0
            const fat = json.foodNutrients?.find((n: any) => n.nutrientId === 1004)?.value ?? 0
            const carbs = json.foodNutrients?.find((n: any) => n.nutrientId === 1005)?.value ?? 0
            setFood({
              fdcId: String(fdcId),
              name: json.description ?? 'Aliment necunoscut',
              brand: json.brandOwner || json.brandName || undefined,
              caloriesPerG: kcal / 100,
              proteinG: protein / 100,
              carbsG: carbs / 100,
              fatG: fat / 100,
              ...micros,
            })
          } else {
            setFood(null)
          }
        } else {
          setFood(null)
        }
      } catch {
        setFood(null)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [fdcId])

  return { food, isLoading }
}
