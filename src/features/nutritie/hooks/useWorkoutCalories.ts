import { useState, useEffect } from 'react'
import { supabase } from '../../../shared/lib/supabase'
import { useAuth } from '../../../shared/context/AuthContext'
import { estimateCaloriesBurned } from '../../../shared/lib/caloriesBurned'
import type { SessionSummary } from '../../../shared/lib/caloriesBurned'

const DEFAULT_BODY_WEIGHT_KG = 70

interface WorkoutSession {
  id: string
  name: string
  estimatedCalories: number
}

export function useWorkoutCalories(date: string) {
  const { user } = useAuth()
  const [totalBurned, setTotalBurned] = useState(0)
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setIsLoading(true)

    supabase
      .from('sessions')
      .select('id, started_at, finished_at, workout_plans(name), session_logs(weight, reps)')
      .eq('user_id', user.id)
      .gte('started_at', `${date}T00:00:00`)
      .lte('started_at', `${date}T23:59:59`)
      .then(({ data }) => {
        if (!data || data.length === 0) {
          setSessions([])
          setTotalBurned(0)
          return
        }

        const summaries: SessionSummary[] = []
        const result: WorkoutSession[] = []

        for (const s of data) {
          const start = new Date(s.started_at).getTime()
          const end = s.finished_at ? new Date(s.finished_at).getTime() : start + 60 * 60 * 1000
          const durationMinutes = Math.max((end - start) / 60000, 1)

          const logs: any[] = s.session_logs ?? []
          const totalVolume = logs.reduce((sum: number, log: any) => {
            const w = Number(log.weight) || 0
            const r = Number(log.reps) || 0
            return sum + w * r
          }, 0)

          summaries.push({ durationMinutes, totalVolume })

          const planName = Array.isArray(s.workout_plans)
            ? (s.workout_plans[0] as any)?.name
            : (s.workout_plans as any)?.name

          result.push({
            id: s.id,
            name: planName || 'Antrenament',
            estimatedCalories: 0,
          })
        }

        let total = 0
        for (let i = 0; i < summaries.length; i++) {
          const kcal = Math.round(estimateCaloriesBurned([summaries[i]], DEFAULT_BODY_WEIGHT_KG))
          result[i].estimatedCalories = kcal
          total += kcal
        }

        setSessions(result)
        setTotalBurned(total)
      })
      .catch(() => {
        setSessions([])
        setTotalBurned(0)
      })
      .finally(() => setIsLoading(false))
  }, [user, date])

  return { totalBurned, sessions, isLoading }
}
