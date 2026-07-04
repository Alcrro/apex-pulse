# PRD — Session

## What it does
Provides the active workout session experience. When a user starts a plan, a session record is created in the DB immediately, and the user can log sets for each exercise. The session ends when the user taps "Finalizează" and confirms via a modal.

## Who uses it and when
An authenticated user who taps "Start" on a workout plan (from the dashboard or from the workout detail page). The session page is full-screen without the standard Layout (no Header or BottomNav).

## Implemented functionality
- ✅ Session created automatically on page mount via `startSession(workoutId)`; redirects to `/` if creation fails
- ✅ Elapsed timer counting seconds from session start, displayed as MM:SS in the header
- ✅ Exercises displayed grouped by muscle group (e.g. "PIEPT", "SPATE"), with exercise image, name, muscle group, and prescribed sets × reps
- ✅ Previous session reference shown per exercise ("Ultima dată: Xkg × Y rep") using `usePreviousExerciseLogs`
- ✅ Weight (kg) and reps inputs per set; weight pre-filled from last logged set of the same exercise in this session, or from previous session if no sets yet
- ✅ RPE selector (6 to 10 in 0.5 steps) toggled via a badge button; optional
- ✅ Optional per-set notes field
- ✅ Live estimated 1RM shown below inputs when weight and reps are both filled
- ✅ "Înregistrează set N" button logs the set to DB; set appears in the logged sets list above the input
- ✅ Logged sets displayed in a table (index, weight, reps, RPE, estimated 1RM) with individual delete button
- ✅ Rest timer: circular countdown triggered automatically after logging a set (uses `rest_seconds` from `workout_exercises`); also accessible via manual "Timer pauză" button after first set
- ✅ Finish session modal: shows elapsed time, set count, optional notes textarea, "Salvează antrenamentul" saves and navigates to `/`, "Continuă antrenamentul" dismisses modal
- ✅ Back button (chevron) and "Finalizează" button both open the finish modal

## Known limitations / missing
- No ability to add exercises not in the plan during an active session
- No "abandon session" (delete session) flow — unfinished sessions persist in DB
- If the user navigates away or closes the app, the session remains unfinished in the DB
- No offline support
- Rest timer has no audio alert when countdown reaches 0

## Main user flow
1. User taps "Start" on a plan → navigated to `/sesiune/<workoutId>`
2. Page mounts; `startSession` inserts a session row; loading shows "Se pregătește sesiunea..."
3. Exercises appear grouped by muscle group
4. User fills weight + reps, optionally adds RPE/note, taps "Înregistrează set 1"
5. Set appears in the logged list; rest timer overlay opens (if `rest_seconds > 0`)
6. User skips or waits for timer, continues to next set
7. After all exercises done, taps "Finalizează" → finish modal opens
8. Adds optional notes, taps "Salvează antrenamentul" → session marked finished, navigated to `/`
