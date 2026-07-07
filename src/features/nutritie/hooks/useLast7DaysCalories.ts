import { useState, useEffect } from 'react'
import { supabase } from '../../../shared/lib/supabase'
import { useAuth } from '../../../shared/context/AuthContext'
import { formatDate } from '../utils/nutritionHelpers'

export function useLast7DaysCalories() {
  const { user } = useAuth()
  const [days, setDays] = useState<{ date: string; calories: number }[]>([])

  useEffect(() => {
    if (!user) return
    const today = formatDate(new Date())
    const from = new Date()
    from.setDate(from.getDate() - 6)
    const fromStr = formatDate(from)

    supabase
      .from('nutrition_logs')
      .select('log_date, total_calories')
      .eq('user_id', user.id)
      .gte('log_date', fromStr)
      .lte('log_date', today)
      .is('deleted_at', null)
      .order('log_date')
      .then(({ data }) => {
        const map = new Map((data ?? []).map((r) => [r.log_date, Number(r.total_calories)]))
        const result = []
        for (let i = 6; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          const ds = formatDate(d)
          result.push({ date: ds, calories: map.get(ds) ?? 0 })
        }
        setDays(result)
      })
      .catch(() => setDays([]))
  }, [user])

  return days
}
