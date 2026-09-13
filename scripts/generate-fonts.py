#!/usr/bin/env python3
"""
scripts/generate-fonts.py
Automated micro-subset font generator for 11ty static builds.

Scans all source templates, markdown blog posts, JSON data files, and scripts
for rendered Unicode characters, and generates micro-subsetted WOFF2 font files
using pyftsubset on every build.
"""

import glob
import os
import re
import shutil
import subprocess
import sys
import tempfile

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(PROJECT_ROOT, "src")
MASTERS_DIR = os.path.join(PROJECT_ROOT, "scripts", "font-masters")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "public", "fonts")

# Fonts to process: (Master filename, Output filename, Is Italic Only)
FONT_TARGETS = [
    ("SpaceGrotesk.woff2", "SpaceGrotesk-Variable.woff2", False),
    ("SpaceMono-Regular.woff2", "SpaceMono-Regular.woff2", False),
    ("SpaceMono-Bold.woff2", "SpaceMono-Bold.woff2", False),
    ("SpaceMono-Italic.woff2", "SpaceMono-Italic.woff2", True),
]


def extract_characters():
    """Extracts all unique unicode characters rendered across the site."""
    site_chars = set()
    italic_chars = set()

    # Always guarantee standard ASCII printable characters (0x20 - 0x7E)
    for code in range(32, 127):
        site_chars.add(chr(code))
        italic_chars.add(chr(code))

    # Scan all source files
    patterns = [
        os.path.join(SRC_DIR, "**", "*.njk"),
        os.path.join(SRC_DIR, "**", "*.html"),
        os.path.join(SRC_DIR, "**", "*.md"),
        os.path.join(SRC_DIR, "**", "*.json"),
        os.path.join(SRC_DIR, "**", "*.js"),
    ]

    for pattern in patterns:
        for filepath in glob.glob(pattern, recursive=True):
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()

                # Add all printable characters to site set
                for char in content:
                    if ord(char) >= 32:
                        site_chars.add(char)

                # Specifically inspect for italic contexts
                # 1. Markdown *text* or _text_
                for m in re.finditer(r"(?<!\*)\*([^*]+)\*(?!\*)|(?<!_)_([^_]+)_(?!_)", content):
                    matched = m.group(1) or m.group(2)
                    for char in matched:
                        if ord(char) >= 32:
                            italic_chars.add(char)

                # 2. HTML <em>...</em> or <i>...</i>
                for m in re.finditer(r"<(?:em|i)[^>]*>(.*?)</(?:em|i)>", content, re.DOTALL):
                    matched = m.group(1)
                    for char in matched:
                        if ord(char) >= 32:
                            italic_chars.add(char)

            except Exception as e:
                print(f"[font-gen] Warning: Could not read {filepath}: {e}", file=sys.stderr)

    return site_chars, italic_chars


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
            "--layout-features=*",
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

    print("[font-gen] Scanning source files for rendered unicode characters...")
    site_chars, italic_chars = extract_characters()

    site_unicodes = sorted([f"U+{ord(c):04X}" for c in site_chars])
    italic_unicodes = sorted([f"U+{ord(c):04X}" for c in italic_chars])

    print(f"[font-gen] Found {len(site_unicodes)} unique site glyphs, {len(italic_unicodes)} italic glyphs.")

    total_orig = 0
    total_opt = 0

    for master_name, out_name, is_italic in FONT_TARGETS:
        master_path = os.path.join(MASTERS_DIR, master_name)
        out_path = os.path.join(OUTPUT_DIR, out_name)

        if not os.path.exists(master_path):
            print(f"[font-gen] Error: Master font not found: {master_path}", file=sys.stderr)
            sys.exit(1)

        unicodes = italic_unicodes if is_italic else site_unicodes
        subset_font(master_path, out_path, unicodes)

        orig_size = os.path.getsize(master_path)
        opt_size = os.path.getsize(out_path)
        total_orig += orig_size
        total_opt += opt_size

        saved_pct = ((orig_size - opt_size) / orig_size) * 100
        print(f"  ✓ {out_name:28} {orig_size / 1024:5.1f} KB -> {opt_size / 1024:4.1f} KB (-{saved_pct:.1f}%)")

    total_saved = ((total_orig - total_opt) / total_orig) * 100
    print(f"[font-gen] Done! Total fonts: {total_orig / 1024:.1f} KB -> {total_opt / 1024:.1f} KB (-{total_saved:.1f}%)")


if __name__ == "__main__":
    main()
