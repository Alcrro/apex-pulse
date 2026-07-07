import { useState, useEffect } from 'react'
import { supabase } from '../../../shared/lib/supabase'
import { useAuth } from '../../../shared/context/AuthContext'
import { estimateCaloriesBurned } from '../../../shared/lib/caloriesBurned'
import { DEFAULT_BODY_WEIGHT_KG, getSessionPlanName, buildSessionSummary } from '../utils/workoutCalories'

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

        let total = 0
        const result: WorkoutSession[] = data.map(s => {
          const kcal = Math.round(estimateCaloriesBurned([buildSessionSummary(s)], DEFAULT_BODY_WEIGHT_KG))
          total += kcal
          return { id: s.id, name: getSessionPlanName(s), estimatedCalories: kcal }
        })

        setSessions(result)
        setTotalBurned(total)
      })
      .catch(() => { setSessions([]); setTotalBurned(0) })
      .finally(() => setIsLoading(false))
  }, [user, date])

  return { totalBurned, sessions, isLoading }
}
