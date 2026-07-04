# Database — Nutriție

## Tabele noi / coloane adăugate

```sql
-- ─── 1. Cache alimente (USDA + Open Food Facts + Custom) ─────────────────────
-- Sursa de adevăr pentru datele nutriționale. Populat lazy sau pre-populate.
-- user_id NULL = aliment public (USDA/OFF/pre-populate românesc)
-- user_id NOT NULL = aliment custom creat de utilizator

CREATE TABLE food_cache (
  fdc_id          TEXT NOT NULL,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identificare
  name            TEXT NOT NULL,
  name_ro         TEXT,                       -- nume în română (dacă disponibil)
  brand           TEXT,
  image_url       TEXT,

  -- Macro per gram
  calories_per_g  NUMERIC(8,4) NOT NULL,
  protein_g       NUMERIC(8,4) NOT NULL DEFAULT 0,
  carbs_g         NUMERIC(8,4) NOT NULL DEFAULT 0,
  sugar_g         NUMERIC(8,4) DEFAULT 0,
  fiber_g         NUMERIC(8,4) DEFAULT 0,
  fat_g           NUMERIC(8,4) NOT NULL DEFAULT 0,
  saturated_fat_g NUMERIC(8,4) DEFAULT 0,
  sodium_mg       NUMERIC(8,4) DEFAULT 0,

  -- Micro-nutrienți JSONB (structura variabilă)
  vitamins        JSONB DEFAULT '{}',
  minerals        JSONB DEFAULT '{}',
  amino_acids     JSONB DEFAULT '{}',

  -- Unități de măsură disponibile per aliment
  -- Ex: [{"unit": "bucata", "grams": 60}, {"unit": "ml", "grams": 1}]
  -- grame și pounds sunt întotdeauna disponibile (conversie universală)
  available_units JSONB DEFAULT '[]',

  -- Meta
  data_source     TEXT NOT NULL DEFAULT 'usda'
                  CHECK (data_source IN ('usda', 'openfoodfacts', 'manual_ro', 'custom')),
  cached_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  raw_usda        JSONB,

  PRIMARY KEY (fdc_id, COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::UUID)),
  CONSTRAINT valid_calories CHECK (calories_per_g >= 0)
);

-- Full-text search pe ambele limbi
CREATE INDEX idx_food_cache_name_fts
  ON food_cache USING gin(
    to_tsvector('simple', name || ' ' || COALESCE(name_ro, ''))
  );

-- Alimentele custom ale unui utilizator
CREATE INDEX idx_food_cache_custom_user
  ON food_cache (user_id) WHERE user_id IS NOT NULL;


-- ─── 2. Log-uri nutriționale zilnice ─────────────────────────────────────────

CREATE TABLE nutrition_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date        DATE NOT NULL,

  -- Totaluri denormalizate (actualizate prin trigger)
  total_calories  NUMERIC(8,2) NOT NULL DEFAULT 0,
  total_protein_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  total_carbs_g   NUMERIC(8,2) NOT NULL DEFAULT 0,
  total_fat_g     NUMERIC(8,2) NOT NULL DEFAULT 0,

  -- Apă (ml)
  water_ml        INT NOT NULL DEFAULT 0,
  water_target_ml INT NOT NULL DEFAULT 2000,

  -- Calorii arse din antrenamente (calculate și cache-uite zilnic)
  calories_burned INT NOT NULL DEFAULT 0,

  -- Snapshot target din ziua respectivă
  target_calories INT,

  -- Soft delete
  deleted_at      TIMESTAMPTZ,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, log_date)
);

CREATE INDEX idx_nutrition_logs_user_date
  ON nutrition_logs (user_id, log_date DESC)
  WHERE deleted_at IS NULL;


-- ─── 3. Intrări individuale în mese ──────────────────────────────────────────

CREATE TABLE meal_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_id          UUID NOT NULL REFERENCES nutrition_logs(id) ON DELETE CASCADE,
  fdc_id          TEXT NOT NULL,

  meal_type       TEXT NOT NULL
                  CHECK (meal_type IN ('mic_dejun', 'pranz', 'cina', 'gustare')),

  -- Cantitate în unitatea aleasă de user + echivalentul în grame
  quantity        NUMERIC(7,2) NOT NULL CHECK (quantity > 0),
  unit            TEXT NOT NULL DEFAULT 'grame'
                  CHECK (unit IN ('grame', 'pounds', 'ml', 'bucata')),
  grams_equivalent NUMERIC(7,2) NOT NULL CHECK (grams_equivalent > 0),

  -- Snapshot valori nutriționale la momentul adăugării
  calories        NUMERIC(8,2) NOT NULL,
  protein_g       NUMERIC(8,2) NOT NULL DEFAULT 0,
  carbs_g         NUMERIC(8,2) NOT NULL DEFAULT 0,
  fat_g           NUMERIC(8,2) NOT NULL DEFAULT 0,

  -- Soft delete
  deleted_at      TIMESTAMPTZ,

  added_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_meal_entries_log
  ON meal_entries (log_id)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_meal_entries_user_recent
  ON meal_entries (user_id, fdc_id, added_at DESC)
  WHERE deleted_at IS NULL;


-- ─── 4. Obiectiv nutrițional ─────────────────────────────────────────────────

CREATE TABLE nutrition_goals (
  user_id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- NULL = faza discovery (nu a ales încă un obiectiv)
  goal_type           TEXT CHECK (goal_type IN ('mentinere', 'deficit_usor', 'deficit_moderat', 'surplus')),

  -- TDEE adaptiv
  tdee_estimated      INT,
  tdee_calculated_at  TIMESTAMPTZ,
  tdee_warning        BOOLEAN NOT NULL DEFAULT FALSE, -- TRUE dacă variația greutății e instabilă

  -- Target final
  target_calories     INT,                           -- NULL în faza discovery
  is_manual_override  BOOLEAN NOT NULL DEFAULT FALSE,

  -- Split macro per goal (% din calorii; ajustabile manual)
  target_protein_pct  SMALLINT NOT NULL DEFAULT 25,
  target_carbs_pct    SMALLINT NOT NULL DEFAULT 45,
  target_fat_pct      SMALLINT NOT NULL DEFAULT 30,

  -- Onboarding
  onboarding_triggered_at TIMESTAMPTZ,              -- când a văzut prima dată flow-ul

  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_macro_pct
    CHECK (target_protein_pct + target_carbs_pct + target_fat_pct = 100)
);


-- ─── 5. Frecvența alimentelor (pentru shortcut-uri) ──────────────────────────
-- Actualizat la fiecare adăugare în meal_entries (trigger sau client-side)

CREATE TABLE food_frequency (
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fdc_id      TEXT NOT NULL,
  use_count   INT NOT NULL DEFAULT 1,
  last_used   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (user_id, fdc_id)
);

CREATE INDEX idx_food_frequency_top
  ON food_frequency (user_id, use_count DESC, last_used DESC);
```

