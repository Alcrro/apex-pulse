import { describe, it, expect } from 'vitest'
import { getTotalMins, formatTotalTime, getWeeklyCount } from './statsUtils'

describe('getTotalMins', () => {
  it('returns 0 with no sessions', () => {
    expect(getTotalMins([])).toBe(0)
  })

  it('skips sessions without finished_at', () => {
    const sessions = [{ started_at: '2024-01-01T10:00:00Z', finished_at: null }]
    expect(getTotalMins(sessions)).toBe(0)
  })

  it('sums durations correctly', () => {
    const sessions = [
      { started_at: '2024-01-01T10:00:00Z', finished_at: '2024-01-01T10:30:00Z' },
      { started_at: '2024-01-02T10:00:00Z', finished_at: '2024-01-02T11:00:00Z' },
    ]
    expect(getTotalMins(sessions)).toBe(90)
  })
})

describe('formatTotalTime', () => {
  it('shows minutes for under 60', () => {
    expect(formatTotalTime(45)).toBe('45m')
  })

  it('shows hours for 60+', () => {
    expect(formatTotalTime(60)).toBe('1h')
    expect(formatTotalTime(120)).toBe('2h')
    expect(formatTotalTime(90)).toBe('1h')
  })

  it('returns 0m for zero', () => {
    expect(formatTotalTime(0)).toBe('0m')
  })
})

describe('getWeeklyCount', () => {
  it('returns 0 for empty list', () => {
    expect(getWeeklyCount([])).toBe(0)
  })

  it('counts sessions from this week', () => {
    const now = new Date().toISOString()
    const old = '2020-01-01T10:00:00Z'
    const sessions = [{ started_at: now }, { started_at: now }, { started_at: old }]
    expect(getWeeklyCount(sessions)).toBe(2)
  })
})
