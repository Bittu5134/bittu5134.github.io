#!/usr/bin/env python3
"""Render the deployed block scenes and their animated WebP overlays.

No atlases. Each scene is a normal PNG with static blocks baked in and animated
cells left transparent. Each animated block gets its own 16x16 lossless WebP;
the site overlays that WebP on the matching cells.
"""
from __future__ import annotations

import json
import random
import re
import shutil
import subprocess
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
VERSIONS = ROOT / "temp/designer/versions"
OUT = ROOT / "public/assets/images/scenes"
PREVIEW = ROOT / "temp/renders"
TEX = ROOT / "temp/ore-scene-work/textures"
MC = ROOT / "temp/ore-scene-work/mc-blocks"
SRC = TEX / "blocks"

TILE = 16
FRAME_MS = 130
ANIM_WEBP_NAMES = {
    "nether_portal": "portal.webp",
    "lava_flow": "lava.webp",
    "soul_campfire_fire": "fire.webp",
}

CRYSTALS = {
    "amethyst_cluster",
    "small_amethyst_bud",
    "medium_amethyst_bud",
    "large_amethyst_bud",
}
BLOCKISH = {"amethyst_block", "budding_amethyst"}
FILL_DARK: dict[str, Image.Image] = {}

# Deployed scenes: output name -> designer export. None means newest v*.json.
SCENES = {
    "vines": None,
    "geode": "sv6.json",
    "portal": "sv7.json",
    "cherry-tree": "sv8.json",
}


def latest_design() -> Path:
    candidates = sorted(
        VERSIONS.glob("v*.json"),
        key=lambda p: int(re.search(r"v(\d+)", p.stem).group(1)),
    )
    if not candidates:
        raise FileNotFoundError(f"no v*.json in {VERSIONS}")
    return candidates[-1]


def load_source(name: str) -> Image.Image:
    for path in (
        SRC / f"{name}.png",
        MC / f"{name}.png",
        TEX / "item" / f"{name}.png",
        TEX / f"{name}.png",
    ):
        if path.exists():
            return Image.open(path).convert("RGBA")
    raise FileNotFoundError(name)


def load(name: str) -> Image.Image:
    """A single 16x16 tile; animated sheets use their first frame."""
    img = load_source(name)
    w, h = img.size
    if h > w and h % w == 0:
        img = img.crop((0, 0, w, w))
    return img.resize((TILE, TILE), Image.NEAREST)


def dark_deepslate() -> Image.Image:
    if "img" not in FILL_DARK:
        img = load("deepslate")
        px = img.load()
        for y in range(img.height):
            for x in range(img.width):
                r, g, b, a = px[x, y]
                px[x, y] = (int(r * 0.55), int(g * 0.55), int(b * 0.55), a)
        FILL_DARK["img"] = img
    return FILL_DARK["img"]


def make_animated_webp(name: str, frames: int, out_name: str) -> None:
    img = load_source(name)
    w, h = img.size
    if w * frames != h:
        raise ValueError(f"{name}: expected {frames} frames, source is {w}x{h}")

    frame_dir = ROOT / "temp/anim-frames" / Path(out_name).stem
    if frame_dir.exists():
        shutil.rmtree(frame_dir)
    frame_dir.mkdir(parents=True)

    for i in range(frames):
        frame = img.crop((0, i * w, w, (i + 1) * w)).resize(
            (TILE, TILE), Image.NEAREST
        )
        frame.save(frame_dir / f"frame-{i:03d}.png")

    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-framerate",
            f"1000/{FRAME_MS}",
            "-i",
            str(frame_dir / "frame-%03d.png"),
            "-c:v",
            "libwebp_anim",
            "-lossless",
            "1",
            "-loop",
            "0",
            "-pix_fmt",
            "rgba",
            str(OUT / out_name),
        ],
        check=True,
    )
    shutil.rmtree(frame_dir)


