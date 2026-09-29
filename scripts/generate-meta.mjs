import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import getProjects from "../src/_data/projects.js";
import getReadingTime from "reading-time";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = "https://bittu.dev";
const blogsDir = path.resolve(__dirname, "../blogs");
const publicDir = path.resolve(__dirname, "../public");

function ensureDirs() {
  [publicDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

import matter from "gray-matter";

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

// Recursively find all markdown files in a directory (supporting nested subfolders)
function getAllMarkdownFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".git") {
        results = results.concat(getAllMarkdownFiles(fullPath));
      }
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push(fullPath);
    }
  }
  return results;
}
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
    coverImage: data.coverImage || getDeterministicAbstractCover(data.slug || fallbackSlug),
    coverAlt: data.coverAlt || (data.title ? `${data.title} abstract cover` : "Abstract cover"),
    content,
    raw,
  };
}

export async function generateMeta() {
  ensureDirs();

  const blogFiles = getAllMarkdownFiles(blogsDir)
    .map((f) => parseMarkdownFile(f))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  console.log(`[generate-meta] Loaded ${blogFiles.length} markdown blog posts directly from frontmatter.`);



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

# AI Agent & LLM Context Feeds
LLMs: ${SITE_URL}/llms.txt
LLMs-full: ${SITE_URL}/llms-full.txt

# Canonical Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(publicDir, "robots.txt"), robotsContent, "utf-8");

  // 5. Generate public/llms.txt
  const articlesList = blogFiles
    .map((post) => {
      const tags = post.tags.length ? ` [${post.tags.join(", ")}]` : "";
      return `- [${post.title}](${SITE_URL}/blogs/${post.slug}.md): ${post.summary}${tags} — ${post.readTime}. Rendered HTML: ${SITE_URL}/blog/${post.slug}`;
    })
    .join("\n");

  const projectsMarkdown = projectsList
    .map((p) => {
      const url = p.liveUrl || p.githubUrl;
      const extra = p.liveUrl ? ` Source: ${p.githubUrl}` : "";
      return `- [${p.title}](${url}): ${p.description}${extra}`;
    })
    .join("\n");

  const llmsContent = `# Bittu (Bittu5134)
> Software engineer at IIT Kanpur specialising in low-level systems programming, WebRTC networking, protocol reverse-engineering, and AI tooling. This file is the canonical agent-readable index of all public work and technical writing at bittu.dev.

Canonical site: ${SITE_URL}
Generated: ${today}

## Identity & Expertise
- Full name: Bittu (handle: Bittu5134)
- Education: B.Tech Cybersecurity & Computing, IIT Kanpur (expected 2030)
- Core skills: Go, Python, C/C++, TypeScript — Linux sockets, POSIX daemons, WebRTC/STUN/TURN, Redis, FastAPI/Gin, Cloudflare Workers, PyMuPDF, PyTorch, RAG pipelines
- Contact: hello@bittu.dev
- GitHub: https://github.com/Bittu5134
- LinkedIn: https://www.linkedin.com/in/bittu5134
- X / Twitter: https://x.com/404lostsquid

## Open-Source Projects
${projectsMarkdown}

## Technical Writing
${articlesList}

## Full Single-File Context
- [llms-full.txt](${SITE_URL}/llms-full.txt): Complete plain-text payload — full project descriptions, all blog post content verbatim, and author profile. Optimised for single-shot context injection into coding assistants and RAG pipelines.

## Additional Links
- [Blog Archive](${SITE_URL}/blog): Chronological index of all technical articles with tags and reading times.
- [RSS Feed](${SITE_URL}/rss.xml): Machine-readable RSS 2.0 feed for new article syndication.
- [Planet Minecraft](https://www.planetminecraft.com/member/bittu5134/): Published Minecraft technical datapacks and game modifications (2.3M+ downloads).
- [Patreon](https://www.patreon.com/lazybittu): Support channel for independent open-source tools and systems research.
`;
  fs.writeFileSync(path.join(publicDir, "llms.txt"), llmsContent, "utf-8");

  // 6. Generate public/llms-full.txt
  const postsFullSection = blogFiles
    .map((post) => {
      const coverUrl = post.coverImage
        ? (post.coverImage.startsWith("http") ? post.coverImage : `${SITE_URL}${post.coverImage}`)
        : "None";
      return `---
Title: ${post.title}
Date: ${post.date}
Read Time: ${post.readTime}
Tags: ${post.tags.join(", ")}
Canonical URL: ${SITE_URL}/blog/${post.slug}
Raw Markdown: ${SITE_URL}/blogs/${post.slug}.md
Cover Image: ${coverUrl}
Summary: ${post.summary}
---

${post.content}`;
    })
    .join("\n\n================================================================================\n\n");

  const projectsFullSection = projectsList
    .map((p, i) => {
      const urls = [p.liveUrl && `Live: ${p.liveUrl}`, p.githubUrl && `Source: ${p.githubUrl}`]
        .filter(Boolean).join(" | ");
      return `### ${i + 1}. ${p.title}
${urls}
Description: ${p.description}
Category: ${p.category}
Language: ${p.language || "(see repo)"}
Topics: ${(p.tags || []).join(", ")}`;
    })
    .join("\n\n");

  const fullContent = `# Bittu (Bittu5134) — Full Context Payload
> Complete plain-text knowledge base for AI agents and coding assistants. Contains full author profile, all open-source project descriptions, and every technical blog post verbatim. Optimised for single-shot ingestion.

Index: ${SITE_URL}/llms.txt
Canonical: ${SITE_URL}
Generated: ${today}

================================================================================
SECTION 1 — IDENTITY & SKILLS
================================================================================

Name: Bittu
Handle: Bittu5134
Email: hello@bittu.dev
Website: ${SITE_URL}
GitHub: https://github.com/Bittu5134
LinkedIn: https://www.linkedin.com/in/bittu5134
X / Twitter: https://x.com/404lostsquid
Patreon: https://www.patreon.com/lazybittu

Education: B.Tech Cybersecurity & Computing — Indian Institute of Technology Kanpur (expected 2030)

Languages: Go, Python, C, C++, TypeScript, JavaScript
Systems: Linux POSIX daemons, raw TCP/UDP sockets, /proc lineage tracing, SHA-256 GUIDs, memory-mapped I/O, zero-allocation Go event loops
Networking: WebRTC signaling servers, STUN/TURN/ICE, Redis TTL heartbeat pruning, IP token-bucket rate limiting, 500-peer concurrency benchmarks
Protocol Reversing: Minecraft Java Edition wire format — VarInt encoding, zlib packet compression, handshake state machines, live packet sniffing
AI & ML: RAG pipelines, MCP servers, CNN defect-detection ensembles, PyTorch, scikit-learn, vision model inference
Spatial Parsing: 2D bounding-box coordinate clustering in PyMuPDF for LaTeX tabular PDFs (academic transcripts, resumes)
Cloud & Edge: Cloudflare Workers, Cloudflare WAF bot mitigation, Cloudflare Pages, FastAPI, Gin, SSG compilers
Notable Deployments: 2.3M+ Minecraft datapack downloads (Planet Minecraft); public WebRTC signaling API (PeerBasket)

================================================================================
SECTION 2 — OPEN-SOURCE PROJECTS
================================================================================

${projectsFullSection}

================================================================================
SECTION 3 — TECHNICAL ARTICLES (FULL TEXT)
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
