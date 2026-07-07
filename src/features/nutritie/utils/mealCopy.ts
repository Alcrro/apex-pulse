import { supabase } from '../../../shared/lib/supabase'
import type { MealEntry, MealType } from '../../../shared/types'
import { parseEntries } from './nutritionLog'

export async function fetchDayMealEntries(
  userId: string,
  date: string,
  mealType: MealType
): Promise<MealEntry[]> {
  try {
    const { data: logRow } = await supabase
      .from('nutrition_logs')
      .select('id')
      .eq('user_id', userId)
      .eq('log_date', date)
      .is('deleted_at', null)
      .maybeSingle()

    if (!logRow) return []

    const { data } = await supabase
      .from('meal_entries')
      .select('*, food_cache(name, name_ro, image_url)')
      .eq('log_id', logRow.id)
      .eq('meal_type', mealType)
      .is('deleted_at', null)
      .order('added_at', { ascending: true })

    return parseEntries(data ?? [])
  } catch {
    return []
  }
}
