import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter, Routes, Route } from "react-router";

import App from "./pages/App.tsx";
import BlogList from "./pages/BlogList.tsx";
import BlogPost from "./pages/BlogPost.tsx";

export function renderPage(url: string): string {
  const tree = createElement(
    StaticRouter,
    { location: url },
    createElement(
      Routes,
      null,
      createElement(Route, { path: "/", element: createElement(App) }),
      createElement(Route, { path: "/blog", element: createElement(BlogList) }),
      createElement(Route, { path: "/blog/:slug", element: createElement(BlogPost) })
    )
  );

  return renderToString(tree);
}
