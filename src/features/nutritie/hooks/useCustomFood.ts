import { useState } from 'react'
import { supabase } from '../../../shared/lib/supabase'
import { useAuth } from '../../../shared/context/AuthContext'
import type { FoodItem } from '../../../shared/types'
import type { CustomFoodPayload } from '../utils/customFoodForm'
import { generateCustomFoodId, buildCustomFoodRow } from '../utils/customFood'
import { parseFoodCacheRow } from '../utils/nutritionHelpers'

export function useCustomFood() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  async function createCustomFood(data: CustomFoodPayload): Promise<FoodItem | null> {
    if (!user) return null
    setIsLoading(true)
    try {
      const fdcId = generateCustomFoodId(user.id)
      const row = buildCustomFoodRow(fdcId, data, user.id)
      const { data: inserted, error } = await supabase
        .from('food_cache')
        .insert(row)
        .select()
        .single()
      if (error || !inserted) return null
      return parseFoodCacheRow(inserted)
    } catch {
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { createCustomFood, isLoading }
}
