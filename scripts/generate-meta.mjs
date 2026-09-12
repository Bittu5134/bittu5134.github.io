import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = "https://bittu.dev";
const blogsDir = path.resolve(__dirname, "../src/content/blogs");
const publicDir = path.resolve(__dirname, "../public");
const rawBlogsDir = path.resolve(publicDir, "raw/blogs");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(rawBlogsDir)) {
  fs.mkdirSync(rawBlogsDir, { recursive: true });
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
    raw,
  };
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
console.log(`[generate-meta] Published raw markdown files to public/raw/blogs/`);

// 2. Fetch Projects from GitHub at build time with hardcoded categories
const curatedProjects = [
  {
    title: "ORV-Reader",
    repo: "Bittu5134/ORV-Reader",
    category: "WEB / CLOUD",
    badge: "10.5M+ REQUESTS / MO",
    description:
      "High-scale distributed web publishing platform serving 10.5M+ monthly HTTP requests (398+ GB bandwidth, 764k+ unique visits). Automated Python Markdown SSG dual-compilation into static web and compressed EPUBs with Cloudflare WAF bot defenses.",
    tags: ["Python", "SSG", "Cloudflare WAF", "EPUB", "FastAPI"],
    liveUrl: "https://orv.pages.dev",
    headerBgClass: "bg-[#fde047]",
    statsText: "398GB Bandwidth · 764K Visits",
  },
  {
    title: "PeerBasket",
    repo: "Bittu5134/PeerBasket",
    category: "SYSTEMS / P2P",
    badge: "41ms LATENCY · 0% LOSS",
    description:
      "High-throughput, lobby-based WebRTC signaling server written in Go with Gin and Redis. Achieves 41 ms average latency and 0.0% packet loss across 500 concurrent peers with Redis TTL heartbeat pruning and IP token-bucket rate limiting on bare-metal Proxmox infrastructure.",
    tags: ["Go", "WebRTC", "Redis", "Proxmox", "Gin"],
    liveUrl: "https://peerbasket.bittu.dev",
    headerBgClass: "bg-[#86efac]",
    statsText: "500 Concurrent Peers · Bare-metal",
  },
  {
    title: "NetShip",
    repo: "Bittu5134/NetShip",
    category: "SYSTEMS / EDR",
    badge: "KERNEL TELEMETRY",
    description:
      "Cross-platform Host Telemetry and Endpoint Detection & Response (EDR) daemon in Go. Captures active TCP/UDP socket activity, maps process lineages via deterministic 24-char SHA-256 GUIDs, performs local cryptographic binary auditing, and runs an embedded live geolocation dashboard.",
    tags: ["Go", "Networking", "Telemetry", "EDR", "Linux"],
    headerBgClass: "bg-[#38bdf8]",
    statsText: "SHA-256 GUIDs · Socket Tracing",
  },
  {
    title: "IITK-Resume-Engine",
    repo: "Bittu5134/IITK-Resume-Model",
    category: "AI / GEOMETRY",
    badge: "4,400+ COURSES INDEXED",
    description:
      "Spatial LaTeX-PDF diagnostic engine built for IIT Kanpur Academics & Career Council (CDW). Features a 2D coordinate geometry table parser in PyMuPDF recognizing 4,400+ IITK courses and CPI metrics, paired with a 6-track step-gradient scoring model and counterfactual gap advice.",
    tags: ["Python", "PyMuPDF", "FastAPI", "LaTeX", "Spatial Geometry"],
    liveUrl: "https://iitk-resume.bittu.dev",
    headerBgClass: "bg-[#c4b5fd]",
    statsText: "99.4% Parsing Precision · CDW IITK",
  },
  {
    title: "InfraPulse",
    repo: "Bittu5134/InfraPulse",
    category: "AI / VISION",
    badge: "TAKNEEK '26 RUNNER-UP",
    description:
      "Civic defect detection and priority dispatch platform developed for IIT Kanpur Takneek '26. Combines a 5-model PyTorch vision ensemble with Sobel spatial edge severity math, async FastAPI ticket routing, and live Server-Sent Events (SSE) staff dispatch queues.",
    tags: ["PyTorch", "YOLO", "Sobel Math", "FastAPI", "SSE"],
    liveUrl: "https://infrapulse.bittu.dev",
    headerBgClass: "bg-[#fb923c]",
    statsText: "5-Model Vision Ensemble · Real-time SSE",
  },
  {
    title: "Sharelock",
    repo: "Bittu5134/Sharelock",
    category: "AI / RETRIEVAL",
    badge: "1st PLACE SHAREIITK",
    description:
      "1st Place Winner at ShareIITK Ideathon. An end-to-end RAG retrieval pipeline and Model Context Protocol (MCP) server indexing 100+ pages of dense IIT Kanpur Undergraduate Manual academic policies for citation-backed query resolution.",
    tags: ["RAG", "MCP Server", "TypeScript", "Policy Search"],
    headerBgClass: "bg-[#f472b6]",
    statsText: "1st Place Winner · MCP Server",
  },
];

