import EleventyFetch from "@11ty/eleventy-fetch";
import meta from "./projectMeta.js";

const LANGUAGE_COLORS = {
  Python: "#3572A5",
  Go: "#00ADD8",
  Svelte: "#ff3e00",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Rust: "#dea584",
  C: "#555555",
  "C++": "#f34b7d",
  Shell: "#89e051",
};

// Curated distinct color families (Zero yellows, zero adjacent/confusable hues)
const NEO_BRUTALIST_PALETTE = [
  "bg-[#38bdf8]", // Sky Blue
  "bg-[#fb923c]", // Peach Orange
  "bg-[#f472b6]", // Bubblegum Pink
  "bg-[#86efac]", // Mint Green
  "bg-[#c4b5fd]", // Lavender Purple
  "bg-[#f87171]", // Coral Red
];

function hashSeed(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

/**
 * Assigns deterministic seeded colors ensuring no color repeats WITHIN the same category.
 * Different categories can reuse colors. Any explicit `color` (or `headerBgClass`) in meta overrides.
 */
function assignCategoryUniqueColors(metaMap, pinnedRepoNames) {
  const assignedColors = {};

  // 1. Manual overrides take absolute precedence
  for (const [repoName, itemMeta] of Object.entries(metaMap)) {
    if (itemMeta.color && itemMeta.color !== "random" && itemMeta.color !== "auto") {
      assignedColors[repoName] = itemMeta.color;
    } else if (itemMeta.headerBgClass && itemMeta.headerBgClass !== "random" && itemMeta.headerBgClass !== "auto") {
      assignedColors[repoName] = itemMeta.headerBgClass;
    }
  }

  // 2. Assign PINNED category first to guarantee uniqueness among the 4 pinned cards
  const pinnedUsed = new Set();
  for (const name of pinnedRepoNames) {
    if (assignedColors[name]) {
      pinnedUsed.add(assignedColors[name]);
    }
  }

  for (const name of pinnedRepoNames) {
    if (!assignedColors[name]) {
      const seed = hashSeed(name);
      let idx = seed % NEO_BRUTALIST_PALETTE.length;
      let attempts = 0;
      while (pinnedUsed.has(NEO_BRUTALIST_PALETTE[idx]) && attempts < NEO_BRUTALIST_PALETTE.length) {
        idx = (idx + 1) % NEO_BRUTALIST_PALETTE.length;
        attempts++;
      }
      const chosen = NEO_BRUTALIST_PALETTE[idx];
      assignedColors[name] = chosen;
      pinnedUsed.add(chosen);
    }
  }

  // 3. For each domain category, ensure all cards in that category have unique colors
  const categories = [...new Set(Object.values(metaMap).map((m) => m.filterCategory).filter(Boolean))];
  for (const cat of categories) {
    const catRepos = Object.keys(metaMap).filter((name) => metaMap[name].filterCategory === cat);
    const catUsed = new Set();

    for (const name of catRepos) {
      if (assignedColors[name]) {
        catUsed.add(assignedColors[name]);
      }
    }

    for (const name of catRepos) {
      if (!assignedColors[name]) {
        const seed = hashSeed(name);
        let idx = seed % NEO_BRUTALIST_PALETTE.length;
        let attempts = 0;
        while (catUsed.has(NEO_BRUTALIST_PALETTE[idx]) && attempts < NEO_BRUTALIST_PALETTE.length) {
          idx = (idx + 1) % NEO_BRUTALIST_PALETTE.length;
          attempts++;
        }
        const chosen = NEO_BRUTALIST_PALETTE[idx];
        assignedColors[name] = chosen;
        catUsed.add(chosen);
      }
    }
  }

  return assignedColors;
}

function formatRelativeTime(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffDays < 1) {
    if (diffHours < 1) return "updated just now";
    return `updated ${diffHours}h ago`;
  }
  if (diffDays === 1) return "updated yesterday";
  if (diffDays < 30) return `updated ${diffDays}d ago`;
  if (diffMonths < 12) return `updated ${diffMonths}mo ago`;
  return `updated ${diffYears}y ago`;
}

