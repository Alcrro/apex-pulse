import type { FoodItem } from '../../../shared/types'
import { parseUsdaFood } from './nutritionHelpers'
import type { UsdaNutrient } from './nutritionHelpers'

export const USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY || 'DEMO_KEY'
const USDA_API_BASE = 'https://api.nal.usda.gov/fdc/v1/food'

export interface Micros {
  vitamins: Record<string, number>
  minerals: Record<string, number>
  aminoAcids: Record<string, number>
}

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
  leucine:         'leucina',
  isoleucine:      'izoleucina',
  valine:          'valina',
  lysine:          'lizina',
  methionine:      'metionina',
  phenylalanine:   'fenilalanina',
  threonine:       'treonina',
  tryptophan:      'triptofan',
  histidine:       'histidina',
  alanine:         'alanina',
  arginine:        'arginina',
  'aspartic acid': 'acid aspartic',
  cystine:         'cistina',
  'glutamic acid': 'acid glutamic',
  glycine:         'glicina',
  proline:         'prolina',
  serine:          'serina',
  tyrosine:        'tirozina',
}

export function extractMicros(nutrients: UsdaNutrient[]): Micros {
  const vitamins: Record<string, number> = {}
  const minerals: Record<string, number> = {}
  const aminoAcids: Record<string, number> = {}

  for (const n of nutrients) {
    const id   = n.nutrientId || n.nutrientNumber
    const name = (n.nutrientName || '').toLowerCase()
    const val  = n.value ?? 0

    if (VITAMIN_IDS[id]) {
      vitamins[VITAMIN_IDS[id]] = val
    } else if (MINERAL_IDS[id]) {
      minerals[MINERAL_IDS[id]] = val
    } else {
      for (const [en, ro] of Object.entries(AMINO_NAMES)) {
        if (name.includes(en)) { aminoAcids[ro] = val; break }
      }
    }
  }

  return { vitamins, minerals, aminoAcids }
}

export async function fetchUsdaFoodDetail(fdcId: string): Promise<{ base: FoodItem; micros: Micros } | null> {
  const res = await fetch(`${USDA_API_BASE}/${fdcId}?api_key=${USDA_API_KEY}`)
  if (!res.ok) return null
  const json = await res.json()
  return {
    base:  parseUsdaFood(json),
    micros: extractMicros(json.foodNutrients ?? []),
  }
}
