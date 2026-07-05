# Tech Spec — Session (Active Workout)

## Location
`src/features/session/`

## Page
| File | Route | Description |
|------|-------|-------------|
| `pages/ActiveSession.tsx` | `/sesiune/:workoutId` | Full-screen; protected by `PrivateRoute` but NOT inside shared `Layout` |

## Components
| Component | Responsibility |
|-----------|---------------|
| `SessionHeader` | Workout name + live elapsed timer (MM:SS) + back chevron + "Finalizează" button |

## Hooks
| Hook | What it does | Supabase tables |
|------|-------------|-----------------|
| `useSessions()` | `startSession(workoutPlanId)` inserts session row; `finishSession(id, notes)` sets `finished_at` | `sessions` |
| `useActiveSession(sessionId)` | Fetches session with full plan+exercises+exercise data; fetches all logs for session; provides `logSet`, `deleteLog` | `sessions`, `workout_plans`, `workout_exercises`, `exercises`, `session_logs` |
| `useWorkoutDetail(workoutId)` | Fetches workout exercises ordered by `order_index` — used before `sessionId` is known | `workout_plans`, `workout_exercises`, `exercises` |

## State management (`ActiveSession.tsx`)
- `sessionId: string | null` — set after `startSession` resolves
- `starting: boolean` — shows loading spinner
- `showFinish: boolean` — controls `FinishSessionModal` visibility
- `elapsed: number` — seconds since page mount; incremented by `setInterval` every 1s
- `startRef: MutableRefObject<number>` — `Date.now()` captured at mount for elapsed calculation

## Dependencies
- `shared/components/atoms/Button`, `Card`
- `shared/components/molecules/Modal` — used inside `FinishSessionModal`
- `shared/lib/exercise_images.getExerciseImage` — exercise thumbnails
- `shared/lib/exercises.calculate1RM` — 1RM estimate

## Notable technical decisions
- `startSession` is called in a `useEffect` on mount — creates a DB row immediately with no "preview before start"
- Both `useWorkoutDetail` and `useActiveSession` fetch the same plan+exercises join: `useWorkoutDetail` is used to render the exercise list before `sessionId` exists; `useActiveSession` re-fetches once the session is created (redundant join)
- Exercises are grouped by `muscle_group` client-side via `reduce` in `ActiveSession.tsx`, preserving `order_index` within each group
- `startRef` is initialised to `Date.now()` at component mount, not at the moment `startSession` resolves — elapsed time may include the DB insert latency (typically < 1s)
