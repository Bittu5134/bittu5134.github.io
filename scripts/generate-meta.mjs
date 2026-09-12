import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = "https://bittu.dev";
const blogsDir = path.resolve(__dirname, "../src/content/blogs");
const publicDir = path.resolve(__dirname, "../public");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
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

  return {
    slug: meta.slug || fallbackSlug,
    title: meta.title || fallbackSlug,
    date: meta.date || "",
    readTime: meta.readTime || "5 min read",
    summary: meta.summary || "",
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    content,
  };
}

const blogFiles = fs
  .readdirSync(blogsDir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => parseMarkdownFile(path.join(blogsDir, f)))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

console.log(`[generate-meta] Loaded ${blogFiles.length} markdown blog posts.`);

// 2. Generate public/rss.xml
function generateRss() {
  const lastBuildDate = new Date().toUTCString();
  const itemsXml = blogFiles
    .map((post) => {
      const pubDate = new Date(post.date).toUTCString();
      const postUrl = `${SITE_URL}/blog/${post.slug}`;
      return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.summary}]]></description>
    </item>`;
    })
    .join("\n");

  const rssContent = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Bittu - Systems &amp; Software Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Essays and deep dives into low-level systems, reverse engineering, distributed networking, and software craft by Divyanshu Anand (Bittu5134).</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>
`;

  fs.writeFileSync(path.join(publicDir, "rss.xml"), rssContent, "utf-8");
  console.log(`[generate-meta] Wrote public/rss.xml`);
}

// 3. Generate public/sitemap.xml
function generateSitemap() {
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
  console.log(`[generate-meta] Wrote public/sitemap.xml`);
}

// 4. Generate public/robots.txt
function generateRobots() {
  const robotsContent = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

  fs.writeFileSync(path.join(publicDir, "robots.txt"), robotsContent, "utf-8");
  console.log(`[generate-meta] Wrote public/robots.txt`);
}

// 5. Generate public/llms.txt (per llmstxt.org specification)
function generateLlmsTxt() {
  const articlesList = blogFiles
    .map(
      (post) =>
        `- [${post.title}](${SITE_URL}/blog/${post.slug}): ${post.summary}`
    )
    .join("\n");

  const llmsContent = `# Bittu (Divyanshu Anand)

> Systems hacker, low-level network engineer, and undergraduate studying Cybersecurity & Computing at IIT Kanpur '30.

## Overview
Bittu specializes in low-level systems programming (Go, Rust, C++), high-throughput WebRTC peer-to-peer networking, Linux daemons and socket telemetry, and reverse engineering binary network protocols (e.g. Minecraft Java wire format).

## Core Projects
- [ORV-Reader](https://orv.pages.dev): High-scale distributed web publishing platform serving 10.5M+ monthly HTTP requests with dual static web and compressed EPUB compilation and Cloudflare WAF bot defenses.
- [PeerBasket](https://peerbasket.bittu.dev): High-throughput lobby-based WebRTC signaling server in Go with Redis. Achieves 41ms average latency and 0.0% packet loss across 500 concurrent peers on bare-metal Proxmox infrastructure.
- [NetShip](https://github.com/Bittu5134/NetShip): Host Telemetry and Endpoint Detection & Response (EDR) daemon in Go. Captures active TCP/UDP socket activity and maps process lineages via deterministic 24-character SHA-256 GUIDs.
- [IITK-Resume-Engine](https://github.com/Bittu5134/IITK-Resume-Model): 2D Cartesian spatial coordinate geometry parser in PyMuPDF for academic LaTeX PDFs, recognizing 4,400+ IITK courses with a 6-track step-gradient scoring model.
- [Sharelock](https://github.com/Bittu5134/Sharelock): 1st Place Winner at ShareIITK Hackathon. Retrieval pipeline and Model Context Protocol (MCP) server indexing 100+ pages of IIT Kanpur academic regulations.

## Technical Articles & Dispatches
${articlesList}

## Quick Links
- Website: ${SITE_URL}
- Technical Zine: ${SITE_URL}/blog
- RSS Feed: ${SITE_URL}/rss.xml
- GitHub: https://github.com/Bittu5134
- Planet Minecraft: https://www.planetminecraft.com/member/bittu5134/
`;

  fs.writeFileSync(path.join(publicDir, "llms.txt"), llmsContent, "utf-8");
  console.log(`[generate-meta] Wrote public/llms.txt`);
}

// Execute all generators
generateRss();
generateSitemap();
generateRobots();
generateLlmsTxt();
console.log(`[generate-meta] Done! All metadata standards generated successfully.`);
