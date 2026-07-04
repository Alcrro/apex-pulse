# Tech Spec — Auth

## Location
`src/features/auth/`

## Pages
| File | Route | Description |
|------|-------|-------------|
| `pages/Auth.tsx` | `/auth` | Full-screen auth page; redirected away if user is already logged in |

## Components
| Component | Responsibility |
|-----------|---------------|
| `AuthHeader` | Renders the "AppFitness" branding (Dumbbell icon, title, tagline) above the form card |
| `AuthModeToggle` | Segmented button switching between `'login'` and `'register'` modes; active mode gets orange-500 highlight |
| `AuthForm` | Form with email + password fields (plus full-name field when in register mode); renders error banner and submit button |

## Hooks
| Hook | What it does | Supabase tables |
|------|-------------|-----------------|
| `useAuth()` | Provides `signIn`, `signUp`, `user`, `loading` from `AuthContext` | `auth.users` (via Supabase Auth SDK) |

## Utils / formatters
None specific to auth feature.

## State management
All state is local to `Auth.tsx`:
- `mode: 'login' | 'register'` — controls which form variant is shown
- `loading: boolean` — disables submit button during async call
- `error: string` — displays Supabase error message
- `form: { email, password, fullName }` — controlled form fields

`user` and session persistence live in `AuthContext` (shared).

## Dependencies on other features
- `shared/context/AuthContext` — provides `signIn`, `signUp`
- `shared/components/atoms/Input` — styled form input
- `shared/components/atoms/Button` — styled submit button

## Notable technical decisions
- `AuthPage` is a single-file controller that passes all state down as props; child components are stateless
- The form is a standard HTML `<form onSubmit>` — no external form library
- `AuthModeToggle` uses plain `<button>` elements, not a native `<input type="radio">`, to allow custom styling
- Full name is stored in Supabase Auth `user_metadata.full_name`, not in a separate DB table
- After successful auth, `AppRoutes` detects `user !== null` via `onAuthStateChange` and performs the redirect — no explicit `navigate()` call inside the auth flow
