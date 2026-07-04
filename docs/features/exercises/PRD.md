# PRD — Exercises

## What it does
Provides access to the global exercise library and allows users to create custom exercises. The exercises feature is a shared data layer — it has no dedicated page or route of its own. It is consumed by the workout and progress features.

## Who uses it and when
- The **workouts** feature uses `useExercises` via `ExerciseSelector` when adding exercises to a plan
- The **progress** feature uses `useExercises` in `ExerciseProgressSection` to populate the exercise picker dropdown

## Implemented functionality
- ✅ Fetch all global (pre-seeded) exercises from the `exercises` table (`is_custom = false`)
- ✅ Fetch user's own custom exercises (`is_custom = true AND user_id = current user`)
- ✅ Create a custom exercise with name, muscle group, and equipment type
- ✅ Exercise images resolved via `getExerciseImage(name)` from `shared/lib/exercise_images.ts` (static map to GitHub CDN URLs)
- ✅ Exercises ordered by `muscle_group` then `name` from Supabase

## Known limitations / missing
- No dedicated exercises page or route
- No ability to edit or delete custom exercises
- No search/filter UI within the hook itself (filtering is done by consumers)
- `image_url` column on exercises is in the type definition but never populated via the app — all images come from the static `EXERCISE_IMAGES` map
- ~90 exercises in the static `DEFAULT_EXERCISES` constant in `exercises.ts`, but only ~46 are seeded in `supabase-schema.sql`; the static list is for reference only

## Main user flow
Used as a data source only — no standalone user flow. See workouts/PRD.md for the flow that surfaces exercises.
