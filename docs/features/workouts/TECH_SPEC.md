# Tech Spec — Workouts

## Location
`src/features/workouts/`

## Pages
| File | Route | Description |
|------|-------|-------------|
| `pages/Workouts.tsx` | `/antrenamente` | Plan list with create/delete; protected by `PrivateRoute` inside shared `Layout` |
| `pages/WorkoutDetail.tsx` | `/antrenamente/:id` | Plan detail with exercise list, drag-and-drop reorder, add/edit/remove exercises |

## Components
| Component | Responsibility |
|-----------|---------------|
| `WorkoutCard` | Single row card for a plan: icon, name, exercise count + description, delete button, chevron |
| `ExerciseRow` | Sortable card for a `WorkoutExercise`: drag handle (dnd-kit), name, muscle group/equipment, sets×reps×rest display, inline edit form, remove button |
| `ExerciseSelector` | Modal for browsing/filtering global + custom exercises; image thumbnails; long-press image preview; inline custom exercise creation form |
| `AddExerciseModal` | Configuration modal for a selected exercise: sets, reps, rest seconds (defaults 3/10/90) |
| `CreateWorkoutModal` | Modal with name + description inputs for new plan |

## Hooks
| Hook | What it does | Supabase tables |
|------|-------------|-----------------|
| `useWorkouts()` | Fetch all plans (with exercise count); create, delete, update plan | `workout_plans`, `workout_exercises` |
| `useWorkoutDetail(workoutId)` | Fetch single plan + exercises (with exercise details); add, remove, update, reorder exercises | `workout_plans`, `workout_exercises`, `exercises` |
| `useExercises()` (from exercises feature) | Used inside `ExerciseSelector` for the exercise list + custom exercise creation | `exercises` |

## Utils / formatters
No feature-local formatters.

## State management
`WorkoutsPage` local state:
- `showCreate: boolean` — `CreateWorkoutModal` visibility
- `saving: boolean` — disables modal submit while creating

`WorkoutDetailPage` local state:
- `showSelector: boolean` — `ExerciseSelector` modal visibility
- `showAddConfig: boolean` — `AddExerciseModal` visibility
- `selectedExercise: Exercise | null` — the exercise chosen in `ExerciseSelector`, passed to `AddExerciseModal`
- `saving: boolean` — disables `AddExerciseModal` submit

`ExerciseSelector` local state:
- `search: string` — text filter value
- `filterGroup: string` — active muscle-group chip
- `showCreate: boolean` — inline custom exercise form visibility
- `newEx: { name, muscle_group, equipment }` — new custom exercise form fields
- `saving: boolean` — disables custom create button
- `previewImg: string | null` — long-press image preview URL

`ExerciseRow` local state:
- `editing: boolean` — toggles inline edit form
- `form: { sets, reps, rest_seconds }` — controlled inputs for edit

## Dependencies on other features
- `features/exercises/hooks/useExercises` — exercise data inside `ExerciseSelector`
- `shared/components/atoms/Card`, `Button`, `Input` — UI atoms
- `shared/components/molecules/Modal` — used by `ExerciseSelector`, `AddExerciseModal`, `CreateWorkoutModal`
- `shared/lib/exercises.MUSCLE_GROUPS`, `EQUIPMENT_TYPES` — filter chips and custom exercise dropdowns
- `shared/lib/exercise_images.getExerciseImage` — exercise thumbnails
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` — drag-and-drop

## Notable technical decisions
- Drag-and-drop uses `@dnd-kit` with both `PointerSensor` and `TouchSensor` (touch requires a 200ms delay + 5px tolerance to avoid conflicting with scroll)
- `reorderExercises` does an optimistic local update (calls `setExercises(reordered)`) then fires N parallel `UPDATE` calls — one per exercise
- `ExerciseSelector` uses `useMemo` for both the filtered list and the grouped object to avoid re-computation on every keystroke
- Long-press detection uses `setTimeout` (500ms) on `onPointerDown`; cancelled by `onPointerUp`/`onPointerLeave`/`onPointerCancel`; `wasLongPress.current` flag prevents the click event from also selecting the exercise
- `AddExerciseModal` uses `inputMode="numeric"` + `pattern="[0-9]*"` on text inputs instead of `type="number"` — provides numeric keyboard on mobile without the spin arrows
- `WorkoutDetailPage` groups exercises by muscle group using a `reduce` in JSX render — not memoized