async function generateProjects() {
  const headers = { "User-Agent": "Node.js" };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`;
  }

  const resolvedProjects = await Promise.all(
    curatedProjects.map(async (p) => {
      let liveUrl = p.liveUrl;
      let githubUrl = `https://github.com/${p.repo}`;
      let description = p.description;
      let tags = p.tags;
      let stars = 0;
      let forks = 0;

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(`https://api.github.com/repos/${p.repo}`, {
          headers,
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          stars = data.stargazers_count || 0;
          forks = data.forks_count || 0;
          if (data.html_url) githubUrl = data.html_url;
          if (data.homepage && !liveUrl) liveUrl = data.homepage;
          if (Array.isArray(data.topics) && data.topics.length > 0) {
            const topicTags = data.topics.map(
              (t) => t.charAt(0).toUpperCase() + t.slice(1)
            );
            tags = [...new Set([...p.tags, ...topicTags])].slice(0, 5);
          }
        }
      } catch (err) {
        console.warn(
          `[generate-meta] GitHub API fetch skipped for ${p.repo}: ${err.message}`
        );
      }

      return {
        title: p.title,
        category: p.category,
        badge: stars > 50 ? `★ ${stars} STARS · ${p.badge}` : p.badge,
        description,
        tags,
        liveUrl,
        githubUrl,
        headerBgClass: p.headerBgClass,
        statsText: p.statsText,
        stars,
        forks,
      };
    })
  );

  const projectsJsonPath = path.resolve(__dirname, "../src/data/projects.json");
  fs.writeFileSync(
    projectsJsonPath,
    JSON.stringify(resolvedProjects, null, 2),
    "utf-8"
  );
  console.log(
    `[generate-meta] Wrote src/data/projects.json with ${resolvedProjects.length} projects.`
  );
}

// 3. Generate public/rss.xml
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
    <description>Essays and deep dives into low-level systems, reverse engineering, distributed networking, and software craft by Bittu (Bittu5134).</description>
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

// 4. Generate public/sitemap.xml
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
  console.log(`[generate-meta] Wrote public/sitemap.xml`);
}

// 5. Generate public/robots.txt
function generateRobots() {
  const robotsContent = `User-agent: *
Allow: /

# Canonical Sitemaps & LLM Context Feeds
Sitemap: ${SITE_URL}/sitemap.xml
`;

  fs.writeFileSync(path.join(publicDir, "robots.txt"), robotsContent, "utf-8");
  console.log(`[generate-meta] Wrote public/robots.txt`);
}

// 6. Generate public/llms.txt (per llmstxt.org specification)
function generateLlmsTxt() {
  const articlesList = blogFiles
    .map(
      (post) =>
        `- [${post.title}](${SITE_URL}/raw/blogs/${post.slug}.md): ${post.summary} (HTML view at ${SITE_URL}/blog/${post.slug})`
    )
    .join("\n");

  const llmsContent = `# Bittu's Portfolio & Technical Blog
> A portfolio and technical blog for a low-level systems builder, cybersecurity undergraduate at IIT Kanpur, and WebRTC developer.

## Projects
- [ORV-Reader](https://orv.pages.dev): High-scale distributed web publishing platform serving 10.5M+ monthly HTTP requests with dual static web and compressed EPUB compilation and Cloudflare WAF bot defenses.
- [PeerBasket](https://peerbasket.bittu.dev): High-throughput lobby-based WebRTC signaling server in Go with Redis. Achieves 41ms average latency and 0.0% packet loss across 500 concurrent peers on bare-metal Proxmox infrastructure.
- [NetShip](https://github.com/Bittu5134/NetShip): Host Telemetry and Endpoint Detection & Response (EDR) daemon in Go. Captures active TCP/UDP socket activity and maps process lineages via deterministic 24-character SHA-256 GUIDs.
- [IITK-Resume-Engine](https://github.com/Bittu5134/IITK-Resume-Model): 2D Cartesian spatial coordinate geometry parser in PyMuPDF for academic LaTeX PDFs, recognizing 4,400+ IITK courses with a 6-track step-gradient scoring model.
- [Sharelock](https://github.com/Bittu5134/Sharelock): 1st Place Winner at ShareIITK Hackathon. Retrieval pipeline and Model Context Protocol (MCP) server indexing 100+ pages of dense IIT Kanpur Undergraduate Manual academic policies.

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
`;

  fs.writeFileSync(path.join(publicDir, "llms.txt"), llmsContent, "utf-8");
  console.log(`[generate-meta] Wrote public/llms.txt`);
}

