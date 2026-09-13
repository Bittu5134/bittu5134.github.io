import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./pages/App.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/blog",
    lazy: async () => {
      const { default: Component } = await import("./pages/BlogList.tsx");
      return { Component };
    },
  },
  {
    path: "/blog/:slug",
    lazy: async () => {
      const { default: Component } = await import("./pages/BlogPost.tsx");
      return { Component };
    },
  },
  {
    path: "/discord",
    lazy: async () => {
      const { default: Component } = await import("./pages/DiscordRedirect.tsx");
      return { Component };
    },
  },
  {
    path: "*",
    lazy: async () => {
      const { default: Component } = await import("./pages/ErrorPage.tsx");
      return { Component };
    },
  },
]);

const rootElement = document.getElementById("root")!;

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(
    rootElement,
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
