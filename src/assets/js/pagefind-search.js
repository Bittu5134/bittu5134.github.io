/**
 * Pagefind Static Search Controller
 * bittu.dev
 *
 * Integrates Cloudflare / Liam Bigelow's industry-standard Pagefind static search engine
 * with the site's neo-brutalist interface, Wasm chunked querying, snippet highlighting,
 * and URL parameter synchronization.
 */

(function () {
  "use strict";

  class PagefindBlogSearch {
    constructor() {
      this.pagefind = null;
      this.isPagefindLoading = false;
      this.currentQuery = "";
      this.currentTag = "ALL";

      // DOM elements
      this.searchInput = document.getElementById("blog-search-input");
      this.searchClearBtn = document.getElementById("blog-search-clear");
      this.tagButtons = document.querySelectorAll(".blog-tag-filter-btn");
      this.articleCards = Array.from(document.querySelectorAll(".blog-post-card"));
      this.cardsContainer = document.getElementById("blog-posts-list");
      this.noResultsBox = document.getElementById("blog-no-results");
      this.resetFiltersBtn = document.getElementById("blog-reset-filters-btn");
      this.statusContainer = document.getElementById("blog-search-status");
      this.statusCount = document.getElementById("blog-search-count");

      if (this.articleCards.length === 0) return;

      this.init();
    }

    async loadPagefind() {
      if (this.pagefind || this.isPagefindLoading) return this.pagefind;
      this.isPagefindLoading = true;
      try {
        const pf = await import("/pagefind/pagefind.js");
        await pf.init();
        this.pagefind = pf;
        return pf;
      } catch (err) {
        console.warn("[pagefind] Pagefind Wasm search library not ready:", err);
        return null;
      } finally {
        this.isPagefindLoading = false;
      }
    }

    init() {
      // Preload Pagefind in background
      this.loadPagefind();

      // Read initial parameters from URL (?tag=... & ?q=...)
      const params = new URLSearchParams(window.location.search);
      const initialTag = params.get("tag");
      const initialQuery = params.get("q");

      if (initialTag) {
        this.currentTag = initialTag.toUpperCase();
        this.updateTagButtonsUI();
      }

      if (initialQuery && this.searchInput) {
        this.searchInput.value = initialQuery;
        this.currentQuery = initialQuery;
      }

      this.bindEvents();

      // Trigger initial search if query or tag was passed
      if (initialTag || initialQuery) {
        this.applySearch();
      }
    }

    bindEvents() {
      let debounceTimer;
      this.searchInput?.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        this.currentQuery = e.target.value.trim();
        debounceTimer = setTimeout(() => {
          this.applySearch();
          this.updateUrlParams();
        }, 120);
      });

      this.searchClearBtn?.addEventListener("click", () => {
        if (this.searchInput) this.searchInput.value = "";
        this.currentQuery = "";
        this.applySearch();
        this.updateUrlParams();
        this.searchInput?.focus();
      });

      this.tagButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          this.currentTag = (btn.getAttribute("data-tag") || "ALL").toUpperCase();
          this.updateTagButtonsUI();
          this.applySearch();
          this.updateUrlParams();
        });
      });

      this.resetFiltersBtn?.addEventListener("click", () => {
        if (this.searchInput) this.searchInput.value = "";
        this.currentQuery = "";
        this.currentTag = "ALL";
        this.updateTagButtonsUI();
        this.applySearch();
        this.updateUrlParams();
      });
    }

    updateTagButtonsUI() {
      this.tagButtons.forEach((btn) => {
        const btnTag = (btn.getAttribute("data-tag") || "").toUpperCase();
        if (btnTag === this.currentTag) {
          btn.classList.add("active", "bg-[#fde047]", "shadow-brutal-xs", "-translate-y-0.5");
          btn.classList.remove("bg-[#fffdf9]");
        } else {
          btn.classList.remove("active", "bg-[#fde047]", "shadow-brutal-xs", "-translate-y-0.5");
          btn.classList.add("bg-[#fffdf9]");
        }
      });
    }

    updateUrlParams() {
      const params = new URLSearchParams();
      if (this.currentTag && this.currentTag !== "ALL") {
        params.set("tag", this.currentTag);
      }
      if (this.currentQuery) {
        params.set("q", this.currentQuery);
      }

      const queryString = params.toString();
      const newUrl = queryString
        ? `${window.location.pathname}?${queryString}`
        : window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }

    async applySearch() {
      const q = this.currentQuery.trim();

      // Show or hide clear button
      if (this.searchClearBtn) {
        if (q) {
          this.searchClearBtn.classList.remove("hidden");
        } else {
          this.searchClearBtn.classList.add("hidden");
        }
      }

      // If no query, filter only by active tag
      if (!q) {
        let visibleCount = 0;
        this.articleCards.forEach((card) => {
          const tags = (card.getAttribute("data-tags") || "").toUpperCase();
          const matchesTag = this.currentTag === "ALL" || tags.includes(this.currentTag);
          const snippetEl = card.querySelector(".blog-match-snippet");
          if (snippetEl) snippetEl.classList.add("hidden");

          if (matchesTag) {
            card.classList.remove("hidden");
            visibleCount++;
          } else {
            card.classList.add("hidden");
          }
        });

        this.updateStatusUI(visibleCount, q);
        return;
      }

      // Query Pagefind static Wasm index
      const pf = await this.loadPagefind();
      if (pf) {
        try {
          const searchOptions = {};
          if (this.currentTag !== "ALL") {
            searchOptions.filters = { tag: this.currentTag };
          }

          const searchResult = await pf.search(q, searchOptions);
          const loadedResults = await Promise.all(
            searchResult.results.map((r) => r.data())
          );

          // Map results by clean slug/URL
          const resultsMap = new Map();
          loadedResults.forEach((res, rank) => {
            // Normalize URL path to match post cards
            const path = res.url.replace(/\/$/, "");
            const slug = path.split("/").pop();
            resultsMap.set(slug, { ...res, rank });
          });

          let visibleCount = 0;

          // Score and rank cards according to Pagefind results
          const matchedCards = [];
          const unmatchedCards = [];

          this.articleCards.forEach((card) => {
            const slug = card.getAttribute("data-slug") || "";
            const tags = (card.getAttribute("data-tags") || "").toUpperCase();
            const matchesTag = this.currentTag === "ALL" || tags.includes(this.currentTag);
            const pfMatch = resultsMap.get(slug);
            const snippetEl = card.querySelector(".blog-match-snippet");

            if (pfMatch && matchesTag) {
              card.classList.remove("hidden");
              if (snippetEl) {
                if (pfMatch.excerpt) {
                  snippetEl.innerHTML = `<span class="font-bold text-amber-800 dark:text-amber-400">Pagefind excerpt: </span>${pfMatch.excerpt}`;
                  snippetEl.classList.remove("hidden");
                } else {
                  snippetEl.classList.add("hidden");
                }
              }
              matchedCards.push({ card, rank: pfMatch.rank });
              visibleCount++;
            } else {
              card.classList.add("hidden");
              if (snippetEl) snippetEl.classList.add("hidden");
              unmatchedCards.push(card);
            }
          });

          // Re-order DOM cards according to Pagefind ranking
          matchedCards.sort((a, b) => a.rank - b.rank);
          if (this.cardsContainer) {
            matchedCards.forEach(({ card }) => this.cardsContainer.appendChild(card));
            unmatchedCards.forEach((card) => this.cardsContainer.appendChild(card));
          }

          this.updateStatusUI(visibleCount, q);
          return;
        } catch (err) {
          console.warn("[pagefind] Search query error, falling back to local scan:", err);
        }
      }

      // Local fallback in case Pagefind is still downloading
      let fallbackCount = 0;
      const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
      this.articleCards.forEach((card) => {
        const title = (card.getAttribute("data-title") || "").toLowerCase();
        const summary = (card.getAttribute("data-summary") || "").toLowerCase();
        const tags = (card.getAttribute("data-tags") || "").toLowerCase();
        const matchesTag = this.currentTag === "ALL" || tags.toUpperCase().includes(this.currentTag);
        const matchesQuery = tokens.every(
          (t) => title.includes(t) || summary.includes(t) || tags.includes(t)
        );

        const snippetEl = card.querySelector(".blog-match-snippet");
        if (snippetEl) snippetEl.classList.add("hidden");

        if (matchesTag && matchesQuery) {
          card.classList.remove("hidden");
          fallbackCount++;
        } else {
          card.classList.add("hidden");
        }
      });

      this.updateStatusUI(fallbackCount, q);
    }

    updateStatusUI(visibleCount, query) {
      if (this.statusContainer && this.statusCount) {
        if (query || this.currentTag !== "ALL") {
          this.statusContainer.classList.remove("hidden");
          const tagInfo = this.currentTag !== "ALL" ? ` in #${this.currentTag}` : "";
          const queryInfo = query ? ` matching "${query}"` : "";
          this.statusCount.textContent = `Found ${visibleCount} dispatch${visibleCount === 1 ? "" : "es"}${queryInfo}${tagInfo}`;
        } else {
          this.statusContainer.classList.add("hidden");
        }
      }

      if (visibleCount === 0) {
        this.noResultsBox?.classList.remove("hidden");
      } else {
        this.noResultsBox?.classList.add("hidden");
      }
    }
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      window.pagefindBlogSearch = new PagefindBlogSearch();
    });
  } else {
    window.pagefindBlogSearch = new PagefindBlogSearch();
  }
})();
