/**
 * Shared blog-date parser.
 *
 * Blog front matter authors dates as DD-MM-YYYY (e.g. "10-01-2026" = 10 January 2026).
 * That format is NOT a valid YAML timestamp, so it always arrives here as a string.
 * Passing such a string straight to `new Date()` is a trap: JavaScript's legacy date
 * parser reads "10-01-2026" as *US* month-first, silently turning 10 January into
 * 1 October. Ambiguous days like "01-02-2026" are misread too.
 *
 * So we parse the day-first form explicitly instead of relying on the built-in parser.
 *
 * Everything is anchored to UTC midnight so that a later `toISOString()` or
 * `toLocaleDateString()` cannot shift the calendar day depending on the build
 * machine's timezone offset.
 */

// Unquoted or quoted ISO-ish forms we pass straight through to the Date constructor.
const ISO_LIKE = /^\d{4}-\d{2}-\d{2}([T ].*)?$/;
// The authored day-first form.
const DAY_FIRST = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;

/**
 * Parse a blog `date` value into a Date at UTC midnight, or null if unusable.
 * Accepts a Date, an ISO string, or a DD-MM-YYYY string.
 *
 * @param {string | Date | undefined | null} value
 * @returns {Date | null} Date pinned to UTC midnight, or null when unparseable.
 */
export function parseBlogDate(value) {
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  if (value === undefined || value === null || value === "") return null;

  const str = String(value).trim();
  if (!str) return null;

  const dayFirst = DAY_FIRST.exec(str);
  if (dayFirst) {
    const day = Number(dayFirst[1]);
    const month = Number(dayFirst[2]);
    const year = Number(dayFirst[3]);
    // Reject impossible calendar days rather than letting Date roll them over.
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    const parsed = new Date(Date.UTC(year, month - 1, day));
    if (
      parsed.getUTCFullYear() !== year ||
      parsed.getUTCMonth() !== month - 1 ||
      parsed.getUTCDate() !== day
    ) {
      return null; // e.g. 31-02-2026
    }
    return parsed;
  }

  if (ISO_LIKE.test(str)) {
    const parsed = new Date(str);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Human-readable long-form date, e.g. "January 10, 2026".
 * Uses UTC getters so the day never drifts with the build machine's timezone.
 *
 * @param {string | Date | undefined | null} value
 * @returns {string} Formatted date, or the raw value when it cannot be parsed.
 */
export function formatBlogDate(value) {
  const parsed = parseBlogDate(value);
  if (!parsed) return value ? String(value) : "";
  return `${MONTHS[parsed.getUTCMonth()]} ${parsed.getUTCDate()}, ${parsed.getUTCFullYear()}`;
}

/**
 * ISO calendar date, e.g. "2026-01-10". Used for <time datetime>, meta tags, and sorting.
 *
 * @param {string | Date | undefined | null} value
 * @returns {string} ISO date, or the raw value when it cannot be parsed.
 */
export function toIsoBlogDate(value) {
  const parsed = parseBlogDate(value);
  if (!parsed) return value ? String(value) : "";
  return parsed.toISOString().split("T")[0];
}

/**
 * Sort key for chronological ordering. Unparseable dates sort last.
 *
 * @param {string | Date | undefined | null} value
 * @returns {number} epoch milliseconds, or Number.NEGATIVE_INFINITY.
 */
export function toSortableTime(value) {
  const parsed = parseBlogDate(value);
  return parsed ? parsed.getTime() : Number.NEGATIVE_INFINITY;
}

/**
 * Normalise a single tag value into a trimmed, non-empty string, or null.
 * Accepts strings or numbers; arrays and objects are not tag-shaped and yield null.
 *
 * @param {unknown} value
 * @returns {string | null}
 */
export function normalizeTag(value) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

/**
 * Normalise one tag collection into a deduped list of non-empty strings.
 * Accepts either an array of tags or a comma-separated string; anything else
 * (undefined, null, a scalar) normalises to an empty list.
 *
 * `tags`, `hiddenTags`, and `seoTags` all funnel through here so every consumer —
 * keywords meta, article:tag meta, Pagefind's data-hidden-tags attribute, and
 * generate-meta.mjs — agrees on the final list without re-implementing the
 * null-filtering and dedup logic.
 *
 * @param {unknown} value Array of tags, or a comma-separated string.
 * @returns {string[]} Non-empty, deduped tag strings in author order.
 */
export function normalizeTagList(value) {
  const raw = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [];
  const seen = new Set();
  const result = [];
  for (const entry of raw) {
    const tag = normalizeTag(entry);
    if (!tag) continue;
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(tag);
  }
  return result;
}

/**
 * Merge tag collections into one deduped list, preserving author order.
 *
 * Used to fold `hiddenTags` and its `seoTags` alias into the single keyword /
 * metadata list. The two fields are synonyms, so a post that sets both must not
 * emit duplicate keywords or duplicate article:tag meta entries.
 *
 * @param {...unknown} lists Tag collections (arrays or comma-separated strings).
 * @returns {string[]} Non-empty, deduped tag strings in author order.
 */
export function mergeTagLists(...lists) {
  const merged = [];
  const seen = new Set();
  for (const list of lists) {
    for (const tag of normalizeTagList(list)) {
      const key = tag.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(tag);
    }
  }
  return merged;
}
