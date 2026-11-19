/**
 * Generates the agent/SEO files that are derived from content rather than
 * hand-written, straight into public/ (Eleventy's passthrough root):
 *
 *   sitemap.xml   — every page with its lastmod
 *   robots.txt    — crawl policy + Content Signals
 *   llms.txt      — short index for LLM agents
 *   llms-full.txt — full-text payload (projects + every post verbatim)
 *
 * RSS is NOT generated here: src/rss.njk renders it via the official plugin.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { fileURLToPath } from "node:url";
import getProjects from "../src/_data/projects.js";
import getReadingTime from "reading-time";
import { getDeterministicAbstractCover } from "./abstract-cover.js";
import { toIsoBlogDate, normalizeTagList, mergeTagLists } from "./parse-blog-date.js";
import siteConfig from "../site.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = siteConfig.url;
const blogsDir = path.resolve(__dirname, "../blogs");
const publicDir = path.resolve(__dirname, "../public");

function getAllMarkdownFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push(fullPath);
    }
  }
  return results;
}

function parseMarkdownFile(filepath) {
  const { data, content } = matter(fs.readFileSync(filepath, "utf-8"));
  const slug = data.slug || path.basename(filepath, ".md");

  // Keyword pool: visible tags + post-specific hidden tags (with the legacy
  // `seoTags` alias) + the site-wide defaults, deduped in author order.
  const tags = normalizeTagList(data.tags).filter((t) => t !== "posts");
  const hiddenTags = mergeTagLists(data.hiddenTags, data.seoTags);
  const allSeoTags = mergeTagLists(tags, hiddenTags, siteConfig.seo.defaultTags);

  const date = toIsoBlogDate(data.date);
  const updated = data.updated ? toIsoBlogDate(data.updated) : null;

  return {
    slug,
    title: data.title || slug,
    date,
    updated,
    lastmod: updated || date,
    readTime: getReadingTime(content).text,
    summary: data.summary || "",
    tags,
    hiddenTags,
    allSeoTags,
    coverImage: data.coverImage || getDeterministicAbstractCover(slug),
    content: content.trim(),
  };
}

export async function generateMeta() {
  const posts = getAllMarkdownFiles(blogsDir)
    .map(parseMarkdownFile)
    .sort((a, b) => (b.lastmod || "").localeCompare(a.lastmod || ""));

  console.log(`[generate-meta] indexed ${posts.length} blog posts from frontmatter.`);

  const { projects } = await getProjects();

  // ── sitemap.xml ───────────────────────────────────────────────────────────
  // Latest content date, falling back to today so the sitemap always shows a
  // plausible lastmod even before any posts exist.
  const today = new Date().toISOString().split("T")[0];
  const latestMod = posts.reduce((latest, post) => (post.lastmod > latest ? post.lastmod : latest), today);
  const urls = [
    { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0", lastmod: latestMod },
    { loc: `${SITE_URL}/blog/`, changefreq: "weekly", priority: "0.8", lastmod: latestMod },
    ...posts.map((post) => ({
      loc: `${SITE_URL}/blog/${post.slug}/`,
      changefreq: "monthly",
      priority: "0.7",
      lastmod: post.lastmod,
    })),
    { loc: `${SITE_URL}/llms.txt`, changefreq: "weekly", priority: "0.6", lastmod: latestMod },
    { loc: `${SITE_URL}/llms-full.txt`, changefreq: "weekly", priority: "0.6", lastmod: latestMod },
    { loc: `${SITE_URL}/rss.xml`, changefreq: "weekly", priority: "0.5", lastmod: latestMod },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);

  // ── robots.txt ────────────────────────────────────────────────────────────
  fs.writeFileSync(
    path.join(publicDir, "robots.txt"),
    `User-agent: *
Allow: /

# AI content usage policy (Content Signals, see https://contentsignals.org/).
# search=yes  - allow search engine indexing
# ai-input=yes - allow AI systems to ground answers in this content
# ai-train=yes - allow this content to be used for model training
Content-Signal: search=yes, ai-input=yes, ai-train=yes

# LLM agent feeds are discovered via <link rel="alternate"> in the HTML head
# (non-standard directives here break Lighthouse SEO).

Sitemap: ${SITE_URL}/sitemap.xml
`
  );

  // ── llms.txt / llms-full.txt ──────────────────────────────────────────────
  const articlesList = posts
    .map((post) => {
      const tags = post.tags.length ? ` [${post.tags.join(", ")}]` : "";
      const dateInfo = post.updated ? ` (${post.date}, updated ${post.updated})` : ` (${post.date})`;
      return `- [${post.title}](${SITE_URL}/blogs/${post.slug}.md)${dateInfo}: ${post.summary}${tags} — ${post.readTime}. Rendered HTML: ${SITE_URL}/blog/${post.slug}`;
    })
    .join("\n");

  const projectsList = projects
    .map((p) => {
      const url = p.liveUrl || p.githubUrl;
      const extra = p.liveUrl ? ` Source: ${p.githubUrl}` : "";
      return `- [${p.title}](${url}): ${p.description}${extra}`;
    })
    .join("\n");

  fs.writeFileSync(
    path.join(publicDir, "llms.txt"),
    `# Divyanshu Anand (Bittu)
> Software engineer at IIT Kanpur specialising in low-level systems programming, WebRTC networking, protocol reverse-engineering, and AI tooling. This file is the canonical agent-readable index of all public work and technical writing at bittu.dev.

Canonical site: ${SITE_URL}

## Identity & Expertise
- Full name: Divyanshu Anand
- Also known as: Bittu, bittu5134, bittu 5134
- Handle: Bittu5134
- Education: Bachelor's in Cybersecurity, IIT Kanpur (expected 2030)
- Core skills: Go, Python, C/C++, TypeScript — Linux sockets, POSIX daemons, WebRTC/STUN/TURN, Redis, FastAPI/Gin, Cloudflare Workers, PyMuPDF, PyTorch, RAG pipelines
- Contact: hello@bittu.dev
- GitHub: https://github.com/Bittu5134
- LinkedIn: https://www.linkedin.com/in/bittu5134
- X / Twitter: https://x.com/LostSquidXD

## Open-Source Projects
${projectsList}

## Technical Writing
${articlesList}

## Full Single-File Context
- [llms-full.txt](${SITE_URL}/llms-full.txt): Complete plain-text payload — full project descriptions, all blog post content verbatim, and author profile. Optimised for single-shot context injection into coding assistants and RAG pipelines.

## Additional Links
- [Blog Archive](${SITE_URL}/blog): Chronological index of all technical articles with tags and reading times.
- [RSS Feed](${SITE_URL}/rss.xml): Machine-readable RSS 2.0 feed for new article syndication.
- [Planet Minecraft](https://www.planetminecraft.com/member/bittu5134/): Published Minecraft technical datapacks and game modifications (2.3M+ downloads).
- [Patreon](https://www.patreon.com/lazybittu): Support channel for independent open-source tools and systems research.
`
  );

  const postsFullSection = posts
    .map((post) => {
      const coverUrl = post.coverImage ? (post.coverImage.startsWith("http") ? post.coverImage : `${SITE_URL}${post.coverImage}`) : "None";
      const keywords = post.hiddenTags.length ? `\nKeywords: ${post.allSeoTags.join(", ")}` : "";
      const updatedLine = post.updated ? `\nDate Modified: ${post.updated}` : "";
      return `---
Title: ${post.title}
Date Published: ${post.date}${updatedLine}
Read Time: ${post.readTime}
Tags: ${post.tags.join(", ")}${keywords}
Canonical URL: ${SITE_URL}/blog/${post.slug}
Raw Markdown: ${SITE_URL}/blogs/${post.slug}.md
Cover Image: ${coverUrl}
Summary: ${post.summary}
---

${post.content}`;
    })
    .join("\n\n================================================================================\n\n");

  const projectsFullSection = projects
    .map((p, i) => {
      const urls = [p.liveUrl && `Live: ${p.liveUrl}`, `Source: ${p.githubUrl}`].filter(Boolean).join(" | ");
      return `### ${i + 1}. ${p.title}
${urls}
Description: ${p.description}
Category: ${p.category}
Language: ${p.language || "(see repo)"}
Topics: ${(p.tags || []).join(", ")}`;
    })
    .join("\n\n");

  fs.writeFileSync(
    path.join(publicDir, "llms-full.txt"),
    `# Divyanshu Anand (Bittu) — Full Context Payload
> Complete plain-text knowledge base for AI agents and coding assistants. Contains full author profile, all open-source project descriptions, and every technical blog post verbatim. Optimised for single-shot ingestion.

Index: ${SITE_URL}/llms.txt
Canonical: ${SITE_URL}

================================================================================
SECTION 1 — IDENTITY & SKILLS
================================================================================

Name: Bittu
Legal Name: Divyanshu Anand
Also known as: Bittu, bittu5134, bittu 5134
Handle: Bittu5134
Email: hello@bittu.dev
Website: ${SITE_URL}
GitHub: https://github.com/Bittu5134
LinkedIn: https://www.linkedin.com/in/bittu5134
X / Twitter: https://x.com/LostSquidXD
Patreon: https://www.patreon.com/lazybittu

Education: Bachelor's in Cybersecurity — Indian Institute of Technology Kanpur (expected 2030)

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
`
  );

  console.log("[generate-meta] sitemap.xml, robots.txt, llms.txt and llms-full.txt written.");
}

// Execute when run directly from the CLI.
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  generateMeta().catch((err) => {
    console.error("[generate-meta] Error:", err);
    process.exit(1);
  });
}
