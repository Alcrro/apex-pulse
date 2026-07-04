import { useState, useEffect } from 'react'
import { supabase } from '../../../shared/lib/supabase'
import { useAuth } from '../../../shared/context/AuthContext'
import type { FoodItem } from '../../../shared/types'
import { parseFoodCacheRow } from '../utils/nutritionHelpers'

export function useRecentFoods() {
  const { user } = useAuth()
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setIsLoading(true)
    supabase
      .from('meal_entries')
      .select('fdc_id, food_cache(*), added_at')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('added_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        const seen = new Set<string>()
        const items: FoodItem[] = []
        for (const row of data ?? []) {
          if (!row.fdc_id || seen.has(row.fdc_id)) continue
          seen.add(row.fdc_id)
          if (row.food_cache) {
            items.push(parseFoodCacheRow(row.food_cache))
          }
          if (items.length >= 10) break
        }
        setFoods(items)
      })
      .catch(() => setFoods([]))
      .finally(() => setIsLoading(false))
  }, [user])

  return { foods, isLoading }
}