### Structura JSONB `available_units` (food_cache)

```jsonc
[
  { "unit": "bucata", "grams": 60 },   // 1 ou = 60g
  { "unit": "ml", "grams": 1.03 }      // 1 ml lapte ≈ 1.03g
]
// grame și pounds sunt întotdeauna disponibile implicit (1 pound = 453.59g)
```

### Structura JSONB micro-nutrienți (food_cache)

```jsonc
// vitamins
{
  "vitaminA_mcg": 120,   "vitaminB1_mg": 0.1,   "vitaminB2_mg": 0.15,
  "vitaminB3_mg": 3.2,   "vitaminB5_mg": 0.8,   "vitaminB6_mg": 0.2,
  "vitaminB9_mcg": 45,   "vitaminB12_mcg": 0.5, "vitaminC_mg": 12.5,
  "vitaminD_mcg": 1.2,   "vitaminE_mg": 1.8,    "vitaminK_mcg": 20
}
// minerals
{
  "calcium_mg": 80,  "iron_mg": 2.1,   "magnesium_mg": 30,
  "potassium_mg": 320, "zinc_mg": 1.2, "selenium_mcg": 18,
  "phosphorus_mg": 150, "copper_mg": 0.15, "iodine_mcg": 45
}
// amino_acids (mg per 100g aliment)
{
  "unit": "mg_per_100g",
  "leucina": 980,  "izoleucina": 560, "valina": 660,
  "lizina": 1050,  "metionina": 290,  "fenilalanina": 610,
  "treonina": 480, "triptofan": 140,  "histidina": 380
}
```

