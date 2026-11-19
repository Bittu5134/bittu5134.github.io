/**
 * main.js — site interactivity, no framework.
 *
 * Every init function looks for its own markup and returns early when it is not
 * on the page, so one bundle safely serves the homepage, the archive, posts and
 * the 404 page. `defer` on the script tag guarantees the DOM is parsed.
 */

(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------------------------------------------------------------------- */
  /* Clipboards                                                            */
  /* ---------------------------------------------------------------------- */

  // Buttons that swap between a "default" and a "done" label after copying the
  // text in data-copy-text.
  function initCopyButtons() {
    $$("[data-copy-text]").forEach((btn) => {
      const doneLabel = $(".copy-done", btn);
      const defaultLabel = $(".copy-default", btn);
      let revertTimer = null;

      btn.addEventListener("click", () => {
        const text = btn.dataset.copyText;
        navigator.clipboard
          .writeText(text)
          .then(() => {
            if (!doneLabel || !defaultLabel) return;
            defaultLabel.classList.add("hidden");
            doneLabel.classList.remove("hidden");
            clearTimeout(revertTimer);
            revertTimer = setTimeout(() => {
              defaultLabel.classList.remove("hidden");
              doneLabel.classList.add("hidden");
            }, 2000);
          })
          .catch((err) => console.warn("[copy] clipboard write failed:", err));
      });
    });
  }

  // Copy buttons on Shiki code fences (markup comes from ast-plugins.js).
  function initCodeCopyButtons() {
    $$(".code-copy-btn").forEach((btn) => {
      let revertTimer = null;
      btn.addEventListener("click", () => {
        let code = "";
        try {
          code = decodeURIComponent(btn.dataset.code || "");
        } catch {
          code = btn.dataset.code || "";
        }
        navigator.clipboard
          .writeText(code)
          .then(() => {
            btn.classList.add("copied");
            clearTimeout(revertTimer);
            revertTimer = setTimeout(() => btn.classList.remove("copied"), 2000);
          })
          .catch((err) => console.warn("[copy] code block failed:", err));
      });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Mobile navigation drawer                                               */
  /* ---------------------------------------------------------------------- */

  function initMobileMenu() {
    const toggleBtn = $("#menu-toggle-btn");
    const drawer = $("#mobile-drawer");
    const backdrop = $("#mobile-backdrop");
    const iconOpen = $("#menu-icon-open");
    const iconClose = $("#menu-icon-close");
    const menuText = $("#menu-text");
    const header = $("header");
    if (!toggleBtn || !drawer || !backdrop) return;

    let isOpen = false;

    function setOpen(open) {
      isOpen = open;
      drawer.classList.toggle("hidden", !open);
      backdrop.classList.toggle("hidden", !open);
      iconOpen?.classList.toggle("hidden", open);
      iconClose?.classList.toggle("hidden", !open);
      if (menuText) menuText.textContent = open ? "CLOSE" : "MENU";
      toggleBtn.setAttribute("aria-expanded", String(open));

      // Pin the header to the viewport while the drawer is open, even if the
      // page was already scrolled.
      if (header) {
        header.classList.toggle("sticky", !open);
        header.classList.toggle("fixed", open);
        header.classList.toggle("top-0", open);
        header.classList.toggle("left-0", open);
        header.classList.toggle("right-0", open);
      }
      document.body.style.overflow = open ? "hidden" : "";
    }

    toggleBtn.addEventListener("click", () => setOpen(!isOpen));
    backdrop.addEventListener("click", () => setOpen(false));
    $$(".mobile-nav-link").forEach((link) => link.addEventListener("click", () => setOpen(false)));

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024 && isOpen) setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !isOpen) return;
      setOpen(false);
      toggleBtn.focus();
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Project category filter                                                */
  /* ---------------------------------------------------------------------- */

  // Every card is rendered server-side; filtering is show/hide + reorder only.
  function initProjectFilters() {
    const chips = $$(".project-filter-btn");
    const grid = $("#projects-grid");
    if (!chips.length || !grid) return;

    const cards = $$(".project-card", grid);
    const CATEGORY_CAP = 6;

    const matches = (card, filter) => {
      if (filter === "PINNED") return card.dataset.pinned === "true";
      if (filter === "ALL") return true;
      return card.dataset.filterCategory === filter || (card.dataset.category || "").includes(filter);
    };

    // Curated order first, popularity as the tie-breaker.
    const byOrder = (a, b) =>
      Number(a.dataset.order || 99) - Number(b.dataset.order || 99) ||
      Number(b.dataset.popularity || 0) - Number(a.dataset.popularity || 0);

    function apply(filter) {
      chips.forEach((chip) => chip.setAttribute("aria-pressed", String(chip.dataset.filter === filter)));

      const matching = cards.filter((card) => matches(card, filter));
      // PINNED keeps the server-rendered (GitHub pinned) order; other views are
      // sorted by curated order and capped.
      if (filter !== "PINNED") matching.sort(byOrder);
      const visible = filter === "PINNED" ? matching : matching.slice(0, CATEGORY_CAP);

      cards.forEach((card) => card.classList.add("hidden"));
      visible.forEach((card) => {
        card.classList.remove("hidden");
        grid.appendChild(card);
      });
    }

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        apply(chip.dataset.filter);
        // Sprites are re-rolled per view, after the new cards are on screen.
        setTimeout(applyOreSprites, 0);
      });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Ore-UI easter eggs                                                     */
  /* ---------------------------------------------------------------------- */

  const ORE_IMAGES = [
    "adventure.webp", "archer.webp", "battle.webp", "campfire.webp",
    "chest.webp", "chicken-eggs.webp", "chickens.webp", "chorus-flower.webp",
    "command-block.webp", "cow-rabbit.webp", "crafting-room.webp", "desert-house.webp",
    "dog-boat.webp", "enderman.webp", "fox.webp", "group-pose.webp",
    "house.webp", "jukebox.webp", "king-pig.webp", "librarian.webp",
    "lineup.webp", "mob-encounter.webp", "opening-chest.webp", "painting.webp",
    "parrots.webp", "pink-cow.webp", "portal-meeting.webp", "quartz-altar.webp",
    "rabbit-carrots.webp", "snow-villager.webp", "snowy-axolotl.webp", "steve-chicken.webp",
    "sunset.webp", "swamp.webp", "turtle-trade.webp", "turtles.webp",
    "underwater.webp", "village-trade.webp", "village.webp", "villager-door.webp",
    "wooden-display.webp", "zombies.webp",
  ].map((file) => `/assets/images/mini_scene/${file}`);

  // Three quarters of the project cards get a pixel-art sprite tucked into
  // their bottom-left corner.
  function applyOreSprites() {
    const deck = [...ORE_IMAGES].sort(() => Math.random() - 0.5);
    let next = 0;

    $$(".project-card").forEach((card) => {
      $$(".ore-sprite", card).forEach((el) => el.remove());
      if (Math.random() >= 0.75) return;

      const wrap = document.createElement("span");
      wrap.className = "ore-sprite hidden sm:block absolute pointer-events-none z-10 select-none";
      wrap.style.left = "0";
      wrap.style.bottom = "0";

      const img = document.createElement("img");
      img.alt = "";
      img.loading = "lazy";
      img.className = "w-full h-auto";
      img.style.imageRendering = "pixelated";
      img.src = deck[next++ % deck.length];
      img.addEventListener("load", () => {
        wrap.style.width = `${Math.min(176, Math.round(img.naturalWidth * 0.78))}px`;
      });

      wrap.appendChild(img);
      card.appendChild(wrap);
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Nav scroll-spy                                                         */
  /* ---------------------------------------------------------------------- */

  // Only in-page anchors (#section) are managed. Links to real routes keep
  // whatever aria-current the server rendered.
  function initNavScrollSpy() {
    const links = $$("header [data-nav]").filter((link) => (link.getAttribute("href") || "").startsWith("#"));
    if (!links.length || !("IntersectionObserver" in window)) return;

    const sections = links
      .map((link) => document.getElementById(link.dataset.nav))
      .filter(Boolean);
    if (!sections.length) return;

    function setCurrent(id) {
      links.forEach((link) => {
        if (id && link.dataset.nav === id) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }

    // Track which sections currently cross the 40–50% band of the viewport, and
    // mark the topmost one; the marker clears when the reader is between sections.
    const intersecting = new Map();
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) intersecting.set(entry.target.id, entry.intersectionRatio);
          else intersecting.delete(entry.target.id);
        });
        let best = null;
        intersecting.forEach((ratio, id) => {
          if (!best || ratio > best.ratio) best = { id, ratio };
        });
        setCurrent(best ? best.id : null);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25] }
    );

    sections.forEach((section) => spy.observe(section));

    // The observer does not fire until layout settles, so resolve the initial
    // section synchronously.
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const bandTop = vh * 0.4;
    const bandBottom = vh * 0.5;
    let initialId = null;
    let initialTop = -Infinity;
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= bandBottom && rect.bottom >= bandTop && rect.top > initialTop) {
        initialTop = rect.top;
        initialId = section.id;
      }
    });
    setCurrent(initialId);
  }

  /* ---------------------------------------------------------------------- */
  /* Allay companion                                                        */
  /* ---------------------------------------------------------------------- */

  // A small sprite that drifts lazily towards the cursor.
  function initAllay() {
    const allay = $("#allay-companion");
    if (!allay || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const SPEED = 0.012; // lerp factor — lower is lazier
    const OFFSET = { x: 28, y: -96 };
    const target = { x: window.innerWidth * 0.7, y: window.innerHeight * 0.5 };
    const pos = { ...target };
    let raf = null;
    let time = 0;

    window.addEventListener(
      "mousemove",
      (event) => {
        target.x = event.clientX + OFFSET.x;
        target.y = event.clientY + OFFSET.y;
      },
      { passive: true }
    );

    function tick() {
      time += 0.05;
      pos.x += (target.x - pos.x) * SPEED;
      pos.y += (target.y - pos.y) * SPEED;

      const width = allay.offsetWidth || 64;
      const height = allay.offsetHeight || 86;
      const x = Math.min(Math.max(pos.x, width * -0.25), window.innerWidth - width * 0.75);
      const y = Math.min(Math.max(pos.y, 8), window.innerHeight - height - 8);
      const bob = Math.sin(time) * 4;
      // face the cursor
      const facing = pos.x + OFFSET.x < target.x - 6 ? -1 : 1;

      allay.style.transform = `translate(${x}px,${y + bob}px) scaleX(${facing})`;
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    // Park the loop while the tab is hidden.
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = null;
      } else if (raf === null) {
        raf = requestAnimationFrame(tick);
      }
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Lo-fi cassette player                                                  */
  /* ---------------------------------------------------------------------- */

  const TRACKS = [
    { title: "Miku", artist: "Anamanaguchi", url: "https://files.catbox.moe/4fmz63.webm" },
    { title: "Pigstep", artist: "Lena Raine", url: "https://files.catbox.moe/7opziz.webm" },
    { title: "Bad Apple!!", artist: "Masayoshi Minoshima ft. Nomico", url: "https://files.catbox.moe/ehjjw2.webm" },
    { title: "MEGALOVANIA", artist: "Toby Fox", url: "https://files.catbox.moe/k9ginr.webm" },
    { title: "Caramelldansen", artist: "Caramell", url: "https://files.catbox.moe/eadyic.webm" },
    { title: "Running in the 90's", artist: "Maurizio De Jorio", url: "https://files.catbox.moe/j7gf0i.webm" },
  ];

  function initCassettePlayer() {
    const audio = $("#cassette-audio");
    const minimizedBtn = $("#cassette-minimized-btn");
    const deck = $("#cassette-expanded-deck");
    if (!audio || !minimizedBtn || !deck) return;

    const minimizeBtn = $("#cassette-minimize-btn");
    const playBtn = $("#cassette-play-btn");
    const prevBtn = $("#cassette-prev-btn");
    const nextBtn = $("#cassette-next-btn");
    const playIcon = $("#cassette-play-icon");
    const pauseIcon = $("#cassette-pause-icon");
    const playText = $("#cassette-play-text");
    const trackDisplays = $$(".cassette-track-display");
    const trackTicker = $("#cassette-track-ticker");
    const trackCounter = $("#cassette-track-counter");
    const volumeSlider = $("#cassette-volume-slider");
    const volumeText = $("#cassette-volume-text");
    const leftSpool = $("#cassette-left-spool");
    const rightSpool = $("#cassette-right-spool");
    const minimizedLabel = $("#cassette-minimized-label");

    let isPlaying = false;
    let trackIndex = 0;
    let isSwitchingTrack = false;

    const pad = (n) => String(n).padStart(2, "0");

    function setTrackText(text) {
      trackDisplays.forEach((el) => {
        el.textContent = text;
      });
    }

    function restartTicker() {
      if (!trackTicker) return;
      trackTicker.style.animation = "none";
      void trackTicker.offsetWidth;
      trackTicker.style.animation = "";
    }

    // The deck only ever changes state on an explicit user action (open pill,
    // minimize button, Escape). It never closes itself.
    function setMinimized(minimized) {
      const focusInsideDeck = deck.contains(document.activeElement);
      minimizedBtn.classList.toggle("hidden", !minimized);
      deck.classList.toggle("hidden", minimized);
      minimizedBtn.setAttribute("aria-expanded", String(!minimized));

      if (minimized) {
        if (focusInsideDeck) minimizedBtn.focus({ preventScroll: true });
      } else if (document.activeElement === minimizedBtn) {
        minimizeBtn?.focus({ preventScroll: true });
      }
    }

    function updatePlayingState(playing) {
      isPlaying = playing;
      const track = TRACKS[trackIndex];

      playIcon?.classList.toggle("hidden", playing);
      pauseIcon?.classList.toggle("hidden", !playing);
      if (playText) playText.textContent = playing ? "PAUSE" : "PLAY";

      playBtn?.classList.toggle("bg-[#86efac]", playing);
      playBtn?.classList.toggle("hover:bg-[#6ee7b7]", playing);
      playBtn?.classList.toggle("bg-[#fde047]", !playing);
      playBtn?.classList.toggle("hover:bg-[#fb923c]", !playing);

      [leftSpool, rightSpool].forEach((spool) => spool?.classList.toggle("animate-spinSlow", playing));
      $$(".cassette-disc-icon svg").forEach((svg) => svg.classList.toggle("animate-spin", playing));

      if (minimizedLabel) minimizedLabel.textContent = playing ? "PLAYING..." : "TAPE DECK";
      if (track) setTrackText(`${playing ? "▶" : "■"} ${track.title} - ${track.artist}`);
    }

    function loadTrack(index, autoplay) {
      trackIndex = (index + TRACKS.length) % TRACKS.length;
      const track = TRACKS[trackIndex];
      isSwitchingTrack = true;
      audio.pause();

      // Attach the source only for an explicit play request: setting src +
      // load() on every selection would download the first track on page load.
      if (autoplay) {
        audio.src = track.url;
        audio.load();
      } else {
        audio.removeAttribute("src");
        audio.load();
      }

      if (trackCounter) trackCounter.textContent = `${pad(trackIndex + 1)}/${pad(TRACKS.length)}`;

      updatePlayingState(autoplay);
      restartTicker();

      if (!autoplay) {
        isSwitchingTrack = false;
        return;
      }

      audio
        .play()
        ?.catch((err) => {
          console.warn("[cassette] playback blocked:", err);
          if (audio.paused) updatePlayingState(false);
        })
        .finally(() => {
          isSwitchingTrack = false;
        });
    }

    function togglePlay() {
      if (!audio.getAttribute("src")) {
        loadTrack(trackIndex, true);
        return;
      }
      if (audio.paused) {
        updatePlayingState(true);
        audio.play()?.catch((err) => {
          console.warn("[cassette] playback blocked:", err);
          updatePlayingState(false);
        });
      } else {
        audio.pause();
      }
    }

    function step(delta) {
      const wasPlaying = isPlaying && !audio.paused;
      if (delta < 0 && audio.currentTime > 3) {
        audio.currentTime = 0;
        if (wasPlaying) audio.play()?.catch(() => {});
        return;
      }
      loadTrack(trackIndex + delta, wasPlaying);
    }

    minimizedBtn.addEventListener("click", () => setMinimized(false));
    minimizeBtn?.addEventListener("click", () => setMinimized(true));
    playBtn?.addEventListener("click", togglePlay);
    nextBtn?.addEventListener("click", () => step(1));
    prevBtn?.addEventListener("click", () => step(-1));

    audio.addEventListener("play", () => updatePlayingState(true));
    audio.addEventListener("pause", () => {
      // Ignore synthetic pauses fired while switching source or when the track ended.
      if (isSwitchingTrack || audio.ended) return;
      updatePlayingState(false);
    });
    audio.addEventListener("ended", () => loadTrack(trackIndex + 1, true));
    audio.addEventListener("error", () => {
      if (isSwitchingTrack) return;
      console.warn("[cassette] audio error:", audio.error);
      setTrackText(`⚠ Error loading ${TRACKS[trackIndex]?.title || "track"}`);
      updatePlayingState(false);
    });

    if (volumeSlider) {
      // Squared curve approximates a logarithmic volume taper.
      const applyVolume = (value) => {
        audio.volume = Math.min(1, Math.max(0, value * value));
        if (volumeText) volumeText.textContent = `${Math.round(value * 100)}%`;
      };
      volumeSlider.addEventListener("input", (event) => applyVolume(parseFloat(event.target.value)));
      applyVolume(parseFloat(volumeSlider.value));
    }

    loadTrack(0, false);
    setMinimized(true);

    // Escape minimizes the deck, but only when focus is inside it — the
    // minimize button owns the state transition and focus restore.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !deck.classList.contains("hidden") && deck.contains(document.activeElement)) {
        minimizeBtn?.click();
      }
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Article reading progress                                               */
  /* ---------------------------------------------------------------------- */

  function initReadingProgress() {
    const bar = $("#reading-progress");
    if (!bar) return;

    function update() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
      bar.style.width = `${progress}%`;
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------------------------------------------------------------------- */

  function init() {
    initCopyButtons();
    initCodeCopyButtons();
    initMobileMenu();
    initProjectFilters();
    applyOreSprites();
    initNavScrollSpy();
    initAllay();
    initCassettePlayer();
    initReadingProgress();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
