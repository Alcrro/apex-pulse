# Database — Nutriție / Log Zilnic

## Tabele noi / coloane adăugate

```sql
-- ─── Log nutrițional zilnic ──────────────────────────────────────────────────
-- Un rând per utilizator per zi. Totalurile sunt denormalizate și actualizate
-- automat prin trigger la orice INSERT/UPDATE pe meal_entries.

CREATE TABLE nutrition_logs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date         DATE NOT NULL,

  -- Totaluri denormalizate (actualizate prin trigger)
  total_calories   NUMERIC(8,2) NOT NULL DEFAULT 0,
  total_protein_g  NUMERIC(8,2) NOT NULL DEFAULT 0,
  total_carbs_g    NUMERIC(8,2) NOT NULL DEFAULT 0,
  total_fat_g      NUMERIC(8,2) NOT NULL DEFAULT 0,

  -- Apă (ml) — tracking zilnic
  water_ml         INT NOT NULL DEFAULT 0,
  water_target_ml  INT NOT NULL DEFAULT 2000,

  -- Calorii arse din antrenamente (estimate, cache-uite zilnic)
  calories_burned  INT NOT NULL DEFAULT 0,

  -- Snapshot target caloric din ziua respectivă (copiat din nutrition_goals)
  target_calories  INT,

  -- Soft delete (nu ștergem date nutriționale)
  deleted_at       TIMESTAMPTZ,

  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, log_date)
);

CREATE INDEX idx_nutrition_logs_user_date
  ON nutrition_logs (user_id, log_date DESC)
  WHERE deleted_at IS NULL;


-- ─── Intrări individuale în mese ──────────────────────────────────────────────
-- Un rând per aliment adăugat la o masă. Snapshot la momentul adăugării.

CREATE TABLE meal_entries (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_id           UUID NOT NULL REFERENCES nutrition_logs(id) ON DELETE CASCADE,
  fdc_id           TEXT NOT NULL,

  meal_type        TEXT NOT NULL
                   CHECK (meal_type IN ('mic_dejun', 'pranz', 'cina', 'gustare')),

  -- Cantitate în unitatea aleasă de utilizator + echivalentul în grame
  quantity         NUMERIC(7,2) NOT NULL CHECK (quantity > 0),
  unit             TEXT NOT NULL DEFAULT 'grame'
                   CHECK (unit IN ('grame', 'pounds', 'ml', 'bucata')),
  grams_equivalent NUMERIC(7,2) NOT NULL CHECK (grams_equivalent > 0),

  -- Snapshot valori nutriționale la momentul adăugării (nu se recalculează)
  calories         NUMERIC(8,2) NOT NULL,
  protein_g        NUMERIC(8,2) NOT NULL DEFAULT 0,
  carbs_g          NUMERIC(8,2) NOT NULL DEFAULT 0,
  fat_g            NUMERIC(8,2) NOT NULL DEFAULT 0,

  -- Soft delete
  deleted_at       TIMESTAMPTZ,

  added_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_meal_entries_log
  ON meal_entries (log_id)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_meal_entries_user_recent
  ON meal_entries (user_id, fdc_id, added_at DESC)
  WHERE deleted_at IS NULL;


-- ─── Frecvența alimentelor (shortcut-uri) ─────────────────────────────────────
-- Actualizat prin trigger la fiecare INSERT în meal_entries.

CREATE TABLE food_frequency (
  user_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fdc_id    TEXT NOT NULL,
  use_count INT NOT NULL DEFAULT 1,
  last_used TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (user_id, fdc_id)
);

CREATE INDEX idx_food_frequency_top
  ON food_frequency (user_id, use_count DESC, last_used DESC);
```

## RLS Policies

```sql
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "nutrition_logs_own"
  ON nutrition_logs FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

ALTER TABLE meal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "meal_entries_own"
  ON meal_entries FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

ALTER TABLE food_frequency ENABLE ROW LEVEL SECURITY;
CREATE POLICY "food_frequency_own"
  ON food_frequency FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

## Funcții / Triggers

```sql
-- Trigger: actualizează totaluri în nutrition_logs după orice modificare în meal_entries
-- Prinde INSERT, UPDATE (inclusiv soft delete = update deleted_at) și DELETE fizic

