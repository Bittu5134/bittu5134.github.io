import fs from "node:fs";
import getReadingTime from "reading-time";
import { getDeterministicAbstractCover } from "../scripts/abstract-cover.js";
import { formatBlogDate, parseBlogDate, toIsoBlogDate, normalizeTagList, mergeTagLists } from "../scripts/parse-blog-date.js";
import { measureImage } from "../scripts/image-dimensions.js";
import siteConfig from "../site.config.js";


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
    // Inferred dynamically from the real image file when not explicitly declared in frontmatter.
    // If the image is external (Unsplash) or unmeasurable, fall back to safe social standards.
    ogImageWidth: (data) => {
      if (data.ogImageWidth) return data.ogImageWidth;
      const target = data.ogImage || data.coverImage;
      const measured = measureImage(target);
      if (measured) return measured.width;
      if (target && target.includes("og-banner")) return 1400;
      return 1200;
    },
    ogImageHeight: (data) => {
      if (data.ogImageHeight) return data.ogImageHeight;
      const target = data.ogImage || data.coverImage;
      const measured = measureImage(target);
      if (measured) return measured.height;
      if (target && target.includes("og-banner")) return 350;
      return 630;
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
    updated: (data) => {
      return data.updated ? parseBlogDate(data.updated) : null;
    },
    displayUpdated: (data) => {
      return data.updated ? formatBlogDate(data.updated) : "";
    },
    dateModified: (data) => {
      const mod = data.updated || data.date;
      if (mod) {
        return toIsoBlogDate(mod);
      }
      return "";
    },
    // Combines:
    //   1. Author visible tags (`tags` minus internal "posts")
    //   2. Post-specific `hiddenTags` (or its legacy alias `seoTags`)
    //   3. Site-wide default tags from site.config.js (`seo.defaultTags`)
    keywords: (data) => {
      const visibleTags = (data.tags || []).filter((t) => t && t !== "posts");
      const universalTags = siteConfig?.seo?.defaultTags || [];
      const combined = mergeTagLists(visibleTags, data.hiddenTags, data.seoTags, universalTags);
      return combined.join(", ");
    },
    allSeoTags: (data) => {
      const visibleTags = (data.tags || []).filter((t) => t && t !== "posts");
      const universalTags = siteConfig?.seo?.defaultTags || [];
      return mergeTagLists(visibleTags, data.hiddenTags, data.seoTags, universalTags);
    },
  },
};
