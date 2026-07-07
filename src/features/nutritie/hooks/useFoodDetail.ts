import { useState, useEffect } from 'react'
import { supabase } from '../../../shared/lib/supabase'
import type { FoodItem } from '../../../shared/types'
import { parseFoodCacheRow } from '../utils/nutritionHelpers'
import { fetchUsdaFoodDetail } from '../utils/usdaApi'

export interface FoodDetail extends FoodItem {
  vitamins?: Record<string, number>
  minerals?: Record<string, number>
  aminoAcids?: Record<string, number>
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
          const isUsda = data.data_source === 'usda' && !fdcId!.startsWith('custom_')

          if ((!hasVitamins || !hasMinerals) && isUsda) {
            const result = await fetchUsdaFoodDetail(fdcId!)
            if (result) { setFood({ ...base, ...result.micros }); return }
          }

          setFood({
            ...base,
            vitamins:   data.vitamins    ?? undefined,
            minerals:   data.minerals    ?? undefined,
            aminoAcids: data.amino_acids ?? undefined,
          })
        } else if (fdcId && !fdcId.startsWith('custom_')) {
          const result = await fetchUsdaFoodDetail(fdcId)
          if (result) setFood({ ...result.base, ...result.micros })
          else        setFood(null)
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
