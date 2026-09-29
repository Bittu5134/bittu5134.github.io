/**
 * Pagefind Static Search & Filter Controller
 * bittu.dev
 *
 * Minimal, functional search controller:
 * - Multi-tag filtering
 * - Fast sorting
 * - Clean Pagefind Wasm querying
 */

(function () {
  "use strict";

  class PagefindBlogSearch {
    constructor() {
      this.pagefind = null;
      this.isPagefindLoading = false;
      this.currentQuery = "";
      this.selectedTags = new Set();
      this.currentSort = "date-desc";

      // DOM elements
      this.searchInput = document.getElementById("blog-search-input");
      this.searchClearBtn = document.getElementById("blog-search-clear");
      this.tagButtons = document.querySelectorAll(".blog-tag-filter-btn");
      this.sortSelect = document.getElementById("blog-sort-select");
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
      this.loadPagefind();

      const params = new URLSearchParams(window.location.search);
      const initialTagParam = params.get("tag") || params.get("tags");
      const initialQuery = params.get("q");
      const initialSort = params.get("sort");

      if (initialTagParam) {
        initialTagParam.split(",").forEach((t) => {
          const clean = t.trim().toUpperCase();
          if (clean && clean !== "ALL") {
            this.selectedTags.add(clean);
          }
        });
        this.updateTagButtonsUI();
      }

      if (initialQuery && this.searchInput) {
        this.searchInput.value = initialQuery;
        this.currentQuery = initialQuery;
      }

      if (initialSort && this.sortSelect) {
        this.sortSelect.value = initialSort;
        this.currentSort = initialSort;
      }

      this.bindEvents();

      if (initialTagParam || initialQuery || (initialSort && initialSort !== "date-desc")) {
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
          const btnTag = (btn.getAttribute("data-tag") || "ALL").toUpperCase();
          if (btnTag === "ALL") {
            this.selectedTags.clear();
          } else {
            if (this.selectedTags.has(btnTag)) {
              this.selectedTags.delete(btnTag);
            } else {
              this.selectedTags.add(btnTag);
            }
          }
          this.updateTagButtonsUI();
          this.applySearch();
          this.updateUrlParams();
        });
      });

      this.sortSelect?.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.applySearch();
        this.updateUrlParams();
      });

      this.resetFiltersBtn?.addEventListener("click", () => {
        if (this.searchInput) this.searchInput.value = "";
        this.currentQuery = "";
        this.selectedTags.clear();
        this.currentSort = "date-desc";
        if (this.sortSelect) this.sortSelect.value = "date-desc";
        this.updateTagButtonsUI();
        this.applySearch();
        this.updateUrlParams();
      });
    }

    updateTagButtonsUI() {
      const isAllActive = this.selectedTags.size === 0;
      this.tagButtons.forEach((btn) => {
        const btnTag = (btn.getAttribute("data-tag") || "").toUpperCase();
        const isActive = (btnTag === "ALL" && isAllActive) || this.selectedTags.has(btnTag);

        if (isActive) {
          btn.classList.add("active", "bg-[#fde047]", "font-black");
          btn.classList.remove("bg-[#fffdf9]", "font-bold");
        } else {
          btn.classList.remove("active", "bg-[#fde047]", "font-black");
          btn.classList.add("bg-[#fffdf9]", "font-bold");
        }
      });
    }

    updateUrlParams() {
      const params = new URLSearchParams();
      if (this.selectedTags.size > 0) {
        params.set("tag", Array.from(this.selectedTags).join(","));
      }
      if (this.currentQuery) {
        params.set("q", this.currentQuery);
      }
      if (this.currentSort && this.currentSort !== "date-desc") {
        params.set("sort", this.currentSort);
      }

      const queryString = params.toString();
      const newUrl = queryString
        ? `${window.location.pathname}?${queryString}`
        : window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }

    cardMatchesTags(card) {
      if (this.selectedTags.size === 0) return true;
      const rawTags = (card.getAttribute("data-tags") || "").toUpperCase();
      const cardTags = rawTags.split("|||").map((t) => t.trim()).filter(Boolean);
      return Array.from(this.selectedTags).every((selected) => cardTags.includes(selected));
    }

    sortCards(cards) {
      return cards.slice().sort((a, b) => {
        if (this.currentSort === "date-desc") {
          const dateA = new Date(a.getAttribute("data-date") || 0).getTime();
          const dateB = new Date(b.getAttribute("data-date") || 0).getTime();
          return dateB - dateA;
        }
        if (this.currentSort === "date-asc") {
          const dateA = new Date(a.getAttribute("data-date") || 0).getTime();
          const dateB = new Date(b.getAttribute("data-date") || 0).getTime();
          return dateA - dateB;
        }
        if (this.currentSort === "read-time-asc") {
          const timeA = parseInt(a.getAttribute("data-readtime") || "0", 10) || 0;
          const timeB = parseInt(b.getAttribute("data-readtime") || "0", 10) || 0;
          return timeA - timeB;
        }
        if (this.currentSort === "read-time-desc") {
          const timeA = parseInt(a.getAttribute("data-readtime") || "0", 10) || 0;
          const timeB = parseInt(b.getAttribute("data-readtime") || "0", 10) || 0;
          return timeB - timeA;
        }
        if (this.currentSort === "title-asc") {
          const titleA = a.getAttribute("data-title") || "";
          const titleB = b.getAttribute("data-title") || "";
          return titleA.localeCompare(titleB);
        }
        return 0;
      });
    }

    async applySearch() {
      const q = this.currentQuery.trim();

      if (this.searchClearBtn) {
        if (q) {
          this.searchClearBtn.classList.remove("hidden");
        } else {
          this.searchClearBtn.classList.add("hidden");
        }
      }

      // Filter and sort without search query
      if (!q) {
        const matchedCards = [];
        const unmatchedCards = [];

        this.articleCards.forEach((card) => {
          const snippetEl = card.querySelector(".blog-match-snippet");
          if (snippetEl) snippetEl.classList.add("hidden");

          if (this.cardMatchesTags(card)) {
            card.classList.remove("hidden");
            matchedCards.push(card);
          } else {
            card.classList.add("hidden");
            unmatchedCards.push(card);
          }
        });

        const sortedMatched = this.sortCards(matchedCards);

        if (this.cardsContainer) {
          sortedMatched.forEach((card) => this.cardsContainer.appendChild(card));
          unmatchedCards.forEach((card) => this.cardsContainer.appendChild(card));
        }

        this.updateStatusUI(matchedCards.length, q);
        return;
      }

      const cleanQ = q.replace(/^#+/, "").trim();
      const rawTokens = cleanQ.toLowerCase().split(/\s+/).map((t) => t.replace(/^#+/, "").trim()).filter(Boolean);

      // Query Pagefind Wasm index
      const pf = await this.loadPagefind();
      if (pf) {
        try {
          const searchResult = await pf.search(cleanQ);
          const loadedResults = await Promise.all(
            searchResult.results.map((r) => r.data())
          );

          const resultsMap = new Map();
          loadedResults.forEach((res, rank) => {
            const path = res.url.replace(/\/$/, "");
            const slug = path.split("/").pop();
            resultsMap.set(slug, { ...res, rank });
          });

          const matchedCards = [];
          const unmatchedCards = [];

          this.articleCards.forEach((card) => {
            const slug = card.getAttribute("data-slug") || "";
            const matchesTag = this.cardMatchesTags(card);
            const pfMatch = resultsMap.get(slug);
            const title = (card.getAttribute("data-title") || "").toLowerCase();
            const summary = (card.getAttribute("data-summary") || "").toLowerCase();
            const rawTags = (card.getAttribute("data-tags") || "").toLowerCase().replace(/\|\|\|/g, " ");
            const localMatch = rawTokens.every((t) => title.includes(t) || summary.includes(t) || rawTags.includes(t));
            const queryMatches = Boolean(pfMatch || localMatch);
            const snippetEl = card.querySelector(".blog-match-snippet");

            if (queryMatches && matchesTag) {
              card.classList.remove("hidden");
              if (snippetEl) {
                if (pfMatch && pfMatch.excerpt) {
                  snippetEl.innerHTML = `<span class="font-bold text-amber-700">Excerpt: </span>${pfMatch.excerpt}`;
                  snippetEl.classList.remove("hidden");
                } else {
                  snippetEl.classList.add("hidden");
                }
              }
              matchedCards.push({ card, rank: pfMatch ? pfMatch.rank : 999 });
            } else {
              card.classList.add("hidden");
              if (snippetEl) snippetEl.classList.add("hidden");
              unmatchedCards.push(card);
            }
          });

          let finalSortedCards = [];
          if (this.currentSort !== "date-desc") {
            finalSortedCards = this.sortCards(matchedCards.map((m) => m.card));
          } else {
            matchedCards.sort((a, b) => a.rank - b.rank);
            finalSortedCards = matchedCards.map((m) => m.card);
          }

          if (this.cardsContainer) {
            finalSortedCards.forEach((card) => this.cardsContainer.appendChild(card));
            unmatchedCards.forEach((card) => this.cardsContainer.appendChild(card));
          }

          this.updateStatusUI(matchedCards.length, q);
          return;
        } catch (err) {
          console.warn("[pagefind] Search query error, falling back to local scan:", err);
        }
      }

      // Local fallback
      const matchedCards = [];
      const unmatchedCards = [];

      this.articleCards.forEach((card) => {
        const title = (card.getAttribute("data-title") || "").toLowerCase();
        const summary = (card.getAttribute("data-summary") || "").toLowerCase();
        const rawTags = (card.getAttribute("data-tags") || "").toLowerCase().replace(/\|\|\|/g, " ");
        const matchesTag = this.cardMatchesTags(card);
        const matchesQuery = rawTokens.every(
          (t) => title.includes(t) || summary.includes(t) || rawTags.includes(t)
        );

        const snippetEl = card.querySelector(".blog-match-snippet");
        if (snippetEl) snippetEl.classList.add("hidden");

        if (matchesTag && matchesQuery) {
          card.classList.remove("hidden");
          matchedCards.push(card);
        } else {
          card.classList.add("hidden");
          unmatchedCards.push(card);
        }
      });

      const finalSortedCards = this.sortCards(matchedCards);
      if (this.cardsContainer) {
        finalSortedCards.forEach((card) => this.cardsContainer.appendChild(card));
        unmatchedCards.forEach((card) => this.cardsContainer.appendChild(card));
      }

      this.updateStatusUI(matchedCards.length, q);
    }

    updateStatusUI(visibleCount, query) {
      if (this.statusContainer && this.statusCount) {
        if (query || this.selectedTags.size > 0 || (this.currentSort && this.currentSort !== "date-desc")) {
          this.statusContainer.classList.remove("hidden");
          this.statusCount.textContent = `Found ${visibleCount} article${visibleCount === 1 ? "" : "s"}`;
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
