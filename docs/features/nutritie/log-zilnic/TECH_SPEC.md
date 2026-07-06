# Tech Spec — Nutriție / Log Zilnic

## Arhitectură generală

Pagina `src/features/nutritie/pages/NutritiePage.tsx` (ruta `/nutritie`). Combină `useNutritionLog` (fetch + CRUD entries + navigare date) cu `useNutritionTarget` (phase + target caloric). Compune componentele vizuale în funcție de `phase`: `'discovery'` sau `'active'`.

```
NutritiePage
  ├── useNutritionLog  — entries pe ziua selectată, CRUD, water, navigare
  ├── useNutritionTarget — phase, target, macros
  ├── useWeeklyCalories — 7 zile pentru WeekStrip + DayCalorieBar
  └── useWorkoutCalories — sesiuni zilei + kcal arse estimate

  Render faza discovery:
    CalorieProfileCard + MacroProgressBars (absolute) + WaterTracker + MealCard×4

  Render faza activă:
    CalorieRing + MacroProgressBars (față de target) + WaterTracker
    + WorkoutCaloriesBar + MealCard×4 + CalorieWarning?
```

## Rute noi / modificate

| Rută | Tip | Pagină |
|------|-----|--------|
| `/nutritie` | protected | `NutritiePage` |

## Componente noi

| Componentă | Locație | Responsabilitate |
|-----------|---------|-----------------|
| `CalorieRing` | `features/nutritie/components/` | SVG animat: consumate / target net (după calorii arse); centrat afișează kcal rămase |
| `MacroProgressBars` | `features/nutritie/components/` | Bare P/C/G; faza discovery = grame absolute; faza activă = % față de target |
| `MealCard` | `features/nutritie/components/` | Card masă: header cu total kcal, lista entries, shortcut-uri frecvente, butoane + și copiere |
| `FoodEntryRow` | `features/nutritie/components/` | Rând entry: thumbnail, nume, gramaj+unitate, kcal, buton soft-delete |
| `WaterTracker` | `features/nutritie/components/` | Bară progres ml/target; butoane +250ml, +500ml; input manual; target editabil inline |
| `WorkoutCaloriesBar` | `features/nutritie/components/` | Sesiunile zilei + kcal estimate; disclaimer „estimare" permanent vizibil |
| `CalorieWarning` | `features/nutritie/components/` | Card non-blocant: galben (<70% target) sau portocaliu (>120%); dismissible per sesiune |
| `CalorieProfileCard` | `features/nutritie/components/` | Faza discovery: medie zilnică kcal ultimele N zile; trend săptămânal |
| `WeekStrip` | `features/nutritie/components/` | 7 zile orizontal; click = navighează; azi = accent; zilele cu date = punct indicator |
| `DayCalorieBar` | `features/nutritie/components/` | Bară verticală în WeekStrip: verde (sub target) / roșie (depășit) |
| `MealCopyPicker` | `features/nutritie/components/` | Calendar 30 zile pentru copiere masă; zile cu date marcate; sugestie copiere multiple zile |
| `MacroCircles` | `features/nutritie/components/` | Cercuri mici P/C/G cu valori absolute și culori; folosit în header NutritiePage |

## Hooks noi

| Hook | Locație | Ce face |
|------|---------|---------|
| `useNutritionLog` | `features/nutritie/hooks/` | Fetch `nutrition_logs` + `meal_entries` pentru ziua selectată; `addFoodEntry`, `removeFoodEntry` (soft delete); `navigateDay(±1)`; optimistic UI |
| `useWaterLog` | `features/nutritie/hooks/` | Fetch+update `water_ml` și `water_target_ml` din `nutrition_logs` |
| `useWeeklyCalories` | `features/nutritie/hooks/` | Fetch `nutrition_logs` 7 zile: `{ date, consumed, burned, target, net }[]` |
| `useWorkoutCalories` | `features/nutritie/hooks/` | Fetch `sessions` + `session_logs` pentru ziua curentă; calculează kcal arse via `caloriesBurned.ts` |
| `useMealCopy` | `features/nutritie/hooks/` | Fetch entries dintr-o zi anterioară; `copyEntries(sourceDate, mealType, targetDate)`; detectare zile consecutive cu aceeași masă |
| `useFrequentFoods` | `features/nutritie/hooks/` | Top 5 `food_frequency JOIN food_cache` pentru shortcut-urile din MealCard |
| `useRecentFoods` | `features/nutritie/hooks/` | Ultimele 10 `fdc_id` distincte din `meal_entries DESC`; JOIN food_cache |

## Schema DB

vezi DATABASE.md — tabele `nutrition_logs`, `meal_entries`, `food_frequency`

## Utilitare partajate

`src/shared/lib/caloriesBurned.ts` — estimare kcal arse:
```ts
// MET (Metabolic Equivalent of Task) × greutate (kg) × ore sesiune
// Greutatea = ultimul body_weight entry sau 70kg default
const MET = { low: 3.0, moderate: 5.0, high: 7.0, very_high: 10.0 }
// Intensitatea determinată din volum sesiune (seturi × reps × greutate), normalizat față de istoricul userului
```

## Decizii tehnice & trade-offs

**Soft delete cu `deleted_at` vs. hard delete:**
Date nutriționale accidentale șterse sunt recuperabile. Queries cu `WHERE deleted_at IS NULL` sunt performante cu index partial. Trade-off: queries ușor mai complexe.

**Faza discovery vs. activă determinată din `goal_type IS NULL`:**
Simplu și fără state local — hook-ul returnează `phase: 'discovery' | 'active'` direct din DB. Componenta nu trebuie să știe logica de decizie.

**Optimistic UI la adăugare/ștergere entry:**
UI se actualizează imediat fără a aștepta confirmarea Supabase. La eroare: revert și toast de eroare. Îmbunătățește percepția de viteză pe conexiuni mobile slabe.

**`useWorkoutCalories` citește direct din Supabase, nu importă din feature sesiuni:**
Evită coupling între feature-uri. Calculul MET e în `shared/lib` — refolosibil independent.

## Riscuri tehnice

- **Calorii arse estimate sunt orientative**: disclaimer permanent pe `WorkoutCaloriesBar`
- **Navigare dată în trecut**: entries din ziua de ieri pot fi editate — comportament intenționat, nu bug
- **`MealCopyPicker` cu zile consecutive**: logica de grupare poate produce false pozitive — acceptabil, userul confirma oricum
