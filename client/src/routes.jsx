import { createBrowserRouter } from "react-router";

import App from "./App";
import Home from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import RoadmapsPage from "./pages/RoadmapsPage";
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
          { path: "roadmaps", Component: RoadmapsPage },
          { path: "profile", Component: ProfilePage },
        ],
      },
    ],
  },
]);

export default router;
