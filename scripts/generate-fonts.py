#!/usr/bin/env python3
"""
scripts/generate-fonts.py
Automated micro-subset font generator for 11ty static builds.

Character-set strategy:
  1. Guaranteed base: printable ASCII (a-zA-Z0-9, punctuation, space) so any
     future content or dynamic string can never hit a missing glyph for the
     common case.
  2. Rendered text from the BUILT site (dist/) — actual visible text nodes,
     not template/JS source code — plus string values from the client-rendered
     JSON data files, plus string literals from public/assets/js/*.js (for
     dynamically generated cards, cassette UI, etc.).
  3. Fallback when dist/ is absent (fresh clone / dev server): scan source
     templates and markdown directly (over-inclusive, fine for dev).

Subsetting: pyftsubset with calt/locl/frac etc. dropped (kept: ccmp, liga,
kern). Playpen Sans uses contextual alternates to vary glyphs per letter —
with them kept, closure over the feature tables pulls ~5x the glyphs
(~62 KB vs ~13 KB per weight). We keep the simpler handwriting texture.

Build-order note: in production (`npm run build`) this runs AFTER eleventy,
so dist/ holds the final rendered HTML. Outputs are written to
public/assets/fonts (repo source of truth) and copied into dist/assets/fonts
(because the eleventy passthrough already copied the previous versions).
"""

import glob
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from html.parser import HTMLParser

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(PROJECT_ROOT, "src")
BLOGS_DIR = os.path.join(PROJECT_ROOT, "blogs")
DIST_DIR = os.path.join(PROJECT_ROOT, "dist")
PUBLIC_JS_DIR = os.path.join(PROJECT_ROOT, "public", "assets", "js")
MASTERS_DIR = os.path.join(PROJECT_ROOT, "fonts", "masters")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "public", "assets", "fonts")
DIST_FONTS_DIR = os.path.join(DIST_DIR, "assets", "fonts")

# Fonts to process: (Master filename, Output filename)
# Space Grotesk was dropped: posts now use Playpen Sans for prose, so it was a
# third family for one page type. Restore it here (and the @font-face in
# blog.css) if posts ever get their own body face again.
FONT_TARGETS = [
    # Space Mono is bold-only: the design uses it as a data/code voice at 700,
    # and the 400 cut was only ever used by code blocks (now 700 too).
    ("SpaceMono-Bold.woff2", "SpaceMono-Bold.woff2"),
    ("PlaypenSans-400.woff2", "PlaypenSans-Regular.woff2"),
    ("PlaypenSans-700.woff2", "PlaypenSans-Bold.woff2"),
    ("PlaypenSans-800.woff2", "PlaypenSans-ExtraBold.woff2"),
]

# SpaceMono-Italic was dropped: audit found zero italic mono contexts
# (no em>code, no italic blockquote code) anywhere in the site.
# Restore here + its @font-face in src/index.css if ever needed.


class _VisibleTextParser(HTMLParser):
    """Collects text nodes the way a browser would render them."""

    SKIP_TAGS = {"script", "style", "noscript", "template", "head"}

    def __init__(self):
        # convert_charrefs=True resolves &amp; etc. into real characters,
        # exactly what ends up rendered on screen.
        super().__init__(convert_charrefs=True)
        self.chunks = []
        self._skip = 0

    def handle_starttag(self, tag, attrs):
        if tag in self.SKIP_TAGS:
            self._skip += 1

    def handle_endtag(self, tag):
        if tag in self.SKIP_TAGS and self._skip:
            self._skip -= 1

    def handle_data(self, data):
        if not self._skip:
            self.chunks.append(data)


def _chars_from_dist_text(out):
    """Visible text nodes from every built HTML page."""
    count = 0
    for filepath in glob.glob(os.path.join(DIST_DIR, "**", "*.html"), recursive=True):
        try:
            parser = _VisibleTextParser()
            with open(filepath, "r", encoding="utf-8") as f:
                parser.feed(f.read())
            for chunk in parser.chunks:
                for ch in chunk:
                    if not ch.isspace():
                        out.add(ch)
            count += 1
        except Exception as e:
            print(f"[font-gen] Warning: could not parse {filepath}: {e}", file=sys.stderr)
    return count


def _chars_from_dist_json(out):
    """String values of client-fetched JSON (e.g. non-pinned project cards)."""
    count = 0
    for filepath in glob.glob(os.path.join(DIST_DIR, "assets", "data", "**", "*.json"), recursive=True):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
            stack = [data]
            while stack:
                item = stack.pop()
                if isinstance(item, str):
                    for ch in item:
                        if not ch.isspace():
                            out.add(ch)
                elif isinstance(item, dict):
                    stack.extend(item.values())
                elif isinstance(item, list):
                    stack.extend(item)
            count += 1
        except Exception as e:
            print(f"[font-gen] Warning: could not parse {filepath}: {e}", file=sys.stderr)
    return count


