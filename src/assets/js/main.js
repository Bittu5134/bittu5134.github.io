/**
 * main.js - Ultra-lightweight Vanilla JS for bittu.dev
 * Handles interactivity with zero framework overhead (< 6KB)
 */

document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------------------------------------------------------- */
  /* 1. Clipboard Copy Helpers                                                  */
  /* -------------------------------------------------------------------------- */
  function setupCopyButton(btnId, textToCopy, defaultSelector, copiedSelector) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(textToCopy).then(() => {
        const defaultEl = btn.querySelector(defaultSelector);
        const copiedEl = btn.querySelector(copiedSelector);
        if (defaultEl && copiedEl) {
          defaultEl.classList.add("hidden");
          copiedEl.classList.remove("hidden");
          setTimeout(() => {
            defaultEl.classList.remove("hidden");
            copiedEl.classList.add("hidden");
          }, 2000);
        }
      }).catch((err) => {
        console.warn("Failed to copy:", err);
      });
    });
  }

  // Hero Discord copy
  setupCopyButton("copy-discord-hero", "bittu5134", ".discord-default", ".discord-copied");

  // Contact Discord copy
  setupCopyButton("copy-discord-contact", "bittu5134", ".discord-default", ".discord-copied");

  // Contact Email copy
  setupCopyButton("copy-email-contact", "hello@bittu.dev", ".email-default", ".email-copied");


  // Post Article Copy Link Buttons (Header & Footer)
  document.querySelectorAll(".post-copy-link-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const url = btn.getAttribute("data-url") || window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<span>Copied!</span>';
        btn.classList.add("bg-[#86efac]");
        btn.classList.remove("bg-[#fde047]");
        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.classList.remove("bg-[#86efac]");
          btn.classList.add("bg-[#fde047]");
        }, 2000);
      }).catch((err) => console.warn("Failed to copy article link:", err));
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 2. Mobile Navigation Drawer                                               */
  /* -------------------------------------------------------------------------- */
  const menuToggleBtn = document.getElementById("menu-toggle-btn");
  const drawerCloseBtn = document.getElementById("drawer-close-btn");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const mobileBackdrop = document.getElementById("mobile-backdrop");
  const menuIconOpen = document.getElementById("menu-icon-open");
  const menuIconClose = document.getElementById("menu-icon-close");
  const menuText = document.getElementById("menu-text");

  const headerEl = document.querySelector("header");
  let isMenuOpen = false;

  function setMenuOpen(open) {
    isMenuOpen = open;
    if (open) {
      mobileDrawer?.classList.remove("hidden");
      mobileBackdrop?.classList.remove("hidden");
      menuIconOpen?.classList.add("hidden");
      menuIconClose?.classList.remove("hidden");
      if (menuText) menuText.textContent = "CLOSE";
      menuToggleBtn?.setAttribute("aria-expanded", "true");
      // Keep header fixed to top of viewport even if user scrolled down before opening drawer
      if (headerEl) {
        headerEl.classList.remove("sticky");
        headerEl.classList.add("fixed", "top-0", "left-0", "right-0");
      }
      document.body.style.overflow = "hidden";
    } else {
      mobileDrawer?.classList.add("hidden");
      mobileBackdrop?.classList.add("hidden");
      menuIconOpen?.classList.remove("hidden");
      menuIconClose?.classList.add("hidden");
      if (menuText) menuText.textContent = "MENU";
      menuToggleBtn?.setAttribute("aria-expanded", "false");
      if (headerEl) {
        headerEl.classList.remove("fixed", "left-0", "right-0");
        headerEl.classList.add("sticky");
      }
      document.body.style.overflow = "";
    }
  }

  // Auto-minimize the tape deck if it overlaps interactive content (filters, stats)
  const cassetteDeck = document.getElementById("cassette-expanded-deck");
  const cassetteMinBtn = document.getElementById("cassette-minimized-btn");
  const cassetteMinBtnEl = document.getElementById("cassette-minimize-btn");
  function minimizeDeckIfOverlapping() {
    if (!cassetteDeck || cassetteDeck.classList.contains("hidden")) return;
    const dr = cassetteDeck.getBoundingClientRect();
    const widget = document.getElementById("cassette-widget");
    const targets = [...document.querySelectorAll(".project-filter-btn, .project-card, a, button")].filter((el) => !(widget && widget.contains(el)));
    for (const el of targets) {
      const r = el.getBoundingClientRect();
      if (r.width && r.height && r.left < dr.right - 8 && r.right > dr.left + 8 && r.top < dr.bottom - 8 && r.bottom > dr.top + 8) {
        cassetteMinBtnEl?.click();
        return;
      }
    }
  }
  window.addEventListener("resize", minimizeDeckIfOverlapping, { passive: true });
  window.addEventListener("load", minimizeDeckIfOverlapping);
  let deckScrollPending = false;
  window.addEventListener("scroll", () => {
    if (deckScrollPending) return;
    deckScrollPending = true;
    requestAnimationFrame(() => { deckScrollPending = false; minimizeDeckIfOverlapping(); });
  }, { passive: true });
  setTimeout(minimizeDeckIfOverlapping, 400);
  cassetteMinBtn?.addEventListener("click", () => setTimeout(minimizeDeckIfOverlapping, 60));

  menuToggleBtn?.addEventListener("click", () => setMenuOpen(!isMenuOpen));
  drawerCloseBtn?.addEventListener("click", () => setMenuOpen(false));
  mobileBackdrop?.addEventListener("click", () => setMenuOpen(false));

  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024 && isMenuOpen) {
      setMenuOpen(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (isMenuOpen) {
      setMenuOpen(false);
      menuToggleBtn?.focus();
      return;
    }
    // Escape closes the cassette deck when it is open and focus is inside it.
    // The minimize button owns the state transition + focus restore.
    if (
      cassetteDeck &&
      !cassetteDeck.classList.contains("hidden") &&
      cassetteDeck.contains(document.activeElement)
    ) {
      cassetteMinBtnEl?.click();
    }
  });

  /* -------------------------------------------------------------------------- */
  /* 3. Projects Category Filter                                                */
  /* -------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll(".project-filter-btn");
  const projectsGrid = document.getElementById("projects-grid");
  let nonPinnedRendered = false;

  function renderNonPinnedCards() {
    if (nonPinnedRendered || !projectsGrid) return;
    const dataEl = document.getElementById("non-pinned-projects-data");
    if (!dataEl) return;

    let nonPinned;
    try {
      nonPinned = JSON.parse(dataEl.textContent || "[]");
    } catch (e) {
      console.warn("Failed to parse non-pinned projects data:", e);
      return;
    }
    if (!Array.isArray(nonPinned) || nonPinned.length === 0) return;

    const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

    // Build everything into a DocumentFragment and append once, so a mid-loop
    // exception can never leave a half-rendered grid behind. The flag is set in
    // a finally block so a failed pass is not retried (which would duplicate
    // already-appended cards on the next filter click).
    try {
      const fragment = document.createDocumentFragment();
      // 1-based position of this card in the full grid order, used for the
      // alternating tilt exactly like the server template's loop.index.
      const baseIndex = projectsGrid.children.length;

      nonPinned.forEach((p, i) => {

        // Markup/classes mirror retro-projects.njk card for card.
        const card = document.createElement("article");
        card.className = `project-card group relative flex flex-col bg-[#f3e7cc] transition-colors hover:bg-[#fffdf9]/60 hidden`;
        card.setAttribute("data-filter-category", p.filterCategory || "");
        card.setAttribute("data-category", p.category || "");
        card.setAttribute("data-pinned", "false");
        card.setAttribute("data-popularity", String(p.popularity || 0));
        card.setAttribute("data-order", String(p.order || 99));

        let statsRow = "";
        if (p.stars > 0) statsRow += `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 border-2 border-black bg-[#fde047] font-mono text-sm font-bold text-black" title="${p.stars} stars on GitHub"><svg class="w-3.5 h-3.5 text-black fill-black" aria-hidden="true"><use href="#icon-star"/></svg>${esc(p.stars)}</span>`;
        if (p.forks > 0) statsRow += `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 border-2 border-black bg-[#f6eedb] font-mono text-sm font-bold text-black" title="${p.forks} forks on GitHub"><svg class="w-3.5 h-3.5 text-black" aria-hidden="true"><use href="#icon-git-fork"/></svg>${esc(p.forks)}</span>`;

        let metaLine = [p.language, p.statsText].filter(Boolean).map(esc).join(" · ");
        let tagsHtml = Array.isArray(p.tags) ? p.tags.map((t) => `<span>#${esc(String(t).toLowerCase())}</span>`).join("") : "";

        let visitBtn = "";
        if (p.liveUrl) visitBtn = `<a href="${esc(p.liveUrl)}" target="_blank" rel="noopener noreferrer" class="btn-pill-sm bg-[#fde047] hover:bg-[#fbbf24]">Visit <svg class="w-3.5 h-3.5 text-black" aria-hidden="true"><use href="#icon-arrow-up-right"/></svg></a>`;
        let ghBtn = "";
        if (p.githubUrl) ghBtn = `<a href="${esc(p.githubUrl)}" target="_blank" rel="noopener noreferrer" class="btn-pill-sm bg-transparent hover:bg-[#86efac]"><svg class="w-3.5 h-3.5 text-black" aria-hidden="true"><use href="#icon-github"/></svg> GitHub</a>`;

        card.innerHTML = `
          <div class="px-6 pt-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <h3 class="font-display text-3xl sm:text-4xl text-black leading-tight">${esc(p.title)}</h3>
            <div class="flex items-center gap-1.5 shrink-0">${statsRow}</div>
          </div>
          ${metaLine ? `<p class="px-6 pt-2 font-mono text-sm font-bold text-black/65">${metaLine}</p>` : ""}
          <p class="px-6 pt-4 pb-5 font-body text-base text-black/85 leading-relaxed flex-1">${esc(p.description)}</p>
          <div class="mt-auto flex flex-wrap items-center gap-2 border-t border-black/15 px-6 py-5">
            <div class="flex flex-1 flex-wrap items-center gap-1.5 font-mono text-sm font-bold text-black/60">${tagsHtml}</div>
            ${ghBtn}${visitBtn}
          </div>
        `;
        fragment.appendChild(card);
      });

      projectsGrid.appendChild(fragment);
    } finally {
      nonPinnedRendered = true;
    }
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedFilter = btn.getAttribute("data-filter");

      // Lazily render non-pinned cards if user picks any category other than PINNED
      if (selectedFilter !== "PINNED") {
        renderNonPinnedCards();
      }

      const allCards = document.querySelectorAll(".project-card");

      // Update button styling: mirror the server-rendered chip classes exactly.
      filterButtons.forEach((b) => {
        b.className = "project-filter-btn px-4 py-2.5 border-2 border-black font-mono text-sm font-bold transition-all cursor-pointer bg-[#fffdf9] hover:bg-[#fde047]";
        b.setAttribute("aria-pressed", "false");
      });
      btn.className = "project-filter-btn px-4 py-2.5 border-2 border-black font-mono text-sm font-bold transition-all cursor-pointer bg-[#fde047] shadow-brutal-xs";
      btn.setAttribute("aria-pressed", "true");

      // Filter project cards
      const matchingCards = [];
      allCards.forEach((card) => {
        const filterCat = card.getAttribute("data-filter-category");
        const fullCat = card.getAttribute("data-category") || "";
        const isPinned = card.getAttribute("data-pinned") === "true";

        let matches = false;
        if (selectedFilter === "PINNED") {
          matches = isPinned;
        } else if (selectedFilter === "ALL") {
          matches = true;
        } else {
          matches = filterCat === selectedFilter || fullCat.includes(selectedFilter);
        }

        if (matches) {
          matchingCards.push(card);
        } else {
          card.classList.add("hidden");
        }
      });

      // If category isn't PINNED, sort matching cards by curated fun/impressive order
      if (selectedFilter !== "PINNED") {
        matchingCards.sort((a, b) => {
          const ordA = parseInt(a.getAttribute("data-order") || "99", 10);
          const ordB = parseInt(b.getAttribute("data-order") || "99", 10);
          if (ordA !== ordB) return ordA - ordB;
          const popA = parseInt(a.getAttribute("data-popularity") || "0", 10);
          const popB = parseInt(b.getAttribute("data-popularity") || "0", 10);
          return popB - popA;
        });
      }

      // Show top 4, hide the rest
      matchingCards.forEach((card, index) => {
        if (index < 4) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 3.3 Nav scroll-spy: aria-current tracks the section in view */
  // Only in-page anchors (#section) are managed here. Links to real routes
  // (e.g. "Blog" -> "/#blog" off the home page, or "/blog") keep whatever
  // aria-current the server rendered for them.
  const navLinks = Array.from(document.querySelectorAll("header [data-nav]"));
  const sectionNavLinks = navLinks.filter((l) => (l.getAttribute("href") || "").startsWith("#"));
  if (sectionNavLinks.length && "IntersectionObserver" in window) {
    const sectionFor = {};
    sectionNavLinks.forEach((l) => {
      const sec = document.getElementById(l.dataset.nav);
      if (sec) sectionFor[sec.id] = l;
    });

    const setCurrent = (id) => {
      sectionNavLinks.forEach((l) => {
        if (id && l.dataset.nav === id) l.setAttribute("aria-current", "location");
        else l.removeAttribute("aria-current");
      });
    };

    // Sections currently inside the spy band (viewport 40%-50%), so we can clear
    // the marker when the reader lands between sections instead of keeping a
    // stale one.
    const intersecting = new Map();
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) intersecting.set(e.target.id, e.intersectionRatio);
        else intersecting.delete(e.target.id);
      });
      let best = null;
      intersecting.forEach((ratio, id) => {
        if (!best || ratio > best.ratio) best = { id, ratio };
      });
      setCurrent(best ? best.id : null);
    }, { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25] });

    Object.keys(sectionFor).forEach((id) => {
      const sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });

    // Initial state: the observer does not fire until layout/scroll settles, so
    // resolve the section currently crossing the band right away.
    const bandSection = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const bandTop = vh * 0.4;
      const bandBottom = vh * 0.5;
      let bestId = null;
      let bestTop = -Infinity;
      Object.keys(sectionFor).forEach((id) => {
        const sec = document.getElementById(id);
        if (!sec) return;
        const r = sec.getBoundingClientRect();
        if (r.top <= bandBottom && r.bottom >= bandTop && r.top > bestTop) {
          bestTop = r.top;
          bestId = id;
        }
      });
      return bestId;
    };
    setCurrent(bandSection());
  }

  /* 3.4 Skills ticker eases to 25% speed on hover/focus */
  const tickerBand = document.querySelector(".ticker-band");
  if (tickerBand) {
    let tickerRate = 1;
    const applyTickerRate = () => {
      document.getAnimations().forEach((anim) => {
        if (anim.animationName === "ticker") anim.playbackRate = tickerRate;
      });
    };
    const easeTicker = (target) => {
      tickerRate = target;
      applyTickerRate();
    };
    tickerBand.addEventListener("mouseenter", () => easeTicker(0.25));
    tickerBand.addEventListener("mouseleave", () => easeTicker(1));
    tickerBand.addEventListener("focusin", () => easeTicker(0.25));
    tickerBand.addEventListener("focusout", () => easeTicker(1));
  }

  /* -------------------------------------------------------------------------- */
  /* 3.4 Ghastling companion — drifts slowly toward the mouse cursor         */
  /* ------------------------------------------------------------------------ */
  const ghastling = document.getElementById("ghastling-companion");
  if (ghastling && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const ghastlingSpeed = 0.012;      // lerp factor — lower = lazier follow
    const ghastlingOffset = { x: 28, y: -96 }; // hover up-right of the cursor
    let target = { x: innerWidth * 0.7, y: innerHeight * 0.5 };
    let pos = { x: innerWidth * 0.7, y: innerHeight * 0.5 };
    let ghastlingRaf = null;
    let ghastlingT = 0;

    window.addEventListener("mousemove", (e) => {
      target.x = e.clientX + ghastlingOffset.x;
      target.y = e.clientY + ghastlingOffset.y;
    }, { passive: true });

    const ghastlingTick = () => {
      ghastlingT += 0.05;
      pos.x += (target.x - pos.x) * ghastlingSpeed;
      pos.y += (target.y - pos.y) * ghastlingSpeed;
      // keep the little guy on screen
      const gw = ghastling.offsetWidth || 64;
      const gh = ghastling.offsetHeight || 86;
      const gx = Math.min(Math.max(pos.x, gw * -0.25), innerWidth - gw * 0.75);
      const gy = Math.min(Math.max(pos.y, 8), innerHeight - gh - 8);
      // idle bob synced to its own gif cadence
      const bob = Math.sin(ghastlingT) * 4;
      // face the cursor: flip horizontally when drifting to the left of it
      const facing = pos.x + ghastlingOffset.x < target.x - 6 ? -1 : 1;
      ghastling.style.transform = "translate(" + gx + "px," + (gy + bob) + "px) scaleX(" + facing + ")";
      ghastlingRaf = requestAnimationFrame(ghastlingTick);
    };
    ghastlingRaf = requestAnimationFrame(ghastlingTick);

    // park the loop when the tab is hidden
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(ghastlingRaf);
        ghastlingRaf = null;
      } else if (ghastlingRaf === null) {
        ghastlingRaf = requestAnimationFrame(ghastlingTick);
      }
    });
  }

  /* 4. Lo-Fi Cassette Player                                                   */
  /* -------------------------------------------------------------------------- */
  const TRACKS = [
    { title: "Miku", artist: "Anamanaguchi", url: "https://files.catbox.moe/4fmz63.webm" },
    { title: "Pigstep", artist: "Lena Raine", url: "https://files.catbox.moe/7opziz.webm" },
    { title: "Bad Apple!!", artist: "Masayoshi Minoshima ft. Nomico", url: "https://files.catbox.moe/ehjjw2.webm" },
    { title: "MEGALOVANIA", artist: "Toby Fox", url: "https://files.catbox.moe/k9ginr.webm" },
    { title: "Caramelldansen", artist: "Caramell", url: "https://files.catbox.moe/eadyic.webm" },
    { title: "Running in the 90's", artist: "Maurizio De Jorio", url: "https://files.catbox.moe/j7gf0i.webm" },
  ];

  const audio = document.getElementById("cassette-audio");
  const minimizedBtn = document.getElementById("cassette-minimized-btn");
  const expandedDeck = document.getElementById("cassette-expanded-deck");
  const minimizeBtn = document.getElementById("cassette-minimize-btn");
  const playBtn = document.getElementById("cassette-play-btn");
  const prevBtn = document.getElementById("cassette-prev-btn");
  const nextBtn = document.getElementById("cassette-next-btn");
  const playIcon = document.getElementById("cassette-play-icon");
  const pauseIcon = document.getElementById("cassette-pause-icon");
  const playText = document.getElementById("cassette-play-text");
  const trackDisplays = document.querySelectorAll(".cassette-track-display");
  const trackDisplay = document.getElementById("cassette-track-display");
  const trackTicker = document.getElementById("cassette-track-ticker");
  const trackCounter = document.getElementById("cassette-track-counter");
  const volumeSlider = document.getElementById("cassette-volume-slider");
  const volumeText = document.getElementById("cassette-volume-text");
  const leftSpool = document.getElementById("cassette-left-spool");
  const rightSpool = document.getElementById("cassette-right-spool");
  const minimizedLabel = document.getElementById("cassette-minimized-label");

  function setTrackDisplayText(text) {
    if (trackDisplays.length > 0) {
      trackDisplays.forEach((el) => {
        el.textContent = text;
      });
    } else if (trackDisplay) {
      trackDisplay.textContent = text;
    }
  }

  function restartTickerAnimation() {
    if (trackTicker) {
      trackTicker.style.animation = "none";
      void trackTicker.offsetWidth;
      trackTicker.style.animation = "";
    }
  }

  if (audio && minimizedBtn && expandedDeck) {
    let isPlaying = false;
    let currentTrackIndex = 0;
    let volume = 1.0;
    let isMinimized = true; // deck always starts minimized, on every screen size
    let isSwitchingTrack = false;

    function pad(n) {
      return String(n).padStart(2, "0");
    }

    function setMinimizedState(minimized) {
      isMinimized = minimized;
      const focusInsideDeck = expandedDeck.contains(document.activeElement);
      if (minimized) {
        minimizedBtn.classList.remove("hidden");
        expandedDeck.classList.add("hidden");
        minimizedBtn.setAttribute("aria-expanded", "false");
        // Hand focus back to the pill that re-opens the deck.
        if (focusInsideDeck) minimizedBtn.focus({ preventScroll: true });
      } else {
        expandedDeck.classList.remove("hidden");
        minimizedBtn.classList.add("hidden");
        minimizedBtn.setAttribute("aria-expanded", "true");
        // Only pull focus when the open was user-initiated (pill had focus), so
        // the desktop initial render does not steal focus on page load.
        if (document.activeElement === minimizedBtn) {
          minimizeBtn?.focus({ preventScroll: true });
        }
      }
    }

    function updatePlayingState(playing) {
      isPlaying = playing;
      const track = TRACKS[currentTrackIndex];

      if (playing) {
        playIcon?.classList.add("hidden");
        pauseIcon?.classList.remove("hidden");
        if (playText) playText.textContent = "PAUSE";
        playBtn?.classList.remove("bg-[#fde047]", "hover:bg-[#fb923c]");
        playBtn?.classList.add("bg-[#86efac]", "hover:bg-[#6ee7b7]");
        leftSpool?.classList.add("animate-spinSlow");
        rightSpool?.classList.add("animate-spinSlow");
        document.querySelectorAll(".cassette-disc-icon svg").forEach((svg) => {
          svg.classList.add("animate-spin");
        });
        if (minimizedLabel) minimizedLabel.textContent = "PLAYING...";
        if (track) {
          setTrackDisplayText(`▶ ${track.title} - ${track.artist}`);
        }
      } else {
        playIcon?.classList.remove("hidden");
        pauseIcon?.classList.add("hidden");
        if (playText) playText.textContent = "PLAY";
        playBtn?.classList.remove("bg-[#86efac]", "hover:bg-[#6ee7b7]");
        playBtn?.classList.add("bg-[#fde047]", "hover:bg-[#fb923c]");
        leftSpool?.classList.remove("animate-spinSlow");
        rightSpool?.classList.remove("animate-spinSlow");
        document.querySelectorAll(".cassette-disc-icon svg").forEach((svg) => {
          svg.classList.remove("animate-spin");
        });
        if (minimizedLabel) minimizedLabel.textContent = "TAPE DECK";
        if (track) {
          setTrackDisplayText(`■ ${track.title} - ${track.artist}`);
        }
      }
    }

    function loadTrack(index, autoplay = false) {
      currentTrackIndex = (index + TRACKS.length) % TRACKS.length;
      const track = TRACKS[currentTrackIndex];
      if (!track) return;

      isSwitchingTrack = true;
      audio.pause();

      // Only attach the source on an explicit play request. Setting audio.src +
      // audio.load() here would fetch the whole first track (e.g. the ~110KB
      // Miku .webm) during page load, even with preload="none" and no user gesture.
      // Paused track switches only move the selection; togglePlay() attaches the
      // source lazily when the user actually hits play.
      if (autoplay) {
        audio.src = track.url;
        audio.load();
      } else {
        // Detach the old source so togglePlay() knows to load the new selection
        // on the next play press. load() with an empty src is a no-op (no fetch).
        audio.removeAttribute("src");
        audio.load();
      }

      if (trackCounter) {
        trackCounter.textContent = `${pad(currentTrackIndex + 1)}/${pad(TRACKS.length)}`;
      }

      if (autoplay) {
        updatePlayingState(true);
        restartTickerAnimation();
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              isSwitchingTrack = false;
            })
            .catch((err) => {
              console.warn("Audio play blocked or interrupted:", err);
              isSwitchingTrack = false;
              if (audio.paused) {
                updatePlayingState(false);
              }
            });
        } else {
          isSwitchingTrack = false;
        }
      } else {
        updatePlayingState(false);
        restartTickerAnimation();
        isSwitchingTrack = false;
      }
    }

    function applyVolume(vol) {
      volume = vol;
      // Acoustic logarithmic volume curve
      audio.volume = Math.min(1, Math.max(0, vol * vol));
      if (volumeText) {
        volumeText.textContent = `${Math.round(vol * 100)}%`;
      }
      if (volumeSlider && volumeSlider.value !== String(vol)) {
        volumeSlider.value = String(vol);
      }
    }

    // Toggle Play/Pause
    function togglePlay() {
      if (!audio.getAttribute("src")) {
        // No source attached yet (paused track selection) - load the current
        // track and start it in one go.
        loadTrack(currentTrackIndex, true);
        return;
      }
      if (audio.paused) {
        updatePlayingState(true);
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Audio play blocked:", err);
            updatePlayingState(false);
          });
        }
      } else {
        audio.pause();
      }
    }

    function nextTrack() {
      // Autoplay next track if playing, stay paused if paused
      const wasPlaying = isPlaying && !audio.paused;
      loadTrack(currentTrackIndex + 1, wasPlaying);
    }

    function prevTrack() {
      const wasPlaying = isPlaying && !audio.paused;
      if (audio.currentTime > 3) {
        audio.currentTime = 0;
        if (wasPlaying) {
          audio.play().catch((err) => console.warn("Audio play blocked:", err));
        }
      } else {
        loadTrack(currentTrackIndex - 1, wasPlaying);
      }
    }

    // Event listeners
    minimizedBtn.addEventListener("click", () => setMinimizedState(false));
    minimizeBtn?.addEventListener("click", () => setMinimizedState(true));
    playBtn?.addEventListener("click", togglePlay);
    nextBtn?.addEventListener("click", nextTrack);
    prevBtn?.addEventListener("click", prevTrack);

    audio.addEventListener("play", () => {
      updatePlayingState(true);
    });
    audio.addEventListener("playing", () => {
      updatePlayingState(true);
    });
    audio.addEventListener("pause", () => {
      // Ignore synthetic pause events fired when switching src or on naturally ended
      if (isSwitchingTrack || audio.ended) return;
      updatePlayingState(false);
    });
    audio.addEventListener("ended", () => {
      // Seamlessly advance to next song and autoplay unless user paused
      loadTrack(currentTrackIndex + 1, true);
    });
    audio.addEventListener("error", () => {
      if (isSwitchingTrack) return;
      console.warn("Cassette audio playback error:", audio.error);
      const track = TRACKS[currentTrackIndex];
      setTrackDisplayText(`⚠ Error loading ${track?.title || "track"}`);
      updatePlayingState(false);
    });

    volumeSlider?.addEventListener("input", (e) => {
      applyVolume(parseFloat(e.target.value));
    });

    // Initialize state
    applyVolume(volume);
    loadTrack(0, false);
    setMinimizedState(isMinimized);
  }

  /* -------------------------------------------------------------------------- */
  /* 5. WebGL Metaballs Raymarching Shader                                      */
  /* -------------------------------------------------------------------------- */
  const canvas = document.getElementById("metaballs-canvas");
  if (canvas) {
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      const vsSource = `
        attribute vec2 position;
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      const fsSource = `
        precision highp float;
        uniform vec2 iResolution;
        uniform float iTime;

        float opSmoothUnion(float d1, float d2, float k) {
          float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
          return mix(d2, d1, h) - k * h * (1.0 - h);
        }

        float sdSphere(vec3 p, float s) {
          return length(p) - s;
        }

        float map(vec3 p) {
          float d = 2.0;
          float X = (iResolution.x / iResolution.y) * 3.0; // half-width of the visible field
          for (int i = 0; i < 12; i++) {
            float fi = float(i);
            float time = iTime * (fract(fi * 412.531 + 0.513) - 0.5) * 2.0;
            // Two edge clusters: blobs hug the screen edges and reach toward the centre,
            // scaled with the real half-width so they sit at the edges at any aspect.
            // Lava-lamp motion: per-blob drift speed + decorrelated phases so they
            // wander, split and merge on their own schedules instead of clumping.
            float fr = fract(fi * 412.531 + 0.5124);   // stable per-blob random
            float sp = 0.4 + fr * 0.7;                 // drift speed 0.4 .. 1.1
            float t1 = time * sp + fi * 7.31;
            float side = (fi < 6.0) ? -1.0 : 1.0;
            float gx = X * (0.78 + sin(t1) * 0.14);    // 0.64X .. 0.92X — at the sides, reaching inward
            float gy = sin(t1 * 0.83 + fi * 2.3) * (0.9 + fr * 1.3);
            float gz = cos(t1 * 0.61 + fi * 3.1) * 0.7;
            vec3 c = vec3(side * gx, gy, gz);
            d = opSmoothUnion(
              sdSphere(p - c, X * mix(0.05, 0.1, fr)),
              d,
              0.4
            );
          }
          return d;
        }

        vec3 calcNormal(in vec3 p) {
          const float h = 1e-5;
          const vec2 k = vec2(1.0, -1.0);
          return normalize(k.xyy * map(p + k.xyy * h) +
                           k.yyx * map(p + k.yyx * h) +
                           k.yxy * map(p + k.yxy * h) +
                           k.xxx * map(p + k.xxx * h));
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / iResolution.xy;
          vec3 rayOri = vec3((uv - 0.5) * vec2(iResolution.x / iResolution.y, 1.0) * 6.0, 3.0);
          vec3 rayDir = vec3(0.0, 0.0, -1.0);

          float depth = 0.0;
          vec3 p = rayOri;

          for (int i = 0; i < 48; i++) {
            p = rayOri + rayDir * depth;
            float dist = map(p);
            depth += dist;
            if (dist < 1e-6) break;
          }

          vec3 col = vec3(0.0);
          float fog = 0.0;

          if (depth < 6.0) {
            vec3 normal = calcNormal(p);
            float diffuse = clamp(dot(normal, vec3(0.5, 0.5, 1.0)), 0.0, 1.0);
            // Site palette: lit faces warm yellow, shaded faces amber
            col = mix(vec3(0.99, 0.84, 0.30), vec3(0.83, 0.40, 0.10), 1.0 - diffuse);
            // Depth fades to transparent (not black) so blobs melt into the paper
            fog = exp(-0.001 * depth * depth * depth);
          }

          float edge = 1.0 - step(6.0, depth);
          float hit = edge * fog;
          gl_FragColor = vec4(col * hit, hit);
        }
      `;

      function createShader(glCtx, type, source) {
        const shader = glCtx.createShader(type);
        glCtx.shaderSource(shader, source);
        glCtx.compileShader(shader);
        if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
          console.warn("Shader compile error:", glCtx.getShaderInfoLog(shader));
          glCtx.deleteShader(shader);
          return null;
        }
        return shader;
      }

      // Program creation is wrapped in initWebGL() and invoked lazily from the
      // IntersectionObserver below, so compile/link never blocks DOMContentLoaded.
      let program = null;
      let resolutionLocation = null;
      let timeLocation = null;
      let initialized = false;
      let isVisible = false;
      let lastDrawTime = 0;
      let animationFrameId = null;
      let startTime = 0;
      let cachedWidth = 0;
      let cachedHeight = 0;
      let needsResize = true;

      const prefersReducedMotion = !!(
        window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );

      // Read layout on resize only. Calling getBoundingClientRect() inside
      // render() forced a synchronous style/layout pass on every frame.
      function measureCanvas() {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5, 1280 / Math.max(1, rect.width));
        cachedWidth = Math.max(1, Math.floor(rect.width * dpr));
        cachedHeight = Math.max(1, Math.floor(rect.height * dpr));
        needsResize = true;
      }

      function resizeCanvas() {
        if (!needsResize) return;
        if (canvas.width !== cachedWidth || canvas.height !== cachedHeight) {
          canvas.width = cachedWidth;
          canvas.height = cachedHeight;
        }
        gl.viewport(0, 0, canvas.width, canvas.height);
        needsResize = false;
      }

      function render(now) {
        animationFrameId = null;
        if (!isVisible || !program) return;
        now = now || performance.now();
        if (now - (lastDrawTime || 0) < 40) {
          animationFrameId = requestAnimationFrame(render);
          return;
        }
        lastDrawTime = now;

        resizeCanvas();

        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        gl.uniform1f(timeLocation, (now - startTime) * 0.001);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // Respect reduced-motion: draw one static frame, never a loop.
        if (!prefersReducedMotion) {
          animationFrameId = requestAnimationFrame(render);
        }
      }

      function startRendering() {
        if (!animationFrameId && isVisible && program) {
          animationFrameId = requestAnimationFrame(render);
        }
      }

      function stopRendering() {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }

      function handleResize() {
        measureCanvas();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          render();
        } else {
          startRendering();
        }
      }

      function initWebGL() {
        if (initialized) return;
        initialized = true;

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        if (!vertexShader || !fragmentShader) return;

        program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          console.warn("Shader link error:", gl.getProgramInfoLog(program));
          program = null;
          return;
        }

        gl.useProgram(program);

        const positionLocation = gl.getAttribLocation(program, "position");
        resolutionLocation = gl.getUniformLocation(program, "iResolution");
        timeLocation = gl.getUniformLocation(program, "iTime");

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([
            -1.0, -1.0,
             1.0, -1.0,
            -1.0,  1.0,
            -1.0,  1.0,
             1.0, -1.0,
             1.0,  1.0,
          ]),
          gl.STATIC_DRAW
        );

        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        measureCanvas();
        startTime = performance.now();

        if ("ResizeObserver" in window) {
          new ResizeObserver(handleResize).observe(canvas);
        } else {
          window.addEventListener("resize", handleResize, { passive: true });
        }

        startRendering();
      }

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) stopRendering();
        else if (isVisible) startRendering();
      });

      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
              initWebGL();
              startRendering();
            } else {
              stopRendering();
            }
          });
        }, { threshold: 0.05 });

        observer.observe(canvas);
      } else {
        isVisible = true;
        initWebGL();
        startRendering();
      }
    }
  }

  /* -------------------------------------------------------------------------- */
  /* 8. Code Block Copy Buttons (Shiki Code Fences)                             */
  /* -------------------------------------------------------------------------- */
  document.querySelectorAll(".code-copy-btn").forEach((btn) => {
    let revertTimer = null;
    btn.addEventListener("click", () => {
      const rawCode = decodeURIComponent(btn.getAttribute("data-code") || "");
      navigator.clipboard
        .writeText(rawCode)
        .then(() => {
          btn.classList.add("copied");
          clearTimeout(revertTimer);
          revertTimer = setTimeout(() => btn.classList.remove("copied"), 2000);
        })
        .catch((err) => console.warn("Failed to copy code block:", err));
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 9. Article Reading Progress Bar                                            */
  /* -------------------------------------------------------------------------- */
  const progressBar = document.getElementById("reading-progress");
  if (progressBar) {
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      progressBar.style.width = `${progress}%`;
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  /* -------------------------------------------------------------------------- */
  /* 10. Table of Contents Scroll-Spy                                           */
  /* -------------------------------------------------------------------------- */
  const tocLinks = document.querySelectorAll(".toc-nav-link");
  if (tocLinks.length > 0) {
    const headingIds = Array.from(tocLinks).map((link) => link.getAttribute("data-target"));
    const headings = headingIds.map((id) => document.getElementById(id)).filter(Boolean);

    if ("IntersectionObserver" in window && headings.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute("id");
              tocLinks.forEach((link) => {
                if (link.getAttribute("data-target") === id) {
                  link.classList.add("active");
                } else {
                  link.classList.remove("active");
                }
              });
            }
          });
        },
        { rootMargin: "0px 0px -70% 0px", threshold: 0 }
      );

      headings.forEach((heading) => observer.observe(heading));
    }
  }

  /* -------------------------------------------------------------------------- */
  /* 11. Blog Search & Filtering handled exclusively by pagefind-search.js     */
  /* -------------------------------------------------------------------------- */

  /* -------------------------------------------------------------------------- */
  /* 12. Dark / Light Theme Controller (Strictly Scoped to Post Pages)         */
  /* -------------------------------------------------------------------------- */
  function initThemeController() {
    const path = window.location.pathname;
    const isPostPage = path.indexOf("/blog/") === 0 && path !== "/blog/" && path !== "/blog/index.html";

    // Strict scope isolation: Never activate or toggle theme on non-post pages (home, blog listing, etc.)
    if (!isPostPage) {
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.classList.remove("dark");
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute("content", "#f3e7cc");
      return;
    }

    const themeToggleBtns = document.querySelectorAll("#theme-toggle-btn");

    function getActiveTheme() {
      return document.documentElement.getAttribute("data-theme") || "light";
    }

    function updateThemeColorMeta(theme) {
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute("content", theme === "dark" ? "#0d1117" : "#f3e7cc");
      }
    }

    function updateToggleIcons(theme) {
      themeToggleBtns.forEach((btn) => {
        const lightIcon = btn.querySelector(".theme-icon-light");
        const darkIcon = btn.querySelector(".theme-icon-dark");
        if (theme === "dark") {
          lightIcon?.classList.remove("hidden");
          lightIcon?.classList.add("flex");
          darkIcon?.classList.add("hidden");
          darkIcon?.classList.remove("flex");
        } else {
          lightIcon?.classList.add("hidden");
          lightIcon?.classList.remove("flex");
          darkIcon?.classList.remove("hidden");
          darkIcon?.classList.add("flex");
        }
      });
    }

    function setTheme(theme, isManual = true) {
      document.documentElement.setAttribute("data-theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      if (isManual) {
        try {
          localStorage.setItem("theme", theme);
        } catch (e) {}
      }

      updateToggleIcons(theme);
      updateThemeColorMeta(theme);

      // Dispatch event for components that need re-rendering (Mermaid diagrams)
      window.dispatchEvent(new CustomEvent("theme-change", { detail: { theme } }));
    }

    // Initialize UI icons on load based on active theme
    const currentTheme = getActiveTheme();
    updateToggleIcons(currentTheme);
    updateThemeColorMeta(currentTheme);

    themeToggleBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const current = getActiveTheme();
        const next = current === "dark" ? "light" : "dark";
        setTheme(next, true);
      });
    });

    // Auto-switch based on system theme if user has not set a manual preference
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", (e) => {
        try {
          if (!localStorage.getItem("theme")) {
            setTheme(e.matches ? "dark" : "light", false);
          }
        } catch (err) {}
      });
    }
  }

  initThemeController();
});
