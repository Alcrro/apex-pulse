# Database — Workouts

## Tables used
| Table | Operations | Relevant fields |
|-------|-----------|-----------------|
| `workout_plans` | SELECT, INSERT, UPDATE, DELETE | `id`, `user_id`, `name`, `description`, `created_at`, `updated_at` |
| `workout_exercises` | SELECT (count), SELECT (full), INSERT, UPDATE, DELETE | `id`, `workout_plan_id`, `exercise_id`, `sets`, `reps`, `rest_seconds`, `order_index`, `created_at` |
| `exercises` | SELECT (embedded join) | `id`, `name`, `muscle_group`, `equipment`, `is_custom`, `user_id`, `image_url` |

## Main queries

**useWorkouts — fetch all plans with exercise count:**
```sql
SELECT workout_plans.*, workout_exercises(count)
FROM workout_plans
WHERE user_id = $user_id
ORDER BY created_at DESC
```

**useWorkouts — create plan:**
```sql
INSERT INTO workout_plans (user_id, name, description)
VALUES ($user_id, $name, $description)
RETURNING *
```

**useWorkouts — delete plan:**
```sql
DELETE FROM workout_plans WHERE id = $id
```
(CASCADE deletes all `workout_exercises` and eventually `session_logs.workout_exercise_id` is set to NULL)

**useWorkouts — update plan:**
```sql
UPDATE workout_plans
SET name = $name, description = $description
WHERE id = $id
RETURNING *
```

**useWorkoutDetail — fetch plan:**
```sql
SELECT * FROM workout_plans WHERE id = $workoutId
```

**useWorkoutDetail — fetch exercises with exercise details:**
```sql
SELECT workout_exercises.*, exercises(*)
FROM workout_exercises
WHERE workout_plan_id = $workoutId
ORDER BY order_index ASC
```

**addExercise:**
```sql
INSERT INTO workout_exercises
  (workout_plan_id, exercise_id, sets, reps, rest_seconds, order_index)
VALUES ($plan_id, $exercise_id, $sets, $reps, $rest, $nextOrder)
RETURNING *, exercises(*)
```

**removeExercise:**
```sql
DELETE FROM workout_exercises WHERE id = $id
```

**updateExercise (sets/reps/rest):**
```sql
UPDATE workout_exercises
SET sets = $sets, reps = $reps, rest_seconds = $rest_seconds
WHERE id = $id
RETURNING *, exercises(*)
```

**reorderExercises (N parallel updates):**
```sql
UPDATE workout_exercises SET order_index = $i WHERE id = $id
```

## RLS assumptions
- `workout_plans`: `FOR ALL USING (auth.uid() = user_id)` — covers all CRUD
- `workout_exercises`: `FOR ALL USING (EXISTS (SELECT 1 FROM workout_plans WHERE workout_plans.id = workout_exercises.workout_plan_id AND workout_plans.user_id = auth.uid()))` — access verified through parent plan

## Table relationships used
- `workout_plans` 1–N `workout_exercises`
- `workout_exercises` N–1 `exercises`
- `workout_exercises` is CASCADE-deleted when its `workout_plans` row is deleted
- `session_logs.workout_exercise_id` is set to NULL (not deleted) when a `workout_exercises` row is deleted
