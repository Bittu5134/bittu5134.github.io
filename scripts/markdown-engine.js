import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkGithubAlerts from "remark-github-alerts";
import remarkFlexibleCodeTitles from "remark-flexible-code-titles";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeShiki from "@shikijs/rehype";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";
import rehypeFigure from "@microflash/rehype-figure";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";

// ─── 1. Custom rehype plugin: mermaid code fences → div.mermaid-container ─────
// Must run BEFORE @shikijs/rehype so Shiki never sees mermaid blocks.
function rehypeMermaidBlocks() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (
        node.tagName === "pre" &&
        node.children?.[0]?.tagName === "code" &&
        node.children[0].properties?.className?.includes("language-mermaid")
      ) {
        const rawCode = node.children[0].children?.[0]?.value || "";
        parent.children[index] = {
          type: "element",
          tagName: "div",
          properties: { className: ["mermaid-container"] },
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

// ─── 2. Utility: recursively extract text from a HAST node ────────────────────
function hastText(node) {
  if (!node) return "";
  if (node.type === "text") return node.value || "";
  if (Array.isArray(node.children)) return node.children.map(hastText).join("");
  return "";
}

// ─── 3. Custom rehype plugin: wrap Shiki <pre> in .code-block-wrapper ─────────
// remark-flexible-code-titles (with container: false) emits a <div class="remark-code-title">
// followed by the code block. @shikijs/rehype highlights the code block.
// This plugin:
//  a) Unnests any sub-root fragments inserted by third-party rehype plugins.
//  b) Detects any Shiki <pre> block.
//  c) Checks if the immediately preceding sibling is a remark-code-title, extracts the title,
//     and removes the redundant title element.
//  d) Wraps the <pre> in .code-block-wrapper with header, badge, and copy button.
function rehypeCodeBlockWrapper() {
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

    // 2. Wrap all Shiki pre blocks
    function wrapCodeBlocks(parent) {
      if (!parent || !Array.isArray(parent.children)) return;
      for (let i = 0; i < parent.children.length; i++) {
        const node = parent.children[i];
        const isShikiPre =
          node &&
          node.type === "element" &&
          node.tagName === "pre" &&
          (node.properties?.className?.includes("shiki") ||
            (typeof node.properties?.class === "string" && node.properties.class.includes("shiki")));

        if (isShikiPre) {
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

          const rawLang = node.properties?.["data-lang"] || node.properties?.dataLang || "";
          const lang = rawLang ? String(rawLang).toUpperCase() : "TEXT";
          const displayLabel = title ? `${lang} · ${title}` : lang;

          const codeNode = node.children?.find((c) => c.tagName === "code") || node.children?.[0];
          const rawCode = hastText(codeNode || node);
          const encodedCode = encodeURIComponent(rawCode);

          parent.children[i] = {
            type: "element",
            tagName: "div",
            properties: { className: ["code-block-wrapper"] },
            children: [
              {
                type: "raw",
                value: `<div class="code-header"><span class="lang-badge">${displayLabel}</span><button class="code-copy-btn" data-code="${encodedCode}" aria-label="Copy code to clipboard"><svg class="w-3.5 h-3.5 copy-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg><span class="copy-text">COPY</span></button></div><div class="code-content">`,
              },
              node,
              { type: "raw", value: `</div>` },
            ],
          };
        } else if (node.children) {
          wrapCodeBlocks(node);
        }
      }
    }
    wrapCodeBlocks(tree);
  };
}

// ─── 4. Custom rehype plugin: restyle markdown-alert divs → our github-alert ───
function rehypeGithubAlertsTransformer() {
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

      // Strip the auto-generated .markdown-alert-title paragraph (octicon icon)
      const bodyChildren = node.children.filter(
        (c) => !(c.type === "element" && c.properties?.className?.includes?.("markdown-alert-title"))
      );

      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: {
          className: ["github-alert"],
          style: `background-color:${meta.bg};border-left:4px solid ${meta.border};`,
        },
        children: [
          {
            type: "raw",
            value: `<div class="github-alert-title" style="color:${meta.border};">${icons[typeClass]}<span>${meta.title}</span></div>`,
          },
          {
            type: "element",
            tagName: "div",
            properties: { className: ["github-alert-body"] },
            children: bodyChildren,
          },
        ],
      };
    });
  };
}

// ─── 5. Build and cache the processor ────────────────────────────────────────
let processorCache = null;

async function buildProcessor() {
  return unified()
    // ── Remark (Markdown → MDAST) ──────────────────────────
    .use(remarkParse)
    .use(remarkGfm)                          // Tables, task lists, strikethrough, footnotes
    .use(remarkMath)                         // $inline$ and $$block$$ LaTeX
    .use(remarkGithubAlerts)                 // > [!TYPE] → blockquote[data-alert]
    .use(remarkFlexibleCodeTitles, { container: false }) // lang:title.ext syntax without wrapping container
    // ── Bridge (MDAST → HAST) ──────────────────────────────
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)                          // pass raw inline HTML through
    // ── Rehype (HAST → HTML) ───────────────────────────────
    .use(rehypeMermaidBlocks)                // intercept mermaid fences BEFORE Shiki
    .use(rehypeSlug)                         // add id= to headings
    .use(rehypeShiki, {
      theme: "github-dark",
      langs: [
        "go", "javascript", "typescript", "tsx", "jsx",
        "cpp", "c", "python", "bash", "sh", "zsh",
        "json", "yaml", "html", "css", "scss",
        "rust", "sql", "markdown", "dockerfile", "diff",
        "toml", "ini", "lua", "java", "kotlin",
        "swift", "php", "ruby", "haskell", "nix", "regex",
      ],
      transformers: [
        {
          name: "record-lang",
          pre(node) {
            node.properties["data-lang"] = this.options.lang;
          },
        },
      ],
    })
    .use(rehypeCodeBlockWrapper)             // wrap shiki <pre> in .code-block-wrapper
    .use(rehypeGithubAlertsTransformer)      // convert alert blockquotes → styled divs
    .use(rehypeKatex)                        // render math nodes → KaTeX HTML
    .use(rehypeExternalLinks, {
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    })
    .use(rehypeFigure, { className: "prose-figure" })
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: { className: ["header-anchor"] },
    })
    .use(rehypeStringify, { allowDangerousHtml: true });
}

export async function getProcessor() {
  if (!processorCache) processorCache = await buildProcessor();
  return processorCache;
}

/**
 * Returns an object with a render(src) method suitable for
 * eleventyConfig.setLibrary("md", ...) — same interface as markdown-it.
 */
export async function setupMarkdown() {
  const processor = await getProcessor();
  return {
    render(src) {
      return processor.process(src).then((file) => String(file));
    },
  };
}
