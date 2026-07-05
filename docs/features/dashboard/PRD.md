# PRD — Dashboard

## What it does
The home page shown after login. Gives the user a snapshot of their nutrition and training activity, and quick access to start any workout plan. The page is split into two explicit sections: "Nutriție" and "Antrenamente", each with a section header subtitle.

## Who uses it and when
Every authenticated user sees this page on app open. It is the default route `/`.

## Implemented functionality
- ✅ Personalized greeting using first name from `user_metadata.full_name` (falls back to "Sportiv")
- ✅ PWA install button: shown when `canInstall` is true (non-iOS, browser install prompt available); tapping calls `install()` from `useInstallPWA`
- ✅ iOS install banner: shown when `isIOS` is true; displays manual Share → Add to Home Screen instructions
- ✅ **Nutriție section** (new) — labelled with a Utensils icon subtitle:
  - `DashboardNutritieCard` — tappable card navigating to `/nutritie`:
    - Today's calorie count with progress bar toward daily target
    - Macro chips (P/C/G in grams, with optional targets)
    - Water intake progress bar (ml / target ml)
    - Consecutive-day logging streak counter (shows flame icon when > 0 days)
- ✅ **Antrenamente section** — labelled with a Dumbbell icon subtitle:
  - Stats grid: sessions this week, total finished sessions, number of plans
  - Last session card: plan name, date, duration, optional notes, days-since label
  - Weekly rhythm strip: Mon–Sun dots, gold-filled on days with a finished session this week, today's dot highlighted
- ✅ `ProgressBanner` component exists in the dashboard feature but is not rendered in `Dashboard.tsx`

## Known limitations / missing
- No loading skeleton shown for any section while data is fetching
- `ProgressBanner` component is unused
- No "free workout" (sessionless) quick-start button from the dashboard
- Dashboard re-fetches sessions and workouts on every mount; no cache or stale-while-revalidate
- `WorkoutQuickStart` component is imported but not rendered in `Dashboard.tsx`; workout plans are shown via the `/antrenamente` route instead

## Main user flow
1. User logs in or opens the app
2. Dashboard mounts; `useWorkouts()`, `useSessions()`, `useNutritionLog()`, `useNutritionTarget()`, `useWeeklyCalories()` fire their Supabase queries
3. Greeting and section headers render immediately
4. Nutriție card shows today's calories/macros/water once nutrition hooks resolve
5. Antrenamente section shows stats, last session, and weekly strip once session/workout hooks resolve
6. User taps `DashboardNutritieCard` → navigated to `/nutritie`
7. Or user taps bottom nav → `/antrenamente` to manage/start workouts
