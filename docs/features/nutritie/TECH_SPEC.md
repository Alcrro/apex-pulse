# Tech Spec — Nutriție

## Arhitectură generală

Feature nou `src/features/nutritie/` respectând structura feature-based existentă. Nu modifică alte feature-uri, cu excepția:
- `src/App.tsx` — rute noi
- `src/shared/components/organisms/layout/BottomNav.tsx` — iconiță nouă
- `src/shared/types/index.ts` — tipuri noi

**Integrare cu feature-ul de sesiuni (calorii arse):**
`useNutritionLog` citește sesiunile de antrenament din `sessions` + `session_logs` (tabele existente) pentru ziua curentă și calculează caloriile arse pe baza intensității. Nu importă cod din feature-ul de sesiuni — accesează direct Supabase. Calculul intensitate → calorii se face într-un utilitar partajat `src/shared/lib/caloriesBurned.ts`.

## Surse de date alimentare

Nu există un API dedicat în limba română. Abordare hibridă în 3 straturi:

| Strat | Sursă | Scop | Notă |
|-------|-------|------|------|
| 1 | Supabase `food_cache` pre-populate | ~200 alimente românești tradiționale | Disponibile offline, fără API call |
| 2 | USDA FoodData Central API | Macro + micro detaliat (aminoacizi, vitamine, minerale) | Gratuit, 1000 req/oră cu API key |
| 3 | Open Food Facts API | Imagini pentru produse ambalate + fallback alimente internaționale | Gratuit, fără rate limit sever |
| 4 | Aliment custom (user-created) | Alimente negăsite în niciun strat | Stocat în `food_cache` cu `data_source = 'custom'` și `user_id` |

**Strategia de search:**
1. Full-text search în `food_cache` Supabase (Romanian + internaionale cached)
2. Dacă < 5 rezultate → fetch USDA API, cache rezultate
3. Fallback Open Food Facts pentru imagini (call separat, doar după ce am nutritional data)
4. Dacă utilizatorul nu găsește → „Adaugă aliment nou" (custom)

**Traducere Romanian → English pentru USDA:**
Dicționar local de termeni comuni (`src/features/nutritie/utils/searchTranslations.ts`): „piept de pui" → „chicken breast", „lapte" → „milk" etc. ~150 termeni. Dacă termenul nu e în dicționar, search direct în engleză.

## Rute noi / modificate

| Rută | Tip | Pagină |
|------|-----|--------|
| `/nutritie` | protected | `NutritiePage` — dashboard zilnic |
| `/nutritie/target` | protected | `NutritieTargetPage` — onboarding caloric + obiectiv |
| `/nutritie/aliment/:fdcId` | protected | `AlimentDetailPage` — detalii complete aliment |
| `/nutritie/aliment/custom/nou` | protected | `CustomAlimentPage` — formular adăugare aliment custom |

## Componente noi

| Componentă | Locație | Responsabilitate |
|-----------|---------|-----------------|
| `CalorieRing` | `features/nutritie/components/` | Inel SVG animat: consumate / target net (după calorii arse) |
| `MacroProgressBars` | `features/nutritie/components/` | Bare P/C/G cu grame + % față de target |
| `MealCard` | `features/nutritie/components/` | Card masă + lista entries + shortcut-uri frecvente + buton + + buton copiere |
| `FoodEntryRow` | `features/nutritie/components/` | Rând entry: thumbnail, nume, gramaj, kcal, soft-delete |
| `FoodSearchModal` | `features/nutritie/components/` | Modal full-screen: tab Căutare / Frecvente / Recent + confirmare gramaj |
| `FoodSearchResult` | `features/nutritie/components/` | Item în rezultate: thumbnail, nume, kcal/100g, badge P/C/G |
| `UnitSelector` | `features/nutritie/components/` | Selector unitate: grame / pounds / ml / bucată cu conversie live |
| `MacroBadge` | `features/nutritie/components/` | Badge colorat: P=albastru, C=galben, G=roșu |
| `NutrientTable` | `features/nutritie/components/` | Tabel micro-nutrienți cu % DZR |
| `AminoAcidList` | `features/nutritie/components/` | Lista aminoacizi cu bare vizuale, esențiali / non-esențiali |
| `MacroDonut` | `features/nutritie/components/` | Recharts PieChart donut split P/C/G |
| `WaterTracker` | `features/nutritie/components/` | Tracker apă: bare + butoane +250ml + input manual |
| `WorkoutCaloriesBar` | `features/nutritie/components/` | Afișează caloriile arse din sesiunile zilei |
| `CalorieWarning` | `features/nutritie/components/` | Warning non-blocant: sub-consum (galben) sau surplus (portocaliu) |
| `TDEEWarning` | `features/nutritie/components/` | Warning instabilitate calcul TDEE (retenție apă etc.) |
| `CalorieProfileCard` | `features/nutritie/components/` | Card faza fără target: „Mănânci în medie X kcal/zi" |
| `OnboardingCaloric` | `features/nutritie/components/` | Flow modal onboarding: situație actuală → alegere obiectiv |
| `GoalSelector` | `features/nutritie/components/` | 4 opțiuni obiectiv cu split macro aferent afișat |
| `MealCopyPicker` | `features/nutritie/components/` | Calendar picker 30 zile pentru copiere masă; grupare zile identice |
| `CustomFoodForm` | `features/nutritie/components/` | Formular creare aliment custom |
| `DayCalorieBar` | `features/nutritie/components/` | Bară zilnică pentru istoricul săptămânal |

## Hooks noi

