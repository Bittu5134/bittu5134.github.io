/**
 * Project cards data.
 *
 * Editorial metadata (curated order, category line, filter bucket, pinned
 * position, live URLs) lives in site.config.js. Everything factual — stars,
 * forks, description, language, topics — is read from the GitHub REST API at
 * build time and cached by @11ty/eleventy-fetch, so a rebuild does not re-hit
 * the API for every page.
 */

import EleventyFetch from "@11ty/eleventy-fetch";
import siteConfig from "../../site.config.js";

const GITHUB_USER = "Bittu5134";
const REPOS_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`;
const CATEGORIES = ["PINNED", "WEB", "SYSTEMS", "AI", "BOTS", "MISC"];

/**
 * Repo metadata from the GitHub API, or an empty list when it is unreachable.
 * Without it, cards still render from site.config (no stars/description): the
 * build must never fail because GitHub rate-limited us.
 */
async function fetchRepos() {
  try {
    const repos = await EleventyFetch(REPOS_URL, {
      duration: "1h",
      type: "json",
      fetchOptions: {
        headers: {
          "User-Agent": "bittu.dev build",
          ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
        },
      },
    });
    return Array.isArray(repos) ? repos : [];
  } catch (err) {
    console.warn(`[projects] GitHub API unavailable (${err.message}); rendering curated data only.`);
    return [];
  }
}

export default async function () {
  const repos = new Map((await fetchRepos()).map((repo) => [repo.name, repo]));

  const projects = Object.entries(siteConfig.projects)
    .map(([repoName, meta]) => {
      const repo = repos.get(repoName) || {};
      const isPinned = typeof meta.pinned === "number";
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
        isPinned,
        order: meta.order ?? 99,
        pinnedOrder: meta.pinned ?? 99,
      };
    })
    .sort((a, b) => {
      // Pinned first, in their configured order; the rest follow the curated
      // order and fall back to popularity as a tie-breaker.
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      if (a.isPinned) return a.pinnedOrder - b.pinnedOrder;
      if (a.order !== b.order) return a.order - b.order;
      return b.stars + b.forks - (a.stars + a.forks);
    });

  return { categories: CATEGORIES, projects };
}
