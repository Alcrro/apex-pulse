# Database — Nutriție / Aliment

## Tabele noi / coloane adăugate

```sql
-- ─── Cache alimente ───────────────────────────────────────────────────────────
-- Sursă unică de adevăr pentru date nutriționale.
-- user_id NULL  = aliment public (USDA / OFF / pre-populate RO)
-- user_id NOT NULL = aliment custom creat de utilizator

CREATE TABLE food_cache (
  fdc_id           TEXT NOT NULL,
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identificare
  name             TEXT NOT NULL,
  name_ro          TEXT,
  brand            TEXT,
  image_url        TEXT,

  -- Macro per gram (stocat per gram, nu per 100g)
  calories_per_g   NUMERIC(8,4) NOT NULL,
  protein_g        NUMERIC(8,4) NOT NULL DEFAULT 0,
  carbs_g          NUMERIC(8,4) NOT NULL DEFAULT 0,
  sugar_g          NUMERIC(8,4) DEFAULT 0,
  fiber_g          NUMERIC(8,4) DEFAULT 0,
  fat_g            NUMERIC(8,4) NOT NULL DEFAULT 0,
  saturated_fat_g  NUMERIC(8,4) DEFAULT 0,
  sodium_mg        NUMERIC(8,4) DEFAULT 0,

  -- Micro-nutrienți (structură variabilă)
  vitamins         JSONB DEFAULT '{}',
  minerals         JSONB DEFAULT '{}',
  amino_acids      JSONB DEFAULT '{}',

  -- Unități disponibile per aliment
  -- Ex: [{"unit": "bucata", "grams": 60}, {"unit": "ml", "grams": 1.03}]
  available_units  JSONB DEFAULT '[]',

  -- Meta
  data_source      TEXT NOT NULL DEFAULT 'usda'
                   CHECK (data_source IN ('usda', 'openfoodfacts', 'manual_ro', 'custom')),
  cached_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  raw_usda         JSONB,  -- payload brut USDA pentru re-parsare (opțional)

  PRIMARY KEY (fdc_id, COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::UUID)),
  CONSTRAINT valid_calories CHECK (calories_per_g >= 0)
);
```

### Structura JSONB `available_units`

```jsonc
[
  { "unit": "bucata", "grams": 60 },    // 1 ou = 60g
  { "unit": "ml", "grams": 1.03 }       // 1 ml lapte ≈ 1.03g
]
// grame și pounds sunt mereu disponibile implicit (1 pound = 453.59g)
```

### Structura JSONB micro-nutrienți

```jsonc
// vitamins
{ "vitaminA_mcg": 120, "vitaminC_mg": 12.5, "vitaminD_mcg": 1.2, "vitaminE_mg": 1.8,
  "vitaminK_mcg": 20, "vitaminB1_mg": 0.1, "vitaminB2_mg": 0.15, "vitaminB3_mg": 3.2,
  "vitaminB5_mg": 0.8, "vitaminB6_mg": 0.2, "vitaminB9_mcg": 45, "vitaminB12_mcg": 0.5 }
// minerals
{ "calcium_mg": 80, "iron_mg": 2.1, "magnesium_mg": 30, "potassium_mg": 320,
  "zinc_mg": 1.2, "selenium_mcg": 18, "phosphorus_mg": 150 }
// amino_acids (mg per 100g)
{ "unit": "mg_per_100g",
  "leucina": 980, "izoleucina": 560, "valina": 660, "lizina": 1050,
  "metionina": 290, "fenilalanina": 610, "treonina": 480, "triptofan": 140, "histidina": 380 }
```

## RLS Policies

```sql
ALTER TABLE food_cache ENABLE ROW LEVEL SECURITY;

-- Citire: alimente publice (user_id NULL) + alimentele custom proprii
CREATE POLICY "food_cache_read"
  ON food_cache FOR SELECT TO authenticated
  USING (user_id IS NULL OR user_id = auth.uid());

-- Inserare: public (caching USDA/OFF) sau custom propriu
CREATE POLICY "food_cache_insert"
  ON food_cache FOR INSERT TO authenticated
  WITH CHECK (
    (user_id IS NULL AND data_source IN ('usda', 'openfoodfacts', 'manual_ro'))
    OR (user_id = auth.uid() AND data_source = 'custom')
  );

-- Update și delete: doar alimente custom proprii
CREATE POLICY "food_cache_update_own"
  ON food_cache FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "food_cache_delete_own"
  ON food_cache FOR DELETE TO authenticated
  USING (user_id = auth.uid());
```

## Funcții / Triggers

Nu sunt necesare triggers. Caching-ul e gestionat în `useFoodSearch` și `useFoodDetail`.

## Indexuri pentru performanță

```sql
-- Full-text search bilingv (RO + EN simultan)
CREATE INDEX idx_food_cache_name_fts ON food_cache
  USING gin(to_tsvector('simple', name || ' ' || COALESCE(name_ro, '')));

-- Alimentele custom ale unui utilizator
CREATE INDEX idx_food_cache_custom_user ON food_cache (user_id)
  WHERE user_id IS NOT NULL;
```

## Date inițiale / seed

**Obligatoriu înainte de launch** — script de import ~200 alimente românești cu `data_source = 'manual_ro'`:

- **Carne**: mici, pui (piept/pulpă/aripi), porc (cotlet/fleică), vită, crap, păstrăv, ton conservă
- **Lactate**: lapte (1.5%/3.5%), iaurt simplu, telemea, cașcaval, smântână, unt
- **Pâine & paste**: pâine albă/integrală, cozonac, mămăligă, paste fierte, orez fiert
- **Legume**: cartofi (fierți/prăjiți), roșii, ardei, varză, morcovi, fasole, linte
- **Fructe**: mere, banane, portocale, struguri, prune
- **Preparate**: ciorbă de burtă, sarmale, fasole bătută, pilaf, tocăniță, drob

## Decizii de schemă & alternative respinse

**Primary key compozit `(fdc_id, COALESCE(user_id, uuid_zero))`:**
Permite același `fdc_id` pentru aliment public și o versiune custom a unui utilizator. Alternativă respinsă: UUID propriu ca PK + coloană `external_id` — ar complica queries și FK-uri din `meal_entries`.

**Macro stocate per gram (nu per 100g):**
Calculul `calories = calories_per_g × grams_equivalent` e direct. Alternativa per 100g necesita împărțire la 100 la fiecare calcul — risc de erori de rotunjire.

**`raw_usda JSONB` opțional:**
Păstrăm payload-ul brut pentru re-parsare fără re-fetch USDA. Opțional — coloanele parsate sunt sursa de adevăr pentru UI. Poate fi `NULL` pentru alimente `manual_ro` și `custom`.

## Testare manuală

- [ ] Full-text search: „piept de pui" returnează rândul cu `name_ro = 'piept de pui'`
- [ ] Fetch `food_cache` fără autentificare → eșuează (RLS)
- [ ] Fetch aliment custom al altui user → 0 rânduri (RLS)
- [ ] Insert aliment custom cu `user_id` diferit de `auth.uid()` → eșuează (RLS)
- [ ] Insert același `fdc_id` de două ori (upsert) → nu dublează (ON CONFLICT)
- [ ] Cascade delete user → dispar alimentele custom ale utilizatorului
