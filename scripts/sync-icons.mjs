import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const spritePath = path.join(rootDir, "public/assets/icons/sprite.svg");

function readNode(pkgPath) {
  return fs.readFileSync(path.join(rootDir, pkgPath), "utf-8");
}

function extractInner(svgString) {
  const match = svgString.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  return match ? match[1].trim() : svgString;
}

function extractViewBox(svgString) {
  const match = svgString.match(/viewBox=["']([^"']+)["']/i);
  return match ? match[1] : "0 0 24 24";
}

const spriteSymbols = [];

// 1. Lucide UI icons
const lucideIcons = [

  "disc-3",
  "arrow-down",
  "arrow-right",
  "arrow-left",
  "arrow-up-right",
  "arrow-up",
  "check",
  "play",
  "pause",
  "skip-back",
  "skip-forward",
  "volume-2",
  "minus",
  "external-link",
  "menu",
  "x",
  "file-text",
  "mail",
  "rss",
  "book-open",
  "copy",
  "share-2",
  "star",
  "git-fork",
  "search",
  "sliders-horizontal"

];

for (const name of lucideIcons) {
  const raw = readNode(`node_modules/lucide-static/icons/${name}.svg`);
  const symbolId = name === "disc-3" ? "icon-disc3" : `icon-${name}`;
  spriteSymbols.push(
    `<symbol id="${symbolId}" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="${extractViewBox(raw)}">${extractInner(raw)}</symbol>`
  );
}

// 2. Brand icons
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
  spriteSymbols.push(
    `<symbol id="icon-${key}" fill="currentColor" viewBox="${extractViewBox(raw)}">${extractInner(raw)}</symbol>`
  );
}

// 3. Custom pixel-art symbols
const customSymbols = [
  {
    id: "icon-pixel-monster",
    viewBox: "0 0 512 512",
    inner: `<path fill="none" d="M0 0h512v512H0z"/><path d="M0 0h170v172.5H0zm341 0h170v172.5H341zm0 172.5H170v86H85V512h85v-86.7h171V512h86V258.4h-86z"/>`,
  },
  // Hand-drawn pixel icons for the hero badges.
  {
    id: "icon-minecraft-live",
    viewBox: "0 0 16 16",
    attrs: `fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"`,
    inner: `<path d="M8 2 L14 5 L8 8 L2 5 Z"/><path d="M2 5 V11 L8 14 V8"/><path d="M8 8 V14 L14 11 V5"/><circle cx="13" cy="2" r="1.5" fill="currentColor" stroke="none"/>`,
  },
  {
    id: "icon-grad-spark",
    viewBox: "0 0 16 16",
    attrs: `fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"`,
    inner: `<path d="M8 3 L15 6 L8 9 L1 6 Z"/><path d="M4 7.5 V11.5 Q8 13.5 12 11.5 V7.5"/><path d="M14 6.5 V10.5"/><path d="M13 0.8 L13.6 1.9 L14.7 2.5 L13.6 3.1 L13 4.2 L12.4 3.1 L11.3 2.5 L12.4 1.9 Z" fill="currentColor" stroke-width="0.5"/>`,
  },
];

for (const c of customSymbols) {
  spriteSymbols.push(
    `<symbol id="${c.id}" ${c.attrs ?? `fill="currentColor"`} viewBox="${c.viewBox}">${c.inner}</symbol>`
  );
}

// 4. Emit only symbols referenced anywhere, as one external sprite.
const usedIdSources = ["src", "blogs", "public/assets/js", "scripts/markdown"].map((dir) =>
  path.join(rootDir, dir)
);

const usedIds = new Set(["icon-disc3"]); // legacy alias kept for safety
const collectUsedIds = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !/\.(njk|md|js|mjs|html|css)$/.test(entry.name)) continue;
    const full = path.join(entry.parentPath ?? entry.path, entry.name);
    for (const m of fs.readFileSync(full, "utf-8").matchAll(/#(icon-[a-z0-9-]+)/g)) {
      usedIds.add(m[1]);
    }
  }
};
usedIdSources.forEach(collectUsedIds);

const outputSymbols = spriteSymbols.filter((s) => {
  const m = s.match(/id="([^"]+)"/);
  return m && usedIds.has(m[1]);
});

fs.mkdirSync(path.dirname(spritePath), { recursive: true });
const spriteOutput = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">\n${outputSymbols.join("\n")}\n</svg>\n`;
fs.writeFileSync(spritePath, spriteOutput, "utf-8");

console.log(
  `[sync-icons] ${outputSymbols.length} used icons -> public/assets/icons/sprite.svg (${(spriteOutput.length / 1024).toFixed(1)} KB)`
);
