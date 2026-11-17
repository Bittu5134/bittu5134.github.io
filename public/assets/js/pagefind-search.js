/**
 * Blog archive search, tag filtering and sorting.
 *
 * The archive is fully server-rendered; this controller only reorders and
 * hides the existing cards. Pagefind indexes the post pages at build time, so
 * a search query ranks full-text matches; when the index is unavailable the
 * controller falls back to matching against the cards' own title/summary/tags.
 *
 * State is mirrored into the URL (?q=&tag=&sort=) so filtered views can be
 * linked directly.
 */

(function () {
  "use strict";

  const els = {
    searchInput: document.getElementById("blog-search-input"),
    searchClear: document.getElementById("blog-search-clear"),
    tagButtons: document.querySelectorAll(".blog-tag-filter-btn"),
    sortSelect: document.getElementById("blog-sort-select"),
    cards: Array.from(document.querySelectorAll(".blog-post-card")),
    list: document.getElementById("blog-posts-list"),
    noResults: document.getElementById("blog-no-results"),
    resetBtn: document.getElementById("blog-reset-filters-btn"),
    status: document.getElementById("blog-search-status"),
    statusCount: document.getElementById("blog-search-count"),
  };

  if (els.cards.length === 0) return;

  const state = {
    query: "",
    tags: new Set(),
    sort: "date-desc",
    pagefindResults: false, // true once a query was answered from the index
  };

  /* ── Pagefind ──────────────────────────────────────────────────────────── */

  let pagefindPromise = null;

  function loadPagefind() {
    if (!pagefindPromise) {
      pagefindPromise = import("/pagefind/pagefind.js")
        .then(async (pf) => {
          await pf.init();
          return pf;
        })
        .catch((err) => {
          console.warn("[pagefind] index not available, using local matching:", err);
          return null;
        });
    }
    return pagefindPromise;
  }

  /* ── Helpers ───────────────────────────────────────────────────────────── */

  // How many of the selected tags this card carries (0 when none selected).
  function tagMatchCount(card) {
    if (state.tags.size === 0) return 0;
    const cardTags = (card.dataset.tags || "").toUpperCase().split("|||");
    let count = 0;
    state.tags.forEach((tag) => {
      if (cardTags.includes(tag)) count += 1;
    });
    return count;
  }

  function matchesTags(card) {
    return state.tags.size === 0 || tagMatchCount(card) > 0;
  }

  const SORTERS = {
    "date-desc": (a, b) => dateOf(b) - dateOf(a),
    "date-asc": (a, b) => dateOf(a) - dateOf(b),
    "read-time-asc": (a, b) => readTimeOf(a) - readTimeOf(b),
    "read-time-desc": (a, b) => readTimeOf(b) - readTimeOf(a),
    "title-asc": (a, b) => (a.dataset.title || "").localeCompare(b.dataset.title || ""),
  };

  function dateOf(card) {
    return new Date(card.dataset.date || 0).getTime();
  }

  function readTimeOf(card) {
    return parseInt(card.dataset.readtime || "0", 10) || 0;
  }

  // Rank visible entries: cards matching every selected tag first, then
  // partial matches with the most matched tags. Ties use the user's sort, or
  // Pagefind relevance when searching with the default sort.
  function rankCards(entries, useSearchRank) {
    return entries.slice().sort((a, b) => {
      const tagDiff = (b.tagCount || 0) - (a.tagCount || 0);
      if (tagDiff !== 0) return tagDiff;
      if (useSearchRank && state.sort === "date-desc" && a.rank !== b.rank) {
        return (a.rank || 999) - (b.rank || 999);
      }
      return (SORTERS[state.sort] || (() => 0))(a.card, b.card);
    });
  }

  function cardSearchableText(card) {
    return ["title", "summary", "tags", "hiddenTags"]
      .map((key) => (card.dataset[key] || "").toLowerCase().replace(/\|\|\|/g, " "))
      .join(" ");
  }

  function localTokensMatch(card, tokens) {
    const text = cardSearchableText(card);
    return tokens.every((token) => text.includes(token));
  }

  /* ── Rendering ─────────────────────────────────────────────────────────── */

  // Highlighted match excerpt under the summary; hidden when there is none.
  function showExcerpt(card, excerptHtml) {
    const snippet = card.querySelector(".blog-match-snippet");
    if (!snippet) return;
    if (excerptHtml) {
      snippet.innerHTML = `<span class="font-bold text-black/50">Excerpt: </span>${excerptHtml}`;
      snippet.classList.remove("hidden");
    } else {
      snippet.classList.add("hidden");
    }
  }

  function showResult(cards) {
    const visible = new Set(cards.map(({ card }) => card));

    els.cards.forEach((card) => {
      if (!state.pagefindResults) showExcerpt(card, null);
      card.classList.toggle("hidden", !visible.has(card));
    });

    const matched = rankCards(cards.filter((entry) => visible.has(entry.card)), Boolean(state.pagefindResults));
    const unmatched = els.cards.filter((card) => !visible.has(card));

    if (els.list) {
      matched.forEach(({ card }) => els.list.appendChild(card));
      unmatched.forEach((card) => els.list.appendChild(card));
    }

    updateStatus(matched.length);
  }

  function updateStatus(count) {
    const filtering = state.query || state.tags.size > 0 || state.sort !== "date-desc";
    if (els.status && els.statusCount) {
      els.status.classList.toggle("hidden", !filtering);
      if (filtering) {
        els.statusCount.textContent = `Found ${count} article${count === 1 ? "" : "s"}`;
      }
    }
    if (els.noResults) els.noResults.classList.toggle("hidden", count !== 0);
  }

  /* ── Search pipeline ───────────────────────────────────────────────────── */

  async function applySearch() {
    els.searchClear?.classList.toggle("hidden", !state.query);
    const query = state.query.trim();

    // No query: filter + sort only.
    if (!query) {
      state.pagefindResults = false;
      showResult(els.cards.filter(matchesTags).map((card) => ({ card, tagCount: tagMatchCount(card) })));
      return;
    }

    // Query Pagefind for full-text matches; fall back to local matching if the
    // index never loaded.
    const pf = await loadPagefind();
    if (pf) {
      try {
        const results = await pf.search(query);
        const data = await Promise.all(results.results.map((result) => result.data()));
        const bySlug = new Map();
        data.forEach((entry, rank) => {
          const slug = entry.url.replace(/\/$/, "").split("/").pop();
          bySlug.set(slug, { entry, rank });
        });

        const tokens = tokenize(query);
        const cards = [];
        els.cards.forEach((card) => {
          const tagCount = tagMatchCount(card);
          if (!matchesTags(card)) return;
          const slug = card.dataset.slug || "";
          const pfMatch = bySlug.get(slug);
          showExcerpt(card, pfMatch && pfMatch.entry.excerpt);
          if (pfMatch || localTokensMatch(card, tokens)) {
            cards.push({ card, rank: pfMatch ? pfMatch.rank : 999, tagCount });
          }
        });
        state.pagefindResults = true;
        showResult(cards);
        return;
      } catch (err) {
        console.warn("[pagefind] query failed, falling back to local scan:", err);
      }
    }

    state.pagefindResults = false;
    const tokens = tokenize(query);
    showResult(
      els.cards
        .filter((card) => matchesTags(card) && localTokensMatch(card, tokens))
        .map((card) => ({ card, tagCount: tagMatchCount(card) }))
    );
  }

  function tokenize(query) {
    return query
      .replace(/^#+/, "")
      .toLowerCase()
      .split(/\s+/)
      .map((token) => token.replace(/^#+/, "").trim())
      .filter(Boolean);
  }

  /* ── URL state ─────────────────────────────────────────────────────────── */

  function updateUrl() {
    const params = new URLSearchParams();
    if (state.tags.size > 0) params.set("tag", Array.from(state.tags).join(","));
    if (state.query) params.set("q", state.query);
    if (state.sort !== "date-desc") params.set("sort", state.sort);
    const queryString = params.toString();
    window.history.replaceState({}, "", queryString ? `${location.pathname}?${queryString}` : location.pathname);
  }

  /* ── Tag chips UI ──────────────────────────────────────────────────────── */

  function updateTagButtons() {
    const allActive = state.tags.size === 0;
    els.tagButtons.forEach((btn) => {
      const tag = (btn.dataset.tag || "").toUpperCase();
      const active = (tag === "ALL" && allActive) || state.tags.has(tag);
      btn.classList.toggle("active", active);
      btn.classList.toggle("font-black", active);
      btn.classList.toggle("font-bold", !active);
    });
  }

  /* ── Events ────────────────────────────────────────────────────────────── */

  let debounceTimer = null;
  els.searchInput?.addEventListener("input", (event) => {
    clearTimeout(debounceTimer);
    state.query = event.target.value.trim();
    debounceTimer = setTimeout(() => {
      applySearch();
      updateUrl();
    }, 120);
  });

  els.searchClear?.addEventListener("click", () => {
    if (els.searchInput) els.searchInput.value = "";
    state.query = "";
    applySearch();
    updateUrl();
    els.searchInput?.focus();
  });

  els.tagButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tag = (btn.dataset.tag || "ALL").toUpperCase();
      if (tag === "ALL") state.tags.clear();
      else if (state.tags.has(tag)) state.tags.delete(tag);
      else state.tags.add(tag);
      updateTagButtons();
      applySearch();
      updateUrl();
    });
  });

  els.sortSelect?.addEventListener("change", (event) => {
    state.sort = event.target.value;
    applySearch();
    updateUrl();
  });

  els.resetBtn?.addEventListener("click", () => {
    if (els.searchInput) els.searchInput.value = "";
    state.query = "";
    state.tags.clear();
    state.sort = "date-desc";
    if (els.sortSelect) els.sortSelect.value = "date-desc";
    updateTagButtons();
    applySearch();
    updateUrl();
  });

  /* ── Boot ──────────────────────────────────────────────────────────────── */

  (function restoreFromUrl() {
    const params = new URLSearchParams(location.search);

    (params.get("tag") || params.get("tags") || "")
      .split(",")
      .forEach((tag) => {
        const clean = tag.trim().toUpperCase();
        if (clean && clean !== "ALL") state.tags.add(clean);
      });

    if (params.get("q")) {
      state.query = params.get("q");
      if (els.searchInput) els.searchInput.value = state.query;
    }

    const sort = params.get("sort");
    if (sort && SORTERS[sort]) {
      state.sort = sort;
    }
    // Set the select explicitly: browsers may restore a stale value on reload.
    if (els.sortSelect) els.sortSelect.value = state.sort;

    updateTagButtons();
    if (state.query || state.tags.size > 0 || state.sort !== "date-desc") {
      applySearch();
    }
  })();
})();
