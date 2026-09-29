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

// Custom AST processors modularized cleanly
import {
  rehypeMermaidBlocks,
  rehypeCodeBlockWrapper,
  rehypeGithubAlertsTransformer,
  rehypeTableWrapper,
  rehypeBlogRelativeImages,
} from "./markdown/ast-plugins.js";

let processorCache = null;

export async function buildProcessor() {
  return unified()
    // ── Remark (Markdown → MDAST) ──────────────────────────
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkGithubAlerts)                 // GitHub alerts syntax > [!NOTE]
    .use(remarkFlexibleCodeTitles, { container: false }) // lang:title.ext syntax without wrapping container
    // ── Bridge (MDAST → HAST) ──────────────────────────────
    .use(remarkRehype, { allowDangerousHtml: true, clobberPrefix: "" })
    .use(rehypeRaw)                          // pass raw inline HTML through
    // ── Rehype (HAST → HTML) ───────────────────────────────
    .use(rehypeMermaidBlocks)                // intercept mermaid fences BEFORE Shiki
    .use(rehypeSlug)                         // add id= to headings
    .use(rehypeShiki, {
      theme: "catppuccin-mocha",
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
    .use(rehypeTableWrapper)                 // wrap <table> in .table-responsive-wrapper
    .use(rehypeBlogRelativeImages)           // rewrite relative blog image links (./assets/...) to /blogs/...
    .use(rehypeKatex)                        // render math nodes → KaTeX HTML
    .use(rehypeExternalLinks, {
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    })
    .use(rehypeFigure, { className: "prose-figure" })
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: { className: ["header-anchor"] },
      test: (node) => node.properties?.id !== "footnote-label",
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
