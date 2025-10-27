import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { inject } from "@vercel/analytics";
import { registerSW } from "virtual:pwa-register";

//  Initialize Vercel analytics (for usage tracking)
inject();

//  Register the service worker for PWA support
const updateSW = registerSW({
  onNeedRefresh() {
    // Automatically refresh when a new version is available
    if (confirm("New version available! Reload to update?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("App ready to work offline.");
  },
});

//  Mount your React app
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