def render_design(design_path: Path, rng: random.Random, out_name: str) -> None:
    design = json.loads(design_path.read_text())
    rows = design["rows"]
    legend = {
        ch: Path(entry["path"]).stem for ch, entry in design["legend"].items()
    }
    bud_random = design.get("budMode") == "random"
    explicit_rot = {
        tuple(map(int, key.split(","))): value
        for key, value in (design.get("rotations") or {}).items()
    }
    do_fill = bud_random or design.get("interiorFill")

    used_c = [c for c in range(len(rows[0])) if any(r[c] != " " for r in rows)]
    used_r = [r for r in range(len(rows)) if any(ch != " " for ch in rows[r])]
    if not used_c or not used_r:
        print(f"skip {design_path.name}: empty grid")
        return

    c0, c1 = min(used_c), max(used_c) + 1
    r0, r1 = min(used_r), max(used_r) + 1
    r_orig_rows = list(range(r0, r1))
    rows = rows[r0:r1]

    def solid(rr: int, cc: int) -> bool:
        if 0 <= rr < len(design["rows"]) and 0 <= cc < len(design["rows"][0]):
            return legend.get(design["rows"][rr][cc]) in BLOCKISH
        return False

    def attach_deg(rr: int, cc: int, name: str) -> int:
        """Rotate a crystal so its base touches an adjacent block."""
        if name not in CRYSTALS:
            return 0
        if solid(rr, cc - 1):
            return 90
        if solid(rr, cc + 1):
            return 270
        if solid(rr + 1, cc):
            return 0
        if solid(rr - 1, cc):
            return 180
        return 0

    fill_cells: set[tuple[int, int]] = set()
    if do_fill:
        crystal_cells = [
            (r, c)
            for r in range(len(rows))
            for c in range(len(rows[0]))
            if legend.get(rows[r][c]) in CRYSTALS
        ]
        fill_cells.update(crystal_cells)
        for r, c in crystal_cells:
            for rr in range(r - 1, r + 2):
                for cc in range(c - 1, c + 2):
                    if (
                        0 <= rr < len(rows)
                        and 0 <= cc < len(rows[0])
                        and rows[rr][cc] == " "
                    ):
                        fill_cells.add((rr, cc))

    frames_by_name = {
        Path(v["path"]).stem: int(v.get("frames", 1))
        for v in design["legend"].values()
    }

    anim_cells: list[dict[str, str | int]] = []
    anim_sheets: dict[str, str] = {}

    def cell(ch: str, r: int, c_orig: int) -> Image.Image | None:
        if ch == " ":
            return None
        if ch not in legend:
            raise KeyError(f"{design_path.name}: unknown design character {ch!r}")

        name = legend[ch]
        if name == "cave_vines_plant_lit":
            name = (
                "cave_vines_plant_lit"
                if rng.random() < 0.5
                else "cave_vines_plant"
            )

        if frames_by_name.get(name, 1) > 1:
            sheet = ANIM_WEBP_NAMES.get(
                name, name.replace("_", "-") + ".webp"
            )
            anim_sheets[sheet] = name
            anim_cells.append({"r": r, "c": c_orig - c0, "sheet": sheet})
            return None

        tile = load(name)
        if (r_orig_rows[r], c_orig) in explicit_rot:
            deg = explicit_rot[(r_orig_rows[r], c_orig)]
        elif name in CRYSTALS and bud_random:
            deg = rng.choice((0, 90, 180, 270))
        else:
            deg = attach_deg(r_orig_rows[r], c_orig, name)

        if deg == 90:
            tile = tile.transpose(Image.Transpose.ROTATE_270)
        elif deg == 180:
            tile = tile.transpose(Image.Transpose.ROTATE_180)
        elif deg == 270:
            tile = tile.transpose(Image.Transpose.ROTATE_90)
        return tile

    img = Image.new("RGBA", (TILE * (c1 - c0), TILE * len(rows)), (0, 0, 0, 0))
    for r, c in fill_cells:
        img.paste(dark_deepslate(), (c * TILE, r * TILE))
    for r, row in enumerate(rows):
        for i, c in enumerate(range(c0, c1)):
            block = cell(row[c], r, c)
            if block is not None:
                img.paste(block, (i * TILE, r * TILE), block)

    img.save(OUT / out_name, optimize=True)

    stem = Path(out_name).stem
    if anim_cells:
        for sheet, name in anim_sheets.items():
            make_animated_webp(name, frames_by_name[name], sheet)
        (OUT / f"{stem}-anim.json").write_text(
            json.dumps(
                {
                    "sceneCols": c1 - c0,
                    "sceneRows": len(rows),
                    "cells": anim_cells,
                },
                indent=1,
            )
        )
    else:
        (OUT / f"{stem}-anim.json").unlink(missing_ok=True)

    # Preview only: fill animated cells with the first source frame.
    preview = img.copy()
    for anim in anim_cells:
        source = load_source(anim_sheets[anim["sheet"]])
        frame = source.crop((0, 0, source.width, source.width)).resize(
            (TILE, TILE), Image.NEAREST
        )
        preview.paste(
            frame,
            (anim["c"] * TILE, anim["r"] * TILE),
            frame,
        )

    sheet = Image.new(
        "RGBA",
        (preview.width + 40, preview.height + 40),
        (243, 231, 204, 255),
    )
    sheet.paste(preview, (20, 20), preview)
    sheet.save(PREVIEW / f"{stem}-preview.png")

    print(
        f"{out_name}: {img.width}x{img.height}, "
        f"{len(anim_cells)} animated cells"
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    PREVIEW.mkdir(parents=True, exist_ok=True)

    latest = latest_design()
    rng = random.Random(2025)

    for out_name, spec in SCENES.items():
        design_path = latest if spec is None else VERSIONS / spec
        if not design_path.exists():
            raise FileNotFoundError(design_path)
        render_design(design_path, rng, f"{out_name}.png")


if __name__ == "__main__":
    main()
