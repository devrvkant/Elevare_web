import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { RouterProvider } from "react-router/dom";
import { Provider } from "react-redux";
import { ClerkProvider } from "@clerk/clerk-react";

import "./index.css";
import router from "./routes.jsx";
import { config } from "./config/env";
import { store } from "./redux/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ClerkProvider publishableKey={config.publishableKey}>
        <RouterProvider router={router} />
      </ClerkProvider>
    </Provider>
  </StrictMode>
);
