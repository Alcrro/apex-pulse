import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { useAuth } from "../context/AuthContext";
import { Layout } from "../components/organisms/layout/Layout";
import { Spinner } from "../components/atoms/Spinner";
import { PrivateRoute } from "./PrivateRoute";
import {
	AuthPage,
	DashboardPage,
	WorkoutsPage,
	WorkoutsSetariPage,
	WorkoutDetailPage,
	ActiveSessionPage,
	ProgressPage,
	NutritiePage,
	NutritieSetariPage,
	AlimentDetailPage,
	CustomAlimentPage,
	ProfilePage,
	AbonamentPage,
	AbonamentSucesPage,
	AbonamentAnulatPage,
} from "./lazyPages";

export function AppRoutes() {
	const { user, loading } = useAuth();
	if (loading) return <Spinner />;

	return (
		<Suspense fallback={<Spinner />}>
			<Routes>
				<Route
					path="/auth"
					element={user ? <Navigate to="/" replace /> : <AuthPage />}
				/>
				<Route
					element={
						<PrivateRoute>
							<Layout />
						</PrivateRoute>
					}
				>
					<Route index element={<DashboardPage />} />
					<Route path="antrenamente" element={<WorkoutsPage />} />
					<Route path="antrenamente/setari" element={<WorkoutsSetariPage />} />
					<Route path="antrenamente/:id" element={<WorkoutDetailPage />} />
					<Route path="istoric" element={<Navigate to="/progres" replace />} />
					<Route path="nutritie" element={<NutritiePage />} />
					<Route path="nutritie/setari" element={<NutritieSetariPage />} />
					<Route path="nutritie/aliment/custom/nou" element={<CustomAlimentPage />} />
					<Route path="nutritie/aliment/:fdcId" element={<AlimentDetailPage />} />
					<Route path="progres" element={<ProgressPage />} />
					<Route path="profil" element={<ProfilePage />} />
					<Route path="abonament" element={<AbonamentPage />} />
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
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</Suspense>
	);
}