## RLS Policies

```sql
-- food_cache: public read (user_id IS NULL) + citire custom proprii
ALTER TABLE food_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "food_cache_read"
  ON food_cache FOR SELECT TO authenticated
  USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "food_cache_insert_public"
  ON food_cache FOR INSERT TO authenticated
  WITH CHECK (
    (user_id IS NULL AND data_source IN ('usda', 'openfoodfacts', 'manual_ro'))
    OR (user_id = auth.uid() AND data_source = 'custom')
  );

CREATE POLICY "food_cache_update_custom_own"
  ON food_cache FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "food_cache_delete_custom_own"
  ON food_cache FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- nutrition_logs
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nutrition_logs_own"
  ON nutrition_logs FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- meal_entries
ALTER TABLE meal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meal_entries_own"
  ON meal_entries FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- nutrition_goals
ALTER TABLE nutrition_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nutrition_goals_own"
  ON nutrition_goals FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- food_frequency
ALTER TABLE food_frequency ENABLE ROW LEVEL SECURITY;

CREATE POLICY "food_frequency_own"
  ON food_frequency FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

## Funcții / Triggers

```sql
-- Trigger: actualizează totaluri în nutrition_logs după INSERT/soft-DELETE în meal_entries
-- Soft delete = update deleted_at, nu DELETE fizic → triggerul prinde UPDATE-ul

CREATE OR REPLACE FUNCTION update_nutrition_log_totals()
RETURNS TRIGGER AS $$
DECLARE
  v_log_id UUID;
BEGIN
  v_log_id := COALESCE(NEW.log_id, OLD.log_id);

  UPDATE nutrition_logs
  SET
    total_calories  = COALESCE((SELECT SUM(calories)   FROM meal_entries WHERE log_id = v_log_id AND deleted_at IS NULL), 0),
    total_protein_g = COALESCE((SELECT SUM(protein_g)  FROM meal_entries WHERE log_id = v_log_id AND deleted_at IS NULL), 0),
    total_carbs_g   = COALESCE((SELECT SUM(carbs_g)    FROM meal_entries WHERE log_id = v_log_id AND deleted_at IS NULL), 0),
    total_fat_g     = COALESCE((SELECT SUM(fat_g)      FROM meal_entries WHERE log_id = v_log_id AND deleted_at IS NULL), 0),
    updated_at      = NOW()
  WHERE id = v_log_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_nutrition_log_totals
  AFTER INSERT OR UPDATE OR DELETE ON meal_entries
  FOR EACH ROW EXECUTE FUNCTION update_nutrition_log_totals();

-- Trigger: actualizează food_frequency la adăugare entry nou
CREATE OR REPLACE FUNCTION update_food_frequency()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.deleted_at IS NULL THEN
    INSERT INTO food_frequency (user_id, fdc_id, use_count, last_used)
    VALUES (NEW.user_id, NEW.fdc_id, 1, NOW())
    ON CONFLICT (user_id, fdc_id) DO UPDATE
      SET use_count = food_frequency.use_count + 1,
          last_used = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_food_frequency
  AFTER INSERT ON meal_entries
  FOR EACH ROW EXECUTE FUNCTION update_food_frequency();

-- Helper: upsert nutrition_log pentru ziua curentă
CREATE OR REPLACE FUNCTION upsert_nutrition_log(p_user_id UUID, p_date DATE)
RETURNS UUID AS $$
DECLARE v_log_id UUID;
BEGIN
  INSERT INTO nutrition_logs (user_id, log_date)
  VALUES (p_user_id, p_date)
  ON CONFLICT (user_id, log_date) DO NOTHING;

  SELECT id INTO v_log_id FROM nutrition_logs
  WHERE user_id = p_user_id AND log_date = p_date AND deleted_at IS NULL;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Indexuri pentru performanță

