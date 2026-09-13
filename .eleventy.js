export default function (eleventyConfig) {
  // Lightweight Vanilla HTML Minifier (zero-dependency, preserves pre/code)
  eleventyConfig.addTransform("htmlmin", function (content) {
    if ((this.page.outputPath || "").endsWith(".html")) {
      const preservedBlocks = [];
      let minified = content.replace(/<(pre|code|textarea)[\s\S]*?<\/\1>/gi, (match) => {
        preservedBlocks.push(match);
        return `___PRESERVED_BLOCK_${preservedBlocks.length - 1}___`;
      });
      minified = minified
        .replace(/<!--(?![\s\S]*?\[if)[\s\S]*?-->/g, "")
        .replace(/>\s+</g, "><")
        .replace(/\s{2,}/g, " ");
      minified = minified.replace(/___PRESERVED_BLOCK_(\d+)___/g, (_, index) => preservedBlocks[Number(index)]);
      return minified.trim();
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
