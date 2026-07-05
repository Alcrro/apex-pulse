# PRD — Session (Active Workout)

## What it does
Provides the full-screen active workout experience. When a user starts a plan, a session record is created immediately in the database, and the user works through each exercise logging sets until they finish and save the session.

## Who uses it and when
Any authenticated user who taps "Start" on a workout plan (from `/antrenamente` or `/antrenamente/:id`). The page is intentionally full-screen with no Header or BottomNav to minimise distraction during training.

## Implemented functionality
- ✅ Session row created automatically on page mount via `startSession(workoutId)`
- ✅ Loading state ("Se pregătește sesiunea…") while session is being created
- ✅ Redirect to `/` if session creation fails
- ✅ Live elapsed timer (MM:SS) in the header from the moment the page loads
- ✅ Back chevron and "Finalizează" button both open the finish modal
- ✅ Exercises displayed in cards grouped by muscle group (e.g. "PIEPT", "SPATE")

## Known limitations / missing
- No "abandon session" flow — unfinished sessions (no `finished_at`) persist in DB
- If user navigates away before `startSession` resolves, an orphan session row is created
- No ability to add exercises not in the original plan during the session

## Main user flow
1. User taps "Start" on a plan → `/sesiune/<workoutId>`
2. Page mounts; `startSession` inserts a session row
3. Exercises appear grouped by muscle group
4. User logs sets per exercise (see `exercitii/`)
5. Rest timer opens after each logged set (see `timer/`)
6. User taps "Finalizează" → finish modal (see `finalizare/`)
7. Saves → session marked finished → navigated to `/`
