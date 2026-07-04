# TODO — Profile

## Status: 🟡

## What's done
- ✅ Display name and email
- ✅ Stats grid (total sessions, weekly, total time, plans)
- ✅ Sign-out with loading state

## Gaps / possible improvements
- [ ] Edit profile — change full name (update `user_metadata`), change email, change password
- [ ] Avatar / profile photo support
- [ ] Streak calculation (current streak in consecutive days or weeks)
- [ ] Training breakdown by muscle group (requires session_logs query)
- [ ] Personal records / PRs section
- [ ] Account deletion

## Known bugs or unhandled edge cases
- [ ] `formatTotalTime` truncates to whole hours (119 min → "1h") — could be misleading for time near the hour boundary
- [ ] Stats are based on the last 50 sessions only (inherited `useSessions` limit); users with >50 sessions see underreported stats
- [ ] No loading state shown while sessions/workouts are being fetched — stats show "0" briefly before data arrives
- [ ] `getWeeklyCount` in `statsUtils.ts` uses Sunday as week start, consistent with dashboard but may not match user expectation

## Refactoring / tech debt
- [ ] `getWeeklyCount` is duplicated between `profile/utils/statsUtils.ts` and `dashboard/utils/formatters.ts` — same logic, different files
- [ ] Profile instantiates `useSessions` and `useWorkouts` independently, causing fresh fetches on every navigation to `/profil` even if data was loaded by dashboard
