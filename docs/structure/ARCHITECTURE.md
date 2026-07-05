# Architecture

## Overview
ApexPulse is a single-page React application (Vite + TypeScript) backed by a Supabase PostgreSQL database. All business logic lives in the browser; the server is purely Supabase (Auth + PostgREST + Row-Level Security). There is no custom backend.

An external AI dependency exists: `useGenerateWorkouts` calls the Anthropic Claude API directly from the browser (`@anthropic-ai/sdk`, `dangerouslyAllowBrowser: true`) using a `VITE_CLAUDE_API_KEY` env var.

## Folder structure philosophy
```
src/
  App.tsx                          # Root routing component
  main.tsx                         # React entry point
  features/                        # Vertical feature slices
    auth/
      components/                  # UI components for this feature
      pages/                       # Route-level page component(s)
    dashboard/
      components/
      pages/
      utils/                       # Feature-local formatters/helpers
    exercises/
      hooks/                       # Data hooks (no page — data-only feature)
    nutritie/
      components/
      hooks/                       # useNutritionLog, useNutritionTarget, useWeeklyCalories, etc.
      pages/                       # NutritiePage, NutritieSetariPage, AlimentDetailPage, CustomAlimentPage
      utils/                       # nutritionHelpers.ts
    profile/
      components/
      pages/
      utils/
    progress/
      components/
      hooks/                       # Feature-local hooks (Supabase queries)
      pages/
      utils/
    session/
      components/
      hooks/
      pages/
    workouts/
      components/
      hooks/
      pages/
      utils/                       # splitTypes.ts — DayType, SplitConfig, SPLIT_TEMPLATES
  shared/                          # Cross-feature reusables
    components/
      atoms/                       # Button, Card, Input
      molecules/                   # Modal
      organisms/
        layout/                    # Layout, Header, BottomNav
    context/
      AuthContext.tsx              # Global auth state
    hooks/
      useInstallPWA.ts             # PWA install prompt + iOS detection
    lib/
      supabase.ts                  # Supabase client singleton
      exercises.ts                 # Exercise constants (DEFAULT_EXERCISES, MUSCLE_GROUPS, EQUIPMENT_TYPES) + calculate1RM
      exercise_images.ts           # Static exercise image URL map
    types/
      index.ts                     # All domain TypeScript interfaces
```

Each feature owns its page components, UI components, hooks, and local utilities. Shared utilities, context, and atomic UI components live in `src/shared/`.

## Data flow
1. User action triggers a function from a hook (e.g. `logSet`, `createWorkout`)
2. Hook calls `supabase.from(table).insert(...)` or similar PostgREST operation
3. Supabase RLS validates the request on the server
4. On success, the hook updates its local React state (`useState`) — no global state manager
5. Component re-renders from the updated state

All data is fetched fresh on component mount. There is no shared cache, no global store (no Redux/Zustand/React Query), and no optimistic UI beyond direct local state mutation on successful mutations.

## Auth flow
1. `main.tsx` renders `<App />` which wraps everything in `<AuthProvider>`
2. `AuthProvider` calls `supabase.auth.getSession()` on mount to restore an existing session
3. `supabase.auth.onAuthStateChange` listener keeps `user` state in sync with Supabase Auth events
4. `AppRoutes` reads `{ user, loading }` from `useAuth()`:
   - While `loading = true`: full-screen "AF" spinner
   - If `user = null` and route is protected: `<Navigate to="/auth" replace />`
   - If `user != null` and route is `/auth`: `<Navigate to="/" replace />`
5. On sign-out, `supabase.auth.signOut()` clears the session; `onAuthStateChange` fires with `null` user; `AppRoutes` redirects to `/auth`

## Key conventions
- **No global state manager** — each hook manages its own `useState`; hooks are re-instantiated per component mount
- **Romanian UI language** — all user-facing strings, route slugs, and labels are in Romanian
- **Supabase for everything** — authentication, database, and RLS; no separate REST/GraphQL API
- **Dark theme only** — `bg-gray-950` base, `bg-gray-900` cards, `orange-500` accent; no light mode
- **`forge-*` tokens** — `tailwind.config.js` defines a `forge` color palette (`forge-base`, `forge-surface`, `forge-surface2`, `forge-gold`, `forge-text`, `forge-muted`) used in dashboard and session components; older components use raw `gray-*` Tailwind classes
- **TypeScript strict mode** — `tsconfig.app.json` has strict mode enabled; all domain types are in `shared/types/index.ts`
- **No testing infrastructure** — no test files, no test runner configured
- **PWA** — `vite-plugin-pwa` configured; `useInstallPWA` in `shared/hooks/` captures `beforeinstallprompt` and provides `canInstall` / `isIOS` / `install()` to any component
- **Lazy-loaded routes** — all page components are wrapped in `React.lazy()` + `<Suspense>` with a full-screen "AP" spinner fallback; reduces initial bundle size
