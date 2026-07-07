import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./shared/context/AuthContext";
import { ThemeProvider } from "./shared/context/ThemeContext";
import { SubscriptionProvider } from "./shared/context/SubscriptionContext";
import { AppRoutes } from "./shared/router/AppRoutes";

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
