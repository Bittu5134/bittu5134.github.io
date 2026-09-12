import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.tsx";
import DiscordRedirect from "./pages/DiscordRedirect.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";

import "../index.css";
import SimpleFlightController from "./pages/SimpleFlightController.tsx";
import BlogList from "./pages/BlogList.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";

let router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/blog",
    Component: BlogList,
  },
  {
    path: "/blog/:slug",
    Component: BlogPost,
  },
  {
    path: "/discord",
    Component: DiscordRedirect,
  },
  {
    path: "/simpleflightcontroller",
    Component: SimpleFlightController,
  },
  {
    path: "*",
    Component: ErrorPage,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
