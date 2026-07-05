# Database — Full Schema

## Stack
- **Database**: Supabase (PostgreSQL hosted)
- **Auth**: Supabase Auth (email/password); user rows in `auth.users` (Supabase managed)
- **API**: PostgREST via `@supabase/supabase-js` v2
- **Schema file**: `supabase-schema.sql` (run in Supabase SQL Editor)

---

## Tables

### `exercises`
Global exercise library plus user-created custom exercises.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `name` | `text` | NOT NULL | Exercise name (English) |
| `muscle_group` | `text` | NOT NULL | One of: Piept, Spate, Umeri, Biceps, Triceps, Picioare, Abdomen |
| `equipment` | `text` | nullable | One of: Bara, Gantere, Cablu, Masina, Greutate corporala, Alt echipament |
| `is_custom` | `boolean` | NOT NULL, default `false` | `true` for user-created exercises |
| `user_id` | `uuid` | nullable, FK → `auth.users(id)` ON DELETE CASCADE | null for global exercises |
| `created_at` | `timestamptz` | default `now()` | |

Note: `image_url` column is referenced in the TypeScript type `Exercise` but does not exist in `supabase-schema.sql`. It is never populated via the app — images are resolved from the static `EXERCISE_IMAGES` map.

Pre-seeded with ~46 global exercises across 7 muscle groups.

---

### `workout_plans`
User-created workout plans.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK → `auth.users(id)` ON DELETE CASCADE | |
| `name` | `text` | NOT NULL | Plan name |
| `description` | `text` | nullable | Optional description |
| `created_at` | `timestamptz` | default `now()` | |
| `updated_at` | `timestamptz` | default `now()` | Not auto-updated by triggers; reflects insert time unless manually set |

---

### `workout_exercises`
Junction table linking exercises to a workout plan, with per-plan configuration.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `workout_plan_id` | `uuid` | NOT NULL, FK → `workout_plans(id)` ON DELETE CASCADE | |
| `exercise_id` | `uuid` | NOT NULL, FK → `exercises(id)` ON DELETE CASCADE | |
| `sets` | `int` | NOT NULL, default `3` | |
| `reps` | `int` | NOT NULL, default `10` | |
| `rest_seconds` | `int` | NOT NULL, default `90` | Rest period between sets |
| `order_index` | `int` | NOT NULL, default `0` | Display order within the plan |
| `created_at` | `timestamptz` | default `now()` | |

---

### `sessions`
A single workout session (started/finished).

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK → `auth.users(id)` ON DELETE CASCADE | |
| `workout_plan_id` | `uuid` | nullable, FK → `workout_plans(id)` ON DELETE SET NULL | Null if free (unplanned) session or if plan is deleted |
| `started_at` | `timestamptz` | NOT NULL, default `now()` | Session start time |
| `finished_at` | `timestamptz` | nullable | Set when user finishes the session; null = in-progress/abandoned |
| `notes` | `text` | nullable | Optional post-session notes |
| `created_at` | `timestamptz` | default `now()` | |

---

### `session_logs`
Individual set logs within a session.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `session_id` | `uuid` | NOT NULL, FK → `sessions(id)` ON DELETE CASCADE | |
| `exercise_id` | `uuid` | NOT NULL, FK → `exercises(id)` ON DELETE CASCADE | |
| `workout_exercise_id` | `uuid` | nullable, FK → `workout_exercises(id)` ON DELETE SET NULL | Links log to a specific plan exercise; null if exercise removed from plan |
| `weight` | `numeric(6,2)` | nullable | Weight in kg; null for bodyweight exercises |
| `reps` | `int` | NOT NULL | |
| `rpe` | `numeric(3,1)` | nullable | Rate of Perceived Exertion (6.0–10.0) |
| `notes` | `text` | nullable | Per-set note |
| `logged_at` | `timestamptz` | NOT NULL, default `now()` | |

---

### `body_weight`
User body weight tracking.

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK → `auth.users(id)` ON DELETE CASCADE | |
| `weight` | `numeric(5,2)` | NOT NULL | Body weight in kg |
| `recorded_at` | `date` | NOT NULL, default `current_date` | Calendar date of measurement |
| `created_at` | `timestamptz` | default `now()` | |

