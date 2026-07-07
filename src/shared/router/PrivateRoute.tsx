import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/atoms/Spinner";

export function PrivateRoute({ children }: { children: ReactNode }) {
	const { user, loading } = useAuth();
	if (loading) return <Spinner />;
	return user ? <>{children}</> : <Navigate to="/auth" replace />;
}
