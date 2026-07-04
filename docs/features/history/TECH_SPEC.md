# Tech Spec — History

## Location
`src/features/history/`

## Pages
| File | Route | Description |
|------|-------|-------------|
| `pages/History.tsx` | `/istoric` | Session history list; protected by `PrivateRoute` inside shared `Layout` |

## Components
| Component | Responsibility |
|-----------|---------------|
| `HistoryItem` | Renders a single session as a `Card`: icon, plan name, date, duration + set count row, optional notes |

## Hooks
| Hook | What it does | Supabase tables |
|------|-------------|-----------------|
| `useSessions()` | Fetches last 50 sessions ordered by `started_at` desc; provides `sessions` and `loading` | `sessions`, `workout_plans` (name), `session_logs` (count) |

## Utils / formatters
`src/features/history/utils/formatters.ts`:
- `formatDate(dateStr)` — Romanian locale long date including weekday (e.g. "lun., 1 iulie 2026")
- `getDuration(start, end)` — "X min" or "Xh Ymin"; returns null if `end` is null

Note: this `formatDate` is more verbose than the dashboard version (includes weekday and year).

## State management
No local state in `History.tsx` beyond what `useSessions` provides. The page filters the sessions array client-side: `sessions.filter(s => s.finished_at)`.

## Dependencies on other features
- `features/session/hooks/useSessions` — session data
- `shared/components/atoms/Card` — card container for each item and empty state

## Notable technical decisions
- `HistoryItem` reads `session.session_logs?.[0]?.count` — Supabase returns the count as `[{ count: N }]`, so index 0 is required
- Filtering to finished sessions happens client-side; `useSessions` returns all sessions (including in-progress if any)
- `loading` check shows 4 skeleton placeholders (hard-coded `[1,2,3,4]`) before real data arrives
