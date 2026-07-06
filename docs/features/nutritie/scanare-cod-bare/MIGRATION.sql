-- ============================================================
-- Migration: Scanare Cod de Bare — extinde food_cache
-- Rulează în Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Adaugă coloana barcode în tabela food_cache existentă
ALTER TABLE food_cache
  ADD COLUMN IF NOT EXISTS barcode TEXT;

-- 2. Index unic pe barcode (NULL-safe — permite multiple rânduri cu barcode NULL)
CREATE UNIQUE INDEX IF NOT EXISTS idx_food_cache_barcode
  ON food_cache(barcode)
  WHERE barcode IS NOT NULL;

-- 3. (Opțional) Dacă food_cache nu permite INSERT din frontend (rol authenticated),
--    adaugă policy-ul următor. Verifică mai întâi cu:
--    SELECT * FROM pg_policies WHERE tablename = 'food_cache';
--    Dacă există deja o policy pentru INSERT authenticated, skip acest pas.

-- CREATE POLICY IF NOT EXISTS "food_cache: authenticated insert"
--   ON food_cache FOR INSERT TO authenticated
--   WITH CHECK (true);

-- ============================================================
-- Verificare post-migrare:
-- SELECT column_name FROM information_schema.columns
--   WHERE table_name = 'food_cache' AND column_name = 'barcode';
-- ============================================================
