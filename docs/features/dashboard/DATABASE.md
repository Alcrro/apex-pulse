# Database — Dashboard

## Tables used
| Table | Operations | Relevant fields |
|-------|-----------|-----------------|
| `workout_plans` | SELECT | `id`, `name`, `description`, `created_at` |
| `workout_exercises` | SELECT (count aggregate via join) | `count` |
| `sessions` | SELECT | `id`, `user_id`, `workout_plan_id`, `started_at`, `finished_at`, `notes` |
| `session_logs` | SELECT (count aggregate via join) | `count` |
| `nutrition_logs` | SELECT (via nutritie hooks) | `date`, `total_calories`, `total_protein_g`, `total_carbs_g`, `total_fat_g`, `water_ml`, `water_target_ml` |
| `nutrition_targets` | SELECT (via nutritie hooks) | `target_calories`, `protein_g`, `carbs_g`, `fat_g` |

## Main queries

**useWorkouts — fetch all plans with exercise count:**
```sql
SELECT workout_plans.*, workout_exercises(count)
FROM workout_plans
WHERE user_id = $user_id
ORDER BY created_at DESC
```

**useSessions — fetch last 50 sessions with plan name and log count:**
```sql
SELECT sessions.*, workout_plans(name), session_logs(count)
FROM sessions
WHERE user_id = $user_id
ORDER BY started_at DESC
LIMIT 50
```

**useNutritionLog(today) — fetch today's log:**
```sql
SELECT * FROM nutrition_logs
WHERE user_id = $user_id AND date = $today
```
(Exact query lives in `features/nutritie/hooks/useNutritionLog.ts`)

**useNutritionTarget — fetch calorie/macro goals:**
```sql
SELECT * FROM nutrition_targets
WHERE user_id = $user_id
```
(Exact query lives in `features/nutritie/hooks/useNutritionTarget.ts`)

**useWeeklyCalories — fetch calorie totals for current week:**
```sql
SELECT date, total_calories FROM nutrition_logs
WHERE user_id = $user_id AND date >= $weekStart
```
(Exact query lives in `features/nutritie/hooks/useWeeklyCalories.ts`)

## RLS assumptions
All queries rely on Supabase RLS:
- `workout_plans`: policy `auth.uid() = user_id`
- `sessions`: policy `auth.uid() = user_id`
- `workout_exercises` and `session_logs` are accessed only as embedded counts, inheriting the parent table's RLS via the join
- Nutrition tables: RLS policy `auth.uid() = user_id` (managed by the nutritie feature)

## Table relationships used
- `workout_plans` 1–N `workout_exercises` (joined for count)
- `sessions` N–1 `workout_plans` (joined for plan name)
- `sessions` 1–N `session_logs` (joined for set count)
- `nutrition_logs` is a single row per user per date; dashboard reads the today row
