import type { GoalType, NutritionGoals } from '../../../shared/types'

// Funcțiile Supabase injectate din page în store la fiecare sync
export type SupabaseFns = {
  setGoalType: (goal: GoalType, tdee: number) => Promise<void>
  setManualCalories: (kcal: number) => Promise<void>
  setCustomMacroSplit: (p: number, c: number, f: number) => Promise<void>
}

// Date externe — vin din useNutritionTarget(), nu sunt editate direct de utilizator
export interface ExternalSlice {
  loading: boolean
  avgCalories: number | null  // media caloriilor din ultimele 14 zile (TDEE real)
  tdee: number                // fallback dacă avgCalories e null
  _fns: SupabaseFns | null    // prefix _ = intern, nu se folosește în componente
  syncExternal: (goals: NutritionGoals | null, avgCalories: number | null, loading: boolean, fns: SupabaseFns) => void
}

// Secțiunea 1 — obiectiv caloric și calorii manuale
export interface GoalSlice {
  pendingGoal: GoalType | null  // goal selectat dar nesalvat încă
  activeGoal: GoalType | null   // goal activ în DB
  goalSaved: boolean            // arată badge-ul "Salvat" timp de 2.5s
  manualMode: boolean           // toggle "calorii manuale"
  manualKcal: string            // valoarea input-ului manual (string pentru input controlat)
  setPendingGoal: (g: GoalType) => void
  setManualMode: (v: boolean) => void
  setManualKcal: (v: string) => void
  saveGoal: () => Promise<void>
  saveManual: () => Promise<void>
}

// Secțiunea 2 — split macronutrienți (mod % și mod grame)
export interface MacroSlice {
  protein: number   // procent proteine (0-100)
  carbs: number     // procent carbohidrați (0-100)
  fat: number       // procent grăsimi (0-100)
  macroSaved: boolean
  gramMode: boolean // true = utilizatorul introduce grame, false = procente
  gramP: string     // input grame proteine (string pentru input controlat)
  gramC: string
  gramF: string
  setProtein: (v: number) => void
  setCarbs: (v: number) => void
  setFat: (v: number) => void
  setGramP: (v: string) => void
  setGramC: (v: string) => void
  setGramF: (v: string) => void
  switchToGrams: () => void  // convertește % curente → grame și activează gramMode
  switchToPct: () => void    // convertește gramele introduse → % și dezactivează gramMode
  saveMacro: () => Promise<void>
}

// Secțiunea 3 — target hidratare (complet independent de celelalte secțiuni)
export interface WaterSlice {
  waterTarget: number   // ml/zi, persistat în localStorage
  waterSaved: boolean
  setWaterTarget: (v: number) => void
  saveWater: () => void
}

// Tipul complet al store-ului — combinația tuturor slice-urilor
// Fiecare slice primește FullStore ca tip generic pentru a putea accesa state-ul celorlalte slice-uri via get()
export type FullStore = ExternalSlice & GoalSlice & MacroSlice & WaterSlice
