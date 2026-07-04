# PRD — Profile

## What it does
Shows the user's account information and a summary of their training statistics. Provides a sign-out button.

## Who uses it and when
Any authenticated user navigating to `/profil` from the bottom nav. Typical use: check lifetime stats or sign out.

## Implemented functionality
- ✅ Profile card with user's full name and email (read from `user.user_metadata.full_name` and `user.email`)
- ✅ Stats grid (2×2) showing: total finished sessions, sessions this week, total training time (hours), and plan count
- ✅ Sign-out button: calls `supabase.auth.signOut()`, shows "Se deconectează..." while in-flight
- ✅ Loading state on the sign-out button (disabled while signing out)

## Known limitations / missing
- No ability to edit profile (name, email, password)
- No avatar/photo support
- Total training time is capped by the 50-session limit inherited from `useSessions`
- No streak / longest streak calculation
- No breakdown by muscle group or exercise type

## Main user flow
1. User taps "Profil" in bottom nav
2. Profile card and stats render
3. User taps "Deconectare"
4. Button shows "Se deconectează..." while `signOut` resolves
5. Auth state clears; `AppRoutes` redirects to `/auth`
