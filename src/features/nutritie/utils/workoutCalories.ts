import type { SessionSummary } from '../../../shared/lib/caloriesBurned'

export const DEFAULT_BODY_WEIGHT_KG = 70

interface SessionLog {
  weight?: number | string | null
  reps?: number | string | null
}

interface SessionRow {
  started_at: string
  finished_at?: string | null
  workout_plans?: { name?: string }[] | { name?: string } | null
  session_logs?: SessionLog[]
}

export function getSessionPlanName(s: SessionRow): string {
  const plans = s.workout_plans
  if (Array.isArray(plans)) return plans[0]?.name || 'Antrenament'
  return plans?.name || 'Antrenament'
}

export function buildSessionSummary(s: SessionRow): SessionSummary {
  const start = new Date(s.started_at).getTime()
  const end = s.finished_at ? new Date(s.finished_at).getTime() : start + 60 * 60 * 1000
  const durationMinutes = Math.max((end - start) / 60000, 1)
  const totalVolume = (s.session_logs ?? []).reduce((sum, log) => {
    return sum + (Number(log.weight) || 0) * (Number(log.reps) || 0)
  }, 0)
  return { durationMinutes, totalVolume }
}
