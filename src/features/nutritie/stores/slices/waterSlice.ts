import type { StateCreator } from 'zustand'
import type { FullStore, WaterSlice } from '../types'

// waterSlice — complet independent de celelalte slice-uri.
// Targetul de apă e persistat în localStorage (nu în Supabase) — e o preferință locală.
export const createWaterSlice: StateCreator<FullStore, [], [], WaterSlice> = (set, get) => ({
  // Citim valoarea salvată la inițializare; dacă nu există, 2000 ml (2L) ca default
  waterTarget: Number(localStorage.getItem('water_target_ml') || 2000),
  waterSaved: false,  // flag temporar — afișează badge-ul "Salvat" timp de 2.5s

  setWaterTarget: (v) => set({ waterTarget: v }),

  // saveWater — persistă în localStorage și afișează confirmarea vizuală
  saveWater() {
    localStorage.setItem('water_target_ml', String(get().waterTarget))
    set({ waterSaved: true })
    setTimeout(() => set({ waterSaved: false }), 2500)
  },
})
