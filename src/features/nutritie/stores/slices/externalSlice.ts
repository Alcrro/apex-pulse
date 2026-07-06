import type { StateCreator } from 'zustand'
import type { FullStore, ExternalSlice } from '../types'

// externalSlice — date care vin din afara store-ului (din useNutritionTarget hook)
// și nu sunt editate direct de utilizator. Pagina apelează syncExternal() la fiecare
// render când se schimbă goals/avgCalories/loading pentru a ține store-ul sincronizat.
export const createExternalSlice: StateCreator<FullStore, [], [], ExternalSlice> = (set, get) => ({
  loading: false,    // true cât timp se încarcă datele din Supabase
  avgCalories:  null, // media caloriilor consumate în ultimele 14 zile (TDEE real măsurat)
  tdee: 2000,        // fallback dacă avgCalories e null sau nu există date de consum
  _fns: null,        // funcțiile Supabase injectate din pagină — null până la primul sync

  // syncExternal — apelat din useEffect în NutritieSetariPage la fiecare schimbare externă.
  // Actualizează store-ul cu datele proaspete din DB, fără a suprascrie modificările
  // nesalvate ale utilizatorului (ex: slider-e mutate dar nesalvate).
  syncExternal(goals, avgCalories, loading, fns) {
    // tdee = media reală dacă există, altfel estimarea din profil, altfel 2000 kcal
    const tdee = avgCalories ?? goals?.tdeeEstimated ?? 2000
    const update: Partial<FullStore> = { loading, avgCalories, tdee, _fns: fns }

    if (goals) {
      // Sincronizează toate câmpurile din goals cu store-ul
      update.manualMode = goals.isManualOverride
      if (goals.targetCalories) update.manualKcal = String(goals.targetCalories)
      update.protein = goals.targetProteinPct
      update.carbs   = goals.targetCarbsPct
      update.fat     = goals.targetFatPct
      update.activeGoal = goals.goalType ?? null

      // Dacă utilizatorul e în gramMode, recalculează gramele din noile calorii țintă
      // (se întâmplă la prima încărcare sau când goals se schimbă din exterior)
      if (get().gramMode && goals.targetCalories) {
        const kcal = goals.targetCalories
        update.gramP = String(Math.round((kcal * goals.targetProteinPct) / 100 / 4))
        update.gramC = String(Math.round((kcal * goals.targetCarbsPct) / 100 / 4))
        update.gramF = String(Math.round((kcal * goals.targetFatPct) / 100 / 9))
      }
    }

    set(update)
  },
})
