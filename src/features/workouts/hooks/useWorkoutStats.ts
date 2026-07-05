import { useEffect, useState } from 'react'
import { supabase } from '../../../shared/lib/supabase'
import { useAuth } from '../../../shared/context/AuthContext'

export interface WorkoutStats {
  totalSessions: number
  currentStreak: number
  bestStreak: number
  favoritePlanName: string | null
  avgSessionsPerWeek: number
  totalVolumeKg: number
  totalHours: number
  avgSessionMinutes: number
}

export interface PlanStats {
  sessionCount: number
  lastSessionDate: string | null
  avgDurationMinutes: number | null
}

type SessionRow = {
  id: string
  started_at: string
  finished_at: string | null
  workout_plan_id: string | null
  workout_plans: { name: string } | null
}

function dateMinus1Day(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}

function diffDays(a: string, b: string): number {
  return Math.round((new Date(a).getTime() - new Date(b).getTime()) / 86400000)
}

function computeStreaks(sessions: SessionRow[]): { current: number; best: number } {
  if (sessions.length === 0) return { current: 0, best: 0 }

  const uniqueDays = [...new Set(sessions.map(s => s.started_at.slice(0, 10)))].sort().reverse()

  const today = new Date().toISOString().slice(0, 10)
  const yesterday = dateMinus1Day(today)

  let current = 0
  const startDay = uniqueDays[0] === today ? today : uniqueDays[0] === yesterday ? yesterday : null

  if (startDay) {
    let expected = startDay
    for (const day of uniqueDays) {
      if (day === expected) {
        current++
        expected = dateMinus1Day(expected)
      } else {
        break
      }
    }
  }

  const sortedAsc = [...uniqueDays].reverse()
  let best = sortedAsc.length > 0 ? 1 : 0
  let run = 1
  for (let i = 1; i < sortedAsc.length; i++) {
    if (diffDays(sortedAsc[i], sortedAsc[i - 1]) === 1) {
      run++
      if (run > best) best = run
    } else {
      run = 1
    }
  }

  return { current, best }
}

export function useWorkoutStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState<WorkoutStats | null>(null)
  const [planStats, setPlanStats] = useState<Record<string, PlanStats>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchStats()
  }, [user])

  async function fetchStats() {
    setLoading(true)

    const { data: sessionsData } = await supabase
      .from('sessions')
      .select('id, started_at, finished_at, workout_plan_id, workout_plans(name)')
      .eq('user_id', user!.id)
      .not('finished_at', 'is', null)
      .order('started_at', { ascending: true })

    const sessions = (sessionsData ?? []) as SessionRow[]

    if (sessions.length === 0) {
      setStats({
        totalSessions: 0,
        currentStreak: 0,
        bestStreak: 0,
        favoritePlanName: null,
        avgSessionsPerWeek: 0,
        totalVolumeKg: 0,
        totalHours: 0,
        avgSessionMinutes: 0,
      })
      setPlanStats({})
      setLoading(false)
      return
    }

    const sessionIds = sessions.map(s => s.id)
    const { data: logsData } = await supabase
      .from('session_logs')
      .select('weight, reps, session_id')
      .in('session_id', sessionIds)

    const logs = (logsData ?? []) as { weight: number | null; reps: number; session_id: string }[]

    const { current, best } = computeStreaks(sessions)

    const totalVolumeKg = logs.reduce((acc, l) => acc + (l.weight ?? 0) * l.reps, 0)

    const durations = sessions
      .filter(s => s.finished_at)
      .map(s => (new Date(s.finished_at!).getTime() - new Date(s.started_at).getTime()) / 60000)
    const totalMinutes = durations.reduce((a, b) => a + b, 0)
    const avgSessionMinutes = durations.length ? totalMinutes / durations.length : 0

    const firstSession = new Date(sessions[0].started_at)
    const weeksElapsed = Math.max(1, (Date.now() - firstSession.getTime()) / (7 * 86400000))

    const planCounts: Record<string, number> = {}
    for (const s of sessions) {
      if (s.workout_plan_id) {
        planCounts[s.workout_plan_id] = (planCounts[s.workout_plan_id] ?? 0) + 1
      }
    }
    let favoritePlanName: string | null = null
    let maxCount = 0
    for (const s of sessions) {
      if (s.workout_plan_id && planCounts[s.workout_plan_id] > maxCount) {
        maxCount = planCounts[s.workout_plan_id]
        favoritePlanName = s.workout_plans?.name ?? null
      }
    }

    setStats({
      totalSessions: sessions.length,
      currentStreak: current,
      bestStreak: best,
      favoritePlanName,
      avgSessionsPerWeek: sessions.length / weeksElapsed,
      totalVolumeKg,
      totalHours: totalMinutes / 60,
      avgSessionMinutes,
    })

    // Per-plan stats
    const planStatsMap: Record<string, PlanStats> = {}
    const planDurations: Record<string, number[]> = {}

    for (const s of sessions) {
      if (!s.workout_plan_id) continue
      if (!planStatsMap[s.workout_plan_id]) {
        planStatsMap[s.workout_plan_id] = { sessionCount: 0, lastSessionDate: null, avgDurationMinutes: null }
      }
      planStatsMap[s.workout_plan_id].sessionCount++
      if (!planStatsMap[s.workout_plan_id].lastSessionDate || s.started_at > planStatsMap[s.workout_plan_id].lastSessionDate!) {
        planStatsMap[s.workout_plan_id].lastSessionDate = s.started_at
      }
      if (s.finished_at) {
        const dur = (new Date(s.finished_at).getTime() - new Date(s.started_at).getTime()) / 60000
        if (!planDurations[s.workout_plan_id]) planDurations[s.workout_plan_id] = []
        planDurations[s.workout_plan_id].push(dur)
      }
    }

    for (const planId in planDurations) {
      const durs = planDurations[planId]
      if (planStatsMap[planId]) {
        planStatsMap[planId].avgDurationMinutes = durs.reduce((a, b) => a + b, 0) / durs.length
      }
    }

    setPlanStats(planStatsMap)
    setLoading(false)
  }

  return { stats, planStats, loading }
}
