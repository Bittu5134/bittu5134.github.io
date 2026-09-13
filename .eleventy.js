import htmlmin from "html-minifier-terser";

export default function (eleventyConfig) {
  // HTML Minification for data savings
  eleventyConfig.addTransform("htmlmin", async function (content) {
    if ((this.page.outputPath || "").endsWith(".html")) {
      return await htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        minifyCSS: true,
        minifyJS: true,
      });
    }
    return content;
  });

  // Passthrough static files from public/ directly to output root
  eleventyConfig.addPassthroughCopy({ "public": "." });
  eleventyConfig.addPassthroughCopy({ "public/.nojekyll": ".nojekyll" });

  // Passthrough client JavaScript
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });

  // Watch for CSS changes
  eleventyConfig.addWatchTarget("./src/index.css");

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