| Hook | Locație | Ce face |
|------|---------|---------|
| `useNutritionLog` | `features/nutritie/hooks/` | CRUD entries pe zi; fetch sesiuni pentru calorii arse; soft delete |
| `useFoodSearch` | `features/nutritie/hooks/` | Search hibrid: cache → USDA → Open Food Facts; dicționar traduceri |
| `useFoodDetail` | `features/nutritie/hooks/` | Detalii complete aliment incl. micro din USDA |
| `useFrequentFoods` | `features/nutritie/hooks/` | Top 5 alimente după frecvență de utilizare a utilizatorului |
| `useRecentFoods` | `features/nutritie/hooks/` | Ultimele 10 alimente adăugate (din `meal_entries` distinct pe `fdc_id`) |
| `useMealCopy` | `features/nutritie/hooks/` | Fetch entries dintr-o zi anterioară + insert în ziua curentă |
| `useWaterLog` | `features/nutritie/hooks/` | CRUD apă zilnică: fetch, addWater, setTarget |
| `useNutritionTarget` | `features/nutritie/hooks/` | Calcul profil caloric progresiv; detectare când trigger onboarding; TDEE adaptiv după obiectiv setat |
| `useWeeklyCalories` | `features/nutritie/hooks/` | Agregat 7 zile: calorii consumate + calorii arse + target |
| `useWorkoutCalories` | `features/nutritie/hooks/` | Citește `sessions` din ziua curentă, calculează calorii arse per sesiune |
| `useCustomFood` | `features/nutritie/hooks/` | Creare / editare aliment custom în `food_cache` cu `data_source = 'custom'` |

## Schema DB

Nu duplicăm schema aici. Vezi `DATABASE.md` pentru toate tabelele, RLS policies și indexuri.

## Dependențe noi

Nicio dependență npm nouă. Recharts există deja.

```
VITE_USDA_API_KEY=<api_key_de_la_api.nal.usda.gov>
```

## Calcul calorii arse din antrenamente

Utilitar `src/shared/lib/caloriesBurned.ts`:

```ts
// Estimare simplificată bazată pe MET (Metabolic Equivalent of Task)
// MET per tip exercițiu + durată sesiune → kcal arse
// Formula: kcal = MET × greutate_estimată(70kg default) × ore
// Greutatea estimată vine din ultimul `body_weight` entry al utilizatorului

type Intensity = 'low' | 'moderate' | 'high' | 'very_high'

const MET_VALUES: Record<Intensity, number> = {
  low: 3.0,       // stretching, mobilitate
  moderate: 5.0,  // antrenament cu greutăți ușor-mediu
  high: 7.0,      // antrenament cu greutăți intens, HIIT moderat
  very_high: 10.0 // HIIT intens, circuit training
}
```

Intensitatea se determină din volumul sesiunii: seturi × reps × greutate medie per sesiune, normalizat față de maximele istorice ale utilizatorului. Calculul rămâne estimativ — se afișează cu disclaimer.

## Split macro per obiectiv

| Obiectiv | Calorii offset | Proteine | Carbohidrați | Grăsimi |
|----------|---------------|----------|-------------|---------|
| Menținere | ±0 kcal | 25% | 45% | 30% |
| Deficit ușor | -300 kcal | 30% | 40% | 30% |
| Deficit moderat | -500 kcal | 35% | 35% | 30% |
| Surplus | +300 kcal | 25% | 50% | 25% |

Proteinele cresc la deficit pentru a proteja masa musculară. Spliturile sunt ajustabile manual după setarea obiectivului.

## Decizii tehnice & trade-offs

**Soft delete în loc de hard delete:**
`deleted_at TIMESTAMPTZ` pe `meal_entries` și `nutrition_logs`. Queries filtrează `WHERE deleted_at IS NULL`. Avantaj: date recuperabile, audit trail. Trade-off: queries ușor mai complexe, necesită index partial.

**Faza fără target (onboarding progresiv):**
`nutrition_goals.goal_type` e NULL inițial. `useNutritionTarget` verifică: dacă NULL → returnează `phase: 'discovery'` și calculează doar medii fără target. Dashboard arată `CalorieProfileCard` în loc de `CalorieRing`. Trigger onboarding la ≥ 7 zile cu date.

**Calorii arse citite direct din Supabase, nu importate din feature sesiuni:**
Evită coupling între feature-uri. `useWorkoutCalories` face propriul query pe `sessions` și `session_logs`. `caloriesBurned.ts` e în `shared/lib` și poate fi folosit de ambele feature-uri independent.

**Aliment custom cu `user_id` în `food_cache`:**
`food_cache` devine shared + per-user. Alimentele custom au `user_id NOT NULL`; cele din USDA/OFF au `user_id NULL`. RLS permite citire: `user_id IS NULL OR user_id = auth.uid()`. Simplu, fără tabel separat.

**Dicționar de traduceri local vs. API de traducere:**
API de traducere (Google Translate) adaugă cost și latență. ~150 termeni comuni acopera 80% din căutările reale. Dicționarul e un simplu `Record<string, string>` — ușor de extins.

## Riscuri tehnice

- **Calorii arse estimate**: formula MET e o estimare grosolană. Utilizatorul trebuie să înțeleagă că e orientativă — disclaimer permanent pe `WorkoutCaloriesBar`.
- **Variabilitate TDEE**: greutatea corporală fluctuează din apă, glicogen, ciclu menstrual. Warning explicit la variații > 1.5kg în 7 zile.
- **Coverage alimente românești**: ~200 pre-populate nu acoperă tot. Custom foods e esențial ca supapă.
- **Rate limiting USDA**: debounce 400ms pe search + cache agresiv + fallback mesaj prietenos.
- **Trigger onboarding la 7 zile**: dacă utilizatorul a logat sporadic (7 zile în 3 săptămâni), triggerul tot se declanșează. Nu verificăm că zilele sunt consecutive — intentionat, pentru a nu penaliza utilizatorii neregulați.
