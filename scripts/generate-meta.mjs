import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import getProjects from "../src/_data/projects.js";
import getReadingTime from "reading-time";

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

import matter from "gray-matter";

// 1. Read and parse all markdown blogs directly with gray-matter
function parseMarkdownFile(filepath) {
  const raw = fs.readFileSync(filepath, "utf-8");
  const fallbackSlug = path.basename(filepath, ".md");
  const parsed = matter(raw);
  const data = parsed.data || {};
  const content = parsed.content.trim();

  // Normalize tags: accept array or comma-separated string, exclude empty / "posts"
  let tags = [];
  if (Array.isArray(data.tags)) {
    tags = data.tags.filter(Boolean);
  } else if (typeof data.tags === "string") {
    tags = data.tags.split(",").map((t) => t.trim()).filter(Boolean);
  }

  // Calculate readTime dynamically using industry standard reading-time
  const stats = getReadingTime(content);
  const readTime = stats.text;

  return {
    slug: data.slug || fallbackSlug,
    title: data.title || fallbackSlug,
    date: data.displayDate || (data.date ? new Date(data.date).toISOString().split("T")[0] : ""),
    readTime,
    summary: data.summary || "",
    tags,
    coverImage: data.coverImage || "",
    coverAlt: data.coverAlt || "",
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

  console.log(`[generate-meta] Loaded ${blogFiles.length} markdown blog posts directly from frontmatter.`);

  // Copy raw markdown posts to public/raw/blogs/
  for (const post of blogFiles) {
    fs.writeFileSync(path.join(rawBlogsDir, `${post.slug}.md`), post.raw, "utf-8");
  }



  // Load projects from src/_data/projects.js
  let projectsList = [];
  try {
    const projectData = typeof getProjects === "function" ? await getProjects() : getProjects;
    projectsList = Array.isArray(projectData) ? projectData : (projectData?.projects || []);
  } catch (e) {
    console.warn(`[generate-meta] Failed to load projects:`, e.message);
  }

  // 2. RSS feed is generated declaratively via official @11ty/eleventy-plugin-rss in src/rss.njk
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