// 7. Generate public/llms-full.txt companion
function generateLlmsFullTxt() {
  const postsFullSection = blogFiles
    .map((post) => {
      return `---
Title: ${post.title}
Date: ${post.date}
Read Time: ${post.readTime}
Tags: ${post.tags.join(", ")}
URL: ${SITE_URL}/blog/${post.slug}
Raw Markdown: ${SITE_URL}/raw/blogs/${post.slug}.md
Summary: ${post.summary}
---

${post.content}`;
    })
    .join("\n\n================================================================================\n\n");

  const fullContent = `# Bittu's Portfolio & Technical Blog — Full Context Payload
> Complete plain-text and Markdown knowledge base for Bittu (Bittu5134): low-level systems builder, cybersecurity undergraduate at IIT Kanpur, and WebRTC developer.

Canonical URL: ${SITE_URL}
Index File: ${SITE_URL}/llms.txt
RSS Feed: ${SITE_URL}/rss.xml
GitHub: https://github.com/Bittu5134

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

1. ORV-Reader (https://orv.pages.dev | https://github.com/Bittu5134/ORV-Reader)
High-scale distributed web publishing platform serving 10.5M+ monthly HTTP requests (398+ GB bandwidth, 764k+ unique visits). Automated Python Markdown SSG dual-compilation into static web and compressed EPUBs with Cloudflare WAF bot defenses.

2. PeerBasket (https://peerbasket.bittu.dev | https://github.com/Bittu5134/PeerBasket)
High-throughput, lobby-based WebRTC signaling server written in Go with Gin and Redis. Achieves 41 ms average latency and 0.0% packet loss across 500 concurrent peers with Redis TTL heartbeat pruning and IP token-bucket rate limiting on bare-metal Proxmox infrastructure.

3. NetShip (https://github.com/Bittu5134/NetShip)
Cross-platform Host Telemetry and Endpoint Detection & Response (EDR) daemon in Go. Captures active TCP/UDP socket activity, maps process lineages via deterministic 24-char SHA-256 GUIDs, performs local cryptographic binary auditing, and runs an embedded live geolocation dashboard.

4. IITK-Resume-Engine (https://github.com/Bittu5134/IITK-Resume-Model)
Spatial LaTeX-PDF diagnostic engine built for IIT Kanpur Academics & Career Council (CDW). Features a 2D coordinate geometry table parser in PyMuPDF recognizing 4,400+ IITK courses and CPI metrics, paired with a 6-track step-gradient scoring model and counterfactual gap advice.

5. Sharelock (https://github.com/Bittu5134/Sharelock)
1st Place Winner at ShareIITK Ideathon. An end-to-end RAG retrieval pipeline and Model Context Protocol (MCP) server indexing 100+ pages of dense IIT Kanpur Undergraduate Manual academic policies for citation-backed query resolution.

================================================================================
SECTION 3: COMPLETE TECHNICAL ARTICLES & DISPATCHES
================================================================================

${postsFullSection}
`;

  fs.writeFileSync(path.join(publicDir, "llms-full.txt"), fullContent, "utf-8");
  console.log(`[generate-meta] Wrote public/llms-full.txt`);
}

// Execute all generators
async function main() {
  await generateProjects();
  generateRss();
  generateSitemap();
  generateRobots();
  generateLlmsTxt();
  generateLlmsFullTxt();
  console.log(`[generate-meta] Done! All metadata and AI context standards generated successfully.`);
}

main().catch((err) => {
  console.error(`[generate-meta] Build failed:`, err);
  process.exit(1);
});
