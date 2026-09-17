import markdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import { createHighlighter } from "shiki";
import { githubAlertsPlugin } from "./markdown-alerts.js";

let highlighterPromise = null;

export async function getHighlighterInstance() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark"],
      langs: [
        "go",
        "javascript",
        "typescript",
        "cpp",
        "c",
        "python",
        "bash",
        "sh",
        "json",
        "yaml",
        "yml",
        "html",
        "css",
        "rust",
        "sql",
        "markdown",
        "dockerfile",
        "diff",
        "toml",
        "ini",
        "lua",
      ],
    });
  }
  return highlighterPromise;
}

export async function setupMarkdown() {
  const highlighter = await getHighlighterInstance();
  const loadedLangs = new Set(highlighter.getLoadedLanguages());

  const md = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });

  // 1. Heading anchors for permalinks
  md.use(anchor, {
    permalink: anchor.permalink.headerLink({
      safariReaderFix: true,
      class: "header-anchor",
    }),
  });

  // 2. GitHub Alerts (> [!NOTE], [!TIP], etc.)
  md.use(githubAlertsPlugin);

  // 3. Custom Fence Renderer: Shiki + Mermaid + Copy Button
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const info = token.info ? token.info.trim() : "";
    const lang = info.split(/\s+/)[0].toLowerCase();
    const rawCode = token.content;

    // Handle Mermaid Markdown Diagrams
    if (lang === "mermaid") {
      return `<div class="mermaid-container my-6 p-4 bg-[#fffdf9] border-[3px] border-black shadow-brutal overflow-x-auto">
  <div class="text-xs font-mono font-bold text-black/60 mb-2 pb-1 border-b border-black/10 flex items-center justify-between">
    <div class="flex items-center gap-1.5">
      <span class="w-2 h-2 rounded-full bg-[#f87171] inline-block border border-black"></span>
      <span class="w-2 h-2 rounded-full bg-[#fde047] inline-block border border-black"></span>
      <span class="w-2 h-2 rounded-full bg-[#86efac] inline-block border border-black"></span>
      <span class="ml-1 tracking-wider">DIAGRAM</span>
    </div>
    <span class="text-[11px] font-bold px-1.5 py-0.5 bg-[#fde047] text-black border border-black">MERMAID</span>
  </div>
  <pre class="mermaid flex justify-center text-sm">${md.utils.escapeHtml(rawCode)}</pre>
</div>`;
    }

    // Syntax Highlight with Shiki
    const targetLang = loadedLangs.has(lang) ? lang : "text";
    let highlightedHtml = "";
    try {
      highlightedHtml = highlighter.codeToHtml(rawCode, {
        lang: targetLang,
        theme: "github-dark",
      });
    } catch (e) {
      highlightedHtml = `<pre class="shiki"><code>${md.utils.escapeHtml(rawCode)}</code></pre>`;
    }

    const displayLang = (lang || "TEXT").toUpperCase();
    const encodedCode = encodeURIComponent(rawCode);

    return `<div class="code-block-wrapper my-6 border-[3px] border-black shadow-brutal bg-[#0d1117] overflow-hidden group">
  <div class="code-header flex items-center justify-between px-3 sm:px-4 py-2 bg-[#161b22] border-b-2 border-black text-xs font-mono text-[#e6edf3]">
    <div class="flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-[#f87171] inline-block border border-black"></span>
      <span class="w-2.5 h-2.5 rounded-full bg-[#fde047] inline-block border border-black"></span>
      <span class="w-2.5 h-2.5 rounded-full bg-[#86efac] inline-block border border-black"></span>
      <span class="font-bold tracking-wider text-[11px] text-[#8b949e] ml-1.5">${displayLang}</span>
    </div>
    <button class="code-copy-btn px-2.5 py-1 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white border border-[#30363d] rounded text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer" data-code="${encodedCode}" aria-label="Copy code to clipboard">
      <svg class="w-3.5 h-3.5 copy-icon text-[#8b949e]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
      <span class="copy-text">COPY</span>
    </button>
  </div>
  <div class="code-content overflow-x-auto text-xs sm:text-sm p-4 font-mono leading-relaxed">
    ${highlightedHtml}
  </div>
</div>`;
  };

  return md;
}
