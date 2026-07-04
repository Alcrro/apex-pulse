# TODO — Workouts

## Status: 🟡

## What's done
- ✅ List, create, delete workout plans
- ✅ Plan detail with exercise list grouped by muscle group
- ✅ Add exercise via selector modal with image thumbnails and filters
- ✅ Custom exercise creation inline in selector
- ✅ Configure exercise sets/reps/rest in `AddExerciseModal`
- ✅ Inline edit sets/reps/rest on `ExerciseRow`
- ✅ Remove exercise
- ✅ Drag-and-drop reorder (pointer + touch)
- ✅ Long-press image preview in `ExerciseSelector`
- ✅ Skeleton loading and empty states

## Gaps / possible improvements
- [ ] Edit plan name / description after creation (no edit plan modal exists)
- [ ] Duplicate plan
- [ ] Reorder plans in the plan list
- [ ] Delete confirmation uses `window.confirm()` — should use a styled confirmation modal
- [ ] No plan tags or categories
- [ ] No exercise notes at the plan level (only at the set-log level during session)

## Known bugs or unhandled edge cases
- [ ] `reorderExercises` fires N parallel Supabase UPDATE calls without any transaction — if one fails, the DB and UI are out of sync with no error handling or rollback
- [ ] `addExercise` sets `order_index` to `exercises.length` (current client-side count) — if two clients add simultaneously, duplicate `order_index` values are possible
- [ ] The "grouped by muscle group" display in `WorkoutDetailPage` does not reflect drag-and-drop reorder correctly: if a user reorders across groups (e.g. moves a Piept exercise between Spate exercises), the flat `order_index` changes, but the render re-groups by muscle_group so the visual position may not match the stored order
- [ ] `ExerciseRow` `form` state is initialized from `we.sets / we.reps / we.rest_seconds` on mount; if the parent updates these props, the form does not re-initialize (stale closure)

## Refactoring / tech debt
- [ ] `WorkoutDetailPage` groups exercises by muscle group inline in JSX (`reduce` inside render) — not memoized; recomputes on every state change
- [ ] `ExerciseSelector` is a large single-file component (~223 lines); the inline custom exercise creation form could be a separate component
- [ ] `useExercises` is re-instantiated inside `ExerciseSelector` on each open, refetching the full exercise list
