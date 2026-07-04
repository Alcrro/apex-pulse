import { useState, useEffect } from 'react'
import { supabase } from '../../../shared/lib/supabase'
import { useAuth } from '../../../shared/context/AuthContext'
import { formatDate } from '../utils/nutritionHelpers'

interface DayCalories {
  date: string
  consumed: number
  burned: number
  target: number | null
}

export function useWeeklyCalories() {
  const { user } = useAuth()
  const [days, setDays] = useState<DayCalories[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setIsLoading(true)

    const today = formatDate(new Date())
    const from = new Date()
    from.setDate(from.getDate() - 6)
    const fromStr = formatDate(from)

    Promise.all([
      supabase
        .from('nutrition_logs')
        .select('log_date, total_calories, calories_burned, target_calories')
        .eq('user_id', user.id)
        .gte('log_date', fromStr)
        .lte('log_date', today)
        .is('deleted_at', null),
      supabase
        .from('nutrition_goals')
        .select('target_calories')
        .eq('user_id', user.id)
        .maybeSingle(),
    ])
      .then(([logsRes, goalRes]) => {
        const logMap = new Map<string, { consumed: number; burned: number; target: number | null }>()
        for (const row of logsRes.data ?? []) {
          logMap.set(row.log_date, {
            consumed: Number(row.total_calories) || 0,
            burned: Number(row.calories_burned) || 0,
            target: row.target_calories ? Number(row.target_calories) : null,
          })
        }

        const globalTarget = goalRes.data?.target_calories ? Number(goalRes.data.target_calories) : null

        const result: DayCalories[] = []
        for (let i = 6; i >= 0; i--) {
          const d = new Date()
          d.setDate(d.getDate() - i)
          const ds = formatDate(d)
          const entry = logMap.get(ds)
          result.push({
            date: ds,
            consumed: entry?.consumed ?? 0,
            burned: entry?.burned ?? 0,
            target: entry?.target ?? globalTarget,
          })
        }
        setDays(result)
      })
      .catch(() => setDays([]))
      .finally(() => setIsLoading(false))
  }, [user])

  return { days, isLoading }
}
