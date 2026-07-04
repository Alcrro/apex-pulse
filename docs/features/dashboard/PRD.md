# PRD — Dashboard

## What it does
The home page shown after login. Gives the user a snapshot of their training activity and quick access to start any workout plan. It combines a personalized greeting, aggregate stats, a weekly rhythm strip, a quick-start list of workout plans, and a card showing the most recent finished session.

## Who uses it and when
Every authenticated user sees this page on app open. It is the default route `/`.

## Implemented functionality
- ✅ Personalized greeting using first name from `user_metadata.full_name` (falls back to "Sportiv")
- ✅ Stats grid: sessions this week, total finished sessions, number of plans
- ✅ Weekly rhythm strip: Mon–Sun dots, gold-filled on days with a finished session this week, today's dot highlighted with a border
- ✅ Workout quick-start list: shows all user plans as cards with exercise count, color-coded difficulty bars, and days-since-last-session label
  - Collapsed to first 3 plans with "Vezi toate (N)" expand toggle
  - "Start" button navigates to `/sesiune/<workoutId>` to begin a session
  - Empty state with CTA to create first plan (navigates to `/antrenamente`)
- ✅ Last session card: shows plan name, date, duration, and optional notes for the most recently finished session
- ✅ `ProgressBanner` component exists in the dashboard feature but is not rendered in `Dashboard.tsx`

## Known limitations / missing
- No loading skeleton shown for the stats/sessions area (data appears only once fetched)
- `ProgressBanner` component is unused
- No "free workout" (sessionless) quick-start button
- Dashboard re-fetches sessions and workouts on every mount; no cache or stale-while-revalidate

## Main user flow
1. User logs in or opens the app
2. Dashboard mounts; `useWorkouts()` and `useSessions()` fire their Supabase queries
3. Greeting and stats grid render with fetched data
4. User sees their plans under "Antrenamente"; taps "Start" on a plan
5. Navigated to `/sesiune/<workoutId>` to begin the active session
