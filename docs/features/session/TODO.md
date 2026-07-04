# TODO — Session

## Status: 🟡

## What's done
- ✅ Auto-create session on page mount
- ✅ Live elapsed timer
- ✅ Exercise cards grouped by muscle group
- ✅ Previous session reference per exercise
- ✅ Weight + reps inputs with pre-fill
- ✅ RPE selector (optional)
- ✅ Per-set notes (optional)
- ✅ Live 1RM estimate
- ✅ Log set with optimistic local state update
- ✅ Logged sets table with delete
- ✅ Rest timer with circular SVG countdown and reset/skip
- ✅ Finish modal with notes, elapsed time, set count
- ✅ Exercise images with fallback Dumbbell icon

## Gaps / possible improvements
- [ ] Add exercise to session that is not in the plan (ad-hoc exercises)
- [ ] Abandon/delete unfinished session — currently these persist in DB with `finished_at = null`
- [ ] Audio cue when rest timer reaches 0
- [ ] Vibration / haptic feedback on rest timer completion
- [ ] Reorder sets is not possible — sets are append-only; only deletion
- [ ] Swap exercise within session (replace one plan exercise with another)
- [ ] Session notes are session-level only; per-exercise notes are per-set only (no mid-exercise note)

## Known bugs or unhandled edge cases
- [ ] If the user taps "Start" and immediately navigates back before `startSession` resolves, a session row may be created in the DB without ever being finished
- [ ] `useWorkoutDetail` and `useActiveSession` both fetch the workout plan + exercises — this is a duplicate query; the exercises loaded via `useWorkoutDetail` are used for the exercise list before `sessionId` is known, then `useActiveSession` loads them again once the session is created
- [ ] `usePreviousExerciseLogs` has `exerciseIds.join(',')` as a dependency string — this causes the effect to re-run if the array reference changes even if values are the same
- [ ] Rest timer launches after every logged set; if the user taps the log button quickly twice (before the timer opens), two timers would stack (though in practice the overlay blocks input)
- [ ] No guard if `workoutId` from URL params doesn't correspond to a real workout — `startSession` would succeed with an invalid plan ID (Supabase FK constraint would catch it but the UI shows no meaningful error)

## Refactoring / tech debt
- [ ] The two-hook pattern (`useWorkoutDetail` + `useActiveSession`) causes redundant fetches — consider fetching exercises only once
- [ ] `SessionExerciseBlock` is a large component (164 lines) combining form, table, RPE picker, and timer logic; could be split into smaller sub-components
- [ ] `elapsed` timer uses `setInterval` with `Date.now() - startRef.current` — correct approach, but `startRef` is initialized to `Date.now()` at module evaluation, not at the moment `startSession` resolves; may show a few seconds of extra elapsed time
