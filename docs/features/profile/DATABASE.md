# Database — Profile

## Tables used
| Table | Operations | Relevant fields |
|-------|-----------|-----------------|
| `sessions` | SELECT (via `useSessions`) | `id`, `user_id`, `started_at`, `finished_at` |
| `workout_plans` | SELECT (via `useWorkouts`) | `id`, `user_id` |
| `auth.users` | Read (via Supabase session) | `email`, `user_metadata.full_name` |

## Main queries

**useSessions (same as history/dashboard):**
```sql
SELECT sessions.*, workout_plans(name), session_logs(count)
FROM sessions
WHERE user_id = $user_id
ORDER BY started_at DESC
LIMIT 50
```

**useWorkouts:**
```sql
SELECT workout_plans.*, workout_exercises(count)
FROM workout_plans
WHERE user_id = $user_id
ORDER BY created_at DESC
```

Profile-specific stats (total time, weekly count) are computed in JavaScript from the fetched session arrays — no aggregate SQL queries are made.

## RLS assumptions
Identical to history and dashboard features:
- `sessions`: `FOR ALL USING (auth.uid() = user_id)`
- `workout_plans`: `FOR ALL USING (auth.uid() = user_id)`

User metadata (`full_name`, `email`) is read from the Supabase Auth session object, not from a DB query.

## Table relationships used
No additional joins beyond what the shared hooks return.
