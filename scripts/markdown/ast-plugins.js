/**
 * AST Utilities & Custom Plugins for Markdown Processing
 * (Unified / Remark / Rehype)
 */
import { visit } from "unist-util-visit";

/**
 * Utility: Recursively extract plain text from a HAST node.
 */
export function hastText(node) {
  if (!node) return "";
  if (node.type === "text") return node.value || "";
  if (Array.isArray(node.children)) return node.children.map(hastText).join("");
  return "";
}

/**
 * 1.5 remarkSmallText (Discord-style `-# small muted text`)
 *
 * Only at the start of a line, like `#` / `###`:
 *
 *   -# This whole line becomes small & muted
 *
 * Implemented by splicing raw <span class="md-small"> markers into the MDAST so that
 * rehypeRaw merges them and any inline markdown in the span still renders.
 */
export function remarkSmallText() {
  return (tree) => {
    visit(tree, "paragraph", (node) => {
      const kids = node.children || [];
      if (!kids.length) return;

      const first = kids[0];
      if (first.type === "text") {
        const head = first.value.match(/^[ \t]*-#[ \t]+/);
        if (head) {
          first.value = first.value.slice(head[0].length);
          node.children = [
            { type: "html", value: '<span class="md-small">' },
            ...kids,
            { type: "html", value: "</span>" },
          ];
        }
      }
    });
  };
}

/**
 * 1. rehypeMermaidBlocks
 * Intercepts ```mermaid code fences BEFORE @shikijs/rehype touches them,
 * transforming them into <div class="mermaid-container"><pre class="mermaid">...
 */
export function rehypeMermaidBlocks() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (
        node.tagName === "pre" &&
        node.children?.[0]?.tagName === "code" &&
        node.children[0].properties?.className?.includes("language-mermaid")
      ) {
        const rawCode = hastText(node.children[0]) || "";
        parent.children[index] = {
          type: "element",
          tagName: "div",
          properties: {
            className: ["mermaid-container"],
            dataMermaidCode: encodeURIComponent(rawCode),
          },
          children: [
            {
              type: "element",
              tagName: "pre",
              properties: { className: ["mermaid"] },
              children: [{ type: "text", value: rawCode }],
            },
          ],
        };
      }
    });
  };
}

/**
 * 2. rehypeCodeBlockWrapper
 * Detects Shiki <pre> blocks AND plain (no-language) <pre><code> fences, extracts title
 * from adjacent remark-code-title if present, and wraps each block in .code-block-wrapper.
 * Design: no header bar — a floating copy button in the top-right (revealed on hover)
 * and a small muted lang/filename label in the bottom-right corner.
 */
