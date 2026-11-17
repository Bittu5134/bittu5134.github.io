import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const uiDir = path.join(rootDir, "public/assets/icons/ui");
const brandsDir = path.join(rootDir, "public/assets/icons/brands");
const techDir = path.join(rootDir, "public/assets/icons/tech");

[uiDir, brandsDir, techDir].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

function readNode(pkgPath) {
  return fs.readFileSync(path.join(rootDir, pkgPath), "utf-8");
}

function extractInner(svgString) {
  // Extract contents inside <svg ...> ... </svg>
  const match = svgString.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  return match ? match[1].trim() : svgString;
}

function extractViewBox(svgString) {
  const match = svgString.match(/viewBox=["']([^"']+)["']/i);
  return match ? match[1] : "0 0 24 24";
}

// 1. Map Lucide UI Icons (standardized stroke-based icons)
const lucideIcons = [
  "terminal",
  "pickaxe",
  "arrow-down",
  "arrow-right",
  "arrow-left",
  "arrow-up-right",
  "arrow-up",
  "check",
  "disc-3",
  "play",
  "pause",
  "skip-back",
  "skip-forward",
  "volume-2",
  "minus",
  "external-link",
  "menu",
  "x",
  "folder",
  "file-text",
  "user",
  "mail",
  "rss",
  "book-open",
  "graduation-cap",
  "gamepad-2",
  "trophy",
  "zap",
  "coffee",
  "heart",
  "copy",
  "share-2",
  "bug",
  "star",
  "git-fork",
  "code",
  "sun",
  "moon",
  "search",
  "sliders-horizontal",
];

console.log("[sync-icons] Exporting Lucide UI icons...");
const spriteSymbols = [];

for (const name of lucideIcons) {
  const srcPath = `node_modules/lucide-static/icons/${name}.svg`;
  const raw = readNode(srcPath);
  // Write individual SVG
  fs.writeFileSync(path.join(uiDir, `${name}.svg`), raw, "utf-8");

  // Format symbol for global sprite
  const inner = extractInner(raw);
  const viewBox = extractViewBox(raw);
  const symbolId = name === "disc-3" ? "icon-disc3" : `icon-${name}`;
  spriteSymbols.push(
    `<symbol id="${symbolId}" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="${viewBox}">${inner}</symbol>`
  );
}

// 2. Map Brands from Simple Icons & Tabler
console.log("[sync-icons] Exporting Brand icons...");
const brandMappings = {
  github: "node_modules/simple-icons/icons/github.svg",
  twitter: "node_modules/simple-icons/icons/x.svg",
  discord: "node_modules/simple-icons/icons/discord.svg",
  patreon: "node_modules/simple-icons/icons/patreon.svg",
  reddit: "node_modules/simple-icons/icons/reddit.svg",
  linkedin: "node_modules/@tabler/icons/icons/filled/brand-linkedin.svg",
};

for (const [key, srcPath] of Object.entries(brandMappings)) {
  const raw = readNode(srcPath);
  fs.writeFileSync(path.join(brandsDir, `${key}.svg`), raw, "utf-8");

  const inner = extractInner(raw);
  const viewBox = extractViewBox(raw);
  spriteSymbols.push(
    `<symbol id="icon-${key}" fill="currentColor" viewBox="${viewBox}">${inner}</symbol>`
  );
}

// Custom specialized pixel monster & planet minecraft symbols
const customSymbols = [
  {
    id: "icon-pixel-monster",
    file: "pixel-monster.svg",
    dir: uiDir,
    viewBox: "0 0 512 512",
    inner: `<path fill="none" d="M0 0h512v512H0z"/><path d="M0 0h170v172.5H0zm341 0h170v172.5H341zm0 172.5H170v86H85V512h85v-86.7h171V512h86V258.4h-86z"/>`,
  },
  {
    id: "icon-planet-minecraft",
    file: "planet-minecraft.svg",
    dir: brandsDir,
    viewBox: "0 0 16 16",
    inner: `<rect width="16" height="16" opacity=".15" rx="2"/><path d="M2 3h4v3H2zm8 0h4v3h-4zM6 6h4v2H6zM4 8h2v2H4zm6 0h2v2h-2zm-6 2h8v2H4z"/>`,
  },
];

for (const c of customSymbols) {
  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${c.viewBox}" fill="currentColor">${c.inner}</svg>`;
  fs.writeFileSync(path.join(c.dir, c.file), fullSvg, "utf-8");
  spriteSymbols.push(
    `<symbol id="${c.id}" fill="currentColor" viewBox="${c.viewBox}">${c.inner}</symbol>`
  );
}

// Hand-drawn pixel icons for the hero badges. Sprite-only (no standalone file),
// so they carry their own stroke styling instead of the generated defaults.
const spriteOnlySymbols = [
  `<symbol id="icon-minecraft-live" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 16 16"><path d="M8 2 L14 5 L8 8 L2 5 Z"/><path d="M2 5 V11 L8 14 V8"/><path d="M8 8 V14 L14 11 V5"/><circle cx="13" cy="2" r="1.5" fill="currentColor" stroke="none"/></symbol>`,
  `<symbol id="icon-grad-spark" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 16 16"><path d="M8 3 L15 6 L8 9 L1 6 Z"/><path d="M4 7.5 V11.5 Q8 13.5 12 11.5 V7.5"/><path d="M14 6.5 V10.5"/><path d="M13 0.8 L13.6 1.9 L14.7 2.5 L13.6 3.1 L13 4.2 L12.4 3.1 L11.3 2.5 L12.4 1.9 Z" fill="currentColor" stroke-width="0.5"/></symbol>`,
];
spriteSymbols.push(...spriteOnlySymbols);

