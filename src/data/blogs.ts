export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  summary: string;
  tags: string[];
  content: string;
}

// Vite glob import of all markdown blog posts as raw strings
const rawBlogFiles = import.meta.glob("../content/blogs/*.md", {
  query: "?raw",
  eager: true,
}) as Record<string, { default: string } | string>;

function parseMarkdownPost(raw: string, fallbackSlug: string): BlogPost {
  const normalized = raw.replace(/\r\n/g, "\n");
  const fmMatch = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  const meta: Record<string, string | string[]> = {};
  let content = normalized;

  if (fmMatch) {
    const yamlBlock = fmMatch[1];
    content = fmMatch[2].trim();

    // Lightweight YAML frontmatter parser
    const lines = yamlBlock.split("\n");
    let currentKey = "";
    let inList = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      if (trimmed.startsWith("- ") && inList && currentKey) {
        const item = trimmed.slice(2).trim().replace(/^["']|["']$/g, "");
        const list = meta[currentKey];
        if (Array.isArray(list)) {
          list.push(item);
        }
        continue;
      }

      const colonIdx = line.indexOf(":");
      if (colonIdx !== -1) {
        const key = line.slice(0, colonIdx).trim();
        const value = line.slice(colonIdx + 1).trim();

        if (value === "") {
          currentKey = key;
          inList = true;
          meta[key] = [];
        } else {
          inList = false;
          currentKey = key;
          // Handle arrays like ["a", "b"]
          if (value.startsWith("[") && value.endsWith("]")) {
            meta[key] = value
              .slice(1, -1)
              .split(",")
              .map((v) => v.trim().replace(/^["']|["']$/g, ""))
              .filter(Boolean);
          } else {
            meta[key] = value.replace(/^["']|["']$/g, "");
          }
        }
      }
    }
  }

  return {
    slug: typeof meta.slug === "string" ? meta.slug : fallbackSlug,
    title: typeof meta.title === "string" ? meta.title : fallbackSlug,
    date: typeof meta.date === "string" ? meta.date : "",
    readTime: typeof meta.readTime === "string" ? meta.readTime : "5 min read",
    summary: typeof meta.summary === "string" ? meta.summary : "",
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    content,
  };
}

export const blogPosts: BlogPost[] = Object.entries(rawBlogFiles)
  .map(([filepath, mod]) => {
    const rawContent = typeof mod === "string" ? mod : mod.default;
    const fallbackSlug = filepath
      .split("/")
      .pop()!
      .replace(/\.md$/, "");
    return parseMarkdownPost(rawContent, fallbackSlug);
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
