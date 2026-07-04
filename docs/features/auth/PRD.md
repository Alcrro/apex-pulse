# PRD — Auth

## What it does
Allows users to create an account or sign in to an existing one using email and password via Supabase Auth. The page is the app's entry point for unauthenticated users.

## Who uses it and when
Any visitor who is not yet authenticated. They land here either by navigating to `/auth` directly or by being redirected from a protected route.

## Implemented functionality
- ✅ Toggle between "Autentificare" (login) and "Înregistrare" (register) modes via a segmented tab control
- ✅ Login with email + password via `supabase.auth.signInWithPassword`
- ✅ Registration with full name, email, and password via `supabase.auth.signUp` (full name stored in `user_metadata.full_name`)
- ✅ Inline error message displayed inside the form card when Supabase returns an error
- ✅ Loading state on submit button while the request is in-flight ("Se procesează...")
- ✅ Redirect to `/` when a logged-in user tries to access `/auth`
- ✅ Automatic session restoration on page load (handled by `AuthContext`)

## Known limitations / missing
- No password reset / "Forgot password" flow
- No email confirmation step displayed after register (Supabase may send one depending on project config, but the UI gives no feedback)
- No input validation beyond `required` and `minLength={6}` on the password field
- No OAuth / social login providers
- Error messages are raw Supabase error strings (not translated to Romanian)

## Main user flow
1. User opens `/auth`
2. Sees branding header (AppFitness logo + tagline)
3. Switches to register tab if needed
4. Fills in full name (register only), email, and password
5. Submits; button shows "Se procesează..."
6. On success: `AuthContext` sets the user and `AppRoutes` redirects to `/`
7. On error: error banner appears inside the card
