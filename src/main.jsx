import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import useAuthStore from "./store/authStore";
import { AppThemeProvider } from "./theme/ThemeContext";

// ─── Rehidratar sesión ANTES del primer render ─────────────────────────────
useAuthStore.getState().rehydrate();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppThemeProvider>
      <App />
    </AppThemeProvider>
  </React.StrictMode>,
);
