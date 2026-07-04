# PRD — Workouts

## What it does
Allows users to create, view, edit, and delete workout plans. Each plan contains an ordered list of exercises with configured sets, reps, and rest time. Users can browse and select exercises from the global library or create custom ones. Exercise order can be changed via drag-and-drop.

## Who uses it and when
Any authenticated user who wants to build or manage their training structure. Accessed via `/antrenamente` from the bottom nav.

## Implemented functionality
- ✅ List all workout plans with exercise count and optional description (`WorkoutsPage`)
- ✅ Create new plan via modal (name + optional description) — navigates to the detail page after creation
- ✅ Delete plan with `confirm()` dialog; removes from list immediately (optimistic UI)
- ✅ Skeleton loading state (3 placeholders) while plans are fetching
- ✅ Empty state with CTA when no plans exist
- ✅ Workout detail page (`WorkoutDetailPage`):
  - Shows plan name, description, and exercise count
  - "Începe antrenamentul" button navigates to `/sesiune/:id` (disabled if no exercises)
  - Exercises listed grouped by muscle group with `order_index` within each group
  - Drag-and-drop reorder via `@dnd-kit` (pointer + touch sensors; touch requires 200ms hold)
  - Add exercise: opens `ExerciseSelector` modal → then `AddExerciseModal` for sets/reps/rest config
  - Edit exercise sets/reps/rest inline within the card
  - Remove exercise with trash icon
- ✅ `ExerciseSelector` modal:
  - Full-screen search with text filter and muscle-group chip filter
  - Exercises listed grouped by muscle group with thumbnail images
  - Long-press (500ms) on an exercise image opens a full-screen image preview overlay
  - "Adaugă exercițiu custom" form inline in the modal (name, muscle group, equipment)

## Known limitations / missing
- No rename/edit plan name or description after creation (no edit plan modal)
- No duplicate plan
- No workout plan reorder
- Exercise order within the plan is global (not per muscle group — `order_index` is a flat index, but display groups by muscle group which hides reorder intent)
- `confirm()` used for delete (browser native, not a styled modal)

## Main user flow
1. User taps "Planuri" in bottom nav → `WorkoutsPage`
2. Taps "+ Nou" → `CreateWorkoutModal` opens
3. Enters name, optionally description → "Creează plan" → navigated to `WorkoutDetailPage`
4. Taps "Adaugă" → `ExerciseSelector` opens, searches/filters, selects exercise
5. `AddExerciseModal` opens with default 3 × 10 × 90s → taps "Adaugă exercițiu" → exercise appears in list
6. Optionally reorders exercises by dragging grip handle
7. Taps "Începe antrenamentul" → navigated to `/sesiune/:id`
