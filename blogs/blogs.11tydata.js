import fs from "node:fs";
import getReadingTime from "reading-time";
import { formatBlogDate, parseBlogDate, toIsoBlogDate } from "../scripts/parse-blog-date.js";

const UNSPLASH_ABSTRACT_COVERS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&h=630&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&h=630&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&h=630&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=1200&h=630&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&h=630&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507499739999-097706ad8914?w=1200&h=630&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=630&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1574169208507-84376144848b?w=1200&h=630&auto=format&fit=crop&q=80",
];

function getDeterministicAbstractCover(str) {
  let hash = 0;
  const s = String(str || "default");
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % UNSPLASH_ABSTRACT_COVERS.length;
  return UNSPLASH_ABSTRACT_COVERS[index];
}

export default {
  layout: "layouts/post.njk",
  tags: ["posts"],
  permalink: "/blog/{{ slug or page.fileSlug }}/index.html",
  eleventyComputed: {
    slug: (data) => data.slug || data.page.fileSlug,
    // Eleventy requires `date` to be a real Date, but the authored DD-MM-YYYY form
    // arrives as a string. Coerce it here so every downstream consumer (sorting,
    // <time datetime>, meta tags) sees a proper Date instead of raw text.
    date: (data) => parseBlogDate(data.date),
    // displayDate is no longer supported: the long form is always derived from
    // `date` so a hand-written date can never disagree with the machine-readable one.
    displayDate: (data) => {
      const parsed = formatBlogDate(data.date);
      return parsed || "";
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
    coverImage: (data) => {
      if (data.coverImage) return data.coverImage;
      return getDeterministicAbstractCover(data.slug || data.page?.fileSlug || data.title);
    },
    coverAlt: (data) => data.coverAlt || (data.title ? `${data.title} abstract cover` : "Abstract cover"),
    ogImage: (data) => {
      if (data.ogImage) return data.ogImage;
      if (data.coverImage) {
        if (data.coverImage.endsWith(".svg")) {
          return data.coverImage.replace(/\.svg$/, ".png");
        }
        return data.coverImage;
      }
      return getDeterministicAbstractCover(data.slug || data.page?.fileSlug || data.title);
    },
    wordCount: (data) => {
      if (data.page && data.page.inputPath) {
        try {
          const raw = fs.readFileSync(data.page.inputPath, "utf-8");
          const body = raw.replace(/^---[\s\S]*?---\n?/, "");
          const words = body.trim().split(/\s+/).filter(Boolean);
          return words.length;
        } catch {
          // fallback
        }
      }
      return 0;
    },
    dateModified: (data) => {
      const mod = data.updated || data.dateModified || data.date;
      if (mod) {
        return toIsoBlogDate(mod);
      }
      return "";
    },
    keywords: (data) => {
      const visibleTags = (data.tags || []).filter((t) => t && t !== "posts");
      const hidden = Array.isArray(data.hiddenTags)
        ? data.hiddenTags.filter(Boolean)
        : typeof data.hiddenTags === "string"
        ? data.hiddenTags.split(",").map((t) => t.trim()).filter(Boolean)
        : Array.isArray(data.seoTags)
        ? data.seoTags.filter(Boolean)
        : typeof data.seoTags === "string"
        ? data.seoTags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];
      const combined = Array.from(new Set([...visibleTags, ...hidden]));
      return combined.join(", ");
    },
    allSeoTags: (data) => {
      const visibleTags = (data.tags || []).filter((t) => t && t !== "posts");
      const hidden = Array.isArray(data.hiddenTags)
        ? data.hiddenTags.filter(Boolean)
        : typeof data.hiddenTags === "string"
        ? data.hiddenTags.split(",").map((t) => t.trim()).filter(Boolean)
        : Array.isArray(data.seoTags)
        ? data.seoTags.filter(Boolean)
        : typeof data.seoTags === "string"
        ? data.seoTags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];
      return Array.from(new Set([...visibleTags, ...hidden]));
    },
  },
};