---

## RLS policy pattern
All tables have RLS enabled. Two patterns are used:

**Direct user_id check (most tables):**
```sql
FOR ALL USING (auth.uid() = user_id)
```
Used on: `workout_plans`, `sessions`, `body_weight`

**Indirect check via parent table join (child tables without user_id):**
```sql
FOR ALL USING (
  EXISTS (SELECT 1 FROM parent_table WHERE parent_table.id = child_table.parent_id AND parent_table.user_id = auth.uid())
)
```
Used on: `workout_exercises` (via `workout_plans`), `session_logs` (via `sessions`)

**Split read policies (exercises only):**
```sql
-- Global exercises: readable by all authenticated users
FOR SELECT USING (is_custom = false)
-- Custom exercises: readable only by owner
FOR SELECT USING (is_custom = true AND auth.uid() = user_id)
-- Custom exercises: only owner can insert
FOR INSERT WITH CHECK (is_custom = true AND auth.uid() = user_id)
-- Custom exercises: only owner can delete
FOR DELETE USING (is_custom = true AND auth.uid() = user_id)
```

---

### `nutrition_logs`
Daily aggregated nutrition totals per user (one row per user per date).

Note: Exact column definitions are managed by the `nutritie` feature. The following fields are accessed via `useNutritionLog`, `useWeeklyCalories`, and `DashboardNutritieCard`:

| Column (inferred from hooks) | Notes |
|------------------------------|-------|
| `user_id` | FK → `auth.users` |
| `date` | Calendar date (YYYY-MM-DD) |
| `total_calories` | kcal consumed that day |
| `total_protein_g` | Protein grams |
| `total_carbs_g` | Carbs grams |
| `total_fat_g` | Fat grams |
| `water_ml` | Water consumed (ml) |
| `water_target_ml` | Daily water target (ml) |

---

### `nutrition_targets`
User-level calorie and macro goals (one row per user).

Note: Exact column definitions are managed by the `nutritie` feature. The following fields are accessed via `useNutritionTarget`:

| Column (inferred from hooks) | Notes |
|------------------------------|-------|
| `user_id` | FK → `auth.users` |
| `target_calories` | Daily kcal target |
| `protein_g` | Protein target (grams) |
| `carbs_g` | Carbs target (grams) |
| `fat_g` | Fat target (grams) |

---

## RLS policy pattern
All tables have RLS enabled. Two patterns are used:

**Direct user_id check (most tables):**
```sql
FOR ALL USING (auth.uid() = user_id)
```
Used on: `workout_plans`, `sessions`, `body_weight`, `nutrition_logs`, `nutrition_targets`

**Indirect check via parent table join (child tables without user_id):**
```sql
FOR ALL USING (
  EXISTS (SELECT 1 FROM parent_table WHERE parent_table.id = child_table.parent_id AND parent_table.user_id = auth.uid())
)
```
Used on: `workout_exercises` (via `workout_plans`), `session_logs` (via `sessions`)

**Split read policies (exercises only):**
```sql
-- Global exercises: readable by all authenticated users
FOR SELECT USING (is_custom = false)
-- Custom exercises: readable only by owner
FOR SELECT USING (is_custom = true AND auth.uid() = user_id)
-- Custom exercises: only owner can insert
FOR INSERT WITH CHECK (is_custom = true AND auth.uid() = user_id)
-- Custom exercises: only owner can delete
FOR DELETE USING (is_custom = true AND auth.uid() = user_id)
```

## Cascade deletes
| Delete | Effect |
|--------|--------|
| `auth.users` deleted | Cascades to `workout_plans`, `sessions`, `body_weight`, custom `exercises`, `nutrition_logs`, `nutrition_targets` |
| `workout_plans` deleted | Cascades to `workout_exercises`; sets `sessions.workout_plan_id = NULL` |
| `workout_exercises` deleted | Sets `session_logs.workout_exercise_id = NULL` (not cascade-deleted) |
| `exercises` deleted | Cascades to `workout_exercises` and `session_logs` |
| `sessions` deleted | Cascades to `session_logs` |
