# Tech Spec — Session

## Location
`src/features/session/`

## Pages
| File | Route | Description |
|------|-------|-------------|
| `pages/ActiveSession.tsx` | `/sesiune/:workoutId` | Full-screen active session; protected by `PrivateRoute` but NOT inside shared `Layout` (no header/bottom nav) |

## Components
| Component | Responsibility |
|-----------|---------------|
| `SessionHeader` | Workout name + live elapsed timer (MM:SS) + back chevron + "Finalizează" button |
| `SessionExerciseBlock` | One card per `WorkoutExercise`: image, name, muscle group, plan sets×reps, previous session reference, logged sets table, weight+reps inputs, RPE toggle, notes, "log set" button, rest timer trigger |
| `SetRow` | Single row in the logged sets table: index, weight, reps, RPE, estimated 1RM, delete button |
| `RpeSelector` | Inline button strip for RPE values 6–10 in 0.5 increments; "Șterge" clears the value |
| `RestTimer` | Full-screen overlay with SVG circular progress countdown; Reset and Skip buttons |
| `FinishSessionModal` | Modal (via shared `Modal`) with elapsed time summary, set count, optional notes, save/continue buttons |

## Hooks
| Hook | What it does | Supabase tables |
|------|-------------|-----------------|
| `useSessions()` | `startSession(workoutPlanId)` inserts session; `finishSession(id, notes)` sets `finished_at` | `sessions` |
| `useActiveSession(sessionId)` | Fetches session with full plan+exercises+exercise data; fetches all logs for session; provides `logSet`, `deleteLog` | `sessions`, `workout_plans`, `workout_exercises`, `exercises`, `session_logs` |
| `usePreviousExerciseLogs(exerciseIds, currentSessionId)` | For each exercise ID, finds the most recent log from any OTHER session | `session_logs` |
| `useWorkoutDetail(workoutId)` | Fetches workout exercises ordered by `order_index` (used for exercise list before sessionId is known) | `workout_plans`, `workout_exercises`, `exercises` |

## Utils / formatters
No feature-local formatters. Uses:
- `shared/lib/exercises.calculate1RM(weight, reps)` — shown inline per set
- `shared/lib/exercise_images.getExerciseImage(name)` — exercise card thumbnail

## State management
`ActiveSession.tsx` local state:
- `sessionId: string | null` — set after `startSession` resolves
- `starting: boolean` — shows "Se pregătește sesiunea..." spinner
- `showFinish: boolean` — controls finish modal visibility
- `elapsed: number` — seconds since session start; incremented by `setInterval` every 1s
- `startRef: MutableRefObject<number>` — `Date.now()` at mount; used for elapsed calculation

`SessionExerciseBlock` local state:
- `form: { weight, reps, rpe, notes }` — controlled inputs for the next set
- `showRpe: boolean` — toggles RPE selector visibility
- `showTimer: boolean` — triggers rest timer overlay
- `logging: boolean` — disables log button during async insert

## Dependencies on other features
- `features/workouts/hooks/useWorkouts.useWorkoutDetail` — exercise list before session exists
- `shared/components/atoms/Card`, `Button` — UI atoms
- `shared/components/molecules/Modal` — used by `FinishSessionModal`
- `shared/lib/exercises.calculate1RM` — 1RM display
- `shared/lib/exercise_images.getExerciseImage` — exercise thumbnails

## Notable technical decisions
- The page calls `startSession` on mount (inside `useEffect`), immediately creating a DB row; there is no "preview before start" screen
- `useActiveSession` and `useWorkoutDetail` are both used: `useWorkoutDetail` provides the exercise list before `sessionId` is known; `useActiveSession` fetches the same data again once `sessionId` is set (redundant join)
- Exercises are grouped by `muscle_group` client-side using a `reduce` call, preserving `order_index` within each group
- The `usePreviousExerciseLogs` hook uses `.order('logged_at', { ascending: false })` and a first-seen map to get the most recent log per exercise across all sessions except the current one
- `RestTimer` uses an SVG circle with `strokeDashoffset` animated via CSS `transition: stroke-dashoffset 1s linear` for smooth countdown
- Image load errors fall back to a `Dumbbell` icon via `onError` handler toggling display styles
