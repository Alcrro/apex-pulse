# PRD — History

## What it does
Displays a chronological list (most recent first) of all finished workout sessions for the current user. Each entry shows the plan name, formatted date, duration, set count, and optional notes.

## Who uses it and when
Any authenticated user navigating to `/istoric` from the bottom nav. Typical use: after completing a session, the user checks history to see their record.

## Implemented functionality
- ✅ Fetch and display all finished sessions (those with `finished_at` not null), ordered most recent first
- ✅ Skeleton loading state (4 pulsing placeholder cards while data loads)
- ✅ Session card showing: plan name (or "Antrenament" if no plan), Romanian long-format date, duration, and set count
- ✅ Session notes displayed in italic when present
- ✅ Empty state with Calendar icon when no finished sessions exist
- ✅ Total session count displayed in the page header

## Known limitations / missing
- No pagination — `useSessions` fetches at most the last 50 sessions; sessions older than the 50th are never shown in history
- No ability to tap a session card to view detailed logs (exercises, sets, weight)
- No filtering by date range, plan, or muscle group
- No delete/edit session from history
- Duration formula matches `history/utils/formatters.ts` (rounds to nearest minute)

## Main user flow
1. User taps "Istoric" in bottom nav
2. Page loads; skeleton shows for up to ~1–2s
3. Finished sessions appear as cards, newest first
4. User scrolls to review past workouts
