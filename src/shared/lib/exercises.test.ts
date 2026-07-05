import { describe, it, expect } from 'vitest'
import { calculate1RM } from './exercises'

describe('calculate1RM', () => {
  it('returns weight directly for 1 rep', () => {
    expect(calculate1RM(100, 1)).toBe(100)
  })

  it('calculates correctly for 10 reps', () => {
    // 100 * (1 + 10/30) = 100 * 1.333... = 133
    expect(calculate1RM(100, 10)).toBe(133)
  })

  it('calculates correctly for 5 reps', () => {
    // 80 * (1 + 5/30) = 80 * 1.1666... = 93
    expect(calculate1RM(80, 5)).toBe(93)
  })

  it('returns 0 for 0 weight', () => {
    expect(calculate1RM(0, 10)).toBe(0)
  })
})
