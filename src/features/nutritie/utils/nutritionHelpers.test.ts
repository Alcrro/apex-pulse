import { describe, it, expect } from 'vitest'
import {
  computeMacroTargets,
  formatDate,
  addDays,
  calcNutrients,
  getMealLabel,
  displayDate,
} from './nutritionHelpers'

describe('getMealLabel', () => {
  it('formats meal label correctly', () => {
    expect(getMealLabel('masa_1')).toBe('Masa 1')
    expect(getMealLabel('masa_3')).toBe('Masa 3')
  })
})

describe('formatDate', () => {
  it('returns ISO date string', () => {
    const d = new Date('2024-03-15T12:00:00Z')
    expect(formatDate(d)).toBe('2024-03-15')
  })
})

describe('addDays', () => {
  it('adds positive days', () => {
    expect(addDays('2024-01-01', 3)).toBe('2024-01-04')
  })

  it('subtracts negative days', () => {
    expect(addDays('2024-01-10', -5)).toBe('2024-01-05')
  })

  it('handles month boundaries', () => {
    expect(addDays('2024-01-31', 1)).toBe('2024-02-01')
  })
})

describe('computeMacroTargets', () => {
  it('calculates protein correctly (4 kcal/g)', () => {
    const result = computeMacroTargets(2000, { protein: 25, carbs: 50, fat: 25 })
    // 2000 * 0.25 / 4 = 125
    expect(result.proteinG).toBe(125)
  })

  it('calculates carbs correctly (4 kcal/g)', () => {
    const result = computeMacroTargets(2000, { protein: 25, carbs: 50, fat: 25 })
    // 2000 * 0.50 / 4 = 250
    expect(result.carbsG).toBe(250)
  })

  it('calculates fat correctly (9 kcal/g)', () => {
    const result = computeMacroTargets(2000, { protein: 25, carbs: 50, fat: 25 })
    // 2000 * 0.25 / 9 = 55.5 → 56
    expect(result.fatG).toBe(56)
  })

  it('all macros sum to approximately target calories', () => {
    const result = computeMacroTargets(2000, { protein: 30, carbs: 40, fat: 30 })
    const totalKcal = result.proteinG * 4 + result.carbsG * 4 + result.fatG * 9
    expect(totalKcal).toBeCloseTo(2000, -1)
  })
})

describe('calcNutrients', () => {
  it('scales calories by grams', () => {
    const food = { caloriesPerG: 2, proteinG: 0.2, carbsG: 0.3, fatG: 0.1, fdcId: '1', name: 'test' } as any
    const result = calcNutrients(food, 100)
    expect(result.calories).toBe(200)
  })

  it('rounds protein to 1 decimal', () => {
    const food = { caloriesPerG: 1, proteinG: 0.215, carbsG: 0, fatG: 0, fdcId: '1', name: 'test' } as any
    const result = calcNutrients(food, 100)
    expect(result.proteinG).toBe(21.5)
  })
})

describe('displayDate', () => {
  it('returns Azi for today', () => {
    const today = formatDate(new Date())
    expect(displayDate(today)).toBe('Azi')
  })

  it('returns Ieri for yesterday', () => {
    const yesterday = addDays(formatDate(new Date()), -1)
    expect(displayDate(yesterday)).toBe('Ieri')
  })
})
