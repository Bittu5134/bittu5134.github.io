import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.resolve(rootDir, "dist");
const distSsrDir = path.resolve(rootDir, "dist-ssr");
const blogsDir = path.resolve(rootDir, "src/content/blogs");

async function prerender() {
  console.log("[prerender] Building SSR entry bundle...");
  execSync("npx vite build --ssr src/entry-server.tsx --outDir dist-ssr", {
    cwd: rootDir,
    stdio: "inherit",
  });

  const ssrEntryPath = path.resolve(distSsrDir, "entry-server.js");
  const { renderPage } = await import(`file://${ssrEntryPath}`);

  const template = fs.readFileSync(path.resolve(distDir, "index.html"), "utf-8");

  // Read blog slugs for SSG routes
  const blogFiles = fs.readdirSync(blogsDir).filter((f) => f.endsWith(".md"));
  const blogRoutes = blogFiles.map((f) => {
    const slug = path.basename(f, ".md");
    return {
      url: `/blog/${slug}`,
      outPath: path.resolve(distDir, `blog/${slug}/index.html`),
      title: `${slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} | Bittu`,
    };
  });

  const routes = [
    {
      url: "/",
      outPath: path.resolve(distDir, "index.html"),
      title: "Bittu",
    },
    {
      url: "/blog",
      outPath: path.resolve(distDir, "blog/index.html"),
      title: "Blog & Technical Zine | Bittu",
    },
    ...blogRoutes,
  ];

  console.log(`[prerender] Pre-rendering ${routes.length} static routes...`);

  for (const route of routes) {
    try {
      const appHtml = renderPage(route.url);
      let pageHtml = template.replace(
        '<div id="root"></div>',
        `<div id="root">${appHtml}</div>`
      );

      // Customize title
      if (route.title) {
        pageHtml = pageHtml.replace(
          /<title>.*?<\/title>/,
          `<title>${route.title}</title>`
        );
      }

      // Ensure directory exists
      const dir = path.dirname(route.outPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(route.outPath, pageHtml, "utf-8");
      console.log(`[prerender] Wrote ${path.relative(rootDir, route.outPath)} (${(pageHtml.length / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`[prerender] Error pre-rendering ${route.url}:`, err);
    }
  }

  // Clean up dist-ssr
  if (fs.existsSync(distSsrDir)) {
    fs.rmSync(distSsrDir, { recursive: true, force: true });
  }

  console.log("[prerender] Static site generation complete!");
}

prerender().catch((err) => {
  console.error("[prerender] Fatal error:", err);
  process.exit(1);
});
