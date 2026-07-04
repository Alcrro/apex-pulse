# Tech Spec — Exercises

## Location
`src/features/exercises/`

## Pages
None. The exercises feature has no route.

## Components
None. All UI is owned by consuming features (workouts, progress).

## Hooks
| Hook | What it does | Supabase tables |
|------|-------------|-----------------|
| `useExercises()` | Fetches global + user custom exercises; exposes `createCustomExercise` mutation | `exercises` |

**Returns:** `{ exercises: Exercise[], loading: boolean, createCustomExercise, refetch }`

`createCustomExercise(name, muscleGroup, equipment)`:
- Inserts into `exercises` with `is_custom: true` and `user_id: user.id`
- On success, appends to local state sorted by name

## Utils / formatters
`shared/lib/exercises.ts` (shared, not feature-local):
- `DEFAULT_EXERCISES` — static array of ~90 exercise definitions (used for reference/seeding, not queried)
- `MUSCLE_GROUPS` — `['Piept', 'Spate', 'Umeri', 'Biceps', 'Triceps', 'Picioare', 'Abdomen']`
- `EQUIPMENT_TYPES` — `['Bara', 'Gantere', 'Cablu', 'Masina', 'Greutate corporala', 'Alt echipament']`
- `calculate1RM(weight, reps)` — Epley formula: `weight * (1 + reps / 30)`, returns 1 if reps = 1

`shared/lib/exercise_images.ts`:
- `EXERCISE_IMAGES` — static `Record<string, string>` mapping exercise names to image URLs from the `yuhonas/free-exercise-db` GitHub repository
- `getExerciseImage(name)` — lookup helper, returns `undefined` for unmapped exercises

## State management
`useExercises` manages its own `exercises: Exercise[]` and `loading: boolean` state. Re-runs fetch on `user` change.

## Dependencies on other features
- `shared/context/AuthContext` — `user.id` for both the OR filter and insert
- `shared/lib/supabase` — Supabase client

## Notable technical decisions
- The Supabase query uses `.or('is_custom.eq.false,user_id.eq.${user.id}')` to combine global and user-specific exercises in a single query without a union
- Results are ordered server-side by `muscle_group` then `name`; after `createCustomExercise` the client re-sorts by name only (muscle group order not enforced client-side)
- `image_url` field exists on the `Exercise` type but is always `undefined` from the DB — `getExerciseImage` provides fallback images from a static map
