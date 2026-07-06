import { GOAL_OFFSETS } from '../utils/nutritionHelpers'
import type { FullStore } from './types'

// selectGramValues — citește gramP/C/F din store (string-uri din input) și calculează:
// - gP/gC/gF: valorile numerice parsate (minim 0)
// - gramKcal: totalul de calorii din grame (proteina=4 kcal/g, carbohidrați=4 kcal/g, grăsimi=9 kcal/g)
// - gramPPct/gramCPct/gramFPct: procentele echivalente față de gramKcal total
// - gramValid: true dacă gramKcal > 0 (cel puțin un macronutrient completat)
export const selectGramValues = (s: FullStore) => {
  const gP = Math.max(0, parseInt(s.gramP) || 0)
  const gC = Math.max(0, parseInt(s.gramC) || 0)
  const gF = Math.max(0, parseInt(s.gramF) || 0)
  const gramKcal = gP * 4 + gC * 4 + gF * 9
  const gramPPct = gramKcal > 0 ? Math.round((gP * 4 / gramKcal) * 100) : 0
  const gramCPct = gramKcal > 0 ? Math.round((gC * 4 / gramKcal) * 100) : 0
  const gramFPct = gramKcal > 0 ? 100 - gramPPct - gramCPct : 0  // fat = rest, evită erori de rotunjire
  return { gP, gC, gF, gramKcal, gramPPct, gramCPct, gramFPct, gramValid: gramKcal > 0 }
}

// selectTargetKcal — determină câte calorii țintă are utilizatorul, în ordinea priorităților:
// 1. manualMode activ → valoarea introdusă manual (cu fallback la tdee dacă e invalid)
// 2. goal activ (slăbit/menținut/masă) → tdee + offset specific goalului (din GOAL_OFFSETS)
// 3. fallback → tdee brut (calculat din avgCalories sau din profil)
export const selectTargetKcal = (s: FullStore): number => {
  if (s.manualMode) return parseInt(s.manualKcal, 10) || s.tdee
  if (s.activeGoal) return s.tdee + GOAL_OFFSETS[s.activeGoal]
  return s.tdee
}

// selectPctGrams — convertește procentele macro (protein/carbs/fat %) în grame absolute,
// pe baza caloriilor țintă curente (selectTargetKcal).
// Folosit pentru a afișa "~Xg" lângă fiecare slider de procente.
// Formula: kcal × procent / 100 / kcal_per_gram
export const selectPctGrams = (s: FullStore) => {
  const kcal = selectTargetKcal(s)
  return {
    pG: Math.round((kcal * s.protein) / 100 / 4),  // grame proteine
    cG: Math.round((kcal * s.carbs) / 100 / 4),    // grame carbohidrați
    fG: Math.round((kcal * s.fat) / 100 / 9),      // grame grăsimi
  }
}
