# Database — Session

## Tables used
| Table | Operations | Relevant fields |
|-------|-----------|-----------------|
| `sessions` | INSERT (start), UPDATE (finish), SELECT | `id`, `user_id`, `workout_plan_id`, `started_at`, `finished_at`, `notes` |
| `workout_plans` | SELECT (embedded) | `id`, `name` |
| `workout_exercises` | SELECT (embedded) | `id`, `workout_plan_id`, `exercise_id`, `sets`, `reps`, `rest_seconds`, `order_index` |
| `exercises` | SELECT (embedded) | `id`, `name`, `muscle_group`, `equipment`, `image_url` |
| `session_logs` | INSERT (log set), DELETE (delete log), SELECT | `id`, `session_id`, `exercise_id`, `workout_exercise_id`, `weight`, `reps`, `rpe`, `notes`, `logged_at` |

## Main queries

**startSession — insert new session:**
```sql
INSERT INTO sessions (user_id, workout_plan_id)
VALUES ($user_id, $workout_plan_id)
RETURNING *
```

**finishSession — mark finished:**
```sql
UPDATE sessions
SET finished_at = now(), notes = $notes
WHERE id = $session_id
```

**useActiveSession — fetch session with full plan hierarchy:**
```sql
SELECT sessions.*, workout_plans(*, workout_exercises(*, exercises(*)))
FROM sessions
WHERE id = $session_id
```

**useActiveSession — fetch all logs for session:**
```sql
SELECT *
FROM session_logs
WHERE session_id = $session_id
ORDER BY logged_at ASC
```

**logSet — insert a set log:**
```sql
INSERT INTO session_logs
  (session_id, exercise_id, workout_exercise_id, weight, reps, rpe, notes)
VALUES ($session_id, $exercise_id, $workout_exercise_id, $weight, $reps, $rpe, $notes)
RETURNING *
```

**deleteLog:**
```sql
DELETE FROM session_logs WHERE id = $log_id
```

**usePreviousExerciseLogs — most recent log per exercise, excluding current session:**
```sql
SELECT exercise_id, weight, reps, logged_at
FROM session_logs
WHERE exercise_id IN ($exercise_ids)
  AND session_id != $current_session_id
ORDER BY logged_at DESC
```
(First-seen per exercise_id is kept in JS to get the most recent.)

## RLS assumptions
- `sessions`: `FOR ALL USING (auth.uid() = user_id)` — covers INSERT, SELECT, UPDATE
- `session_logs`: `FOR ALL USING (EXISTS (SELECT 1 FROM sessions WHERE sessions.id = session_logs.session_id AND sessions.user_id = auth.uid()))` — no direct `user_id` on `session_logs`; access verified through parent session

## Table relationships used
- `sessions` N–1 `workout_plans` → N `workout_exercises` → N–1 `exercises` (3-level join for active session display)
- `sessions` 1–N `session_logs` → N–1 `exercises`
- `session_logs.workout_exercise_id` → `workout_exercises` (nullable; ON DELETE SET NULL)
