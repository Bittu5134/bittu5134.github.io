import { renderToString } from "react-dom/server";
import { Router, Switch, Route } from "wouter";

import App from "./pages/App.tsx";
import BlogList from "./pages/BlogList.tsx";
import BlogPost from "./pages/BlogPost.tsx";

export function renderPage(url: string): string {
  return renderToString(
    <Router ssrPath={url}>
      <Switch>
        <Route path="/" component={App} />
        <Route path="/blog" component={BlogList} />
        <Route path="/blog/:slug" component={BlogPost} />
      </Switch>
    </Router>
  );
}
