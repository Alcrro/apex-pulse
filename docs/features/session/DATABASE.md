# Database — Session (Active Workout)

## Tables used
| Table | Operations | Relevant fields |
|-------|-----------|-----------------|
| `sessions` | INSERT (start), UPDATE (finish), SELECT | `id`, `user_id`, `workout_plan_id`, `started_at`, `finished_at`, `notes` |
| `workout_plans` | SELECT (embedded join) | `id`, `name` |
| `workout_exercises` | SELECT (embedded join) | `id`, `exercise_id`, `sets`, `reps`, `rest_seconds`, `order_index` |
| `exercises` | SELECT (embedded join) | `id`, `name`, `muscle_group`, `equipment`, `image_url` |
| `session_logs` | INSERT, DELETE, SELECT | `id`, `session_id`, `exercise_id`, `workout_exercise_id`, `weight`, `reps`, `rpe`, `notes`, `logged_at` |

## Main queries

```sql
-- startSession
INSERT INTO sessions (user_id, workout_plan_id)
VALUES ($user_id, $workout_plan_id)
RETURNING *

-- useActiveSession: fetch session with full plan hierarchy (3-level join)
SELECT sessions.*, workout_plans(*, workout_exercises(*, exercises(*)))
FROM sessions
WHERE id = $session_id

-- useActiveSession: fetch all logs for session
SELECT * FROM session_logs
WHERE session_id = $session_id
ORDER BY logged_at ASC
```

See `exercitii/DATABASE.md` for set logging queries.
See `finalizare/DATABASE.md` for the `finishSession` UPDATE.

## RLS assumptions
- `sessions`: `FOR ALL USING (auth.uid() = user_id)`
- `session_logs`: `FOR ALL USING (EXISTS (SELECT 1 FROM sessions WHERE id = session_logs.session_id AND user_id = auth.uid()))` — no direct `user_id` on `session_logs`
- `workout_plans`, `workout_exercises`, `exercises`: accessed via embedded joins; read access for user-owned plans

## Table relationships
- `sessions` N–1 `workout_plans` → N `workout_exercises` → N–1 `exercises`
- `sessions` 1–N `session_logs`
- `session_logs.workout_exercise_id` → `workout_exercises` (nullable; ON DELETE SET NULL)
