# TODO — Dashboard

## Status: 🟡

## What's done
- ✅ Personalized greeting
- ✅ Stats grid (weekly count, total, plans)
- ✅ Workout quick-start with colored cards and difficulty indicator
- ✅ Last session card
- ✅ Weekly rhythm strip (Mon–Sun)
- ✅ Expand/collapse for more than 3 workout plans
- ✅ Empty state for no plans

## Gaps / possible improvements
- [ ] Wire up `ProgressBanner` — the component exists in `dashboard/components/` but is never rendered
- [ ] Loading state: no skeleton/spinner shown while `useWorkouts` and `useSessions` are loading; page renders empty stats
- [ ] "Free workout" (no plan) start button — user can only start plan-based sessions from the dashboard
- [ ] The weekly count in `getWeeklyCount` uses Sunday as the start of the week (JavaScript `getDay()` default), while `getWeekTrainingDays` uses Monday — these are inconsistent

## Known bugs or unhandled edge cases
- [ ] `getWeeklyCount` considers Sunday as the week start (day 0 of `startOfWeek.setDate(... - getDay())`), but `getWeekTrainingDays` treats Monday as day 0 — the stats grid "Sesiuni săpt." and the dot strip can show different counts
- [ ] If a session spans midnight, `getWeekTrainingDays` uses `started_at` date, so the session is attributed to the start day

## Refactoring / tech debt
- [ ] `lastSessionByWorkout` is computed inline in `Dashboard.tsx` render — could be extracted to a utility function or memoized with `useMemo`
- [ ] Both `useWorkouts` and `useSessions` are instantiated here and in other pages independently, leading to duplicate Supabase calls across pages
