# Database — Dashboard

## Tables used
| Table | Operations | Relevant fields |
|-------|-----------|-----------------|
| `workout_plans` | SELECT | `id`, `name`, `description`, `created_at` |
| `workout_exercises` | SELECT (count aggregate via join) | `count` |
| `sessions` | SELECT | `id`, `user_id`, `workout_plan_id`, `started_at`, `finished_at`, `notes` |
| `session_logs` | SELECT (count aggregate via join) | `count` |

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

## RLS assumptions
Both queries rely on RLS:
- `workout_plans`: policy `"Userii vad doar planurile lor"` — `auth.uid() = user_id`
- `sessions`: policy `"Userii vad doar sesiunile lor"` — `auth.uid() = user_id`
- `workout_exercises` and `session_logs` are accessed only as embedded counts, inheriting the parent table's RLS via the join

## Table relationships used
- `workout_plans` 1–N `workout_exercises` (joined for count)
- `sessions` N–1 `workout_plans` (joined for plan name)
- `sessions` 1–N `session_logs` (joined for set count)
