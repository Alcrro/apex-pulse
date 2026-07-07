import { formatDate } from './nutritionHelpers'

export const DAY_LABELS = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D']

export function getWeekDays(dateStr: string): string[] {
  const d = new Date(dateStr)
  const dow = d.getDay()
  const mondayOffset = dow === 0 ? -6 : 1 - dow
  const monday = new Date(d)
  monday.setDate(d.getDate() + mondayOffset)
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    return formatDate(day)
  })
}

export function getMondayOf(dateStr: string): string {
  const d = new Date(dateStr)
  const dow = d.getDay()
  const offset = dow === 0 ? -6 : 1 - dow
  d.setDate(d.getDate() + offset)
  return formatDate(d)
}
