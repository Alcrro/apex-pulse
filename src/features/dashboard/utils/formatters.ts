export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' })
}

export function getDuration(start: string, end: string | null): string | null {
  if (!end) return null
  const mins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000)
  if (mins < 60) return `${mins} min`
  return `${Math.floor(mins / 60)}h ${mins % 60}min`
}

export function getWeeklyCount(sessions: Array<{ started_at: string; finished_at: string | null }>): number {
  const startOfWeek = new Date()
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  return sessions.filter(s => s.finished_at && new Date(s.started_at) >= startOfWeek).length
}

export function getDaysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
}

// Returns [Mon, Tue, Wed, Thu, Fri, Sat, Sun] — true if session finished that day this week
export function getWeekTrainingDays(
  sessions: Array<{ started_at: string; finished_at: string | null }>
): boolean[] {
  const today = new Date()
  const dow = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1))
  monday.setHours(0, 0, 0, 0)

  const days = Array(7).fill(false) as boolean[]
  for (const s of sessions) {
    if (!s.finished_at) continue
    const d = new Date(s.started_at)
    if (d >= monday) {
      const idx = d.getDay() === 0 ? 6 : d.getDay() - 1
      days[idx] = true
    }
  }
  return days
}
