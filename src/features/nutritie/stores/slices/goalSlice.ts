import type { StateCreator } from 'zustand'
import { GOAL_MACRO_SPLIT } from '../../utils/nutritionHelpers'
import type { FullStore, GoalSlice } from '../types'

// goalSlice — gestionează obiectivul caloric al utilizatorului (slăbit / menținut / masă)
// și modul manual de calorii. Salvarea se face prin _fns injectat de externalSlice.
export const createGoalSlice: StateCreator<FullStore, [], [], GoalSlice> = (set, get) => ({
  pendingGoal: null,   // goal selectat în UI dar nesalvat încă în DB
  activeGoal: null,    // goal activ în DB (sincronizat via syncExternal)
  goalSaved: false,    // flag temporar — afișează badge-ul "Salvat" timp de 2.5s
  manualMode: false,   // true = utilizatorul a setat calorii manual, ignorând goal-ul
  manualKcal: '2000',  // valoarea input-ului de calorii manuale (string pentru input controlat)

  // setPendingGoal — selectează un goal nou și aplică imediat split-ul macro recomandat
  // (ex: slăbit → mai multe proteine, mai puțini carbohidrați). Nu salvează în DB.
  setPendingGoal(g) {
    const s = GOAL_MACRO_SPLIT[g]  // { protein, carbs, fat } recomandate pentru goal-ul respectiv
    set({ pendingGoal: g, activeGoal: g, protein: s.protein, carbs: s.carbs, fat: s.fat })
  },

  setManualMode: (v) => set({ manualMode: v }),
  setManualKcal: (v) => set({ manualKcal: v }),

  // saveGoal — salvează goal-ul activ în DB via Supabase.
  // Trimite și tdee-ul curent pentru ca backend-ul să calculeze targetCalories.
  async saveGoal() {
    const { activeGoal, tdee, _fns } = get()
    if (!activeGoal || !_fns) return
    await _fns.setGoalType(activeGoal, tdee)
    set({ pendingGoal: null, goalSaved: true })
    setTimeout(() => set({ goalSaved: false }), 2500)  // ascunde badge-ul după 2.5s
  },

  // saveManual — salvează caloriile manuale în DB. Validează că sunt între 800-10000 kcal.
  async saveManual() {
    const { manualKcal, _fns } = get()
    const kcal = parseInt(manualKcal, 10)
    if (!kcal || kcal < 800 || kcal > 10000 || !_fns) return
    await _fns.setManualCalories(kcal)
  },
})
