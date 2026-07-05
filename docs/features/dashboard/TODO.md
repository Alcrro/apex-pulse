# TODO — Dashboard

## Status: 🟡

## What's done
- ✅ Personalized greeting
- ✅ PWA install button (non-iOS) via `useInstallPWA`
- ✅ iOS install instructions banner
- ✅ Nutriție section with `DashboardNutritieCard` (calories, macros, water, streak)
- ✅ Section subtitles ("Nutriție" with Utensils icon, "Antrenamente" with Dumbbell icon)
- ✅ Stats grid (weekly count, total, plans)
- ✅ Last session card
- ✅ Weekly rhythm strip (Mon–Sun)

## Gaps / possible improvements
- [ ] Wire up `ProgressBanner` — the component exists in `dashboard/components/` but is never rendered
- [ ] Loading state: no skeleton/spinner shown while any hooks are loading; sections render empty
- [ ] "Free workout" (no plan) quick-start button — user can only start plan-based sessions
- [ ] `WorkoutQuickStart` is imported in `Dashboard.tsx` but not rendered — the workout quick-start was moved to `WorkoutsPage`; the unused import should be cleaned up
- [ ] `DashboardNutritieCard` has no error state if nutrition hooks fail; it silently shows zero values

## Known bugs or unhandled edge cases
- [ ] `getWeeklyCount` considers Sunday as the week start (`startOfWeek.setDate(... - getDay())`), but `getWeekTrainingDays` treats Monday as day 0 — the stats grid "Sesiuni săpt." and the dot strip can show different counts
- [ ] If a session spans midnight, `getWeekTrainingDays` uses `started_at` date, so the session is attributed to the start day
- [ ] Both `canInstall` and `isIOS` could theoretically both be true (edge case with iOS PWA support detection); both banners would render simultaneously

## Refactoring / tech debt
- [ ] `DashboardNutritieCard` imports from `features/nutritie/` breaking the feature-isolation boundary; consider moving it to the `nutritie` feature or creating a shared cross-feature component
- [ ] Both `useWorkouts` and `useSessions` are instantiated here and in other pages independently, leading to duplicate Supabase calls across pages
- [ ] The streak calculation in `DashboardNutritieCard` is inline; could be extracted to a utility or hook
