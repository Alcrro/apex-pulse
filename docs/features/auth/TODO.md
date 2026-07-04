# TODO — Auth

## Status: 🟡

## What's done
- ✅ Email/password login
- ✅ Email/password registration with full name
- ✅ Mode toggle (login vs register)
- ✅ Inline error display (raw Supabase message)
- ✅ Loading state on submit button
- ✅ Redirect away from `/auth` when already authenticated
- ✅ Session persistence via `onAuthStateChange`

## Gaps / possible improvements
- [ ] Password reset flow ("Am uitat parola") — link + separate page or modal
- [ ] Post-registration feedback — inform the user if email confirmation is required
- [ ] Client-side validation: password minimum length shown inline, email format check before submit
- [ ] Translate Supabase error messages to Romanian (e.g. "Invalid login credentials" → "Email sau parolă incorecte")
- [ ] Show password toggle (eye icon) on the password input

## Known bugs or unhandled edge cases
- [ ] If `signUp` succeeds but Supabase requires email confirmation, the UI shows no feedback — the user is left on the auth page with no error and no explanation
- [ ] Rapid double-submit possible if user clicks before `loading` state renders (no debounce, no disabled on first click)
- [ ] Network errors (no internet) surface as generic Supabase error strings

## Refactoring / tech debt
- [ ] `Auth.tsx` manages form state and async logic inline; could extract a `useAuthForm` hook to separate concerns
- [ ] `AuthForm` receives all form fields as a single `form` object; consider named props or a `FormEvent` abstraction for testability