```sql
-- Full-text search bilingv (deja definit mai sus)
CREATE INDEX idx_food_cache_name_fts ON food_cache
  USING gin(to_tsvector('simple', name || ' ' || COALESCE(name_ro, '')));

-- nutrition_logs: fetch rapid 14 zile (calcul TDEE)
CREATE INDEX idx_nutrition_logs_user_date ON nutrition_logs (user_id, log_date DESC)
  WHERE deleted_at IS NULL;

-- meal_entries: recent foods per user
CREATE INDEX idx_meal_entries_user_recent ON meal_entries (user_id, fdc_id, added_at DESC)
  WHERE deleted_at IS NULL;

-- food_frequency: top 5 shortcut-uri
CREATE INDEX idx_food_frequency_top ON food_frequency (user_id, use_count DESC, last_used DESC);

-- body_weight (tabel existent): verifică că există index, dacă nu:
-- CREATE INDEX idx_body_weight_user_date ON body_weight (user_id, date DESC);
```

## Date inițiale / seed

**Obligatoriu înainte de launch:** script de import pentru ~200 alimente românești tradiționale în `food_cache` cu `data_source = 'manual_ro'`. Lista minimă include:
- Carne: mici, pui (piept/pulpă/aripi), porc (cotlet/fleică), vită, pește (crap, păstrăv, ton conservă)
- Lactate: lapte (1.5%/3.5%), iaurt, telemea, cașcaval, smântână, unt
- Pâine & paste: pâine albă/neagră/integrală, cozonac, mămăligă, paste fierte
- Legume: cartofi (fierți/prăjiți), roșii, ardei, varză, morcovi, fasole, linte
- Fructe: mere, banane, portocale, struguri, prune
- Mâncăruri gătite: ciorbă de burtă, sarmale, fasole bătută, pilaf, tocăniță

## Decizii de schemă & alternative respinse

**Soft delete cu `deleted_at` vs. tabel de arhivă separat:**
`deleted_at` e simplu, queries cu `WHERE deleted_at IS NULL` sunt performante cu index partial. Un tabel de arhivă ar fi mai curat izolat, dar adaugă complexitate la restore. Trade-off acceptabil.

**`food_frequency` tabel separat vs. query COUNT pe `meal_entries`:**
COUNT pe `meal_entries` la fiecare search e lent (full scan per user). Tabelul `food_frequency` denormalizat actualizat prin trigger e O(1) la citire. Trade-off: complexitate trigger.

**Primary key compozit în `food_cache` pentru custom foods:**
Alimentele USDA au `fdc_id` unic global. Alimentele custom generate local pot colida. Primary key `(fdc_id, COALESCE(user_id, uuid_zero))` permite același `fdc_id` pentru un aliment public și o versiune custom a aceluiași utilizator (rară, dar posibilă).

**`grams_equivalent` în `meal_entries`:**
Indiferent de unitatea aleasă (bucată, ml, pounds), stocăm echivalentul în grame pentru calcule nutriționale uniforme. Snapshot la momentul adăugării — nu se recalculează dacă `available_units` se schimbă ulterior.

## Testare manuală

- [ ] Insert `meal_entry` → verifică că `nutrition_logs.total_calories` se actualizează (trigger)
- [ ] Soft delete `meal_entry` (update `deleted_at`) → verifică că totalul scade
- [ ] `food_frequency` se incrementează la fiecare INSERT în `meal_entries`
- [ ] Fetch `food_cache` fără auth → trebuie să eșueze (RLS)
- [ ] Fetch aliment custom al altui user → trebuie să returneze 0 rânduri (RLS)
- [ ] Insert aliment custom cu `user_id` al altui utilizator → trebuie să eșueze
- [ ] Cascade delete user → dispar `nutrition_logs`, `meal_entries`, `nutrition_goals`, `food_frequency` + alimentele custom
- [ ] Full-text search bilingv: `piept de pui` găsește rândul cu `name_ro = 'piept de pui'`
- [ ] Constraint `valid_macro_pct`: insert cu P+C+G ≠ 100 → eșuează
- [ ] `upsert_nutrition_log` apelat de două ori aceeași zi → returnează același UUID
