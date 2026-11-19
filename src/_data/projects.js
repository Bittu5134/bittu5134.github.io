/**
 * Project cards data.
 *
 * Factual data comes from GitHub at build time, cached by @11ty/eleventy-fetch
 * for an hour:
 *   - stars, forks, description, language, topics from the REST API
 *   - the PINNED set + its order scraped from the profile's own pinned list,
 *     so the homepage PINNED pill always mirrors github.com/Bittu5134
 *
 * Editorial data lives in site.config.js: curated order, category line,
 * filter bucket, and live URLs that are not the repo's homepage. If GitHub is
 * unreachable the build still succeeds with curated data only (no stars /
 * descriptions / pins).
 */

import EleventyFetch from "@11ty/eleventy-fetch";
import siteConfig from "../../site.config.js";

const GITHUB_USER = "Bittu5134";
const REPOS_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`;
const PROFILE_URL = `https://github.com/${GITHUB_USER}`;
const CATEGORIES = ["PINNED", "WEB", "SYSTEMS", "AI", "BOTS", "MISC"];

// Pinned set used when GitHub is unreachable or the scrape comes back empty —
// keep in sync with the profile's pinned list.
const PINNED_FALLBACK = ["ORV-Reader", "PeerBasket", "GH-Follow-Tracker", "LOTM-Reader"];

function fetchOptions() {
  return {
    headers: {
      "User-Agent": "bittu.dev build (Mozilla/5.0)",
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
  };
}

async function fetchJson(url, label) {
  try {
    return await EleventyFetch(url, { duration: "1h", type: "json", fetchOptions: fetchOptions() });
  } catch (err) {
    console.warn(`[projects] ${label} unavailable (${err.message}).`);
    return null;
  }
}

async function fetchText(url, label) {
  try {
    return await EleventyFetch(url, { duration: "1h", type: "text", fetchOptions: fetchOptions() });
  } catch (err) {
    console.warn(`[projects] ${label} unavailable (${err.message}).`);
    return null;
  }
}

// The profile page marks pinned repos with a text-bold repo link.
function scrapePinnedRepos(profileHtml) {
  return [
    ...profileHtml.matchAll(
      /href="\/Bittu5134\/([^"\/]+)"[^>]*class="[^"]*text-bold[^"]*"[^>]*><span class="repo">/g
    ),
  ]
    .map((match) => match[1])
    .slice(0, 4);
}

export default async function () {
  const [repos, profileHtml] = await Promise.all([
    fetchJson(REPOS_URL, "GitHub repos API"),
    fetchText(PROFILE_URL, "GitHub profile"),
  ]);

  const repoMap = new Map((Array.isArray(repos) ? repos : []).map((repo) => [repo.name, repo]));

  const pinnedRepoNames = (() => {
    const scraped = profileHtml ? scrapePinnedRepos(profileHtml) : [];
    return scraped.length ? scraped : PINNED_FALLBACK;
  })();

  const projects = Object.entries(siteConfig.projects)
    .map(([repoName, meta]) => {
      const repo = repoMap.get(repoName) || {};
      return {
        title: meta.title || repoName,
        repoName,
        category: meta.category,
        filterCategory: meta.filterCategory,
        statsText: meta.statsText || "",
        description: (repo.description || "").trim(),
        language: meta.language || repo.language || null,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        tags: meta.tags || (repo.topics || []).slice(0, 5),
        liveUrl: meta.liveUrl || repo.homepage || null,
        githubUrl: `https://github.com/${GITHUB_USER}/${repoName}`,
        isPinned: pinnedRepoNames.includes(repoName),
        pinnedOrder: pinnedRepoNames.indexOf(repoName),
        order: meta.order ?? 99,
      };
    })
    .sort((a, b) => {
      // Pinned first, in the profile's pinned order; the rest follow the
      // curated order and fall back to popularity as a tie-breaker.
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      if (a.isPinned) return a.pinnedOrder - b.pinnedOrder;
      if (a.order !== b.order) return a.order - b.order;
      return b.stars + b.forks - (a.stars + a.forks);
    });

  return { categories: CATEGORIES, projects };
}
