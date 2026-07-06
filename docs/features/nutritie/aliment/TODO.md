# TODO — Nutriție / Aliment

## Frontend

### Pagini
- [x] `src/features/nutritie/pages/AlimentDetailPage.tsx` (ruta `/nutritie/aliment/:fdcId`)
  - [x] Header: imagine + nume + brand + badge sursă date
  - [x] `MacroDonut` + grame per porție selectată
  - [x] Tab-uri: Macro | Micro | Aminoacizi
  - [x] Tab Micro: `NutrientTable` (vitamine + minerale cu % DZR)
  - [x] Tab Aminoacizi: `AminoAcidList` (esențiali / non-esențiali)
  - [x] Fallback „Date indisponibile" dacă JSONB gol

- [x] `src/features/nutritie/pages/CustomAlimentPage.tsx` (ruta `/nutritie/aliment/custom/nou`)
  - [x] Câmpuri obligatorii: nume, kcal/100g, proteine, carbohidrați, grăsimi
  - [x] Câmpuri opționale collapsibile: sodiu, fibre, zahăr, grăsimi saturate, imagine URL
  - [x] Validare client-side + submit → `useCustomFood`
  - [x] Redirect la pagina anterioară după save

### Componente
- [x] `FoodSearchModal.tsx`
  - [x] Tab-uri: Căutare | Frecvente | Recent
  - [x] Input autofocused cu debounce 400ms
  - [x] Lista `FoodSearchResult` cu skeleton loading
  - [x] La tap rezultat: ecran confirmare cu selector unitate + cantitate + preview kcal live
  - [x] Buton „Adaugă aliment nou" la 0 rezultate
- [x] `FoodSearchResult.tsx` — thumbnail + nume + kcal/100g + badge-uri P/C/G
- [x] `NutrientTable.tsx` — tabel nutrient/valoare/% DZR; „—" la lipsă; grupat vitamine/minerale
- [x] `AminoAcidList.tsx` — Esențiali / Non-esențiali; mini-bară față de DZR
- [x] `MacroDonut.tsx` — Recharts PieChart donut P/C/G cu legendă grame
- [x] `MacroBadge.tsx` — badge colorat mic: P=albastru, C=galben, G=roșu

### Hooks
- [x] `useFoodSearch.ts`
  - [x] Full-text search `food_cache` (query original + traducere din dicționar)
  - [x] Fallback USDA API dacă <5 rezultate; upsert în cache
  - [x] Expune: `results`, `isLoading`, `isError`, `search(query)`, `clearResults()`
- [x] `useFoodDetail.ts`
  - [x] Fetch `food_cache` după `fdcId`
  - [x] Re-fetch USDA dacă micro JSONB goale → parse + update cache
  - [x] Expune: `food`, `isLoading`
- [x] `useCustomFood.ts`
  - [x] `createCustomFood(data)` → INSERT în `food_cache` cu `data_source='custom'`, `user_id=auth.uid()`
  - [x] ID generat local: `custom_${userId.slice(0,8)}_${Date.now()}`
  - [x] Expune: `createCustomFood`, `isLoading`, `error`

### Utilitare
- [x] `src/features/nutritie/utils/searchTranslations.ts` — `Record<string, string>` cu ~150 termeni RO→EN

### Backend (Supabase)
- [ ] Migrare `food_cache` (vezi DATABASE.md)
- [ ] RLS policies aplicate și testate (citire publică + write custom)
- [ ] Index full-text bilingv aplicat
- [ ] Seed ~200 alimente românești (`data_source = 'manual_ro'`)
- [ ] `VITE_USDA_API_KEY` configurat în `.env` și în environment-ul de deploy

### UX / Edge cases
- [x] Loading skeleton `FoodSearchResult`
- [x] Empty state search: mesaj + buton „Adaugă aliment nou"
- [x] Eroare USDA API: mesaj discret „Căutarea externă nu este disponibilă. Afișăm rezultatele locale."
- [x] Aliment fără imagine: placeholder `Salad` Lucide
- [x] Aliment fără micro: tab Micro cu „Date indisponibile pentru acest aliment"
- [x] Gramaj/cantitate ≤0: buton „Adaugă" disabled în modal confirmare
- [ ] Test manual: aliment custom apare în tab „Frecvente" după prima adăugare

### Mobile / responsive
- [x] `FoodSearchModal` full-screen pe mobile
- [x] `FoodEntryRow` touch target delete ≥44px
- [x] `NutrientTable` scroll orizontal pe ecrane <360px

## Progres general
- [x] PRD aprobat
- [x] Tech spec finalizat
- [x] `useFoodSearch` + `useFoodDetail` + `useCustomFood` implementate
- [x] `FoodSearchModal` + componente implementate
- [x] `AlimentDetailPage` + `CustomAlimentPage` implementate
- [ ] Schema DB migrată (`food_cache`)
- [ ] Seed alimente românești importat
- [ ] `VITE_USDA_API_KEY` configurat
- [ ] Testat pe mobile
- [ ] Build fără erori (`npm run build`)
