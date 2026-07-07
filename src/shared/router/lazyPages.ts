import { lazy } from "react";

export const AuthPage = lazy(() => import("../../features/auth/pages/Auth").then(m => ({ default: m.AuthPage })));
export const DashboardPage = lazy(() => import("../../features/dashboard/pages/Dashboard").then(m => ({ default: m.DashboardPage })));
export const WorkoutsPage = lazy(() => import("../../features/workouts/pages/Workouts").then(m => ({ default: m.WorkoutsPage })));
export const WorkoutsSetariPage = lazy(() => import("../../features/workouts/pages/WorkoutsSetari").then(m => ({ default: m.WorkoutsSetariPage })));
export const WorkoutDetailPage = lazy(() => import("../../features/workouts/pages/WorkoutDetail").then(m => ({ default: m.WorkoutDetailPage })));
export const ActiveSessionPage = lazy(() => import("../../features/session/pages/ActiveSession").then(m => ({ default: m.ActiveSessionPage })));
export const ProgressPage = lazy(() => import("../../features/progress/pages/Progress").then(m => ({ default: m.ProgressPage })));
export const NutritiePage = lazy(() => import("../../features/nutritie/pages/NutritiePage").then(m => ({ default: m.NutritiePage })));
export const NutritieSetariPage = lazy(() => import("../../features/nutritie/pages/NutritieSetariPage").then(m => ({ default: m.NutritieSetariPage })));
export const AlimentDetailPage = lazy(() => import("../../features/nutritie/pages/AlimentDetailPage").then(m => ({ default: m.AlimentDetailPage })));
export const CustomAlimentPage = lazy(() => import("../../features/nutritie/pages/CustomAlimentPage").then(m => ({ default: m.CustomAlimentPage })));
export const ProfilePage = lazy(() => import("../../features/profile/pages/Profile").then(m => ({ default: m.ProfilePage })));
export const AbonamentPage = lazy(() => import("../../features/abonament/pages/AbonamentPage").then(m => ({ default: m.AbonamentPage })));
export const AbonamentSucesPage = lazy(() => import("../../features/abonament/pages/AbonamentSucesPage").then(m => ({ default: m.AbonamentSucesPage })));
export const AbonamentAnulatPage = lazy(() => import("../../features/abonament/pages/AbonamentAnulatPage").then(m => ({ default: m.AbonamentAnulatPage })));
