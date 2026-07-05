# Tech Spec — Dashboard

## Location
`src/features/dashboard/`

## Pages
| File | Route | Description |
|------|-------|-------------|
| `pages/Dashboard.tsx` | `/` (index) | Home dashboard; protected by `PrivateRoute` inside the shared `Layout` |

## Components
| Component | Responsibility |
|-----------|---------------|
| `DashboardGreeting` | Renders "Bună ziua" label and the user's first name in large bold text using `forge-*` design tokens |
| `DashboardNutritieCard` | Tappable card (navigates to `/nutritie`) showing today's calories with progress bar, macro chips (P/C/G with optional targets), water progress bar, and consecutive-day streak counter |
| `StatsGrid` | 3-column grid of `StatCard` sub-components: sessions this week, total sessions, plan count; values displayed in `forge-gold` colour |
| `LastSessionCard` | Single card with plan name, formatted date, duration, and notes for the most recently finished session |
| `WeeklyRhythmStrip` | Mon–Sun dot strip showing training days this week; gold dot for trained days, grey border for today |
| `WorkoutQuickStart` | Lists workout plans as colored cards with difficulty indicator and "Start" button; collapses to 3 items with expand toggle; empty state with CTA — imported in `Dashboard.tsx` but not currently rendered there; used by `WorkoutsPage` |
| `ProgressBanner` | Clickable card linking to `/progres`; currently not rendered in `Dashboard.tsx` |

## Hooks
| Hook | What it does | Supabase tables |
|------|-------------|-----------------|
| `useWorkouts()` | Fetches all user workout plans with exercise count | `workout_plans`, `workout_exercises` |
| `useSessions()` | Fetches last 50 sessions ordered by `started_at` desc | `sessions`, `workout_plans`, `session_logs` |
| `useNutritionLog(date)` | Fetches today's aggregated nutrition log (calories, macros, water) | `nutrition_logs` (nutritie feature) |
| `useNutritionTarget()` | Fetches user's calorie and macro targets | `nutrition_targets` (nutritie feature) |
| `useWeeklyCalories()` | Fetches daily calorie totals for current week for streak calculation | `nutrition_logs` (nutritie feature) |
| `useInstallPWA()` | Browser `beforeinstallprompt` event capture; provides `canInstall`, `isIOS`, `install()` | — (browser API only) |

## Utils / formatters
`src/features/dashboard/utils/formatters.ts`:
- `formatDate(dateStr)` — Romanian locale short date (e.g. "3 iul.")
- `getDuration(start, end)` — Returns "Xh Ymin" or "Z min"; returns null if no end
- `getWeeklyCount(sessions)` — Counts finished sessions since start of current calendar week (Sunday-anchored via `startOfWeek.setDate(... - getDay())`)
- `getDaysSince(dateStr)` — Returns integer days elapsed since a date
- `getWeekTrainingDays(sessions)` — Returns `boolean[7]` (Mon–Sun) indicating which days had a finished session this week (Monday-anchored: `dow === 0 ? 6 : dow - 1`)

`DashboardNutritieCard` uses `formatDate` imported from `features/nutritie/utils/nutritionHelpers`.

## State management
All state is held in the hooks above. `DashboardPage` itself holds:
- Derived `name` from `user.user_metadata.full_name` (split on space, first token)
- Derived `lastSession` (first finished session from the array)

`DashboardNutritieCard` computes `streak` inline from the `days` array returned by `useWeeklyCalories`.

`WorkoutQuickStart` holds local `showAll: boolean` for the expand/collapse toggle (component only used in `WorkoutsPage`, not on the dashboard itself).

## Dependencies on other features
- `features/workouts/hooks/useWorkouts` — workout data
- `features/session/hooks/useSessions` — session data
- `features/nutritie/hooks/useNutritionLog` — today's nutrition totals
- `features/nutritie/hooks/useNutritionTarget` — calorie/macro goals
- `features/nutritie/hooks/useWeeklyCalories` — streak computation
- `features/nutritie/utils/nutritionHelpers.formatDate` — used inside `DashboardNutritieCard`
- `shared/context/AuthContext` — `user` for greeting name
- `shared/components/atoms/Card` — used by `ProgressBanner`
- `shared/hooks/useInstallPWA` — PWA install prompt / iOS detection

## Notable technical decisions
- The dashboard page is divided into two explicit `<section>` blocks with icon+label subtitles: "Nutriție" (Utensils icon) and "Antrenamente" (Dumbbell icon)
- `DashboardNutritieCard` is a cross-feature component: it lives in `dashboard/components/` but imports three hooks and a utility from the `nutritie` feature
- PWA install button (`canInstall`) and iOS install banner (`isIOS`) are rendered inline in `Dashboard.tsx` rather than as a separate component
- Difficulty level in `WorkoutQuickStart`'s inner `WorkoutCard` is derived from exercise count: ≤4 = Ușor, ≤7 = Medie, 8+ = Greu
- `getWeeklyCount` uses Sunday as week start; `getWeekTrainingDays` uses Monday — these remain inconsistent (see TODO)
- `ProgressBanner` was created but never wired into the dashboard page render tree
- The spinner app-loading text changed from "AF" to "AP" in `App.tsx` (ApexPulse branding)
