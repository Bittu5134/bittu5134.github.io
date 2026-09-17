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

  // Blog Article Share link copy & Web Share API
  const shareBtn = document.getElementById("share-article-btn");
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      const title = shareBtn.getAttribute("data-title") || document.title;
      const url = shareBtn.getAttribute("data-url") || window.location.href;

      if (navigator.share && navigator.canShare && navigator.canShare({ title, url })) {
        navigator.share({ title, url }).catch(() => {});
      } else {
        navigator.clipboard.writeText(url).then(() => {
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
      }
    });
  }

  // Post Article Copy Link Button
  const postCopyLinkBtn = document.querySelector(".post-copy-link-btn");
  if (postCopyLinkBtn) {
    postCopyLinkBtn.addEventListener("click", () => {
      const url = postCopyLinkBtn.getAttribute("data-url") || window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        const originalHtml = postCopyLinkBtn.innerHTML;
        postCopyLinkBtn.innerHTML = '<span>LINK COPIED!</span>';
        postCopyLinkBtn.classList.add("bg-[#86efac]");
        setTimeout(() => {
          postCopyLinkBtn.innerHTML = originalHtml;
          postCopyLinkBtn.classList.remove("bg-[#86efac]");
        }, 2000);
      }).catch((err) => console.warn("Failed to copy article link:", err));
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

      // Filter project cards (if more than 4, show top 4 most popular: stars + forks)
      const matchingCards = [];
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

        if (matches) {
          matchingCards.push(card);
        } else {
          card.classList.add("hidden");
        }
      });

      // If category isn't PINNED, sort matching cards by popularity (stars + forks) descending
      if (selectedFilter !== "PINNED") {
        matchingCards.sort((a, b) => {
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
          for (int i = 0; i < 16; i++) {
            float fi = float(i);
            float time = iTime * (fract(fi * 412.531 + 0.513) - 0.5) * 2.0;
            d = opSmoothUnion(
              sdSphere(p + sin(time + fi * vec3(52.5126, 64.62744, 632.25)) * vec3(2.0, 2.0, 0.8), mix(0.5, 1.0, fract(fi * 412.531 + 0.5124))),
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

          for (int i = 0; i < 64; i++) {
            p = rayOri + rayDir * depth;
            float dist = map(p);
            depth += dist;
            if (dist < 1e-6) break;
          }

          vec3 col = vec3(0.0);

          if (depth < 6.0) {
            vec3 normal = calcNormal(p);
            float diffuse = clamp(dot(normal, vec3(0.5, 0.5, 1.0)), 0.0, 1.0);
            col = diffuse * (cos(vec3(1.0, 2.0, 3.0) + p.z * 0.5) * 0.5 + 0.5);
            col = mix(col, vec3(0.0), 1.0 - exp(-0.001 * depth * depth * depth));
          }

          gl_FragColor = vec4(col, 1.0);
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

      const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
      const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

      if (vertexShader && fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
          gl.useProgram(program);

          const positionLocation = gl.getAttribLocation(program, "position");
          const resolutionLocation = gl.getUniformLocation(program, "iResolution");
          const timeLocation = gl.getUniformLocation(program, "iTime");

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

          let isVisible = false;
          let startTime = performance.now();
          let animationFrameId = null;

          function resizeCanvas() {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            const displayWidth = Math.max(1, Math.floor(rect.width * dpr));
            const displayHeight = Math.max(1, Math.floor(rect.height * dpr));

            if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
              canvas.width = displayWidth;
              canvas.height = displayHeight;
              gl.viewport(0, 0, displayWidth, displayHeight);
            }
          }

          function render(now) {
            if (!isVisible) return;

            resizeCanvas();

            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
            gl.uniform1f(timeLocation, (now - startTime) * 0.001);

            gl.drawArrays(gl.TRIANGLES, 0, 6);

            animationFrameId = requestAnimationFrame(render);
          }

          if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
              entries.forEach((entry) => {
                isVisible = entry.isIntersecting;
                if (isVisible) {
                  if (!animationFrameId) {
                    animationFrameId = requestAnimationFrame(render);
                  }
                } else if (animationFrameId) {
                  cancelAnimationFrame(animationFrameId);
                  animationFrameId = null;
                }
              });
            }, { threshold: 0.05 });

            observer.observe(canvas);
          } else {
            isVisible = true;
            requestAnimationFrame(render);
          }
        }
      }
    }
  }

  /* -------------------------------------------------------------------------- */
  /* 8. Code Block Copy Buttons (Shiki Code Fences)                             */
  /* -------------------------------------------------------------------------- */
  document.querySelectorAll(".code-copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const rawCode = decodeURIComponent(btn.getAttribute("data-code") || "");
      navigator.clipboard
        .writeText(rawCode)
        .then(() => {
          const copyText = btn.querySelector(".copy-text");
          if (copyText) {
            const original = copyText.textContent;
            copyText.textContent = "COPIED!";
            btn.classList.add("text-[#86efac]", "border-[#86efac]", "bg-[#1f2937]");
            setTimeout(() => {
              copyText.textContent = original;
              btn.classList.remove("text-[#86efac]", "border-[#86efac]", "bg-[#1f2937]");
            }, 2000);
          }
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
  /* 11. Blog Search & Tag Real-Time Filtering                                  */
  /* -------------------------------------------------------------------------- */
  const searchInput = document.getElementById("blog-search-input");
  const searchClearBtn = document.getElementById("blog-search-clear");
  const tagButtons = document.querySelectorAll(".blog-tag-filter-btn");
  const articleCards = document.querySelectorAll(".blog-post-card");
  const noResultsBox = document.getElementById("blog-no-results");
  const resetFiltersBtn = document.getElementById("blog-reset-filters-btn");

  if (articleCards.length > 0) {
    // If Pagefind static search engine is present, defer to it
    if (window.pagefindBlogSearch || document.querySelector('script[src*="pagefind"]')) return;

    let currentTag = "ALL";
    let currentQuery = "";

    // Parse URL parameter ?tag=... on page load
    const urlParams = new URLSearchParams(window.location.search);
    const initialTag = urlParams.get("tag");
    if (initialTag) {
      currentTag = initialTag.toUpperCase();
      tagButtons.forEach((b) => {
        if ((b.getAttribute("data-tag") || "").toUpperCase() === currentTag) {
          b.classList.add("active", "bg-[#fde047]", "shadow-brutal-xs", "-translate-y-0.5");
          b.classList.remove("bg-[#fffdf9]");
        } else {
          b.classList.remove("active", "bg-[#fde047]", "shadow-brutal-xs", "-translate-y-0.5");
          b.classList.add("bg-[#fffdf9]");
        }
      });
    }

    function applyFilters() {
      let visibleCount = 0;
      const q = currentQuery.toLowerCase().trim();

      articleCards.forEach((card) => {
        const title = card.getAttribute("data-title") || "";
        const summary = card.getAttribute("data-summary") || "";
        const tags = card.getAttribute("data-tags") || "";

        const matchesTag =
          currentTag === "ALL" || tags.toUpperCase().includes(currentTag);

        const matchesQuery =
          !q ||
          title.includes(q) ||
          summary.includes(q) ||
          tags.includes(q);

        if (matchesTag && matchesQuery) {
          card.classList.remove("hidden");
          visibleCount++;
        } else {
          card.classList.add("hidden");
        }
      });

      if (visibleCount === 0) {
        noResultsBox?.classList.remove("hidden");
      } else {
        noResultsBox?.classList.add("hidden");
      }

      if (searchClearBtn) {
        if (q) {
          searchClearBtn.classList.remove("hidden");
        } else {
          searchClearBtn.classList.add("hidden");
        }
      }
    }

    searchInput?.addEventListener("input", (e) => {
      currentQuery = e.target.value;
      applyFilters();
    });

    searchClearBtn?.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      currentQuery = "";
      applyFilters();
    });

    tagButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        tagButtons.forEach((b) => {
          b.classList.remove("active", "bg-[#fde047]", "shadow-brutal-xs", "-translate-y-0.5");
          b.classList.add("bg-[#fffdf9]");
        });
        btn.classList.add("active", "bg-[#fde047]", "shadow-brutal-xs", "-translate-y-0.5");
        btn.classList.remove("bg-[#fffdf9]");

        currentTag = (btn.getAttribute("data-tag") || "ALL").toUpperCase();
        applyFilters();
      });
    });

    resetFiltersBtn?.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      currentQuery = "";
      currentTag = "ALL";
      tagButtons.forEach((b) => {
        if (b.getAttribute("data-tag") === "ALL") {
          b.classList.add("active", "bg-[#fde047]", "shadow-brutal-xs", "-translate-y-0.5");
          b.classList.remove("bg-[#fffdf9]");
        } else {
          b.classList.remove("active", "bg-[#fde047]", "shadow-brutal-xs", "-translate-y-0.5");
          b.classList.add("bg-[#fffdf9]");
        }
      });
      applyFilters();
    });

    if (initialTag) {
      applyFilters();
    }
  }

  /* -------------------------------------------------------------------------- */
  /* 12. Dark / Light Theme Controller (Strictly Scoped to /blog)              */
  /* -------------------------------------------------------------------------- */
  function initThemeController() {
    const path = window.location.pathname;
    const isBlog = path === "/blog" || path.indexOf("/blog/") === 0;

    // Strict scope isolation: Never activate or toggle theme on non-blog pages
    if (!isBlog) {
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.classList.remove("dark");
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute("content", "#f6eedb");
      return;
    }

    const themeToggleBtns = document.querySelectorAll("#theme-toggle-btn");

    function getActiveTheme() {
      return document.documentElement.getAttribute("data-theme") || "light";
    }

    function updateThemeColorMeta(theme) {
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute("content", theme === "dark" ? "#0d1117" : "#f6eedb");
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
