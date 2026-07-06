import { useState, useEffect } from 'react'
import type { MealType } from '../../../shared/types'
import { supabase } from '../../../shared/lib/supabase'
import { useAuth } from '../../../shared/context/AuthContext'
import { formatDate, addDays, getDayLabel } from '../utils/nutritionHelpers'

export interface DayOption {
  date: string
  label: string
  count: number
}

export function useMealCopyDays(mealType: MealType) {
  const { user } = useAuth()
  const [days, setDays] = useState<DayOption[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setIsLoading(true)

    const today = formatDate(new Date())
    const from = addDays(today, -30)

    supabase
      .from('meal_entries')
      .select('fdc_id, meal_type, added_at, nutrition_logs!inner(log_date)')
      .eq('user_id', user.id)
      .eq('meal_type', mealType)
      .is('deleted_at', null)
      .gte('added_at', `${from}T00:00:00`)
      .order('added_at', { ascending: false })
      .then(({ data }) => {
        const countByDate = new Map<string, number>()
        for (const row of data ?? []) {
          const logDate = (row.nutrition_logs as any)?.log_date
          if (!logDate) continue
          countByDate.set(logDate, (countByDate.get(logDate) ?? 0) + 1)
        }
        const result: DayOption[] = []
        for (let i = 1; i <= 30; i++) {
          const d = addDays(today, -i)
          const count = countByDate.get(d) ?? 0
          if (count > 0) result.push({ date: d, label: getDayLabel(d), count })
        }
        setDays(result)
      })
      .catch(() => setDays([]))
      .finally(() => setIsLoading(false))
  }, [user, mealType])

  return { days, isLoading }
}
