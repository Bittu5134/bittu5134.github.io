/**
 * Littlefinger.js - High-Performance Client-Side Static Index Search Engine
 * bittu.dev
 *
 * Efficiently indexes and queries pre-computed static JSON indexes (/search-index.json)
 * with multi-field weighted scoring, snippet context extraction, and URL state sync.
 */

(function () {
  "use strict";

  class LittlefingerSearch {
    constructor() {
      this.index = null;
      this.isLoading = false;
      this.loaded = false;
      this.currentQuery = "";
      this.currentTag = "ALL";

      // DOM elements
      this.searchInput = document.getElementById("blog-search-input");
      this.searchClearBtn = document.getElementById("blog-search-clear");
      this.tagButtons = document.querySelectorAll(".blog-tag-filter-btn");
      this.articleCards = document.querySelectorAll(".blog-post-card");
      this.noResultsBox = document.getElementById("blog-no-results");
      this.resetFiltersBtn = document.getElementById("blog-reset-filters-btn");
      this.statusContainer = document.getElementById("blog-search-status");
      this.statusCount = document.getElementById("blog-search-count");

      if (this.articleCards.length === 0) return;

      this.init();
    }

    async loadIndex() {
      if (this.index || this.isLoading) return;
      this.isLoading = true;
      try {
        const res = await fetch("/search-index.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        this.index = await res.json();
        this.loaded = true;
      } catch (err) {
        console.warn("[littlefinger] Static search index could not be loaded:", err);
      } finally {
        this.isLoading = false;
      }
    }

    init() {
      // Pre-fetch index in background
      this.loadIndex();

      // Read initial query / tag from URL params
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

      // Initial filter if params were present
      if (initialTag || initialQuery) {
        this.applySearch();
      }
    }

    bindEvents() {
      // Real-time search input with debounce
      let debounceTimer;
      this.searchInput?.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        this.currentQuery = e.target.value.trim();
        debounceTimer = setTimeout(() => {
          this.applySearch();
          this.updateUrlParams();
        }, 120);
      });

      // Clear search button
      this.searchClearBtn?.addEventListener("click", () => {
        if (this.searchInput) this.searchInput.value = "";
        this.currentQuery = "";
        this.applySearch();
        this.updateUrlParams();
        this.searchInput?.focus();
      });

      // Tag filter pills
      this.tagButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          this.currentTag = (btn.getAttribute("data-tag") || "ALL").toUpperCase();
          this.updateTagButtonsUI();
          this.applySearch();
          this.updateUrlParams();
        });
      });

      // Reset all filters button on empty state
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

    // Extract a snippet window around matched keywords
    createSnippet(text, keywords) {
      if (!text || !keywords || keywords.length === 0) return "";
      const lower = text.toLowerCase();
      let bestIdx = -1;

      for (const kw of keywords) {
        const idx = lower.indexOf(kw);
        if (idx !== -1) {
          bestIdx = idx;
          break;
        }
      }

      if (bestIdx === -1) return text.slice(0, 150) + "...";

      const start = Math.max(0, bestIdx - 60);
      const end = Math.min(text.length, bestIdx + 120);
      let snippet = (start > 0 ? "..." : "") + text.slice(start, end).trim() + (end < text.length ? "..." : "");

      // Highlight keywords safely
      for (const kw of keywords) {
        if (kw.length < 2) continue;
        const reg = new RegExp(`(${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
        snippet = snippet.replace(reg, "<mark class='bg-[#fde047] text-black px-0.5 rounded font-bold'>$1</mark>");
      }

      return snippet;
    }

    applySearch() {
      const q = this.currentQuery.toLowerCase().trim();
      const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
      let visibleCount = 0;

      // Show or hide clear button
      if (this.searchClearBtn) {
        if (q) {
          this.searchClearBtn.classList.remove("hidden");
        } else {
          this.searchClearBtn.classList.add("hidden");
        }
      }

      // Map indexed documents by slug if index is ready
      const indexedMap = new Map();
      if (this.index) {
        for (const item of this.index) {
          indexedMap.set(item.slug, item);
        }
      }

      this.articleCards.forEach((card) => {
        const slug = card.getAttribute("data-slug") || "";
        const title = (card.getAttribute("data-title") || "").toLowerCase();
        const summary = (card.getAttribute("data-summary") || "").toLowerCase();
        const tags = (card.getAttribute("data-tags") || "").toLowerCase();
        const snippetEl = card.querySelector(".blog-match-snippet");

        // 1. Check Tag filter
        const matchesTag =
          this.currentTag === "ALL" || tags.toUpperCase().includes(this.currentTag);

        if (!matchesTag) {
          card.classList.add("hidden");
          if (snippetEl) snippetEl.classList.add("hidden");
          return;
        }

        // 2. If no query, show all articles that match tag
        if (tokens.length === 0) {
          card.classList.remove("hidden");
          if (snippetEl) snippetEl.classList.add("hidden");
          visibleCount++;
          return;
        }

        // 3. Search matching using static index data if available, fallback to DOM attributes
        const doc = indexedMap.get(slug);
        let matches = false;
        let matchedSnippet = "";

        if (doc) {
          const docTitle = doc.title.toLowerCase();
          const docSummary = (doc.summary || "").toLowerCase();
          const docHeadings = (doc.headings || []).join(" ").toLowerCase();
          const docTags = (doc.tags || []).join(" ").toLowerCase();
          const docBody = (doc.body || "").toLowerCase();

          // All search tokens must match somewhere in the document
          const allTokensMatch = tokens.every(
            (token) =>
              docTitle.includes(token) ||
              docSummary.includes(token) ||
              docHeadings.includes(token) ||
              docTags.includes(token) ||
              docBody.includes(token)
          );

          if (allTokensMatch) {
            matches = true;
            // If match is inside headings or body, produce a helpful highlighted snippet
            const inTitleOrSummary = tokens.every(
              (t) => docTitle.includes(t) || docSummary.includes(t)
            );
            if (!inTitleOrSummary && doc.body) {
              matchedSnippet = this.createSnippet(doc.body, tokens);
            }
          }
        } else {
          // Fallback if static index is still downloading
          matches = tokens.every(
            (token) =>
              title.includes(token) || summary.includes(token) || tags.includes(token)
          );
        }

        if (matches) {
          card.classList.remove("hidden");
          visibleCount++;

          if (snippetEl) {
            if (matchedSnippet) {
              snippetEl.innerHTML = `<span class="font-bold text-amber-800 dark:text-amber-400">Match context: </span>${matchedSnippet}`;
              snippetEl.classList.remove("hidden");
            } else {
              snippetEl.classList.add("hidden");
            }
          }
        } else {
          card.classList.add("hidden");
          if (snippetEl) snippetEl.classList.add("hidden");
        }
      });

      // Update Result Count & Feedback
      if (this.statusContainer && this.statusCount) {
        if (q || this.currentTag !== "ALL") {
          this.statusContainer.classList.remove("hidden");
          const tagInfo = this.currentTag !== "ALL" ? ` in #${this.currentTag}` : "";
          const queryInfo = q ? ` matching "${q}"` : "";
          this.statusCount.textContent = `Found ${visibleCount} dispatch${visibleCount === 1 ? "" : "es"}${queryInfo}${tagInfo}`;
        } else {
          this.statusContainer.classList.add("hidden");
        }
      }

      // Show or hide empty state
      if (visibleCount === 0) {
        this.noResultsBox?.classList.remove("hidden");
      } else {
        this.noResultsBox?.classList.add("hidden");
      }
    }
  }

  // Initialize once DOM is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      window.littlefinger = new LittlefingerSearch();
    });
  } else {
    window.littlefinger = new LittlefingerSearch();
  }
})();
