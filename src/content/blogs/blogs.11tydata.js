import fs from "node:fs";
import getReadingTime from "reading-time";

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
  },
};
