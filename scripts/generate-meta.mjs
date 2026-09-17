import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import getProjects from "../src/_data/projects.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = "https://bittu.dev";
const blogsDir = path.resolve(__dirname, "../src/content/blogs");
const blogImagesDir = path.resolve(blogsDir, "images");
const publicDir = path.resolve(__dirname, "../public");
const publicBlogImagesDir = path.resolve(publicDir, "images/blogs");
const rawBlogsDir = path.resolve(publicDir, "raw/blogs");

function ensureDirs() {
  [publicDir, publicBlogImagesDir, rawBlogsDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// 1. Read and parse all markdown blogs
function parseMarkdownFile(filepath) {
  const raw = fs.readFileSync(filepath, "utf-8").replace(/\r\n/g, "\n");
  const fallbackSlug = path.basename(filepath, ".md");
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  let meta = {};
  let content = raw;

  if (fmMatch) {
    content = fmMatch[2].trim();
    const yamlBlock = fmMatch[1];
    const lines = yamlBlock.split("\n");
    let currentKey = "";
    let inList = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      if (trimmed.startsWith("- ") && inList && currentKey) {
        const item = trimmed.slice(2).trim().replace(/^["']|["']$/g, "");
        if (Array.isArray(meta[currentKey])) {
          meta[currentKey].push(item);
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

  // Calculate readTime dynamically if not provided
  const words = content.replace(/<[^>]*>/g, "").trim().split(/\s+/).filter(Boolean).length;
  const computedMinutes = Math.max(1, Math.round(words / 200));
  const readTime = meta.readTime || `${computedMinutes} min read`;

  return {
    slug: meta.slug || fallbackSlug,
    title: meta.title || fallbackSlug,
    date: meta.displayDate || meta.date || "",
    readTime,
    summary: meta.summary || "",
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    coverImage: meta.coverImage || "",
    coverAlt: meta.coverAlt || "",
    content,
    raw,
  };
}

export async function generateMeta() {
  ensureDirs();

  // Copy any co-located blog images from src/content/blogs/images to public/images/blogs
  if (fs.existsSync(blogImagesDir)) {
    const images = fs.readdirSync(blogImagesDir);
    for (const img of images) {
      const srcPath = path.join(blogImagesDir, img);
      const destPath = path.join(publicBlogImagesDir, img);
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  const blogFiles = fs
    .readdirSync(blogsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => parseMarkdownFile(path.join(blogsDir, f)))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  console.log(`[generate-meta] Loaded ${blogFiles.length} markdown blog posts.`);

  // Copy raw markdown posts to public/raw/blogs/
  for (const post of blogFiles) {
    fs.writeFileSync(path.join(rawBlogsDir, `${post.slug}.md`), post.raw, "utf-8");
  }

  // Write lightweight metadata JSON for list and preview views
  const blogsMeta = blogFiles.map(({ slug, title, date, readTime, summary, tags, coverImage, coverAlt }) => ({
    slug,
    title,
    date,
    readTime,
    summary,
    tags,
    coverImage,
    coverAlt,
  }));
  fs.writeFileSync(
    path.resolve(__dirname, "../src/_data/blogs.json"),
    JSON.stringify(blogsMeta, null, 2),
    "utf-8"
  );



  // Load projects from src/_data/projects.js
  let projectsList = [];
  try {
    const projectData = typeof getProjects === "function" ? await getProjects() : getProjects;
    projectsList = Array.isArray(projectData) ? projectData : (projectData?.projects || []);
  } catch (e) {
    console.warn(`[generate-meta] Failed to load projects:`, e.message);
  }

  // 2. Generate public/rss.xml
  const lastBuildDate = new Date().toUTCString();
  const itemsXml = blogFiles
    .map((post) => {
      const pubDate = new Date(post.date).toUTCString();
      const postUrl = `${SITE_URL}/blog/${post.slug}`;
      let enclosure = "";
      if (post.coverImage) {
        let fileLength = 0;
        try {
          const localImgPath = path.join(publicDir, post.coverImage.replace(/^\//, ""));
          if (fs.existsSync(localImgPath)) {
            fileLength = fs.statSync(localImgPath).size;
          }
        } catch {
          // ignore stat errors
        }
        enclosure = `\n      <enclosure url="${SITE_URL}${post.coverImage}" type="image/svg+xml" length="${fileLength}" />`;
      }
      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.summary}]]></description>${enclosure}
    </item>`;
    })
    .join("\n");

  const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Bittu - Systems &amp; Software Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Essays and deep dives into low-level systems, reverse engineering, distributed networking, and software craft by Bittu (Bittu5134).</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>
`;
  fs.writeFileSync(path.join(publicDir, "rss.xml"), rssContent, "utf-8");

  // 3. Generate public/sitemap.xml
  const today = new Date().toISOString().split("T")[0];
  const urls = [
    { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0", lastmod: today },
    { loc: `${SITE_URL}/blog`, changefreq: "weekly", priority: "0.8", lastmod: today },
    ...blogFiles.map((post) => {
      const dateObj = new Date(post.date);
      const lastmod = !isNaN(dateObj.getTime())
        ? dateObj.toISOString().split("T")[0]
        : today;
      return {
        loc: `${SITE_URL}/blog/${post.slug}`,
        changefreq: "monthly",
        priority: "0.7",
        lastmod,
      };
    }),
    { loc: `${SITE_URL}/llms.txt`, changefreq: "weekly", priority: "0.6", lastmod: today },
    { loc: `${SITE_URL}/llms-full.txt`, changefreq: "weekly", priority: "0.6", lastmod: today },
    { loc: `${SITE_URL}/rss.xml`, changefreq: "weekly", priority: "0.5", lastmod: today },
  ];

  const urlsXml = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join("\n");

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>
`;
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapContent, "utf-8");

  // 4. Generate public/robots.txt
  const robotsContent = `User-agent: *
Allow: /

# Canonical Sitemaps & LLM Context Feeds
Sitemap: ${SITE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(publicDir, "robots.txt"), robotsContent, "utf-8");

  // 5. Generate public/llms.txt
  const articlesList = blogFiles
    .map(
      (post) =>
        `- [${post.title}](${SITE_URL}/raw/blogs/${post.slug}.md): ${post.summary} (HTML view at ${SITE_URL}/blog/${post.slug})`
    )
    .join("\n");

  const projectsMarkdown = projectsList
    .map((p) => `- [${p.title}](${p.liveUrl || p.githubUrl}): ${p.description}`)
    .join("\n");

  const llmsContent = `# Bittu's Portfolio & Technical Blog
> A portfolio and technical blog for a low-level systems builder, cybersecurity undergraduate at IIT Kanpur, and WebRTC developer.

## Projects
${projectsMarkdown}

## Technical Writing
${articlesList}

## Full Content Payload
- [Complete Site LLM Context](${SITE_URL}/llms-full.txt): Stitched plain-text and raw Markdown payload containing full project descriptions and complete blog post contents for single-shot ingestion.

## Optional & Quick Links
- [Website Home](${SITE_URL}): Interactive Neo-Brutalist portfolio home.
- [Technical Blog](${SITE_URL}/blog): Full web-rendered article archive.
- [RSS 2.0 Feed](${SITE_URL}/rss.xml): Standard RSS syndication feed.
- [GitHub Profile](https://github.com/Bittu5134): Open-source repositories and experimental code.
- [Planet Minecraft](https://www.planetminecraft.com/member/bittu5134/): Minecraft technical datapacks and spotlighted game modifications.
- [Patreon](https://www.patreon.com/lazybittu): Support independent open-source tools and systems research.
`;
  fs.writeFileSync(path.join(publicDir, "llms.txt"), llmsContent, "utf-8");

  // 6. Generate public/llms-full.txt
  const postsFullSection = blogFiles
    .map((post) => {
      return `---
Title: ${post.title}
Date: ${post.date}
Read Time: ${post.readTime}
Tags: ${post.tags.join(", ")}
URL: ${SITE_URL}/blog/${post.slug}
Cover: ${post.coverImage ? `${SITE_URL}${post.coverImage}` : "None"}
Raw Markdown: ${SITE_URL}/raw/blogs/${post.slug}.md
Summary: ${post.summary}
---

${post.content}`;
    })
    .join("\n\n================================================================================\n\n");

  const projectsFullSection = projectsList
    .map((p, i) => {
      return `${i + 1}. ${p.title} (${p.liveUrl ? `${p.liveUrl} | ` : ""}${p.githubUrl})
${p.description}
Category: ${p.category} | Tags: ${p.tags.join(", ")} | Stats: ${p.statsText}`;
    })
    .join("\n\n");

  const fullContent = `# Bittu's Portfolio & Technical Blog — Full Context Payload
> Complete plain-text and Markdown knowledge base for Bittu (Bittu5134): low-level systems builder, cybersecurity undergraduate at IIT Kanpur, and WebRTC developer.

Canonical URL: ${SITE_URL}
Index File: ${SITE_URL}/llms.txt
RSS Feed: ${SITE_URL}/rss.xml
GitHub: https://github.com/Bittu5134
Patreon: https://www.patreon.com/lazybittu

================================================================================
SECTION 1: PROFILE & CORE EXPERTISE
================================================================================

Name: Bittu (Bittu5134)
Education: Undergraduate in Cybersecurity & Computing at Indian Institute of Technology Kanpur (IIT Kanpur '30)
Core Focus:
- Low-Level Systems: Linux POSIX daemons, raw TCP/UDP socket interception, /proc lineage tracing with SHA-256 GUIDs, memory-mapped I/O, zero-allocation Go loops.
- Networking & P2P: High-throughput WebRTC signaling servers, STUN/TURN, Redis TTL state sync, token-bucket rate limiting.
- Protocol Reverse Engineering: Minecraft Java Edition wire format (VarInts, packet state machine transitions, zlib decompression).
- Spatial Geometry: 2D coordinate bounding box parsing in PyMuPDF for complex LaTeX tabular PDFs.
- Web & Cloud: SSG static compilers, Cloudflare WAF bot mitigation, FastAPI async backends.

================================================================================
SECTION 2: FEATURED PROJECTS
================================================================================

${projectsFullSection}

================================================================================
SECTION 3: COMPLETE TECHNICAL ARTICLES & DISPATCHES
================================================================================

${postsFullSection}
`;

  fs.writeFileSync(path.join(publicDir, "llms-full.txt"), fullContent, "utf-8");
  console.log(`[generate-meta] All metadata, RSS, sitemap, and LLM standards synchronized.`);
}

// Execute when run directly from CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  generateMeta().catch((err) => {
    console.error("[generate-meta] Error:", err);
    process.exit(1);
  });
}
