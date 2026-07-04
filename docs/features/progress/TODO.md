# TODO — Progress

## Status: 🟡

## What's done
- ✅ Exercise 1RM progress area chart
- ✅ Best-per-day aggregation with Epley 1RM formula
- ✅ Current 1RM and delta stats above chart
- ✅ Body weight line chart (last 90 entries)
- ✅ Body weight log form (weight + date)
- ✅ Body weight current value and delta stats
- ✅ Custom chart tooltip
- ✅ Loading and empty states for both sections

## Gaps / possible improvements
- [ ] Delete body weight entries
- [ ] Edit body weight entries
- [ ] Date range filter for exercise progress chart
- [ ] Volume chart (total weight lifted per session: sets × reps × weight)
- [ ] Session frequency / consistency chart (sessions per week over time)
- [ ] Per-muscle-group progress overview
- [ ] Personal records (PR) table per exercise
- [ ] Export data (CSV/PDF)
- [ ] Body weight target / goal line on chart

## Known bugs or unhandled edge cases
- [ ] If two body weight entries have the same `recorded_at` date, both appear on the chart — no duplicate-date guard in `addEntry`
- [ ] `useExerciseProgress` RLS depends on the join to `sessions` — if a session is deleted, the logs are cascade-deleted and no longer visible; however if session has no `finished_at` (abandoned), logs are silently excluded from the chart with no explanation
- [ ] `addEntry` does not check for a duplicate date; submitting the same date twice appends both entries to the chart
- [ ] `BodyWeightSection` uses a raw `<input type="number">` and `<input type="date">` instead of the shared `Input` atom, breaking design consistency

## Refactoring / tech debt
- [ ] `useExercises` is instantiated a second time in `ExerciseProgressSection`, adding a duplicate DB fetch
- [ ] Post-processing logic (grouping by date, picking max 1RM) inside `useExerciseProgress` could be extracted to a pure utility function for testability
