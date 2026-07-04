# Database — Exercises

## Tables used
| Table | Operations | Relevant fields |
|-------|-----------|-----------------|
| `exercises` | SELECT (global + custom), INSERT (custom only) | `id`, `name`, `muscle_group`, `equipment`, `is_custom`, `user_id`, `created_at`, `image_url` |

## Main queries

**Fetch all accessible exercises:**
```sql
SELECT *
FROM exercises
WHERE is_custom = false OR user_id = $user_id
ORDER BY muscle_group, name
```
(Expressed in PostgREST syntax as `.or('is_custom.eq.false,user_id.eq.${user.id}')`)

**Create custom exercise:**
```sql
INSERT INTO exercises (name, muscle_group, equipment, is_custom, user_id)
VALUES ($name, $muscle_group, $equipment, true, $user_id)
RETURNING *
```

## RLS assumptions
Two separate SELECT policies exist on `exercises`:
- `"Exercitii globale vizibile de toti"`: `FOR SELECT USING (is_custom = false)` — all authenticated users can read global exercises
- `"Exercitii custom vizibile doar de owner"`: `FOR SELECT USING (is_custom = true AND auth.uid() = user_id)` — custom exercises visible only to their creator

INSERT policy: `"Userii pot crea exercitii custom"` — `WITH CHECK (is_custom = true AND auth.uid() = user_id)`

DELETE policy: `"Userii pot sterge exercitii custom proprii"` — `USING (is_custom = true AND auth.uid() = user_id)` (delete UI not implemented)

No UPDATE policy exists.

## Table relationships used
`exercises.id` is referenced by:
- `workout_exercises.exercise_id` (ON DELETE CASCADE)
- `session_logs.exercise_id` (ON DELETE CASCADE)
