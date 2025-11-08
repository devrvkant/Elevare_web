import { createBrowserRouter } from "react-router";

import App from "./App";
import Home from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/DashboardPage";
import AIToolsPage from "./pages/AIToolsPage";
import HistoryPage from "./pages/HistoryPage";
import BillingPage from "./pages/BillingPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/routes/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: Home },
      { path: "sign-in/*", Component: SignInPage },
      { path: "sign-up/*", Component: SignUpPage },
      {
        path: "dashboard",
        Component: () => (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, Component: Dashboard },
          { path: "ai-tools", Component: AIToolsPage },
          { path: "history", Component: HistoryPage },
          { path: "billing", Component: BillingPage },
          { path: "profile", Component: ProfilePage },
        ],
      },
    ],
  },
]);

export default router;
