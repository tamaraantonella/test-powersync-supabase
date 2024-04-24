import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SystemProvider } from "./provider/SystemProvider.tsx";
import { powerSync, setupPowerSync } from "./db/client.ts";
/*
setupPowerSync().then(async () => {
  const result = await powerSync.getAll("SELECT * FROM pets")
  console.log("🚀🩷🥰​ ~ file: main.tsx:10 ~ setupPowerSync ~ result:", result);
});
*/

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SystemProvider>
      <App />
    </SystemProvider>
  </React.StrictMode>
);
