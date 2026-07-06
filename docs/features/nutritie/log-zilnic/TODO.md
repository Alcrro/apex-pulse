# TODO — Nutriție / Log Zilnic

## Frontend

### Pagini
- [x] `src/features/nutritie/pages/NutritiePage.tsx` (ruta `/nutritie`)
  - [x] `WeekStrip` cu navigator zilnic ← →
  - [x] Faza discovery: `DiscoveryBanner` + bare macro absolute + `WaterTracker` + `MealCard` × 4
  - [x] Faza activă: `CalorieRing` + `MacroProgressBars` + `WaterTracker` + `WorkoutCaloriesBar` + `MealCard` × 4
  - [x] `CalorieWarning` la <70% sau >120% din target
  - [x] `OnboardingCaloric` modal la ≥7 zile date (o singură dată)
  - [x] Buton setări (gear) în header → navighează la `/nutritie/setari`

### Componente
- [x] `CalorieRing.tsx` — SVG animat; centrat arată kcal rămase; prop `netCalories` și `target`
- [x] `MacroProgressBars.tsx` — P/C/G cu grame + % față de target; culori P=albastru, C=galben, G=roșu
- [x] `MacroCircles.tsx` — cercuri mici P/C/G cu valori absolute; în header faza discovery
- [x] `MealCard.tsx`
  - [x] Header cu total kcal masă + titlu
  - [x] Lista `FoodEntryRow` (doar `deleted_at IS NULL`)
  - [x] Shortcut-uri frecvente (top 5) ca chips rapide
  - [x] Butoane: `+` (deschide `FoodSearchModal`) + copiere (deschide `MealCopyPicker`)
  - [x] Empty state cu mesaj
- [x] `FoodEntryRow.tsx` — thumbnail (fallback `Salad` icon), nume, cantitate+unitate, kcal; buton soft-delete
- [x] `WaterTracker.tsx` — bară progres ml/target; butoane +250ml, +500ml; input manual; target editabil inline
- [x] `WorkoutCaloriesBar.tsx` — sesiunile zilei + kcal estimate; disclaimer „estimare" permanent
- [x] `CalorieWarning.tsx` — galben (<70%) sau portocaliu (>120%); dismissible per sesiune
- [x] `CalorieProfileCard.tsx` — faza discovery: medie zilnică kcal; trend săptămânal
- [x] `WeekStrip.tsx` — 7 zile; click navighează; azi = accent orange; zile cu date = indicator punct
- [x] `DayCalorieBar.tsx` — bară verticală per zi în WeekStrip; verde/roșu față de target
- [x] `MealCopyPicker.tsx` — calendar 30 zile; zile cu date marcate; preview entries; sugestie copiere zile consecutive

### Hooks
- [x] `useNutritionLog.ts`
  - [x] Fetch `nutrition_logs` + `meal_entries` (JOIN `food_cache`) pentru ziua selectată
  - [x] `addFoodEntry(fdcId, quantity, unit, gramsEquivalent, mealType)` — upsert log + insert entry; optimistic UI
  - [x] `removeFoodEntry(entryId)` — soft delete (`updated deleted_at`); optimistic UI
  - [x] `navigateDay(±1)` — schimbă data, refetch
- [x] `useWaterLog.ts` — fetch + `addWater(ml)` + `setTarget(ml)`
- [x] `useWeeklyCalories.ts` — fetch 7 zile: `{ date, consumed, burned, target, net }[]`
- [x] `useWorkoutCalories.ts` — fetch sesiuni zilei; estimare kcal via `caloriesBurned.ts`
- [x] `useMealCopy.ts` — fetch entries zi anterioară; `copyEntries(...)`; detectare zile consecutive
- [x] `useFrequentFoods.ts` — top 5 `food_frequency JOIN food_cache`
- [x] `useRecentFoods.ts` — ultimele 10 `fdc_id` distincte din `meal_entries`

### Utilitare partajate
- [x] `src/shared/lib/caloriesBurned.ts` — `estimateCaloriesBurned(sessions, bodyWeightKg)` cu MET values

### Backend (Supabase)
- [ ] Migrare `nutrition_logs`, `meal_entries`, `food_frequency` (vezi DATABASE.md)
- [ ] Triggers: `trg_update_nutrition_log_totals`, `trg_update_food_frequency`
- [ ] Funcție `upsert_nutrition_log`
- [ ] RLS policies aplicate și testate
- [ ] Indexuri partial aplicați (`WHERE deleted_at IS NULL`)

### UX / Edge cases
- [x] Loading skeletons: `MealCard`, `FoodEntryRow`
- [x] Empty state masă: mesaj + shortcut-uri frecvente vizibile
- [x] Navigator dată: butonul → disabled dacă azi
- [x] `CalorieWarning`: dismissible per sesiune (nu persistent)
- [x] Copiere masă: append în ziua curentă, nu înlocuire
- [ ] Testare retenție dismissal warning între navigări de dată

### Mobile / responsive
- [x] `CalorieRing` dimensiune fluidă (% viewport width)
- [x] `MealCard` touch target buton delete ≥44px
- [x] `MealCopyPicker` calendar touch-friendly
- [x] `WeekStrip` scroll orizontal pe ecrane <360px

## Progres general
- [x] PRD aprobat
- [x] Tech spec finalizat
- [x] Hooks implementate și funcționale
- [x] Componente UI implementate
- [x] `NutritiePage` asamblată (ambele faze)
- [ ] Schema DB migrată
- [ ] Triggers verificate în Supabase
- [ ] Testat pe mobile (iOS Safari + Android Chrome)
- [ ] Build fără erori (`npm run build`)
