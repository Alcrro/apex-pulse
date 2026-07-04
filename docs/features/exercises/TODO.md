# TODO — Exercises

## Status: 🟡

## What's done
- ✅ Fetch global exercises (pre-seeded ~46 in DB)
- ✅ Fetch user custom exercises alongside global ones in a single query
- ✅ Create custom exercise (name, muscle group, equipment)
- ✅ Static exercise image map covering most pre-seeded exercises
- ✅ `calculate1RM` utility function (Epley formula)

## Gaps / possible improvements
- [ ] No edit custom exercise UI (no UPDATE policy exists either)
- [ ] No delete custom exercise UI (RLS DELETE policy exists but no button in the app)
- [ ] No dedicated exercises page/route where a user could browse or manage their custom exercises independently of the workout builder
- [ ] `image_url` column on exercises table is never populated — all images are resolved from a static compile-time map; adding a new exercise to the DB outside the static list will have no image
- [ ] The ~90-entry `DEFAULT_EXERCISES` constant in `exercises.ts` is not used at runtime — it's documentation/reference only; the DB is seeded with only ~46 entries

## Known bugs or unhandled edge cases
- [ ] `createCustomExercise` does not guard against duplicate names for the same user
- [ ] After `createCustomExercise`, the local state is sorted by name only, not by `muscle_group` then name as the server returns — may cause ordering inconsistency if the consumer relies on grouped display

## Refactoring / tech debt
- [ ] `useExercises` is instantiated independently in `ExerciseSelector` (workouts) and `ExerciseProgressSection` (progress) — fetches fire twice with no shared cache
- [ ] `image_url` field on `Exercise` type is `string | undefined` but always `undefined` from DB; could be removed from the type or actually populated
