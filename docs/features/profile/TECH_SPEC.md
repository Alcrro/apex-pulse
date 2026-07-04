# Tech Spec — Profile

## Location
`src/features/profile/`

## Pages
| File | Route | Description |
|------|-------|-------------|
| `pages/Profile.tsx` | `/profil` | User profile and stats; protected by `PrivateRoute` inside shared `Layout` |

## Components
| Component | Responsibility |
|-----------|---------------|
| `ProfileCard` | Displays user icon, full name, and email |
| `ProfileStats` | 2×2 grid: total sessions, weekly count, total time, plans count |

## Hooks
| Hook | What it does | Supabase tables |
|------|-------------|-----------------|
| `useSessions()` | Fetches last 50 sessions for stat calculations | `sessions`, `workout_plans`, `session_logs` |
| `useWorkouts()` | Fetches all user workout plans for plan count | `workout_plans`, `workout_exercises` |
| `useAuth()` | Provides `user` (name, email) and `signOut` | `auth.users` |

## Utils / formatters
`src/features/profile/utils/statsUtils.ts`:
- `getTotalMins(sessions)` — sums `(finished_at - started_at)` in minutes for all finished sessions
- `formatTotalTime(mins)` — returns `"Xh"` if ≥60 mins, else `"Xm"`
- `getWeeklyCount(sessions)` — counts sessions started since the beginning of the current calendar week (Sunday-anchored, same logic as `dashboard/utils/formatters.ts`)

## State management
Local state in `Profile.tsx`:
- `signingOut: boolean` — disables the sign-out button while the async call is in-flight

All other data comes from hooks.

## Dependencies on other features
- `features/session/hooks/useSessions` — session data
- `features/workouts/hooks/useWorkouts` — plan count
- `shared/context/AuthContext` — user identity and `signOut`
- `shared/components/atoms/Card` — card container in `ProfileCard` and `ProfileStats`
- `shared/components/atoms/Button` — sign-out button

## Notable technical decisions
- `Profile.tsx` filters sessions client-side with `sessions.filter(s => s.finished_at)` before passing to stat utilities
- `formatTotalTime` rounds down: 119 minutes → "1h" (not "1h 59min")
- Name falls back to `'Utilizator'` if `user_metadata.full_name` is absent
