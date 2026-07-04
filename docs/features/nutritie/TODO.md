# TODO — Nutriție

## Frontend

### Pagini

- [ ] `src/features/nutritie/pages/NutritiePage.tsx`
  - [ ] Faza discovery (goal_type NULL): `CalorieProfileCard` + macro absolute + `WaterTracker` + `MealCard` × 4
  - [ ] Faza cu target: `CalorieRing` + `MacroProgressBars` + `WaterTracker` + `WorkoutCaloriesBar` + `MealCard` × 4
  - [ ] Navigator dată ← → (disable buton → dacă azi)
  - [ ] `CalorieWarning` dacă < 70% sau > 120% din target
  - [ ] `OnboardingCaloric` modal la ≥ 7 zile date (o singură dată)

- [ ] `src/features/nutritie/pages/NutritieTargetPage.tsx`
  - [ ] `TDEEStatusCard`: TDEE estimat + interval date folosite + `TDEEWarning` dacă instabil
  - [ ] `GoalSelector`: 4 opțiuni cu split macro aferent vizibil
  - [ ] Editare manuală target kcal (toggle `is_manual_override`)
  - [ ] Editare manuală split macro P/C/G (validat să sumeze 100%)
  - [ ] Buton „Recalculează TDEE" (refetch ultimele 14 zile)

- [ ] `src/features/nutritie/pages/AlimentDetailPage.tsx`
  - [ ] Header: imagine + nume + brand + badge sursă date
  - [ ] `MacroDonut` + grame per porție selectată
  - [ ] Tab-uri: Macro | Micro | Aminoacizi
  - [ ] Tab Micro: `NutrientTable` (vitamine + minerale cu % DZR)
  - [ ] Tab Aminoacizi: `AminoAcidList` (esențiali / non-esențiali)
  - [ ] Fallback „Date indisponibile" dacă JSONB gol

