import { setupMarkdown } from "./scripts/markdown-engine.js";
import { generateMeta } from "./scripts/generate-meta.mjs";
import getReadingTime from "reading-time";
import pluginRss from "@11ty/eleventy-plugin-rss";
import { minify } from "html-minifier-terser";

export default async function (eleventyConfig) {
  // 0. Official RSS Plugin
  eleventyConfig.addPlugin(pluginRss);

  // 1. Setup Markdown engine (Shiki SSG syntax highlighting, Mermaid diagrams, GitHub alerts, anchors)
  const md = await setupMarkdown();
  eleventyConfig.setLibrary("md", md);

  // 2. Lifecycle hook: Sync sitemaps, robots, raw markdown, and metadata before each build
  eleventyConfig.on("eleventy.before", async () => {
    try {
      await generateMeta();
    } catch (err) {
      console.warn("[11ty.before] generateMeta warning:", err.message);
    }
  });

  // 3. Ignore auto-generated metadata artifacts from triggering watch rebuild loops
  if (eleventyConfig.watchIgnores) {
    eleventyConfig.watchIgnores.add("public/rss.xml");
    eleventyConfig.watchIgnores.add("public/sitemap.xml");
    eleventyConfig.watchIgnores.add("public/robots.txt");
    eleventyConfig.watchIgnores.add("public/llms*.txt");
    eleventyConfig.watchIgnores.add("public/raw/**");
    eleventyConfig.watchIgnores.add("public/images/blogs/**");
  }

  // 4. Watch for blog content and styles
  eleventyConfig.addWatchTarget("./src/content/blogs/");
  eleventyConfig.addWatchTarget("./src/index.css");

  // 5. Reactive Blogs collection sorted chronologically descending
  eleventyConfig.addCollection("blogs", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./src/content/blogs/*.md").sort((a, b) => {
      const dateA = new Date(a.data.date || a.date);
      const dateB = new Date(b.data.date || b.date);
      return dateB - dateA;
    });
  });

  // 5.1 Unique tags collection for blog filtering
  eleventyConfig.addCollection("blogTags", function (collectionApi) {
    const tagsSet = new Set();
    const posts = collectionApi.getFilteredByGlob("./src/content/blogs/*.md");
    posts.forEach((post) => {
      (post.data.tags || []).forEach((t) => {
        if (t && t !== "posts") tagsSet.add(t);
      });
    });
    return Array.from(tagsSet).sort((a, b) => a.localeCompare(b));
  });

  // 6. Established HTML Minifier with html-minifier-terser
  eleventyConfig.addTransform("htmlmin", async function (content) {
    if ((this.page.outputPath || "").endsWith(".html")) {
      try {
        return await minify(content, {
          collapseWhitespace: true,
          removeComments: true,
          conservativeCollapse: true,
          minifyCSS: true,
          minifyJS: false, // preserve inline scripts with safe execution
        });
      } catch (err) {
        console.warn("[htmlmin] Error minifying " + this.page.outputPath + ":", err.message);
        return content;
      }
    }
    return content;
  });

  // 7. Passthrough static assets
  eleventyConfig.addPassthroughCopy({ "public": "." });
  eleventyConfig.addPassthroughCopy({ "public/.nojekyll": ".nojekyll" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({ "node_modules/littlefoot/dist/littlefoot.mjs": "assets/js/littlefoot.js" });
  eleventyConfig.addPassthroughCopy({ "node_modules/littlefoot/dist/littlefoot.css": "assets/css/littlefoot.css" });

  // 8. Template Filters
  // Table of Contents generator from rendered HTML
  eleventyConfig.addFilter("toc", function (content) {
    if (!content) return [];
    const headingRegex = /<h([23])\s+id="([^"]+)"[^>]*>(?:<a[^>]*>)?([\s\S]*?)(?:<\/a>)?<\/h\1>/gi;
    const items = [];
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const title = match[3].replace(/<[^>]+>/g, "").trim();
      items.push({
        level: parseInt(match[1], 10),
        id: match[2],
        title: title,
      });
    }
    return items;
  });

  // Reading time estimate using standard reading-time package
  eleventyConfig.addFilter("readingTime", function (content) {
    if (!content) return "1 min read";
    const text = String(content).replace(/<[^>]*>/g, "").trim();
    const stats = getReadingTime(text);
    return stats.text; // e.g. "4 min read"
  });

  // Date formatting helpers
  eleventyConfig.addFilter("dateDisplay", function (value) {
    if (!value) return "";
    const d = new Date(value);
    return !isNaN(d.getTime())
      ? d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : String(value);
  });

  eleventyConfig.addFilter("dateIso", function (value) {
    if (!value) return "";
    const d = new Date(value);
    return !isNaN(d.getTime()) ? d.toISOString().split("T")[0] : String(value);
  });

  // String uppercase filter
  eleventyConfig.addFilter("upper", function (value) {
    return typeof value === "string" ? value.toUpperCase() : value;
  });

  // JSON stringify filter
  eleventyConfig.addFilter("json", function (value) {
    return JSON.stringify(value);
  });

  // Slug filter fallback
  eleventyConfig.addFilter("slugifyText", function (value) {
    return String(value)
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["html", "njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