def _chars_from_js_literals(out):
    """String literals in shipped JS — covers text injected at runtime
    (project card markup, cassette player symbols, UI labels)."""
    count = 0
    pattern = re.compile(
        r'"((?:[^"\\\n]|\\.)*)"|\'((?:[^\'\\\n]|\\.)*)\'|`((?:[^`\\]|\\.)*)`'
    )
    for js_dir in (PUBLIC_JS_DIR,):
        for filepath in glob.glob(os.path.join(js_dir, "*.js")):
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                for m in pattern.finditer(content):
                    literal = next(g for g in m.groups() if g is not None)
                    # Decode \uXXXX / \xXX escapes so hidden non-ASCII isn't missed.
                    literal = re.sub(
                        r"\\u([0-9a-fA-F]{4})",
                        lambda mm: chr(int(mm.group(1), 16)),
                        literal,
                    )
                    literal = re.sub(
                        r"\\x([0-9a-fA-F]{2})",
                        lambda mm: chr(int(mm.group(1), 16)),
                        literal,
                    )
                    for ch in literal:
                        if not ch.isspace() and ord(ch) >= 32:
                            out.add(ch)
                count += 1
            except Exception as e:
                print(f"[font-gen] Warning: could not read {filepath}: {e}", file=sys.stderr)
    return count


def _chars_from_source_fallback(out):
    """Dev fallback: raw source scan (over-inclusive on purpose)."""
    count = 0
    patterns = [
        os.path.join(SRC_DIR, "**", "*.njk"),
        os.path.join(SRC_DIR, "**", "*.html"),
        os.path.join(SRC_DIR, "**", "*.md"),
        os.path.join(SRC_DIR, "**", "*.json"),
        os.path.join(SRC_DIR, "**", "*.js"),
        os.path.join(BLOGS_DIR, "**", "*.md"),
        os.path.join(BLOGS_DIR, "**", "*.json"),
    ]
    for pattern in patterns:
        for filepath in glob.glob(pattern, recursive=True):
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                for char in content:
                    if ord(char) >= 32:
                        out.add(char)
                count += 1
            except Exception as e:
                print(f"[font-gen] Warning: Could not read {filepath}: {e}", file=sys.stderr)
    return count


def extract_characters():
    """Builds the subset character set."""
    chars = set()
    # 1. Guaranteed base: printable ASCII (a-zA-Z0-9 + punctuation).
    for code in range(32, 127):
        chars.add(chr(code))

    # 2. Rendered text, when a built dist is available (production build).
    if os.path.isdir(DIST_DIR) and glob.glob(os.path.join(DIST_DIR, "**", "*.html"), recursive=True):
        html_n = _chars_from_dist_text(chars)
        json_n = _chars_from_dist_json(chars)
        js_n = _chars_from_js_literals(chars)
        print(f"[font-gen] Rendered scan: {html_n} pages, {json_n} JSON data files, {js_n} JS bundles")
    else:
        # 3. Fallback for dev / fresh clones: scan sources directly.
        n = _chars_from_source_fallback(chars)
        print(f"[font-gen] No dist/ HTML found — source fallback scan ({n} files)")

    return chars


def subset_font(master_path, output_path, unicodes):
    """Runs pyftsubset to generate an optimized WOFF2 font."""
    unicodes_str = ",".join(unicodes)
    with tempfile.NamedTemporaryFile("w", delete=False, encoding="utf-8") as tf:
        tf.write(unicodes_str)
        tf_path = tf.name

    try:
        cmd = [
            "pyftsubset",
            master_path,
            f"--unicodes-file={tf_path}",
            "--flavor=woff2",
            "--no-hinting",
            "--desubroutinize",
            # Keep composition, standard ligatures and kerning; drop calt/locl/
            # frac etc. whose closure multiplies the glyph set ~5x for Playpen.
            "--layout-features=ccmp,liga,kern",
            f"--output-file={output_path}",
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            raise RuntimeError(f"pyftsubset failed: {res.stderr}")
    finally:
        if os.path.exists(tf_path):
            os.remove(tf_path)


def main():
    if not shutil.which("pyftsubset"):
        print("[font-gen] Error: 'pyftsubset' not found in PATH.", file=sys.stderr)
        sys.exit(1)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("[font-gen] Extracting rendered character set...")
    chars = extract_characters()
    unicodes = sorted([f"U+{ord(c):04X}" for c in chars])
    print(f"[font-gen] Subset covers {len(unicodes)} codepoints (base ASCII + rendered text).")

    total_orig = 0
    total_opt = 0

    for master_name, out_name in FONT_TARGETS:
        master_path = os.path.join(MASTERS_DIR, master_name)
        out_path = os.path.join(OUTPUT_DIR, out_name)

        if not os.path.exists(master_path):
            print(f"[font-gen] Error: Master font not found: {master_path}", file=sys.stderr)
            sys.exit(1)

        subset_font(master_path, out_path, unicodes)

        orig_size = os.path.getsize(master_path)
        opt_size = os.path.getsize(out_path)
        total_orig += orig_size
        total_opt += opt_size

        saved_pct = ((orig_size - opt_size) / orig_size) * 100
        print(f"  ✓ {out_name:28} {orig_size / 1024:5.1f} KB -> {opt_size / 1024:4.1f} KB (-{saved_pct:.1f}%)")

        # Production build runs this AFTER eleventy, so the passthrough already
        # copied stale fonts into dist/ — refresh the copies.
        if os.path.isdir(DIST_DIR):
            os.makedirs(DIST_FONTS_DIR, exist_ok=True)
            shutil.copy2(out_path, os.path.join(DIST_FONTS_DIR, out_name))

    total_saved = ((total_orig - total_opt) / total_orig) * 100
    print(f"[font-gen] Done! Total fonts: {total_orig / 1024:.1f} KB -> {total_opt / 1024:.1f} KB (-{total_saved:.1f}%)")


if __name__ == "__main__":
    main()