CREATE OR REPLACE FUNCTION update_nutrition_log_totals()
RETURNS TRIGGER AS $$
DECLARE v_log_id UUID;
BEGIN
  v_log_id := COALESCE(NEW.log_id, OLD.log_id);
  UPDATE nutrition_logs SET
    total_calories  = COALESCE((SELECT SUM(calories)  FROM meal_entries WHERE log_id = v_log_id AND deleted_at IS NULL), 0),
    total_protein_g = COALESCE((SELECT SUM(protein_g) FROM meal_entries WHERE log_id = v_log_id AND deleted_at IS NULL), 0),
    total_carbs_g   = COALESCE((SELECT SUM(carbs_g)   FROM meal_entries WHERE log_id = v_log_id AND deleted_at IS NULL), 0),
    total_fat_g     = COALESCE((SELECT SUM(fat_g)     FROM meal_entries WHERE log_id = v_log_id AND deleted_at IS NULL), 0),
    updated_at      = NOW()
  WHERE id = v_log_id;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_nutrition_log_totals
  AFTER INSERT OR UPDATE OR DELETE ON meal_entries
  FOR EACH ROW EXECUTE FUNCTION update_nutrition_log_totals();


-- Trigger: incrementează food_frequency la fiecare entry nou adăugat

CREATE OR REPLACE FUNCTION update_food_frequency()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.deleted_at IS NULL THEN
    INSERT INTO food_frequency (user_id, fdc_id, use_count, last_used)
    VALUES (NEW.user_id, NEW.fdc_id, 1, NOW())
    ON CONFLICT (user_id, fdc_id) DO UPDATE
      SET use_count = food_frequency.use_count + 1, last_used = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_food_frequency
  AFTER INSERT ON meal_entries
  FOR EACH ROW EXECUTE FUNCTION update_food_frequency();


-- Helper: upsert nutrition_log pentru o zi dată (folosit din hook)

CREATE OR REPLACE FUNCTION upsert_nutrition_log(p_user_id UUID, p_date DATE)
RETURNS UUID AS $$
DECLARE v_log_id UUID;
BEGIN
  INSERT INTO nutrition_logs (user_id, log_date)
  VALUES (p_user_id, p_date)
  ON CONFLICT (user_id, log_date) DO NOTHING;

  SELECT id INTO v_log_id
  FROM nutrition_logs
  WHERE user_id = p_user_id AND log_date = p_date AND deleted_at IS NULL;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Indexuri pentru performanță

```sql
-- Fetch rapid 14 zile pentru calcul TDEE și WeekStrip
CREATE INDEX idx_nutrition_logs_user_date ON nutrition_logs (user_id, log_date DESC)
  WHERE deleted_at IS NULL;

-- Recent foods per user (tab „Recent" din FoodSearchModal)
CREATE INDEX idx_meal_entries_user_recent ON meal_entries (user_id, fdc_id, added_at DESC)
  WHERE deleted_at IS NULL;

-- Top 5 frecvente (shortcut-uri MealCard)
CREATE INDEX idx_food_frequency_top ON food_frequency (user_id, use_count DESC, last_used DESC);
```

## Date inițiale / seed

Nu sunt necesare date seed. Log-urile se creează lazy prin `upsert_nutrition_log`.

## Decizii de schemă & alternative respinse

**Soft delete cu `deleted_at` vs. hard delete:**
Date nutriționale accidentale șterse sunt recuperabile. Index partial `WHERE deleted_at IS NULL` menține performanța la queries curente.

**`food_frequency` tabel separat vs. COUNT pe `meal_entries`:**
COUNT la fiecare search ar fi un full scan per user. Tabelul denormalizat actualizat prin trigger e O(1) la citire. Trade-off: complexitate trigger (acceptabilă).

**`grams_equivalent` snapshot în `meal_entries`:**
Indiferent de unitate (bucată, ml, pounds), stocăm echivalentul în grame la momentul adăugării. Nu depindem de modificările viitoare ale `available_units`.

**`target_calories` snapshot în `nutrition_logs`:**
Copiem targetul din ziua respectivă pentru a păstra istoricul corect dacă utilizatorul schimbă obiectivul ulterior. Dashboard-ul de progres va arăta comparații corecte retroactiv.

## Testare manuală

- [ ] Insert `meal_entry` → verifică că `nutrition_logs.total_calories` se actualizează imediat (trigger)
- [ ] Soft delete `meal_entry` (update `deleted_at`) → verifică că totalul scade
- [ ] `food_frequency.use_count` se incrementează la fiecare INSERT în `meal_entries`
- [ ] `upsert_nutrition_log` apelat de două ori aceeași zi → returnează același UUID (nu creează duplicate)
- [ ] Fetch `nutrition_logs` cu user diferit → 0 rânduri (RLS)
- [ ] Cascade delete user → dispar `nutrition_logs`, `meal_entries`, `food_frequency`