// 3. Export Tech Stack Icons
console.log("[sync-icons] Exporting Tech stack icons...");
const techMappings = {
  go: "node_modules/simple-icons/icons/go.svg",
  python: "node_modules/simple-icons/icons/python.svg",
  cplusplus: "node_modules/simple-icons/icons/cplusplus.svg",
  typescript: "node_modules/simple-icons/icons/typescript.svg",
  linux: "node_modules/simple-icons/icons/linux.svg",
  webrtc: "node_modules/simple-icons/icons/webrtc.svg",
  docker: "node_modules/simple-icons/icons/docker.svg",
  redis: "node_modules/simple-icons/icons/redis.svg",
  fastapi: "node_modules/simple-icons/icons/fastapi.svg",
  cloudflare: "node_modules/simple-icons/icons/cloudflare.svg",
};

// NOTE: tech icons are no longer added to the sprite. The About section renders
// skills as text pills (retro-about.njk), so `icon-tech-*` symbols were dead
// weight in every page's HTML.

const updatedTechStack = [];
for (const [techKey, srcPath] of Object.entries(techMappings)) {
  const raw = readNode(srcPath);
  fs.writeFileSync(path.join(techDir, `${techKey}.svg`), raw, "utf-8");

  // Extract path data
  const pathMatch = raw.match(/<path[^>]*d=["']([^"']+)["']/i);
  const pathData = pathMatch ? pathMatch[1] : "";

  const nameMap = {
    go: { name: "Go", bgClass: "bg-[#38bdf8]" },
    python: { name: "Python", bgClass: "bg-[#fde047]" },
    cplusplus: { name: "C / C++", bgClass: "bg-[#fb923c]" },
    typescript: { name: "TypeScript", bgClass: "bg-[#86efac]" },
    linux: { name: "Linux & Sockets", bgClass: "bg-[#c4b5fd]" },
    webrtc: { name: "WebRTC", bgClass: "bg-[#f472b6]" },
    docker: { name: "Docker", bgClass: "bg-[#38bdf8]" },
    redis: { name: "Redis", bgClass: "bg-[#fde047]" },
    fastapi: { name: "FastAPI / Gin", bgClass: "bg-[#a7f3d0]" },
    cloudflare: { name: "Cloudflare Workers", bgClass: "bg-[#fb923c]" },
  };

  const meta = nameMap[techKey];
  updatedTechStack.push({
    name: meta.name,
    bgClass: meta.bgClass,
    iconId: `icon-tech-${techKey}`,
    iconFile: `/assets/icons/tech/${techKey}.svg`,
  });

  const inner = extractInner(raw);
  const viewBox = extractViewBox(raw);
  spriteSymbols.push(
    `<symbol id="icon-tech-${techKey}" fill="currentColor" viewBox="${viewBox}">${inner}</symbol>`
  );
}

// Update src/_data/techStack.js with official paths
const techStackJsContent = `// Automatically synchronized from official Simple Icons via scripts/sync-icons.mjs
export default ${JSON.stringify(updatedTechStack, null, 2)};
`;
fs.writeFileSync(path.join(rootDir, "src/_data/techStack.js"), techStackJsContent, "utf-8");

// 4. Assemble the external sprite (public/assets/icons/sprite.svg).
// Previously the sprite was inlined into every page's HTML (~30-34 KB each).
// It is now an external file so browsers download and cache it once across
// all pages. Templates reference it via <use href="/assets/icons/sprite.svg#id">.
// To keep the file lean we only ship symbols actually referenced anywhere.
const usedIdSources = [];
for (const dir of ["src", "blogs"]) {
  usedIdSources.push(path.join(rootDir, dir));
}
for (const jsDir of ["public/assets/js", "scripts/markdown"]) {
  usedIdSources.push(path.join(rootDir, jsDir));
}

const usedIds = new Set(["icon-disc3"]); // legacy alias kept for safety
const collectUsedIds = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || /\.(njk|md|js|mjs|html|css)$/.test(entry.name) === false) continue;
    const full = path.join(entry.parentPath ?? entry.path, entry.name);
    const text = fs.readFileSync(full, "utf-8");
    for (const m of text.matchAll(/#(icon-[a-z0-9-]+)/g)) usedIds.add(m[1]);
  }
};
usedIdSources.forEach(collectUsedIds);

const outputSymbols = spriteSymbols.filter((s) => {
  const m = s.match(/id="([^"]+)"/);
  return m && usedIds.has(m[1]);
});

const spriteOutput = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">\n${outputSymbols.join("\n")}\n</svg>\n`;
fs.writeFileSync(path.join(rootDir, "public/assets/icons/sprite.svg"), spriteOutput, "utf-8");

console.log(`[sync-icons] Done! ${outputSymbols.length} used icons -> public/assets/icons/ + external sprite.svg (${(spriteOutput.length / 1024).toFixed(1)} KB).`);
