# TODO — Setări / Obiectiv Caloric

## Frontend

### Componente
- [x] `GoalSelector.tsx` — 4 carduri: menținere / deficit ușor / deficit moderat / surplus
  - [x] Fiecare card: titlu + descriere scurtă + offset kcal (dreapta) + badge-uri P/C/G (stânga jos)
  - [x] Cardul selectat: border orange + fundal evidențiat
- [x] `DiscoveryBanner.tsx` — banner faza discovery cu medie kcal și CTA spre setări

### Logică în `NutritieSetariPage`
- [x] Afișare TDEE estimat: „Media caloriilor din ultimele 14 zile: X kcal"
  - [ ] Ascunde secțiunea TDEE dacă <3 zile de date; afișează mesaj explicativ
- [x] Toggle „Calorii manuale" → input numeric `target_calories`
- [x] Buton „Salvează obiectivul" cu badge „Salvat ✓"
- [x] Buton „Recalculează" când `is_manual_override = true`

### Hook (`useNutritionTarget`)
- [x] `setGoalType(type)` → calculează target + macro split implicit
- [x] `setManualCalories(kcal)` → `is_manual_override = true`
- [ ] Warning UI dacă target manual <1200 sau >5000 kcal

### UX / Edge cases
- [x] `OnboardingCaloric` modal apare o singură dată (la ≥7 zile date, `goal_type IS NULL`)
- [ ] Testare cu 0 zile de date: secțiunea TDEE hidden complet

## Progres general
- [x] `GoalSelector` implementat
- [x] Secțiunea „Obiectiv caloric" funcțională în `NutritieSetariPage`
- [ ] Edge case <3 zile date — mesaj explicativ
- [ ] Testare end-to-end cu date reale (≥7 zile)
