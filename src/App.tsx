import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./shared/context/AuthContext";
import { ThemeProvider } from "./shared/context/ThemeContext";
import { SubscriptionProvider } from "./shared/context/SubscriptionContext";
import { Layout } from "./shared/components/organisms/layout/Layout";
import { lazy, Suspense, ReactNode } from "react";

const AuthPage = lazy(() => import("./features/auth/pages/Auth").then(m => ({ default: m.AuthPage })));
const DashboardPage = lazy(() => import("./features/dashboard/pages/Dashboard").then(m => ({ default: m.DashboardPage })));
const WorkoutsPage = lazy(() => import("./features/workouts/pages/Workouts").then(m => ({ default: m.WorkoutsPage })));
const WorkoutsSetariPage = lazy(() => import("./features/workouts/pages/WorkoutsSetari").then(m => ({ default: m.WorkoutsSetariPage })));
const WorkoutDetailPage = lazy(() => import("./features/workouts/pages/WorkoutDetail").then(m => ({ default: m.WorkoutDetailPage })));
const ActiveSessionPage = lazy(() => import("./features/session/pages/ActiveSession").then(m => ({ default: m.ActiveSessionPage })));
const ProgressPage = lazy(() => import("./features/progress/pages/Progress").then(m => ({ default: m.ProgressPage })));
const NutritiePage = lazy(() => import("./features/nutritie/pages/NutritiePage").then(m => ({ default: m.NutritiePage })));
const NutritieSetariPage = lazy(() => import("./features/nutritie/pages/NutritieSetariPage").then(m => ({ default: m.NutritieSetariPage })));
const AlimentDetailPage = lazy(() => import("./features/nutritie/pages/AlimentDetailPage").then(m => ({ default: m.AlimentDetailPage })));
const CustomAlimentPage = lazy(() => import("./features/nutritie/pages/CustomAlimentPage").then(m => ({ default: m.CustomAlimentPage })));
const ProfilePage = lazy(() => import("./features/profile/pages/Profile").then(m => ({ default: m.ProfilePage })));
const AbonamentPage = lazy(() => import("./features/abonament/pages/AbonamentPage").then(m => ({ default: m.AbonamentPage })));
const AbonamentSucesPage = lazy(() => import("./features/abonament/pages/AbonamentSucesPage").then(m => ({ default: m.AbonamentSucesPage })));
const AbonamentAnulatPage = lazy(() => import("./features/abonament/pages/AbonamentAnulatPage").then(m => ({ default: m.AbonamentAnulatPage })));

function Spinner() {
	return (
		<div className="min-h-screen bg-gray-950 flex items-center justify-center">
			<div className="text-orange-500 font-black text-2xl animate-pulse">AP</div>
		</div>
	);
}

function PrivateRoute({ children }: { children: ReactNode }) {
	const { user, loading } = useAuth();
	if (loading) return <Spinner />;
	return user ? (
		<>{children}</>
	) : (
		<Navigate
			to="/auth"
			replace
		/>
	);
}

function AppRoutes() {
	const { user, loading } = useAuth();
	if (loading) return <Spinner />;

	return (
		<Suspense fallback={<Spinner />}>
		<Routes>
			<Route
				path="/auth"
				element={
					user ? (
						<Navigate
							to="/"
							replace
						/>
					) : (
						<AuthPage />
					)
				}
			/>
			<Route
				element={
					<PrivateRoute>
						<Layout />
					</PrivateRoute>
				}
			>
				<Route
					index
					element={<DashboardPage />}
				/>
				<Route
					path="antrenamente"
					element={<WorkoutsPage />}
				/>
				<Route
					path="antrenamente/setari"
					element={<WorkoutsSetariPage />}
				/>
				<Route
					path="antrenamente/:id"
					element={<WorkoutDetailPage />}
				/>
				<Route
					path="istoric"
					element={<Navigate to="/progres" replace />}
				/>
				<Route
					path="nutritie"
					element={<NutritiePage />}
				/>
				<Route
					path="nutritie/setari"
					element={<NutritieSetariPage />}
				/>
				<Route
					path="nutritie/aliment/custom/nou"
					element={<CustomAlimentPage />}
				/>
				<Route
					path="nutritie/aliment/:fdcId"
					element={<AlimentDetailPage />}
				/>
				<Route
					path="progres"
					element={<ProgressPage />}
				/>
				<Route
					path="profil"
					element={<ProfilePage />}
				/>
				<Route
					path="abonament"
					element={<AbonamentPage />}
				/>
			</Route>
			<Route
				path="abonament/succes"
				element={
					<PrivateRoute>
						<AbonamentSucesPage />
					</PrivateRoute>
				}
			/>
			<Route
				path="abonament/anulat"
				element={
					<PrivateRoute>
						<AbonamentAnulatPage />
					</PrivateRoute>
				}
			/>
			<Route
				path="sesiune/:workoutId"
				element={
					<PrivateRoute>
						<ActiveSessionPage />
					</PrivateRoute>
				}
			/>
			<Route
				path="*"
				element={
					<Navigate
						to="/"
						replace
					/>
				}
			/>
		</Routes>
		</Suspense>
	);
}

export default function App() {
	return (
		<BrowserRouter>
			<ThemeProvider>
				<AuthProvider>
					<SubscriptionProvider>
						<AppRoutes />
					</SubscriptionProvider>
				</AuthProvider>
			</ThemeProvider>
		</BrowserRouter>
	);
}