- [ ] `src/features/nutritie/pages/CustomAlimentPage.tsx`
  - [ ] `CustomFoodForm`: câmpuri obligatorii (nume, kcal/100g, P/C/G) + opționale (sodium, fibre, imagine URL)
  - [ ] Selector `available_units`: adaugă unități custom (ex: „felie = 30g")
  - [ ] Validare client-side + submit → `useCustomFood`

### Componente

- [ ] `CalorieRing.tsx` — SVG animat, prop `netCalories = consumed - burned`, prop `target`; centrat arată calorii rămase
- [ ] `MacroProgressBars.tsx` — P/C/G cu grame + % față de target per macro; culori: P=albastru, C=galben, G=roșu
- [ ] `MealCard.tsx`
  - [ ] Header cu total kcal al mesei + titlu (Mic dejun / Prânz / Cină / Gustări)
  - [ ] Lista `FoodEntryRow` (doar entries cu `deleted_at IS NULL`)
  - [ ] Shortcut-uri: top 5 alimente frecvente ca butoane rapide
  - [ ] Butoane: `+` (deschide `FoodSearchModal`) + `Copiază din altă zi` (deschide `MealCopyPicker`)
  - [ ] Empty state cu mesaj dacă nicio intrare
- [ ] `FoodEntryRow.tsx` — thumbnail (fallback `Salad` Lucide), nume, cantitate + unitate, kcal; buton soft-delete (X)
- [ ] `FoodSearchModal.tsx`
  - [ ] Tab-uri: Căutare | Frecvente | Recent
  - [ ] Input autofocused cu debounce 400ms
  - [ ] Lista `FoodSearchResult` cu skeleton loading
  - [ ] La tap rezultat: ecran confirmare cu `UnitSelector` + cantitate + preview kcal recalculat live
  - [ ] Buton „Adaugă aliment nou" dacă 0 rezultate → navighează la `CustomAlimentPage`
- [ ] `FoodSearchResult.tsx` — thumbnail + nume + kcal/100g + badge-uri P/C/G; skeleton state
- [ ] `UnitSelector.tsx` — dropdown: grame / pounds / ml / bucată; afișează unitățile disponibile per aliment; conversie automată la grame în background
- [ ] `MacroBadge.tsx` — badge colorat mic cu tip + valoare
- [ ] `NutrientTable.tsx` — tabel nutrient / valoare / % DZR; marchează lipsă cu „—"; grupat pe categorii
- [ ] `AminoAcidList.tsx` — două secțiuni: Esențiali / Non-esențiali; mini-bară proporțională față de DZR
- [ ] `MacroDonut.tsx` — Recharts PieChart cu legendă grame; culori consistente cu `MacroBadge`
- [ ] `WaterTracker.tsx` — bară progres (ml / target_ml); butoane +250ml +500ml; input manual; target editabil inline
- [ ] `WorkoutCaloriesBar.tsx` — afișează sesiunile din ziua curentă + kcal estimate; disclaimer „estimare"
- [ ] `CalorieWarning.tsx` — card non-blocant: galben (< 70% target) sau portocaliu (> 120% target); mesaj empatic
- [ ] `TDEEWarning.tsx` — card galben: avertizare variație greutate neuniformă; apare când `nutrition_goals.tdee_warning = TRUE`
- [ ] `CalorieProfileCard.tsx` — card faza discovery: medie zilnică kcal ultimele N zile; trend săptămânal
- [ ] `OnboardingCaloric.tsx` — modal 3 pași: situație actuală → alegere obiectiv (`GoalSelector`) → confirmare target
- [ ] `GoalSelector.tsx` — 4 carduri selectabile; fiecare afișează: offset kcal + split macro implicit (P/C/G %)
- [ ] `MealCopyPicker.tsx` — calendar 30 zile (zilele cu date marcate); la selecție afișează preview entries; dacă aceeași masă în zile consecutive → „Copiezi toate? (3 zile)"
- [ ] `CustomFoodForm.tsx` — formular cu validare; câmpuri opționale collapsibile; adăugare unitate custom
- [ ] `DayCalorieBar.tsx` — bară verticală pentru istoricul săptămânal; roșie dacă depășit target, verde dacă sub

### Hooks

- [ ] `useNutritionLog.ts`
  - [ ] Fetch `nutrition_logs` + `meal_entries` (cu food_cache join) pentru ziua selectată
  - [ ] `addFoodEntry(fdcId, quantity, unit, gramsEquivalent, mealType)` — upsert log dacă nu există, insert entry, optimistic UI
  - [ ] `removeFoodEntry(entryId)` — soft delete (update `deleted_at`), optimistic UI
  - [ ] `navigateDay(±1)` — schimbă data, refetch
  - [ ] Fetch `sessions` zilei curente → `useWorkoutCalories` → salvează în `nutrition_logs.calories_burned`

- [ ] `useFoodSearch.ts`
  - [ ] Search full-text Supabase `food_cache` (bilingv: query original + traducere din dicționar)
  - [ ] Fallback USDA API dacă < 5 rezultate; parse răspuns → structură internă; upsert în cache
  - [ ] Fallback Open Food Facts doar pentru `image_url`
  - [ ] Expune: `results`, `isLoading`, `isError`, `search(query)`

- [ ] `useFoodDetail.ts`
  - [ ] Fetch `food_cache` după `fdcId`
  - [ ] Dacă micro JSONB goale → re-fetch USDA `GET /food/{fdcId}` → parse + update cache
  - [ ] Expune: `food`, `isLoading`

- [ ] `useFrequentFoods.ts`
  - [ ] Fetch top 5 din `food_frequency` JOIN `food_cache` pentru user curent
  - [ ] Expune: `foods`, `isLoading`

- [ ] `useRecentFoods.ts`
  - [ ] Fetch ultimele 10 `fdc_id` distincte din `meal_entries` ORDER BY `added_at DESC`
  - [ ] JOIN cu `food_cache` pentru detalii
  - [ ] Expune: `foods`, `isLoading`

- [ ] `useMealCopy.ts`
  - [ ] Fetch `meal_entries` pentru o zi anterioară filtrată pe `meal_type`
  - [ ] `copyEntries(sourceDate, mealType, targetDate)` — insert batch în ziua curentă
  - [ ] Detectare „zile consecutive cu aceeași masă" pentru sugestia de copiere multiplă
  - [ ] Expune: `fetchDayEntries(date, mealType)`, `copyEntries(...)`, `isLoading`

- [ ] `useWaterLog.ts`
  - [ ] Fetch `water_ml` + `water_target_ml` din `nutrition_logs` pentru ziua curentă
  - [ ] `addWater(ml)` — update `water_ml += ml`, optimistic
  - [ ] `setTarget(ml)` — update `water_target_ml`
  - [ ] Expune: `waterMl`, `targetMl`, `addWater`, `setTarget`

- [ ] `useNutritionTarget.ts`
  - [ ] Fetch `nutrition_goals` (NULL goal_type = faza discovery)
  - [ ] Calcul profil discovery: `avg(total_calories)` ultimele N zile disponibile
  - [ ] Trigger onboarding: returnează `shouldShowOnboarding: true` dacă ≥ 7 zile date și `goal_type IS NULL`
  - [ ] Calcul TDEE adaptiv (după ce user are și body_weight data): formula medie 14 zile
  - [ ] Detectare instabilitate: variație greutate > 1.5kg în 7 zile → `tdee_warning = TRUE`
  - [ ] `setGoalType(type)` → calculează `target_calories = TDEE + offset` + split macro per goal
  - [ ] `setManualCalories(kcal)` → `is_manual_override = TRUE`
  - [ ] `updateMacroPct(protein, carbs, fat)` → validează sumă = 100
  - [ ] Expune: `phase ('discovery' | 'active')`, `profile`, `targetCalories`, `macroTargets`, `shouldShowOnboarding`

- [ ] `useWeeklyCalories.ts`
  - [ ] Fetch `nutrition_logs` ultimele 7 zile: `total_calories`, `calories_burned`, `target_calories`
  - [ ] Returnează `{ date, consumed, burned, target, net }[]`

- [ ] `useWorkoutCalories.ts`
  - [ ] Fetch `sessions` cu `session_logs` pentru o dată dată (user curent)
  - [ ] Calculează calorii arse per sesiune via `caloriesBurned.ts` (MET × greutate × ore)
  - [ ] Expune: `sessions[]` cu `estimatedCalories`, `totalBurned`

- [ ] `useCustomFood.ts`
  - [ ] `createCustomFood(data)` → insert în `food_cache` cu `data_source = 'custom'`, `user_id = auth.uid()`
  - [ ] `updateCustomFood(fdcId, data)` → update dacă `user_id = auth.uid()`
  - [ ] ID generat local: `custom_${userId.slice(0,8)}_${Date.now()}`

### Utilitare noi

- [ ] `src/features/nutritie/utils/searchTranslations.ts` — `Record<string, string>` cu ~150 termeni RO → EN
- [ ] `src/shared/lib/caloriesBurned.ts` — funcție `estimateCaloriesBurned(sessions, bodyWeightKg)` cu MET values

### Routing

- [ ] Adaugă în `src/App.tsx` (în blocul PrivateRoute):
  - `/nutritie` → `<NutritiePage />`
  - `/nutritie/target` → `<NutritieTargetPage />`
  - `/nutritie/aliment/:fdcId` → `<AlimentDetailPage />`
  - `/nutritie/aliment/custom/nou` → `<CustomAlimentPage />`

### Navigare

- [ ] `src/shared/components/organisms/layout/BottomNav.tsx`:
  - [ ] Adaugă item `Nutriție` cu iconiță `UtensilsCrossed` (Lucide), path `/nutritie`
  - [ ] Verifică spacing cu 5 itemi pe ecrane < 360px (reduci label-uri sau ascunzi text pe xs)

### Shared types

- [ ] `src/shared/types/index.ts` — adaugă:
  - `MealType`, `GoalType`, `NutritionPhase`
  - `FoodItem`, `MealEntry`, `NutritionLog`, `NutritionGoals`
  - `FoodFrequency`, `WaterLog`, `WorkoutCaloriesResult`

### UX / Edge cases

- [ ] Loading skeletons: `FoodSearchResult`, `MealCard`, `CalorieRing`
- [ ] Empty state masă: „Niciun aliment adăugat. Apasă + pentru a adăuga." + shortcut-uri frecvente vizibile
- [ ] Empty state search: „Niciun aliment găsit" + buton „Adaugă aliment nou"
- [ ] Error USDA API: mesaj „Căutarea externă nu este disponibilă. Afișăm rezultatele locale."
- [ ] Aliment fără imagine: placeholder `Salad` Lucide în `FoodEntryRow` și `FoodSearchResult`
- [ ] Aliment fără micro: tab Micro afișat cu „Date indisponibile pentru acest aliment" (nu ascuns)
- [ ] Gramaj/cantitate 0 sau negativ: buton „Adaugă" disabled în `FoodSearchModal`
- [ ] Navigator dată: butonul → disabled dacă ziua curentă e azi
- [ ] `OnboardingCaloric` apare o singură dată (persist `onboarding_triggered_at`)
- [ ] Copiere masă în ziua curentă care deja are entries: append, nu înlocui
- [ ] Warning calories: non-blocant, dismissible per sesiune (nu permanent)

### Mobile / responsive

- [ ] `CalorieRing` dimensiune fluidă (% din viewport width, nu px fix)
- [ ] `FoodSearchModal` full-screen pe mobile, `max-w-lg centered` pe desktop
- [ ] `FoodEntryRow` touch target minim 44px pentru butonul de delete
- [ ] `NutrientTable` scroll orizontal pe ecrane < 360px
- [ ] BottomNav 5 itemi: testează pe iPhone SE (375px) și Galaxy A (360px)
- [ ] `MealCopyPicker` calendar: grid responsive, touch-friendly

## Backend (Supabase)

- [ ] Migrare schema (vezi `DATABASE.md` pentru SQL exact):
  - [ ] `food_cache` (cu primary key compozit)
  - [ ] `nutrition_logs` (cu `water_ml`, `calories_burned`, `deleted_at`)
  - [ ] `meal_entries` (cu `quantity`, `unit`, `grams_equivalent`, `deleted_at`)
  - [ ] `nutrition_goals` (cu `goal_type` nullable, `tdee_warning`, `onboarding_triggered_at`)
  - [ ] `food_frequency`
- [ ] RLS policies aplicate și testate (checklist în `DATABASE.md`)
- [ ] Trigger `trg_update_nutrition_log_totals` (prinde INSERT + UPDATE + DELETE)
- [ ] Trigger `trg_update_food_frequency`
- [ ] Funcție `upsert_nutrition_log` cu SECURITY DEFINER
- [ ] Indexuri aplicate (full-text bilingv, partial indexes cu `WHERE deleted_at IS NULL`)
- [ ] Seed ~200 alimente românești (`data_source = 'manual_ro'`)
- [ ] `VITE_USDA_API_KEY` în `.env` și Vercel environment variables

## Progres general

- [ ] PRD aprobat
- [ ] Tech spec finalizat
- [ ] Schema DB migrată și testată
- [ ] RLS policies verificate (inclusiv custom foods)
- [ ] Seed alimente românești importat
- [ ] Utilitare (`searchTranslations.ts`, `caloriesBurned.ts`) implementate
- [ ] Hooks implementate și testate cu date reale
- [ ] Componente UI implementate
- [ ] Pagini asamblate
- [ ] Flow onboarding caloric testat end-to-end
- [ ] Funcție copiere mese testată
- [ ] Integrare calorii arse din antrenamente testată
- [ ] BottomNav actualizat și testat 5 itemi
- [ ] Build fără erori (`npm run build`)
- [ ] Testat pe mobile (iOS Safari + Android Chrome)
- [ ] Deploy pe Vercel
