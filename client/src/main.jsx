import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { RouterProvider } from "react-router/dom";
import { ClerkProvider } from "@clerk/clerk-react";

import "./index.css";
import router from "./routes.jsx";
import env from "./config/env";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={env.PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
);
