# Database — History

## Tables used
| Table | Operations | Relevant fields |
|-------|-----------|-----------------|
| `sessions` | SELECT | `id`, `user_id`, `workout_plan_id`, `started_at`, `finished_at`, `notes` |
| `workout_plans` | SELECT (embedded join) | `name` |
| `session_logs` | SELECT (count aggregate via join) | `count` |

## Main queries

**useSessions — last 50 sessions with plan name and log count:**
```sql
SELECT sessions.*, workout_plans(name), session_logs(count)
FROM sessions
WHERE user_id = $user_id
ORDER BY started_at DESC
LIMIT 50
```

History then filters in JavaScript:
```js
sessions.filter(s => s.finished_at)
```

## RLS assumptions
- `sessions`: policy `"Userii vad doar sesiunile lor"` — `FOR ALL USING (auth.uid() = user_id)`
- `workout_plans` and `session_logs` inherit visibility through the session join; no extra RLS needed for the embedded selects

## Table relationships used
- `sessions` N–1 `workout_plans` — for plan name display
- `sessions` 1–N `session_logs` — for set count display
