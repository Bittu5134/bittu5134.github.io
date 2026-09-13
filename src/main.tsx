import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Switch, Route } from "wouter";
import App from "./pages/App.tsx";
import "./index.css";

const BlogList = lazy(() => import("./pages/BlogList.tsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.tsx"));
const DiscordRedirect = lazy(() => import("./pages/DiscordRedirect.tsx"));
const ErrorPage = lazy(() => import("./pages/ErrorPage.tsx"));

export function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Switch>
        <Route path="/" component={App} />
        <Route path="/blog" component={BlogList} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/discord" component={DiscordRedirect} />
        <Route component={ErrorPage} />
      </Switch>
    </Suspense>
  );
}

const rootElement = document.getElementById("root")!;

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(
    rootElement,
    <React.StrictMode>
      <AppRoutes />
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AppRoutes />
    </React.StrictMode>
  );
}