export function rehypeCodeBlockWrapper() {
  return (tree) => {
    // 1. Unnest any misplaced root nodes in the HAST tree
    function unnestRoots(parent) {
      if (!parent || !Array.isArray(parent.children)) return;
      const flat = [];
      for (const child of parent.children) {
        if (child.type === "root" && Array.isArray(child.children)) {
          flat.push(...child.children);
        } else {
          flat.push(child);
        }
      }
      parent.children = flat;
      for (const child of parent.children) {
        if (child.children) unnestRoots(child);
      }
    }
    unnestRoots(tree);

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }

    const copyBtnSvg =
      '<button class="code-copy-btn" data-code="${CODE}" aria-label="Copy code to clipboard" title="Copy code to clipboard">' +
      // copy icon (shown by default)
      '<svg class="icon-copy" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>' +
      // check icon (shown after copy)
      '<svg class="icon-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>' +
      '</button>';

    // 2. Wrap all code blocks (shiki-highlighted or plain)
    function wrapCodeBlocks(parent) {
      if (!parent || !Array.isArray(parent.children)) return;
      for (let i = 0; i < parent.children.length; i++) {
        const node = parent.children[i];
        if (!node || node.type !== "element" || node.tagName !== "pre") {
          if (node.children) wrapCodeBlocks(node);
          continue;
        }

        // Skip mermaid diagrams (pre.mermaid) — they are interactive diagrams, not code
        if ((node.properties?.className || []).includes?.("mermaid") ||
            (typeof node.properties?.class === "string" && node.properties.class.includes("mermaid"))) {
          continue;
        }

        const codeNode = node.children?.find((c) => c.tagName === "code") || node.children?.[0];
        const isShiki =
          (node.properties?.className || []).includes?.("shiki") ||
          (typeof node.properties?.class === "string" && node.properties.class.includes("shiki"));

        // Only fenced code: shiki pre, or a bare `pre > code` (no-language fence / indented block)
        if (!isShiki && !(codeNode && codeNode.tagName === "code")) continue;

        let title = "";
        let titleIndex = -1;

        // Search backwards for an adjacent remark-code-title
        for (let j = i - 1; j >= 0; j--) {
          const prev = parent.children[j];
          if (prev.type === "text" && !prev.value.trim()) continue;
          if (
            prev.type === "element" &&
            (prev.properties?.className?.includes("remark-code-title") ||
              (typeof prev.properties?.class === "string" &&
                prev.properties.class.includes("remark-code-title")))
          ) {
            title = hastText(prev).trim();
            titleIndex = j;
          }
          break;
        }

        if (titleIndex !== -1) {
          // Remove the title node and any intervening whitespace text nodes
          parent.children.splice(titleIndex, i - titleIndex);
          i = titleIndex; // adjust loop counter to current pre index
        }

        const rawLang = isShiki ? node.properties?.["data-lang"] || node.properties?.dataLang || "" : "";
        const lang = rawLang ? String(rawLang).toUpperCase() : "";

        // Corner label: lang, or lang -title. Omitted entirely for unlabeled blocks.
        let labelHtml = '';
        if (title) {
          labelHtml = `<span class="code-lang">${escapeHtml(lang || "TEXT")}</span><span class="code-sep">·</span><span class="code-filename">${escapeHtml(title)}</span>`;
        } else if (lang) {
          labelHtml = `<span class="code-lang">${escapeHtml(lang)}</span>`;
        }

        const rawCode = hastText(codeNode || node);
        const encodedCode = encodeURIComponent(rawCode);

        parent.children[i] = {
          type: "element",
          tagName: "div",
          properties: { className: ["code-block-wrapper"] },
          children: [
            {
              type: "raw",
              value:
                copyBtnSvg.replace("${CODE}", encodedCode) +
                (labelHtml ? `<span class="code-meta">${labelHtml}</span>` : ""),
            },
            node,
          ],
        };
      }
    }
    wrapCodeBlocks(tree);
  };
}

/**
 * 3. rehypeGithubAlertsTransformer
 * Converts remark-github-alerts blockquote markup into retro neo-brutalist alert callouts.
 */
