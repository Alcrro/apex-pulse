# Tech Spec — Progress

## Location
`src/features/progress/`

## Pages
| File | Route | Description |
|------|-------|-------------|
| `pages/Progress.tsx` | `/progres` | Progress charts; protected by `PrivateRoute` inside shared `Layout` |

`Progress.tsx` is a thin wrapper that renders `<ExerciseProgressSection />` and `<BodyWeightSection />`.

## Components
| Component | Responsibility |
|-----------|---------------|
| `ExerciseProgressSection` | Exercise selector dropdown + area chart of estimated 1RM + current/delta stats; uses `useExercises` and `useExerciseProgress` |
| `BodyWeightSection` | Weight + date form + line chart of body weight + current/delta stats; uses `useBodyWeight` |
| `ChartTooltip` | Custom Recharts tooltip: shows date label and all payload values in kg |

## Hooks
| Hook | What it does | Supabase tables |
|------|-------------|-----------------|
| `useExercises()` | Provides exercise list for the selector dropdown | `exercises` |
| `useExerciseProgress(exerciseId)` | Fetches `session_logs` for a given exercise, joins `sessions`, filters to finished sessions, groups by calendar date keeping best 1RM per day | `session_logs`, `sessions` |
| `useBodyWeight()` | Fetches last 90 body weight entries ordered by `recorded_at` asc; provides `addEntry` mutation | `body_weight` |

## Utils / formatters
`src/features/progress/utils/formatters.ts`:
- `formatDateShort(dateStr)` — Romanian locale short date for chart X-axis labels (e.g. "3 iul.")

`shared/lib/exercises.ts`:
- `calculate1RM(weight, reps)` — used inside `useExerciseProgress` to compute estimated 1RM per log

## State management
`ExerciseProgressSection` local state:
- `selectedExId: string` — controls which exercise's data is fetched

`BodyWeightSection` local state:
- `bwInput: string` — controlled number input for weight
- `bwDate: string` — controlled date input (ISO date string, defaults to today)
- `saving: boolean` — disables the add button during submission

## Dependencies on other features
- `features/exercises/hooks/useExercises` — exercise list
- `shared/components/atoms/Card` — card containers
- Recharts: `AreaChart`, `LineChart`, `ResponsiveContainer`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `Line`, `Area`

## Notable technical decisions
- `useExerciseProgress` groups logs by `sessions.started_at.split('T')[0]` (calendar date), keeping the log with the highest 1RM per day
- Only logs from finished sessions (`sessions.finished_at` not null) are included
- Logs with null weight are excluded via `.not('weight', 'is', null)` in the query
- `useBodyWeight` fetches a rolling last 90 entries via `.limit(90)` ordered ascending — oldest to newest for correct chart rendering
- Delta for body weight: green when ≤ 0 (loss), orange when > 0 (gain); exercise 1RM delta is always green when ≥ 0
