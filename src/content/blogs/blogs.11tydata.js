import fs from "node:fs";
import getReadingTime from "reading-time";

export default {
  layout: "layouts/post.njk",
  tags: ["posts"],
  permalink: "/blog/{{ slug or page.fileSlug }}/index.html",
  eleventyComputed: {
    slug: (data) => data.slug || data.page.fileSlug,
    displayDate: (data) => {
      if (data.displayDate) return data.displayDate;
      if (data.date) {
        const d = new Date(data.date);
        return !isNaN(d.getTime())
          ? d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
          : String(data.date);
      }
      return "";
    },
    readTime: (data) => {
      if (data.page && data.page.inputPath) {
        try {
          const raw = fs.readFileSync(data.page.inputPath, "utf-8");
          const body = raw.replace(/^---[\s\S]*?---\n?/, "");
          const stats = getReadingTime(body);
          return stats.text;
        } catch {
          // fallback
        }
      }
      return "3 min read";
    },
    coverImage: (data) => data.coverImage || "",
    coverAlt: (data) => data.coverAlt || (data.title ? `${data.title} cover image` : ""),
  },
};
