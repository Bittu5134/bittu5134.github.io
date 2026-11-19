import fs from "node:fs";
import getReadingTime from "reading-time";
import { getDeterministicAbstractCover } from "../scripts/abstract-cover.js";
import { formatBlogDate, parseBlogDate, toIsoBlogDate, normalizeTagList, mergeTagLists } from "../scripts/parse-blog-date.js";
import { measureImage } from "../scripts/image-dimensions.js";
import siteConfig from "../site.config.js";

// The symlinked dist entry is read per computed property, which keeps watch-mode
// rebuilds honest: an edited post always gets a fresh read.
function readBody(data) {
  if (!data.page || !data.page.inputPath) return "";
  try {
    return fs.readFileSync(data.page.inputPath, "utf-8").replace(/^---[\s\S]*?---\n?/, "");
  } catch {
    return "";
  }
}

export default {
  layout: "layouts/post.njk",
  isPostPage: true,
  tags: ["posts"],
  permalink: "/blog/{{ slug or page.fileSlug }}/index.html",
  eleventyComputed: {
    slug: (data) => data.slug || data.page.fileSlug,

    // Eleventy requires `date` to be a real Date, but the authored DD-MM-YYYY form
    // arrives as a string. Coerce it here so every downstream consumer (sorting,
    // <time datetime>, meta tags) sees a proper Date instead of raw text.
    date: (data) => parseBlogDate(data.date),

    // displayDate is derived from `date`, never authored, so a hand-written long
    // form can never disagree with the machine-readable one.
    displayDate: (data) => formatBlogDate(data.date) || "",

    readTime: (data) => {
      const body = readBody(data);
      return body ? getReadingTime(body).text : "3 min read";
    },
    wordCount: (data) => {
      const body = readBody(data);
      return body ? body.trim().split(/\s+/).filter(Boolean).length : 0;
    },

    coverAlt: (data) => data.coverAlt || (data.title ? `${data.title} abstract cover` : "Abstract cover"),

    // Posts without an authored coverImage get a deterministic Unsplash
    // abstract, keyed on the slug so the art is stable across builds.
    coverImage: (data) => data.coverImage || getDeterministicAbstractCover(data.slug || data.page?.fileSlug || data.title),

    // Social cards want real pixel dimensions. Measured from the local file when
    // possible; cards that cannot be measured fall back to the standard size.
    ogImageWidth: (data) => {
      if (data.ogImageWidth) return data.ogImageWidth;
      return measureImage(data.ogImage || data.coverImage)?.width ?? 1200;
    },
    ogImageHeight: (data) => {
      if (data.ogImageHeight) return data.ogImageHeight;
      return measureImage(data.ogImage || data.coverImage)?.height ?? 630;
    },

    dateModified: (data) => toIsoBlogDate(data.updated || data.date) || "",

    // SEO keyword pool: visible tags, then post-specific hidden tags (with the
    // legacy `seoTags` alias), then the site-wide defaults from site.config.js.
    allSeoTags: (data) => {
      const visibleTags = normalizeTagList(data.tags).filter((t) => t !== "posts");
      return mergeTagLists(visibleTags, data.hiddenTags, data.seoTags, siteConfig.seo.defaultTags);
    },
    // Eleventy evaluates computed data with a proxy against sample data, so this
    // runs once without a real allSeoTags — guard against that call.
    keywords: (data) => (Array.isArray(data.allSeoTags) ? data.allSeoTags.join(", ") : ""),
  },
};
