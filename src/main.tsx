import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SystemProvider } from "./provider/SystemProvider.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Watched from "./views/Watched.tsx";
import { ByUser } from "./views/ByUser.tsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/watched", element: <Watched /> },
  { path: "/by-user", element: <ByUser /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SystemProvider>
      <RouterProvider router={router} />
    </SystemProvider>
  </React.StrictMode>,
);
