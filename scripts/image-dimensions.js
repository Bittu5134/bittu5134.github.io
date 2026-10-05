/**
 * Shared local-image dimension probe.
 *
 * OpenGraph/Twitter cards want og:image:width and og:image:height. Those numbers
 * used to be guessed in the templates — 1200x630 for anything, 1400x350 for any
 * cover containing "og_banner" in its path — which meant a post whose cover was
 * 1280x720 published a card claiming 1200x630, and the JSON-LD disagreed with the
 * OG tags on top of that. A wrong aspect ratio makes some social scrapers letterbox
 * or crop the card.
 *
 * So read the real dimensions off the file header instead. There is no image library
 * in this project (no sharp, no image-size), and pulling one in for two integers is
 * not worth the dependency, so this parses the handful of container headers that
 * actually appear in this repo: WebP, PNG, JPEG and GIF.
 *
 * Local site-root paths (/images/foo.webp) are resolved against public/, which is
 * the tree Eleventy passthrough-copies to dist/. Remote and data: URLs are never
 * probed — there is nothing local to read and the request would only slow the
 * build — so callers fall back to their own defaults.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, "../public");
// Public files that already live at a site-root path on dist/ (passthrough-copied).
// Covers can therefore live either here or under blogs/ (which is passthrough-copied
// to dist/blogs/ via the { "blogs": "blogs" } config), so probe both.
const PROJECT_ROOT = path.resolve(__dirname, "..");
const ASSET_ROOTS = [PUBLIC_DIR, PROJECT_ROOT];

// WebP: a RIFF container whose "VP8 " / "VP8L" / "VP8X" chunk carries the size.
// Lossless (VP8L) packs width-1 and height-1 into one little-endian 32-bit word.
const WEBP_CHUNKS = new Set(["VP8 ", "VP8L", "VP8X"]);

// Layout of a "VP8 " (lossy) frame payload, relative to the start of its chunk
// header. Verified against public/images/og_banner.webp (1400x350):
//   +4  chunkSize (uint32 LE)
//   +8  3-byte frame tag
//   +11 3-byte start code 0x9d 0x01 0x2a
//   +14 width  (14-bit)
//   +16 height (14-bit)
const VP8_WIDTH_OFFSET = 14;
const VP8_HEIGHT_OFFSET = 16;

function readWebp(buf) {
  if (buf.length < 30) return null;
  let offset = 12; // skip "RIFF" + 4-byte size + "WEBP"
  while (offset + 8 <= buf.length) {
    const fourcc = buf.toString("latin1", offset, offset + 4);
    const chunkSize = buf.readUInt32LE(offset + 4);
    if (WEBP_CHUNKS.has(fourcc)) {
      if (fourcc === "VP8 ") {
        // Lossy: 14-bit dimensions stored after the 3-byte start code 0x9d012a.
        return {
          width: buf.readUInt16LE(offset + VP8_WIDTH_OFFSET) & 0x3fff,
          height: buf.readUInt16LE(offset + VP8_HEIGHT_OFFSET) & 0x3fff,
        };
      }
      if (fourcc === "VP8L") {
        // Lossless: byte signature 0x2f, then width-1 and height-1 packed as 14-bit
        // fields in one little-endian uint32 at +5.
        const bits = buf.readUInt32LE(offset + 9);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
      // VP8X (extended): 24-bit little-endian width-1 / height-1.
      const width = 1 + (buf[offset + 12] | (buf[offset + 13] << 8) | (buf[offset + 14] << 16));
      const height = 1 + (buf[offset + 15] | (buf[offset + 16] << 8) | (buf[offset + 17] << 16));
      return { width, height };
    }
    // Chunks are padded to even byte counts.
    offset += 8 + chunkSize + (chunkSize % 2);
  }
  return null;
}

function readPng(buf) {
  // IHDR is always the first chunk: 8-byte signature, then length + "IHDR" + data.
  if (buf.length < 24 || buf.toString("latin1", 12, 16) !== "IHDR") return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function readGif(buf) {
  // Logical screen descriptor sits at byte 6: two little-endian uint16s.
  if (buf.length < 10) return null;
  return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
}

function readJpeg(buf) {
  // Walk the marker segments until a Start-Of-Frame, which stores the real size.
  // Skip APPn/COM segments (payload already carries its own 2-byte length) so a
  // large EXIF thumbnail cannot be mistaken for the image dimensions.
  let offset = 2; // past SOI
  const sofMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  while (offset + 4 <= buf.length) {
    if (buf[offset] !== 0xff) return null; // lost sync: not a valid JPEG
    const marker = buf[offset + 1];
    const segmentLength = buf.readUInt16BE(offset + 2);
    if (sofMarkers.has(marker)) {
      return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
    }
    offset += 2 + segmentLength;
  }
  return null;
}

const READERS = { webp: readWebp, png: readPng, gif: readGif, jpg: readJpeg, jpeg: readJpeg };

/**
 * Read the pixel dimensions of a local image file.
 *
 * @param {string} filePath Absolute or repo-relative path to the image.
 * @returns {{width: number, height: number} | null} null when unreadable/unknown.
 */
export function readImageDimensions(filePath) {
  const extension = path.extname(filePath).toLowerCase().replace(".", "");
  const reader = READERS[extension];
  if (!reader) return null;
  try {
    const buf = fs.readFileSync(filePath);
    return reader(buf);
  } catch {
    return null;
  }
}

/**
 * Resolve a site-root image path (/images/foo.webp) to its file on disk.
 * Probes public/ first (assets passthrough-copied verbatim), then the repo root
 * (blogs/** passthrough-copied to dist/blogs/), since blog covers live under the latter.
 * Absolute filesystem paths are used as-is.
 */
function resolvePublicPath(urlPath) {
  const relative = urlPath.replace(/^\/+/, "");
  for (const root of ASSET_ROOTS) {
    const candidate = path.resolve(root, relative);
    // Guard against a crafted path escaping the root via "..".
    if (candidate.startsWith(root + path.sep) || candidate === root) {
      if (fs.existsSync(candidate)) return candidate;
    }
  }
  return null;
}

/**
 * Measure a cover/OG image URL.
 *
 * Only local site-root paths are probed: that is where this repo's covers live, and
 * it keeps remote and data: URLs from triggering network reads at build time.
 *
 * @param {string | undefined | null} imageUrl e.g. "/images/og_banner.webp" or "https://…"
 * @returns {{width: number, height: number} | null} null when not measurable locally.
 */
export function measureImage(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return null;
  if (!imageUrl.startsWith("/") || imageUrl.startsWith("//")) return null;
  const resolved = resolvePublicPath(imageUrl.split(/[?#]/)[0]);
  if (!resolved) return null;
  return readImageDimensions(resolved);
}