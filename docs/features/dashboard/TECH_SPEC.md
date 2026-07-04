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
| `StatsGrid` | 3-column grid of `StatCard` sub-components: sessions this week, total sessions, plan count; values displayed in `forge-gold` colour |
| `WorkoutQuickStart` | Lists workout plans as colored cards with difficulty indicator and "Start" button; collapses to 3 items with expand toggle; empty state with CTA |
| `LastSessionCard` | Single card with plan name, formatted date, duration, and notes for the most recent finished session |
| `WeeklyRhythmStrip` | Mon–Sun dot strip showing training days this week; gold dot for trained days, grey border for today |
| `ProgressBanner` | Clickable card linking to `/progres`; currently not rendered in `Dashboard.tsx` |

## Hooks
| Hook | What it does | Supabase tables |
|------|-------------|-----------------|
| `useWorkouts()` | Fetches all user workout plans with exercise count | `workout_plans`, `workout_exercises` |
| `useSessions()` | Fetches last 50 sessions ordered by `started_at` desc | `sessions`, `workout_plans`, `session_logs` |

## Utils / formatters
`src/features/dashboard/utils/formatters.ts`:
- `formatDate(dateStr)` — Romanian locale short date (e.g. "3 iul.")
- `getDuration(start, end)` — Returns "Xh Ymin" or "Z min"; returns null if no end
- `getWeeklyCount(sessions)` — Counts finished sessions since start of current calendar week (Sunday-anchored)
- `getDaysSince(dateStr)` — Returns integer days elapsed since a date
- `getWeekTrainingDays(sessions)` — Returns `boolean[7]` (Mon–Sun) indicating which days had a finished session this week

## State management
All state is held in the two hooks. Dashboard itself holds:
- Derived `name` from `user.user_metadata.full_name`
- Derived `lastSession` (first finished session from the array)
- Derived `lastSessionByWorkout` map (workout_plan_id → most recent started_at) — computed inline in render

`WorkoutQuickStart` holds local `showAll: boolean` for the expand/collapse toggle.

## Dependencies on other features
- `features/workouts/hooks/useWorkouts` — workout data
- `features/session/hooks/useSessions` — session data
- `shared/context/AuthContext` — `user` for greeting name
- `shared/components/atoms/Card` — used by `ProgressBanner`

## Notable technical decisions
- Workout color in `WorkoutQuickStart` is determined by a keyword match on the plan name (e.g. "piept" → red), falling back to gold — purely cosmetic, no DB field
- Difficulty level (Easy/Medium/Hard) is derived from exercise count: ≤4 = Easy, ≤7 = Medium, 8+ = Hard
- The weekly count uses `startOfWeek.getDay()` with Sunday as day 0; `getWeekTrainingDays` adjusts to Mon–Sun display order independently
- `ProgressBanner` was created but never wired into the dashboard page render tree
