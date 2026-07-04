type Intensity = 'low' | 'moderate' | 'high' | 'very_high'

const MET_VALUES: Record<Intensity, number> = {
  low: 3.0,
  moderate: 5.0,
  high: 7.0,
  very_high: 10.0,
}

export interface SessionSummary {
  durationMinutes: number
  totalVolume: number
}

export function estimateIntensity(totalVolume: number, maxHistoricalVolume: number): Intensity {
  if (maxHistoricalVolume <= 0) return 'moderate'
  const ratio = totalVolume / maxHistoricalVolume
  if (ratio < 0.25) return 'low'
  if (ratio < 0.5) return 'moderate'
  if (ratio < 0.75) return 'high'
  return 'very_high'
}

export function estimateCaloriesBurned(sessions: SessionSummary[], bodyWeightKg: number): number {
  if (sessions.length === 0) return 0
  const volumes = sessions.map((s) => s.totalVolume)
  const maxVol = Math.max(...volumes)
  return Math.round(
    sessions.reduce((total, s) => {
      const intensity = estimateIntensity(s.totalVolume, maxVol)
      const met = MET_VALUES[intensity]
      return total + met * bodyWeightKg * (s.durationMinutes / 60)
    }, 0),
  )
}
