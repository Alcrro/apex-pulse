# Database — Progress

## Tables used
| Table | Operations | Relevant fields |
|-------|-----------|-----------------|
| `exercises` | SELECT | `id`, `name`, `muscle_group`, `is_custom`, `user_id` |
| `session_logs` | SELECT | `weight`, `reps`, `logged_at`, `exercise_id`, `session_id` |
| `sessions` | SELECT (embedded join) | `started_at`, `finished_at` |
| `body_weight` | SELECT, INSERT | `id`, `user_id`, `weight`, `recorded_at`, `created_at` |

## Main queries

**useExerciseProgress — logs for a selected exercise:**
```sql
SELECT weight, reps, logged_at, sessions(started_at, finished_at)
FROM session_logs
WHERE exercise_id = $exerciseId
  AND weight IS NOT NULL
ORDER BY logged_at ASC
LIMIT 200
```
Post-processing in JS:
- Filter to logs where `sessions.finished_at IS NOT NULL`
- Group by `sessions.started_at::date`
- Keep record with highest `calculate1RM(weight, reps)` per date

**useBodyWeight — last 90 body weight entries:**
```sql
SELECT *
FROM body_weight
WHERE user_id = $user_id
ORDER BY recorded_at ASC
LIMIT 90
```

**useBodyWeight — add entry:**
```sql
INSERT INTO body_weight (user_id, weight, recorded_at)
VALUES ($user_id, $weight, $date)
RETURNING *
```

## RLS assumptions
- `session_logs`: policy `"Userii vad doar log-urile lor"` — access checked via join to `sessions.user_id = auth.uid()`; no `user_id` column on `session_logs` itself
- `body_weight`: policy `"Userii vad doar greutatea lor"` — `FOR ALL USING (auth.uid() = user_id)`
- `exercises`: visible via two-policy pattern (see exercises/DATABASE.md)

## Table relationships used
- `session_logs` N–1 `sessions` — joined to get `started_at` (chart date) and `finished_at` (filter)
- `body_weight` is standalone (only joined to `auth.users` via `user_id`)
