-- ============================================================
-- ApexPulse — Nutrition Feature Migration
-- Paste into Supabase SQL Editor and run all at once.
-- ============================================================


-- ─── 1. food_cache ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS food_cache (
  fdc_id          TEXT NOT NULL,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  name            TEXT NOT NULL,
  name_ro         TEXT,
  brand           TEXT,
  image_url       TEXT,

  calories_per_g  NUMERIC(8,4) NOT NULL,
  protein_g       NUMERIC(8,4) NOT NULL DEFAULT 0,
  carbs_g         NUMERIC(8,4) NOT NULL DEFAULT 0,
  sugar_g         NUMERIC(8,4) DEFAULT 0,
  fiber_g         NUMERIC(8,4) DEFAULT 0,
  fat_g           NUMERIC(8,4) NOT NULL DEFAULT 0,
  saturated_fat_g NUMERIC(8,4) DEFAULT 0,
  sodium_mg       NUMERIC(8,4) DEFAULT 0,

  vitamins        JSONB DEFAULT '{}',
  minerals        JSONB DEFAULT '{}',
  amino_acids     JSONB DEFAULT '{}',

  available_units JSONB DEFAULT '[]',

  data_source     TEXT NOT NULL DEFAULT 'usda'
                  CHECK (data_source IN ('usda', 'openfoodfacts', 'manual_ro', 'custom')),
  cached_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  raw_usda        JSONB,

  PRIMARY KEY (fdc_id, COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::UUID)),
  CONSTRAINT valid_calories CHECK (calories_per_g >= 0)
);

CREATE INDEX IF NOT EXISTS idx_food_cache_name_fts
  ON food_cache USING gin(
    to_tsvector('simple', name || ' ' || COALESCE(name_ro, ''))
  );

CREATE INDEX IF NOT EXISTS idx_food_cache_custom_user
  ON food_cache (user_id) WHERE user_id IS NOT NULL;


-- ─── 2. nutrition_logs ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS nutrition_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date        DATE NOT NULL,

  total_calories  NUMERIC(8,2) NOT NULL DEFAULT 0,
  total_protein_g NUMERIC(8,2) NOT NULL DEFAULT 0,
  total_carbs_g   NUMERIC(8,2) NOT NULL DEFAULT 0,
  total_fat_g     NUMERIC(8,2) NOT NULL DEFAULT 0,

  water_ml        INT NOT NULL DEFAULT 0,
  water_target_ml INT NOT NULL DEFAULT 2000,

  calories_burned INT NOT NULL DEFAULT 0,
  target_calories INT,

  deleted_at      TIMESTAMPTZ,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, log_date)
);

CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_date
  ON nutrition_logs (user_id, log_date DESC)
  WHERE deleted_at IS NULL;


-- ─── 3. meal_entries ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS meal_entries (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_id           UUID NOT NULL REFERENCES nutrition_logs(id) ON DELETE CASCADE,
  fdc_id           TEXT NOT NULL,

  meal_type        TEXT NOT NULL
                   CHECK (meal_type IN ('mic_dejun', 'pranz', 'cina', 'gustare')),

  quantity         NUMERIC(7,2) NOT NULL CHECK (quantity > 0),
  unit             TEXT NOT NULL DEFAULT 'grame'
                   CHECK (unit IN ('grame', 'pounds', 'ml', 'bucata')),
  grams_equivalent NUMERIC(7,2) NOT NULL CHECK (grams_equivalent > 0),

  calories         NUMERIC(8,2) NOT NULL,
  protein_g        NUMERIC(8,2) NOT NULL DEFAULT 0,
  carbs_g          NUMERIC(8,2) NOT NULL DEFAULT 0,
  fat_g            NUMERIC(8,2) NOT NULL DEFAULT 0,

  deleted_at       TIMESTAMPTZ,

  added_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meal_entries_log
  ON meal_entries (log_id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_meal_entries_user_recent
  ON meal_entries (user_id, fdc_id, added_at DESC)
  WHERE deleted_at IS NULL;


-- ─── 4. nutrition_goals ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS nutrition_goals (
  user_id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  goal_type              TEXT CHECK (goal_type IN ('mentinere', 'deficit_usor', 'deficit_moderat', 'surplus')),

  tdee_estimated         INT,
  tdee_calculated_at     TIMESTAMPTZ,
  tdee_warning           BOOLEAN NOT NULL DEFAULT FALSE,

  target_calories        INT,
  is_manual_override     BOOLEAN NOT NULL DEFAULT FALSE,

  target_protein_pct     SMALLINT NOT NULL DEFAULT 25,
  target_carbs_pct       SMALLINT NOT NULL DEFAULT 45,
  target_fat_pct         SMALLINT NOT NULL DEFAULT 30,

  onboarding_triggered_at TIMESTAMPTZ,

  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT valid_macro_pct
    CHECK (target_protein_pct + target_carbs_pct + target_fat_pct = 100)
);


-- ─── 5. food_frequency ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS food_frequency (
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fdc_id      TEXT NOT NULL,
  use_count   INT NOT NULL DEFAULT 1,
  last_used   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (user_id, fdc_id)
);

CREATE INDEX IF NOT EXISTS idx_food_frequency_top
  ON food_frequency (user_id, use_count DESC, last_used DESC);


-- ─── RLS ────────────────────────────────────────────────────

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


ALTER TABLE nutrition_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nutrition_goals_own"
  ON nutrition_goals FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());


ALTER TABLE food_frequency ENABLE ROW LEVEL SECURITY;

CREATE POLICY "food_frequency_own"
  ON food_frequency FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());


-- ─── Triggers ───────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_nutrition_log_totals()
RETURNS TRIGGER AS $$
DECLARE
  v_log_id UUID;
BEGIN
  v_log_id := COALESCE(NEW.log_id, OLD.log_id);

  UPDATE nutrition_logs
  SET
    total_calories  = COALESCE((SELECT SUM(calories)  FROM meal_entries WHERE log_id = v_log_id AND deleted_at IS NULL), 0),
    total_protein_g = COALESCE((SELECT SUM(protein_g) FROM meal_entries WHERE log_id = v_log_id AND deleted_at IS NULL), 0),
    total_carbs_g   = COALESCE((SELECT SUM(carbs_g)   FROM meal_entries WHERE log_id = v_log_id AND deleted_at IS NULL), 0),
    total_fat_g     = COALESCE((SELECT SUM(fat_g)     FROM meal_entries WHERE log_id = v_log_id AND deleted_at IS NULL), 0),
    updated_at      = NOW()
  WHERE id = v_log_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_nutrition_log_totals ON meal_entries;
CREATE TRIGGER trg_update_nutrition_log_totals
  AFTER INSERT OR UPDATE OR DELETE ON meal_entries
  FOR EACH ROW EXECUTE FUNCTION update_nutrition_log_totals();


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

DROP TRIGGER IF EXISTS trg_update_food_frequency ON meal_entries;
CREATE TRIGGER trg_update_food_frequency
  AFTER INSERT ON meal_entries
  FOR EACH ROW EXECUTE FUNCTION update_food_frequency();


-- ─── Helper function ─────────────────────────────────────────

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
