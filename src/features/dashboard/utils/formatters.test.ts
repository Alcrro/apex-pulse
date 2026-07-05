import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getDuration, getWeeklyCount, getWeekTrainingDays, getDaysSince } from './formatters'

describe('getDuration', () => {
  it('returns null when no end time', () => {
    expect(getDuration('2024-01-01T10:00:00Z', null)).toBeNull()
  })

  it('formats minutes correctly', () => {
    expect(getDuration('2024-01-01T10:00:00Z', '2024-01-01T10:45:00Z')).toBe('45 min')
  })

  it('formats hours and minutes correctly', () => {
    expect(getDuration('2024-01-01T10:00:00Z', '2024-01-01T11:30:00Z')).toBe('1h 30min')
  })
})

describe('getDaysSince', () => {
  it('returns 0 for today', () => {
    const today = new Date().toISOString()
    expect(getDaysSince(today)).toBe(0)
  })

  it('returns 1 for yesterday', () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString()
    expect(getDaysSince(yesterday)).toBe(1)
  })
})

describe('getWeeklyCount', () => {
  it('returns 0 with no sessions', () => {
    expect(getWeeklyCount([])).toBe(0)
  })

  it('counts only finished sessions this week', () => {
    const now = new Date().toISOString()
    const sessions = [
      { started_at: now, finished_at: now },
      { started_at: now, finished_at: null },
      { started_at: '2020-01-01T10:00:00Z', finished_at: '2020-01-01T11:00:00Z' },
    ]
    expect(getWeeklyCount(sessions)).toBe(1)
  })
})

describe('getWeekTrainingDays', () => {
  it('returns 7 booleans', () => {
    expect(getWeekTrainingDays([])).toHaveLength(7)
  })

  it('returns all false with no sessions', () => {
    expect(getWeekTrainingDays([])).toEqual([false, false, false, false, false, false, false])
  })

  it('marks today as true when session finished today', () => {
    const now = new Date().toISOString()
    const days = getWeekTrainingDays([{ started_at: now, finished_at: now }])
    const today = new Date()
    const idx = today.getDay() === 0 ? 6 : today.getDay() - 1
    expect(days[idx]).toBe(true)
  })
})
