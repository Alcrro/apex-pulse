# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ApexPulse** is a Romanian-language fitness tracking web app (React + TypeScript + Vite + Supabase). Users create workout plans, track active sessions, log sets with weight/reps/RPE, and view progress charts.

## Commands

- `npm run dev` - Start Vite dev server
- `npm run build` - Type-check and bundle for production
- `npm run preview` - Preview production build

No lint or test scripts exist; `npm run build` is the primary correctness check.

## Architecture

### Feature-based structure

Code is split into `src/features/` (feature-specific) and `src/shared/` (cross-cutting):

```
src/
  App.tsx                          # Routing
  features/
    auth/                          # Login/signup pages and form components
    dashboard/                     # Home page with stats, last session, quick-start
    exercises/                     # useExercises hook
    history/                       # Session history list
    profile/                       # Profile stats and card
    progress/                      # Body weight + exercise progress charts
    session/                       # Active workout session (full-screen)
    workouts/                      # Workout plans list and detail/edit
  shared/
    components/
      atoms/                       # Button, Card, Input
      molecules/                   # Modal
      organisms/layout/            # Layout, Header, BottomNav
    context/AuthContext.tsx        # Auth state via useAuth()
    lib/
      supabase.ts                  # Supabase client
      exercises.ts                 # Exercise constants, muscle groups, 1RM calc
      exercise_images.ts           # Exercise image URL mappings
    types/index.ts                 # All domain types
```

Each feature folder typically contains `pages/`, `components/`, `hooks/`, and `utils/`.

### Auth & routing

`AuthContext` (`src/shared/context/AuthContext.tsx`) wraps the app and exposes `useAuth()` → `{ user, loading, signIn, signUp, signOut }`. `App.tsx` wraps protected routes in a `PrivateRoute` component that redirects to `/auth` when unauthenticated.

Routes:
- `/auth` — public, redirects to `/` if already logged in
- `/` — Dashboard
- `/antrenamente` — Workout plans list
- `/antrenamente/:id` — Workout plan detail/edit
- `/sesiune/:workoutId` — Active session (full-screen, outside Layout)
- `/istoric` — Session history
- `/progres` — Progress charts
- `/profil` — Profile

### Data layer

Each feature owns its hooks. Key hooks and their locations:
- `useWorkouts()` — `features/workouts/hooks/useWorkouts.ts` — CRUD on workout plans
- `useExercises()` — `features/exercises/hooks/useExercises.ts` — global + custom exercises
- `useSessions()` — `features/session/hooks/useSessions.ts` — start/finish sessions, log sets
- `useBodyWeight()` — `features/progress/hooks/useBodyWeight.ts`
- `useExerciseProgress()` — `features/progress/hooks/useExerciseProgress.ts`

All hooks call `useAuth()` to get the current user before querying Supabase. State is local to each hook instance — no global cache.

### Database schema

Supabase PostgreSQL with RLS on all tables. All tables have `user_id` with cascading deletes.

- `exercises` — global library (`user_id` null) + user custom (`is_custom = true`)
- `workout_plans` — user plans
- `workout_exercises` — exercises in a plan (sets, reps, rest_seconds, order_index)
- `sessions` — workout sessions with start/end timestamps
- `session_logs` — individual set logs (weight, reps, RPE, notes)
- `body_weight` — daily body weight entries

RLS enforces user isolation; always use `.eq('user_id', user.id)` or rely on RLS. For related data: `.select('*, related_table(*)')`.

### Key dependencies

- **@dnd-kit/core + sortable** — drag-and-drop exercise reordering in workout plans
- **Recharts** — progress charts
- **Lucide React** — icons

### Styling

Tailwind with dark theme: `bg-gray-950` (base), `bg-gray-900` (cards), `orange-500` accent. Components use `rounded-2xl`/`rounded-xl` and `shadow-lg shadow-orange-500/20`.

## Environment

`.env` requires:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Language

All UI strings are Romanian. Routes, muscle groups, and equipment names are in Romanian (e.g., Piept, Spate, Umeri, Picioare, Abdomen).
