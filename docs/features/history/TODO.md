# TODO — History

## Status: 🟡

## What's done
- ✅ List of finished sessions (newest first)
- ✅ Session card: plan name, date, duration, set count, notes
- ✅ Skeleton loading state (4 placeholders)
- ✅ Empty state with icon
- ✅ Total count in header

## Gaps / possible improvements
- [ ] Session detail view — tapping a history item should show the full list of exercises and logged sets
- [ ] Pagination or infinite scroll — currently capped at 50 sessions from `useSessions`; older sessions are invisible
- [ ] Filter/search — by date range, workout plan, or muscle group
- [ ] Delete session from history
- [ ] Edit session notes after the fact

## Known bugs or unhandled edge cases
- [ ] If `useSessions` `loading` is false but the fetch errored, no error state is shown — the page shows the empty state as if there are no sessions
- [ ] Sessions with `finished_at` null (in-progress or abandoned) are silently excluded; if a user starts a session and navigates away without finishing, there is no indication in history

## Refactoring / tech debt
- [ ] `getDuration` in `history/utils/formatters.ts` is duplicated from `dashboard/utils/formatters.ts` — could be consolidated in a shared utility
- [ ] Hard-coded `[1,2,3,4]` array for skeleton count; could be a named constant
