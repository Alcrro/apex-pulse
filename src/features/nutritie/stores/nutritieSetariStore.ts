import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { createExternalSlice } from './slices/externalSlice'
import { createGoalSlice } from './slices/goalSlice'
import { createMacroSlice } from './slices/macroSlice'
import { createWaterSlice } from './slices/waterSlice'
import { selectGramValues, selectTargetKcal, selectPctGrams } from './selectors'
import type { FullStore } from './types'

// Re-exportăm selectoarele din acest modul — componentele importă totul de aici
export { selectGramValues, selectTargetKcal, selectPctGrams }

// Store-ul principal — combină cele 4 slice-uri într-un singur obiect Zustand.
// Fiecare slice primește (set, get, api) via spread, deci pot accesa state-ul global prin get().
export const useNutritieSetariStore = create<FullStore>()((...a) => ({
  ...createExternalSlice(...a),
  ...createGoalSlice(...a),
  ...createMacroSlice(...a),
  ...createWaterSlice(...a),
}))

// ── section hooks ─────────────────────────────────────────────────────────
// Fiecare hook expune exact câmpurile de care are nevoie o secțiune.
// useShallow previne re-render-uri inutile — componenta se re-renderizează
// doar când se schimbă unul din câmpurile selectate (comparație shallow).

// useCalorieGoalSection — pentru secțiunea de obiectiv caloric
// Include și gramMode/gramP/C/F pentru preview-ul macro din aceeași secțiune
export const useCalorieGoalSection = () => {
  const state = useNutritieSetariStore(useShallow((s) => ({
    avgCalories:    s.avgCalories,
    tdee:           s.tdee,
    activeGoal:     s.activeGoal,
    pendingGoal:    s.pendingGoal,
    goalSaved:      s.goalSaved,
    manualMode:     s.manualMode,
    manualKcal:     s.manualKcal,
    gramMode:       s.gramMode,
    gramP:          s.gramP,
    gramC:          s.gramC,
    gramF:          s.gramF,
    loading:        s.loading,
    setPendingGoal: s.setPendingGoal,
    setManualMode:  s.setManualMode,
    setManualKcal:  s.setManualKcal,
    saveGoal:       s.saveGoal,
    saveManual:     s.saveManual,
  })))
  return state
}

// useMacroSplitSection — pentru secțiunea de split macronutrienți.
// Returnează state-ul de bază + valorile calculate de selectoare (grame, kcal total, grame din %).
export const useMacroSplitSection = () => {
  const state = useNutritieSetariStore(useShallow((s) => ({
    protein:      s.protein,
    carbs:        s.carbs,
    fat:          s.fat,
    macroSaved:   s.macroSaved,
    gramMode:     s.gramMode,
    gramP:        s.gramP,
    gramC:        s.gramC,
    gramF:        s.gramF,
    setProtein:   s.setProtein,
    setCarbs:     s.setCarbs,
    setFat:       s.setFat,
    setGramP:     s.setGramP,
    setGramC:     s.setGramC,
    setGramF:     s.setGramF,
    switchToGrams: s.switchToGrams,
    switchToPct:  s.switchToPct,
    saveMacro:    s.saveMacro,
  })))
  const gramValues = useNutritieSetariStore(selectGramValues)   // { gP, gC, gF, gramKcal, gramPPct, ... }
  const targetKcal = useNutritieSetariStore(selectTargetKcal)   // număr total de calorii țintă
  const pctGrams   = useNutritieSetariStore(selectPctGrams)     // { pG, cG, fG } — grame din %
  return { ...state, ...gramValues, targetKcal, ...pctGrams }
}

// useWaterTargetSection — pentru secțiunea de hidratare (complet independentă)
export const useWaterTargetSection = () =>
  useNutritieSetariStore(useShallow((s) => ({
    waterTarget:    s.waterTarget,
    waterSaved:     s.waterSaved,
    setWaterTarget: s.setWaterTarget,
    saveWater:      s.saveWater,
  })))

// useNutritionInfoSection — pentru cardul de info/rezumat din josul paginii
export const useNutritionInfoSection = () => {
  const state = useNutritieSetariStore(useShallow((s) => ({
    avgCalories: s.avgCalories,
    protein:     s.protein,
    carbs:       s.carbs,
    fat:         s.fat,
  })))
  const pctGrams = useNutritieSetariStore(selectPctGrams)  // grame calculate din % și targetKcal
  return { ...state, ...pctGrams }
}
