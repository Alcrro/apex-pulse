# Tech Spec — Nutriție / Aliment

## Arhitectură generală

Trei suprafețe UI care se bazează pe același strat de date (`food_cache` Supabase + USDA API + Open Food Facts):

```
FoodSearchModal (în NutritiePage)
  └── useFoodSearch — search hibrid cache → USDA
  └── useFrequentFoods, useRecentFoods — shortcut-uri

AlimentDetailPage (/nutritie/aliment/:fdcId)
  └── useFoodDetail — detalii complete incl. micro din USDA

CustomAlimentPage (/nutritie/aliment/custom/nou)
  └── useCustomFood — creare în food_cache cu data_source='custom'
```

## Rute noi / modificate

| Rută | Tip | Pagină |
|------|-----|--------|
| `/nutritie/aliment/:fdcId` | protected | `AlimentDetailPage` |
| `/nutritie/aliment/custom/nou` | protected | `CustomAlimentPage` |

## Componente noi

| Componentă | Locație | Responsabilitate |
|-----------|---------|-----------------|
| `FoodSearchModal` | `features/nutritie/components/` | Modal full-screen: tab-uri Căutare / Frecvente / Recent; confirmare cantitate + unitate |
| `FoodSearchResult` | `features/nutritie/components/` | Item rezultat: thumbnail, nume, kcal/100g, badge-uri P/C/G |
| `NutrientTable` | `features/nutritie/components/` | Tabel micro-nutrienți cu % DZR; groupat pe vitamine/minerale; „—" la lipsă |
| `AminoAcidList` | `features/nutritie/components/` | Esențiali / Non-esențiali; mini-bară față de DZR |
| `MacroDonut` | `features/nutritie/components/` | Recharts PieChart donut P/C/G cu legendă grame |
| `MacroBadge` | `features/nutritie/components/` | Badge colorat mic: P=albastru, C=galben, G=roșu |

## Hooks noi

| Hook | Locație | Ce face |
|------|---------|---------|
| `useFoodSearch` | `features/nutritie/hooks/` | Search full-text `food_cache` (bilingv); fallback USDA API dacă <5 rezultate; upsert în cache |
| `useFoodDetail` | `features/nutritie/hooks/` | Fetch `food_cache` după `fdcId`; re-fetch USDA dacă micro JSONB gol |
| `useCustomFood` | `features/nutritie/hooks/` | `createCustomFood(data)` → INSERT în `food_cache` cu `data_source='custom'` și `user_id` |

## Schema DB

vezi DATABASE.md — tabela `food_cache`

## Surse de date

| Strat | Sursă | Scop |
|-------|-------|------|
| 1 | `food_cache` Supabase pre-populate | ~200 alimente RO tradiționale, offline-first |
| 2 | USDA FoodData Central API | Macro + micro detaliat; `VITE_USDA_API_KEY` required |
| 3 | Open Food Facts API | Imagini produse ambalate (call separat, opțional) |
| 4 | Custom user | Alimente create de utilizator (`data_source='custom'`) |

**Strategia de search în `useFoodSearch`:**
1. Full-text search `food_cache` (query original + traducere din dicționar RO→EN)
2. Dacă <5 rezultate → fetch USDA, upsert în cache, merge cu locale
3. Dacă USDA eșuează → toast discret, returnează doar localele

**Dicționar traduceri** `src/features/nutritie/utils/searchTranslations.ts`:
~150 termeni comuni RO→EN acoperiți (piept de pui → chicken breast, lapte → milk etc.). Dacă termenul nu e în dicționar, search direct în engleză.

## Decizii tehnice & trade-offs

**Aliment custom cu `user_id` în `food_cache` vs tabelă separată:**
`food_cache` devine shared + per-user cu RLS: `user_id IS NULL` (public) sau `user_id = auth.uid()` (custom). Simplu, fără JOIN suplimentar. Trade-off: tabelul e mai „dens" dar volumul e mic.

**Primary key compozit `(fdc_id, COALESCE(user_id, uuid_zero))`:**
Permite un aliment public și o versiune custom a aceluiași utilizator cu același `fdc_id`. Rară, dar posibilă (e.g. utilizatorul ajustează gramajul unui ou din USDA).

**Cache lazy vs. pre-populate:**
~200 alimente românești pre-populate la deploy (seed). Restul se cacheazăa lazy la prima căutare USDA. Evită supra-inginerie pentru un catalog variabil.

**`grams_equivalent` snapshot la adăugare:**
Stocăm echivalentul în grame în `meal_entries` la momentul adăugării — nu recalculăm dacă `available_units` se schimbă ulterior. Date istorice rămân corecte.

## Riscuri tehnice

- **Rate limiting USDA**: debounce 400ms + cache agresiv. La rate limit: fallback la cache local + toast mesaj prietenos
- **USDA micro lipsă**: `useFoodDetail` face re-fetch USDA dacă JSONB gol; dacă tot lipsesc → tab Micro cu „Date indisponibile"
- **Imagini Open Food Facts**: call separat și opțional — dacă eșuează, placeholder Lucide `Salad`