export default async function () {
  let repos = [];
  const fetchHeaders = {
    "User-Agent": "11ty-portfolio-fetcher (Mozilla/5.0)",
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  };

  // 1. Fetch repos from GitHub API
  try {
    repos = await EleventyFetch("https://api.github.com/users/Bittu5134/repos?per_page=100", {
      duration: "1h",
      type: "json",
      fetchOptions: { headers: fetchHeaders },
    });
  } catch (err) {
    console.warn(`[@11ty/eleventy-fetch] Failed to fetch GitHub repos (${err.message}). Using local fallback metadata.`);
    repos = Object.keys(meta).map((name) => ({
      name,
      html_url: `https://github.com/Bittu5134/${name}`,
      homepage: null,
      topics: meta[name].tags || [],
      stargazers_count: 0,
      language: null,
      pushed_at: null,
      description: null,
    }));
  }

  // 2. Fetch pinned repos from GitHub profile
  let pinnedRepoNames = [];
  try {
    const profileHtml = await EleventyFetch("https://github.com/Bittu5134", {
      duration: "1h",
      type: "text",
      fetchOptions: { headers: fetchHeaders },
    });
    pinnedRepoNames = [
      ...profileHtml.matchAll(
        /href="\/Bittu5134\/([^"\/]+)"[^>]*class="[^"]*text-bold[^"]*"[^>]*><span class="repo">/g
      ),
    ]
      .map((m) => m[1])
      .slice(0, 4);
  } catch (err) {
    console.warn(`[@11ty/eleventy-fetch] Failed to fetch pinned repos (${err.message}). Using fallback.`);
    pinnedRepoNames = ["ORV-Reader", "PeerBasket", "GH-Follow-Tracker", "LOTM-Reader"];
  }

  if (!pinnedRepoNames || pinnedRepoNames.length === 0) {
    pinnedRepoNames = ["ORV-Reader", "PeerBasket", "GH-Follow-Tracker", "LOTM-Reader"];
  }

  // Ensure any pinned repo is in meta (with reasonable fallbacks if not yet in projectMeta)
  for (const pinnedName of pinnedRepoNames) {
    if (!meta[pinnedName]) {
      meta[pinnedName] = {
        order: 99,
        category: "TOOLS / DEV",
        filterCategory: "TOOLS",
        badge: "PINNED",
        headerBgClass: "bg-[#fffdf9]",
        blurb: "",
      };
    }
  }

  const repoMap = new Map(repos.map((r) => [r.name, r]));
  const projectColors = assignCategoryUniqueColors(meta, pinnedRepoNames);

  const featured = Object.entries(meta)
    .map(([repoName, itemMeta]) => {
      const r = repoMap.get(repoName) || {};
      const topics = Array.isArray(r.topics) && r.topics.length > 0 ? r.topics.slice(0, 5) : (itemMeta.tags || []);
      const language = itemMeta.language || r.language || null;
      const languageColor = LANGUAGE_COLORS[language] || "#6e7681";
      const isPinned = pinnedRepoNames.includes(repoName);
      const pinnedIndex = pinnedRepoNames.indexOf(repoName);
      const headerColor = itemMeta.color || itemMeta.headerBgClass || projectColors[repoName] || "bg-[#86efac]";

      return {
        title: itemMeta.title || r.name || repoName,
        repoName,
        liveUrl: itemMeta.liveUrl || r.homepage || null,
        githubUrl: itemMeta.githubUrl || r.html_url || `https://github.com/Bittu5134/${repoName}`,
        tags: topics,
        stars: typeof r.stargazers_count === "number" ? r.stargazers_count : 0,
        language,
        languageColor,
        updated: r.pushed_at || null,
        updatedAgo: formatRelativeTime(r.pushed_at),
        description: itemMeta.blurb || r.description || "",
        isPinned,
        pinnedIndex: isPinned ? pinnedIndex : 99,
        ...itemMeta,
        headerBgClass: headerColor,
      };
    })
    .sort((a, b) => {
      // Pinned items sorted by their GitHub pinned order first
      if (a.isPinned && b.isPinned) {
        return a.pinnedIndex - b.pinnedIndex;
      }
      if (a.isPinned) return -1;
      if (b.isPinned) return 1;
      return (a.order || 99) - (b.order || 99);
    });

  return {
    categories: ["PINNED", "SYSTEMS", "AI", "WEB", "TOOLS"],
    projects: featured,
  };
}
