# Routing

## All routes
| Path | Component | Protected | Description |
|------|-----------|-----------|-------------|
| `/auth` | `AuthPage` | No (redirects to `/` if logged in) | Email/password login and registration |
| `/` | `DashboardPage` | Yes | Home dashboard with nutrition card, stats, last session, weekly strip |
| `/antrenamente` | `WorkoutsPage` | Yes | Quick-start workout plan list; start any plan directly |
| `/antrenamente/setari` | `WorkoutsSetariPage` | Yes | Plan management (create/delete) + AI split generator |
| `/antrenamente/:id` | `WorkoutDetailPage` | Yes | Plan detail; add/edit/remove/reorder exercises |
| `/sesiune/:workoutId` | `ActiveSessionPage` | Yes | Full-screen active workout session |
| `/istoric` | — | Yes | Redirects to `/progres` (route removed, history merged into progress) |
| `/nutritie` | `NutritiePage` | Yes | Daily nutrition log with meals, macros, water tracking |
| `/nutritie/setari` | `NutritieSetariPage` | Yes | Nutrition goals setup (calories, macros, TDEE) |
| `/nutritie/aliment/custom/nou` | `CustomAlimentPage` | Yes | Create a custom food item |
| `/nutritie/aliment/:fdcId` | `AlimentDetailPage` | Yes | Food detail from USDA FDC database |
| `/progres` | `ProgressPage` | Yes | Exercise 1RM chart + body weight chart |
| `/profil` | `ProfilePage` | Yes | User info, aggregate stats, sign-out |
| `*` (catch-all) | — | — | Redirects to `/` |

## Route protection mechanism
Two complementary mechanisms in `App.tsx`:

**`PrivateRoute` component:**
```tsx
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  return user ? <>{children}</> : <Navigate to="/auth" replace />
}
```
Used to wrap both the shared `<Layout>` (which contains all standard routes as `<Outlet>`) and the standalone `/sesiune/:workoutId` route.

**`/auth` guard in `AppRoutes`:**
```tsx
<Route path="/auth" element={
  user ? <Navigate to="/" replace /> : <AuthPage />
} />
```
Prevents authenticated users from seeing the auth page.

During the initial auth check (`loading = true`), both `PrivateRoute` and `AppRoutes` render a full-screen spinner (`Spinner` component showing "AF" in orange).

## Navigation
**Bottom navigation (`BottomNav`):**
Fixed at bottom; visible on all standard routes (inside `Layout`). 5 tabs:
- Home (`/`) — `Home` icon, label "Home"
- Planuri (`/antrenamente`) — `Dumbbell` icon, label "Planuri"
- Nutriție (`/nutritie`) — `Utensils` icon, label "Nutriție"
- Progres (`/progres`) — `TrendingUp` icon, label "Progres"
- Profil (`/profil`) — `User` icon, label "Profil"

Note: The "Istoric" tab was removed; `/istoric` now redirects to `/progres`.

Active tab uses `NavLink` `isActive` state, colored `text-orange-500`; inactive tabs are `text-gray-500`.

**Header:**
Sticky top header showing "AP" logo (ApexPulse branding) and a page title mapped from `PAGE_TITLES` record:
```
'/'             → 'Dashboard'
'/antrenamente' → 'Antrenamente'
'/progres'      → 'Progres'
'/profil'       → 'Profil'
'/nutritie'     → 'Nutriție'
```
Falls back to the app name for unmapped paths (e.g. `/antrenamente/:id`, `/antrenamente/setari`).

**Active session:**
`/sesiune/:workoutId` renders `ActiveSessionPage` directly (not inside `Layout`), so it has no Header or BottomNav. Navigation away is only via the `SessionHeader`'s back/finish buttons, which open the `FinishSessionModal` to confirm ending the session.

**Programmatic navigation:**
`useNavigate()` is used by:
- `Dashboard` — to start a session (`/sesiune/:id`) or open workouts (`/antrenamente`)
- `Workouts` — to open a plan detail (`/antrenamente/:id`) after creation
- `WorkoutDetail` — back to `/antrenamente`, or to start a session
- `ActiveSession` — to `/` after finishing or on error