export function rehypeGithubAlertsTransformer() {
  const alertMeta = {
    "markdown-alert-note":      { title: "NOTE",      border: "#3b82f6", bg: "#eff6ff" },
    "markdown-alert-tip":       { title: "TIP",       border: "#22c55e", bg: "#f0fdf4" },
    "markdown-alert-important": { title: "IMPORTANT", border: "#a855f7", bg: "#faf5ff" },
    "markdown-alert-warning":   { title: "WARNING",   border: "#f59e0b", bg: "#fffbeb" },
    "markdown-alert-caution":   { title: "CAUTION",   border: "#ef4444", bg: "#fef2f2" },
  };
  const icons = {
    "markdown-alert-note":      `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    "markdown-alert-tip":       `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`,
    "markdown-alert-important": `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
    "markdown-alert-warning":   `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
    "markdown-alert-caution":   `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>`,
  };

  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "div") return;
      const classes = node.properties?.className || [];
      if (!classes.includes("markdown-alert")) return;

      const typeClass = classes.find((c) => alertMeta[c]);
      if (!typeClass) return;

      const meta = alertMeta[typeClass];
      const alertType = typeClass.replace("markdown-alert-", "");

      // Strip the auto-generated .markdown-alert-title paragraph (octicon icon)
      const bodyChildren = node.children.filter(
        (c) => !(c.type === "element" && c.properties?.className?.includes?.("markdown-alert-title"))
      );

      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: {
          className: ["github-alert", `github-alert-${alertType}`],
        },
        children: [
          {
            type: "raw",
            value: `<div class="github-alert-title">${icons[typeClass]}<span>${meta.title}</span></div>`,
          },
          ...bodyChildren,
        ],
      };
    });
  };
}

/**
 * 4. rehypeTableWrapper
 * Wraps GFM rendered tables in responsive overflow scroll wrappers.
 */
export function rehypeTableWrapper() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (
        node.tagName === "table" &&
        parent &&
        !(parent.properties?.className?.includes("table-responsive-wrapper"))
      ) {
        parent.children[index] = {
          type: "element",
          tagName: "div",
          properties: { className: ["table-responsive-wrapper"] },
          children: [node],
        };
      }
    });
  };
}

/**
 * 5. rehypeBlockquoteAttribution
 * Formats attribution lines inside editorial blockquotes:
 * If the last paragraph begins with "-- " or "— ", wraps it in a <footer><cite> tag
 * for clean, semantic typography.
 */
export function rehypeBlockquoteAttribution() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "blockquote") return;
      const classes = node.properties?.className || [];
      if (classes.includes("github-alert") || classes.some((c) => String(c).includes("alert"))) return;

      const pChildren = (node.children || []).filter((c) => c.type === "element" && c.tagName === "p");
      if (pChildren.length === 0) return;

      const lastP = pChildren[pChildren.length - 1];
      const text = hastText(lastP).trim();

      // Soft-break attribution: `> quote` newline `> — Author` becomes ONE <p>
      // whose final text node holds "\n— Author". Split it out before the other paths.
      const kids = lastP.children || [];
      const tail = kids[kids.length - 1];
      if (tail && tail.type === "text") {
        const softMatch = tail.value.match(/\n[ \t]*(-{1,2}|—|–)[ \t]+(.+?)[ \t]*$/);
        if (softMatch && tail.value.slice(0, softMatch.index).trim()) {
          tail.value = tail.value.slice(0, softMatch.index).replace(/[ \t]+$/, "");
          const pIndex = node.children.indexOf(lastP);
          node.children.splice(pIndex + 1, 0, {
            type: "element",
            tagName: "footer",
            properties: {},
            children: [
              {
                type: "element",
                tagName: "cite",
                properties: {},
                children: [{ type: "text", value: softMatch[2].trim() }],
              },
            ],
          });
          return;
        }
      }

      // Check if last paragraph has an author attribution, e.g. "- Nobody", "-- Alan Turing", "— Linus Torvalds", or "– En-dash"
      if (/^(\-\-?|—|–)\s+/.test(text)) {
        const cleanAuthor = text.replace(/^(\-\-?|—|–)\s+/, "").trim();
        const pIndex = node.children.indexOf(lastP);
        if (pIndex !== -1) {
          node.children[pIndex] = {
            type: "element",
            tagName: "footer",
            properties: {},
            children: [
              {
                type: "element",
                tagName: "cite",
                properties: {},
                children: [{ type: "text", value: cleanAuthor }],
              },
            ],
          };
        }
      } else {
        // Also support single paragraph where author attribution follows <br>
        // e.g. <p>Quote text<br>-- Author</p>
        const brIdx = lastP.children?.findIndex((c) => c.type === "element" && c.tagName === "br");
        if (brIdx !== -1 && brIdx < lastP.children.length - 1) {
          const afterBrNodes = lastP.children.slice(brIdx + 1);
          const afterText = afterBrNodes.map(hastText).join("").trim();
          if (/^(\-\-?|—|–)\s+/.test(afterText)) {
            const cleanAuthor = afterText.replace(/^(\-\-?|—|–)\s+/, "").trim();
            lastP.children = lastP.children.slice(0, brIdx);
            const pIndex = node.children.indexOf(lastP);
            node.children.splice(pIndex + 1, 0, {
              type: "element",
              tagName: "footer",
              properties: {},
              children: [
                {
                  type: "element",
                  tagName: "cite",
                  properties: {},
                  children: [{ type: "text", value: cleanAuthor }],
                },
              ],
            });
          }
        }
      }
    });
  };
}

/**
 * 6. rehypeBlogRelativeImages
 * Rewrites relative image links (e.g. ./assets/foo.png or assets/foo.png)
 * to root-relative paths under /blogs/... so browsers can resolve them on /blog/<slug>/ pages.
 */
export function rehypeBlogRelativeImages() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "img" && node.properties?.src) {
        let src = String(node.properties.src).trim();
        if (
          !src.startsWith("http://") &&
          !src.startsWith("https://") &&
          !src.startsWith("/") &&
          !src.startsWith("data:")
        ) {
          src = src.replace(/^\.\//, "");
          node.properties.src = `/blogs/${src}`;
        }
      }
    });
  };
}

