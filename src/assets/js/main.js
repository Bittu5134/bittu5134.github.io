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

  // Blog Article Share link copy
  const shareBtn = document.getElementById("share-article-btn");
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        const defaultEl = shareBtn.querySelector(".share-default");
        const copiedEl = shareBtn.querySelector(".share-copied");
        if (defaultEl && copiedEl) {
          defaultEl.classList.add("hidden");
          copiedEl.classList.remove("hidden");
          setTimeout(() => {
            defaultEl.classList.remove("hidden");
            copiedEl.classList.add("hidden");
          }, 2000);
        }
      }).catch((err) => console.warn("Failed to copy share link:", err));
    });
  }

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
      document.body.style.overflow = "hidden";
    } else {
      mobileDrawer?.classList.add("hidden");
      mobileBackdrop?.classList.add("hidden");
      menuIconOpen?.classList.remove("hidden");
      menuIconClose?.classList.add("hidden");
      if (menuText) menuText.textContent = "MENU";
      menuToggleBtn?.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  }

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

  /* -------------------------------------------------------------------------- */
  /* 3. Projects Category Filter                                                */
  /* -------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll(".project-filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedFilter = btn.getAttribute("data-filter");

      // Update button styling
      filterButtons.forEach((b) => {
        b.className = "project-filter-btn px-2.5 sm:px-3 py-1 sm:py-1.5 border-2 border-black transition-all cursor-pointer bg-[#fffdf9] hover:bg-[#f6eedb]";
      });
      btn.className = "project-filter-btn px-2.5 sm:px-3 py-1 sm:py-1.5 border-2 border-black transition-all cursor-pointer bg-[#fde047] shadow-brutal-xs font-black -translate-y-0.5";

      // Filter project cards (show up to 4 matching)
      let shownCount = 0;
      projectCards.forEach((card) => {
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

        if (matches && shownCount < 4) {
          card.classList.remove("hidden");
          shownCount++;
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 3.5 Live IST Clock                                                         */
  /* -------------------------------------------------------------------------- */
  const clockEl = document.getElementById("hero-clock");
  if (clockEl) {
    function updateClock() {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        // second: "2-digit",
        hour12: false
      });
      clockEl.textContent = `${timeStr} IST`;
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  /* -------------------------------------------------------------------------- */
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
    let volume = 0.30;
    let isMinimized = window.innerWidth < 768;

    function pad(n) {
      return String(n).padStart(2, "0");
    }

    function updateTrackUI() {
      const track = TRACKS[currentTrackIndex];
      if (!track) return;
      audio.src = track.url;
      setTrackDisplayText(`${isPlaying ? "▶ " : "■ "}${track.title} - ${track.artist}`);
      restartTickerAnimation();
      if (trackCounter) {
        trackCounter.textContent = `${pad(currentTrackIndex + 1)}/${pad(TRACKS.length)}`;
      }
    }

    function setMinimizedState(minimized) {
      isMinimized = minimized;
      if (minimized) {
        minimizedBtn.classList.remove("hidden");
        expandedDeck.classList.add("hidden");
      } else {
        minimizedBtn.classList.add("hidden");
        expandedDeck.classList.remove("hidden");
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

    function applyVolume(vol) {
      volume = vol;
      // Acoustic logarithmic volume curve
      audio.volume = Math.min(1, Math.max(0, vol * vol));
      if (volumeText) {
        volumeText.textContent = `${Math.round(vol * 100)}%`;
      }
    }

    // Toggle Play/Pause
    function togglePlay() {
      if (isPlaying) {
        audio.pause();
      } else {
        if (!audio.src || !audio.src.includes(TRACKS[currentTrackIndex].url)) {
          audio.src = TRACKS[currentTrackIndex].url;
        }
        audio.play().catch((err) => console.warn("Audio play blocked:", err));
      }
    }

    function nextTrack() {
      currentTrackIndex = (currentTrackIndex + 1) % TRACKS.length;
      updateTrackUI();
      if (isPlaying) {
        audio.play().catch((err) => console.warn("Audio play blocked:", err));
      }
    }

    function prevTrack() {
      currentTrackIndex = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
      updateTrackUI();
      if (isPlaying) {
        audio.play().catch((err) => console.warn("Audio play blocked:", err));
      }
    }

    // Event listeners
    minimizedBtn.addEventListener("click", () => setMinimizedState(false));
    minimizeBtn?.addEventListener("click", () => setMinimizedState(true));
    playBtn?.addEventListener("click", togglePlay);
    nextBtn?.addEventListener("click", nextTrack);
    prevBtn?.addEventListener("click", prevTrack);

    audio.addEventListener("play", () => updatePlayingState(true));
    audio.addEventListener("pause", () => updatePlayingState(false));
    audio.addEventListener("ended", nextTrack);

    volumeSlider?.addEventListener("input", (e) => {
      applyVolume(parseFloat(e.target.value));
    });

    // Initialize state
    applyVolume(volume);
    updateTrackUI();
    setMinimizedState(isMinimized);
  }
});
