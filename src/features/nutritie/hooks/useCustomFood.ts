import { useState } from 'react'
import { supabase } from '../../../shared/lib/supabase'
import { useAuth } from '../../../shared/context/AuthContext'
import type { FoodItem } from '../../../shared/types'

interface CustomFoodInput {
  name: string
  nameRo?: string
  caloriesPerG: number
  proteinG: number
  carbsG: number
  fatG: number
  fiberG?: number
  sodiumMg?: number
}

export function useCustomFood() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  async function createCustomFood(data: CustomFoodInput): Promise<FoodItem | null> {
    if (!user) return null
    setIsLoading(true)
    try {
      const fdcId = `custom_${user.id.slice(0, 8)}_${Date.now()}`
      const row = {
        fdc_id: fdcId,
        name: data.name,
        name_ro: data.nameRo ?? null,
        brand: null,
        image_url: null,
        calories_per_g: data.caloriesPerG,
        protein_g: data.proteinG,
        carbs_g: data.carbsG,
        fat_g: data.fatG,
        sugar_g: 0,
        fiber_g: data.fiberG ?? 0,
        sodium_mg: data.sodiumMg ?? 0,
        data_source: 'custom',
        user_id: user.id,
      }
      const { data: inserted, error } = await supabase
        .from('food_cache')
        .insert(row)
        .select()
        .single()
      if (error || !inserted) return null
      return {
        fdcId: inserted.fdc_id,
        name: inserted.name,
        nameRo: inserted.name_ro ?? undefined,
        caloriesPerG: Number(inserted.calories_per_g),
        proteinG: Number(inserted.protein_g),
        carbsG: Number(inserted.carbs_g),
        fatG: Number(inserted.fat_g),
        fiberG: inserted.fiber_g ? Number(inserted.fiber_g) : undefined,
        sodiumMg: inserted.sodium_mg ? Number(inserted.sodium_mg) : undefined,
      }
    } catch {
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { createCustomFood, isLoading }
}
