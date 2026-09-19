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

// 4. Assemble optimized global inlined sprite for instantaneous zero-RTT rendering
const spriteOutput = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="hidden" style="display:none">\n${spriteSymbols.join("\n")}\n</svg>\n`;
fs.writeFileSync(path.join(rootDir, "src/_includes/components/icons-sprite.njk"), spriteOutput, "utf-8");

console.log(`[sync-icons] Done! Synchronized ${spriteSymbols.length} official icons into public/assets/icons/ and icons-sprite.njk.`);
