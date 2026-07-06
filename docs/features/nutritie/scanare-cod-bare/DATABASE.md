# Database — Scanare Cod de Bare Alimente

## Tabele noi / coloane adăugate

Nu se creează tabele noi. Se extinde tabela existentă `food_cache` cu o coloană pentru barcode.

```sql
-- Adaugă coloana barcode în food_cache existentă
ALTER TABLE food_cache
  ADD COLUMN IF NOT EXISTS barcode TEXT;

-- Index unic pe barcode (NULL-safe — permite multiple rânduri cu barcode NULL)
CREATE UNIQUE INDEX IF NOT EXISTS idx_food_cache_barcode
  ON food_cache(barcode)
  WHERE barcode IS NOT NULL;
```

### Structura completă a `food_cache` după migrare

```sql
-- food_cache (existentă, arătăm doar coloanele relevante)
-- fdc_id      TEXT PRIMARY KEY   — ID din USDA FDC sau OFF (pentru OFF: 'off_<barcode>')
-- name        TEXT               — numele original (EN)
-- name_ro     TEXT               — numele în română
-- barcode     TEXT               — codul EAN-13 / UPC-A (NOU)
-- calories_per_g NUMERIC
-- protein_g   NUMERIC
-- carbs_g     NUMERIC
-- fat_g       NUMERIC
-- ...restul câmpurilor existente
```

### Convenție `fdc_id` pentru produse Open Food Facts

Produsele din OFF nu au un FDC ID USDA. Folosim prefixul `off_` + barcode ca cheie primară:

```
fdc_id = 'off_5941028001592'   -- pentru EAN-13 5941028001592
```

Astfel produsele OFF și USDA coexistă în același tabel fără conflict.

## RLS Policies

Tabela `food_cache` are deja RLS configurată (read public, write service role). Nu sunt necesare modificări — coloana `barcode` moștenește politicile existente.

```sql
-- Verifică că politicile existente acoperă și noua coloană (ar trebui să fie implicite):
-- SELECT: anon + authenticated (read-only cache)
-- INSERT/UPDATE: service_role sau authenticated (pentru cache write din hook)
```

Dacă `food_cache` permite `INSERT` din frontend (authenticated), nimic de adăugat.
Dacă nu, adaugă:

```sql
-- Permite utilizatorilor autentificați să insereze în cache (best-effort caching)
CREATE POLICY IF NOT EXISTS "food_cache: authenticated insert"
  ON food_cache FOR INSERT TO authenticated
  WITH CHECK (true);
```

## Funcții / Triggers

Nu sunt necesare funcții sau triggers noi. Logica de caching e gestionată în hook-ul frontend `useBarcodeLookup`.

## Indexuri pentru performanță

```sql
-- Deja adăugat mai sus, repetăm explicit:
CREATE UNIQUE INDEX IF NOT EXISTS idx_food_cache_barcode
  ON food_cache(barcode)
  WHERE barcode IS NOT NULL;
```

Justificare: lookup-ul primar pentru scan e `WHERE barcode = ?` — fără index, fiecare scan cauzează un seq scan pe un tabel care poate ajunge la sute de mii de rânduri.

## Date inițiale / seed

Nu sunt necesare date seed. Cache-ul se populează organic la prima scanare a fiecărui produs.

## Decizii de schemă & alternative respinse

**Coloană `barcode` în `food_cache` vs tabelă separată `barcode_lookup`:**
- O tabelă separată `barcode_lookup(barcode, fdc_id)` ar fi mai normalizată
- Ales extinderea `food_cache` direct: evită JOIN suplimentar la fiecare scan, logica de caching rămâne în același loc, nu adăugăm complexitate pentru o singură coloană
- Dacă în viitor vrem să mapăm mai multe barcodes la același produs (bundle packs), putem migra la o tabelă separată

**`fdc_id` prefixat cu `off_` vs coloană separată `source TEXT`:**
- Prefixul în `fdc_id` e suficient pentru a distinge sursa fără o coloană în plus
- Alternativă respinsă: `source TEXT DEFAULT 'usda' CHECK (source IN ('usda', 'off', 'custom'))` — ar fi mai explicit dar adaugă complexitate inutilă acum

**Stocarea întregului payload OFF în `payload JSONB`:**
- Respins — `food_cache` nu are coloană JSONB, și nu avem nevoie de datele brute OFF după ce le parsăm
- Datele brute sunt disponibile oricând de la OFF API dacă e nevoie

## Testare manuală

- [ ] Verifică că `food_cache` acceptă `INSERT` cu `barcode` non-null din frontend (rol `authenticated`)
- [ ] Verifică că două rânduri cu `barcode = NULL` sunt permise (index WHERE barcode IS NOT NULL)
- [ ] Scanează același produs de 2 ori → al doilea scan nu face request la OFF (cache hit verificat în Network tab)
- [ ] Verifică că un produs USDA existent și un produs OFF cu același `fdc_id` nu intră în conflict (prefix `off_` previne asta)
- [ ] Verifică că RLS nu blochează `SELECT barcode FROM food_cache` pentru utilizator autentificat
- [ ] Verifică cascade: ștergerea unui rând din `food_cache` nu afectează `nutrition_log_entries` dacă `fdcId` e stocat acolo (verifică foreign keys existente)
