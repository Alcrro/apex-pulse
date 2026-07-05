# TODO — Session (Active Workout)

## Status: 🟡 Partial

## What's done
- ✅ Auto-create session on mount + loading state
- ✅ Live elapsed timer in header
- ✅ Exercises grouped by muscle group
- ✅ Full set logging, RPE, notes, 1RM (see `exercitii/`)
- ✅ Rest timer with SVG countdown (see `timer/`)
- ✅ Finish modal with session summary (see `finalizare/`)

## Gaps / possible improvements
- [ ] Abandon / delete unfinished session — sessions with `finished_at = null` accumulate in DB
- [ ] Add exercise not in the plan (ad-hoc exercises during an active session)
- [ ] Swap a plan exercise for a different one mid-session

## Known bugs or unhandled edge cases
- [ ] If user navigates away before `startSession` resolves, an orphan `sessions` row is created with no `finished_at`
- [ ] No guard if `workoutId` URL param doesn't match a real plan — `startSession` fires; Supabase FK constraint catches it but the UI shows no meaningful error message
- [ ] `useWorkoutDetail` + `useActiveSession` both fetch the same plan+exercises join — redundant DB read on every session start

## Refactoring / tech debt
- [ ] `startRef` initialised at mount, not at `startSession` resolve — elapsed time includes DB insert latency
- [ ] Muscle-group grouping `reduce` runs inside JSX render on every state change — not memoized
