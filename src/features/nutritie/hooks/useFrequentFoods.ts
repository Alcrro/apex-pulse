import { useState, useEffect } from 'react'
import { supabase } from '../../../shared/lib/supabase'
import { useAuth } from '../../../shared/context/AuthContext'
import type { FoodItem } from '../../../shared/types'
import { parseFoodCacheRow } from '../utils/nutritionHelpers'

export function useFrequentFoods() {
  const { user } = useAuth()
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setIsLoading(true)
    supabase
      .from('food_frequency')
      .select('fdc_id, use_count, food_cache(*)')
      .eq('user_id', user.id)
      .order('use_count', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        const items = (data ?? [])
          .map((row: any) => row.food_cache ? parseFoodCacheRow(row.food_cache) : null)
          .filter(Boolean) as FoodItem[]
        setFoods(items)
      })
      .catch(() => setFoods([]))
      .finally(() => setIsLoading(false))
  }, [user])

  return { foods, isLoading }
}
