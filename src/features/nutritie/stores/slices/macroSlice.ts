import type { StateCreator } from 'zustand'
import { selectGramValues, selectPctGrams } from '../selectors'
import type { FullStore, MacroSlice } from '../types'

// macroSlice — gestionează split-ul de macronutrienți (proteine/carbohidrați/grăsimi).
// Suportă două moduri: procente (mode implicit) și grame (gramMode).
export const createMacroSlice: StateCreator<FullStore, [], [], MacroSlice> = (set, get) => ({
  protein: 25,  // procent proteine implicit
  carbs:   45,  // procent carbohidrați implicit
  fat:     30,  // procent grăsimi implicit (suma = 100)
  macroSaved: false,  // flag temporar — afișează badge-ul "Salvat" timp de 2.5s

  // gramMode persistat în localStorage — utilizatorul rămâne în modul ales între sesiuni
  gramMode: localStorage.getItem('nutrition_macro_gram_mode') === 'true',
  gramP: '',  // grame proteine (string gol = necompletat)
  gramC: '',  // grame carbohidrați
  gramF: '',  // grame grăsimi

  setProtein: (v) => set({ protein: v }),
  setCarbs:   (v) => set({ carbs: v }),
  setFat:     (v) => set({ fat: v }),
  setGramP:   (v) => set({ gramP: v }),
  setGramC:   (v) => set({ gramC: v }),
  setGramF:   (v) => set({ gramF: v }),

  // switchToGrams — calculează gramele echivalente pentru procentele curente
  // (folosind targetKcal) și pre-completează input-urile, apoi activează gramMode.
  switchToGrams() {
    const { pG, cG, fG } = selectPctGrams(get())  // grame calculate din % curente × targetKcal
    set({ gramP: String(pG), gramC: String(cG), gramF: String(fG), gramMode: true })
    localStorage.setItem('nutrition_macro_gram_mode', 'true')
  },

  // switchToPct — convertește gramele introduse înapoi în procente și dezactivează gramMode.
  // Dacă gramele introduse sunt valide, actualizează protein/carbs/fat %.
  switchToPct() {
    const { gramPPct, gramCPct, gramFPct, gramValid } = selectGramValues(get())
    if (gramValid) set({ protein: gramPPct, carbs: gramCPct, fat: gramFPct })
    set({ gramMode: false })
    localStorage.removeItem('nutrition_macro_gram_mode')
  },

  // saveMacro — salvează split-ul macro în DB, cu logică diferită pentru cele două moduri:
  // - gramMode: convertește gramele → % și salvează și caloriile totale ca manual override
  // - % mode: salvează direct procentele (trebuie să sumeze exact 100)
  async saveMacro() {
    const s = get()
    if (!s._fns) return
    const { gramPPct, gramCPct, gramFPct, gramKcal, gramValid } = selectGramValues(s)
    if (s.gramMode) {
      if (!gramValid) return  // nu salva dacă toate câmpurile sunt goale
      await s._fns.setCustomMacroSplit(gramPPct, gramCPct, gramFPct)
      await s._fns.setManualCalories(gramKcal)  // gramele definesc implicit și caloriile totale
      set({ manualMode: true, manualKcal: String(gramKcal) })
    } else {
      if (s.protein + s.carbs + s.fat !== 100) return  // UI previne asta, dar check de siguranță
      await s._fns.setCustomMacroSplit(s.protein, s.carbs, s.fat)
    }
    set({ macroSaved: true })
    setTimeout(() => set({ macroSaved: false }), 2500)
  },
})
