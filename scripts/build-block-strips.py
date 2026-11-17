#!/usr/bin/env python3
"""Render the block design (drawn in temp/block-designer) as ONE image.

Design source: the 16x24 character grid below (exported from
temp/block-designer/index.html). Rendered 1:1 at a uniform scale:
no stretching, no tiling, no resplitting into repeat segments.
Only fully-empty border columns are cropped so the art keeps its
true proportions. Tweak SCALE / the grid later as needed.

Writes public/images/blocks/lush-vines.png   (deployed)
       temp/block-variants/lush-vines-preview.png

'^'-like J cells mix cave_vines_plant_lit / cave_vines_plant 50/50 (seeded).

Run:  python3 scripts/build-block-strips.py
"""
import json
import random
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
TEX = ROOT / "temp/ore-scene-work/textures"
MC = ROOT / "temp/ore-scene-work/mc-blocks"
SRC = TEX / "blocks"
VERSIONS = ROOT / "temp/block-designer/versions"

def latest_design():
    """Newest versions/vN.json the designer exported."""
    import re
    cands = sorted(VERSIONS.glob("v*.json"), key=lambda f: int(re.search(r"v(\d+)", f.name).group(1)))
    return cands[-1]
OUT = ROOT / "public/images/blocks"
PREVIEW = ROOT / "temp/block-variants"

TILE = 16
SCALE = 1         # compose at native 16px tiles; CSS scales up with pixelated rendering

def load_design(path=None):
    path = path or latest_design()
    d = json.loads(path.read_text())
    legend = {}
    for ch, v in d["legend"].items():
        name = Path(v["path"]).stem
        # the berry vine texture mixes lit/plant 50/50 regardless of its letter
        legend[ch] = None if name == "cave_vines_plant_lit" else name
    return d["rows"], legend

def load(name, scale=SCALE):
    side = round(TILE * scale)
    # blocks dir first, then mc-blocks, item textures, and the textures root
    for path in (SRC / f"{name}.png", MC / f"{name}.png",
                 TEX / "item" / f"{name}.png", TEX / f"{name}.png"):
        if path.exists():
            img = Image.open(path).convert("RGBA")
            w, h = img.size
            if h > w and h % w == 0:  # animated flipbook sheet: use the first frame
                img = img.crop((0, 0, w, w))
            return img.resize((side, side), Image.NEAREST)
    raise FileNotFoundError(name)

# bud/cluster textures are drawn tip-up with their base at the bottom.
# default: each is auto-rotated so its base touches an adjacent amethyst block.
# designs with "budMode": "random" instead get a random orientation per crystal,
# plus their interior empty cells are filled with a darker deepslate shade that
# the crystals are drawn over (embedded-cave look).
CRYSTALS = {"amethyst_cluster", "small_amethyst_bud", "medium_amethyst_bud", "large_amethyst_bud"}
BLOCKISH = {"amethyst_block", "budding_amethyst"}
FILL_DARK = {}  # cached darkened deepslate texture

def dark_deepslate():
    if "img" not in FILL_DARK:
        base = load("deepslate")
        px = base.load()
        for y in range(base.height):
            for x in range(base.width):
                r, g, b, a = px[x, y]
                px[x, y] = (int(r * 0.55), int(g * 0.55), int(b * 0.55), a)
        FILL_DARK["img"] = base
    return FILL_DARK["img"]



def render_design(design_path, rng, out_name):
    anim_cells = []  # [{r, c, sheet, frames}] for the site-side CSS ticker
    d = json.loads(design_path.read_text())
    legend = {}
    for ch, v in d["legend"].items():
        name = Path(v["path"]).stem
        # the berry vine texture mixes lit/plant 50/50 regardless of its letter
        legend[ch] = None if name == "cave_vines_plant_lit" else name
    rows = d["rows"]
    bud_random = d.get("budMode") == "random"
    explicit_rot = {tuple(map(int, k.split(","))): v for k, v in (d.get("rotations") or {}).items()}
    do_fill = bud_random or d.get("interiorFill")

    # crop fully-empty border rows and columns (keeps the art's true aspect)
    used_c = [c for c in range(len(rows[0])) if any(r[c] != " " for r in rows)]
    used_r = [r for r in range(len(rows)) if any(ch != " " for ch in rows[r])]
    if not used_c or not used_r:
        print(f"skip {design_path.name}: empty grid")
        return None
    c0, c1 = min(used_c), max(used_c) + 1
    r0, r1 = min(used_r), max(used_r) + 1
    r_orig_rows = list(range(r0, r1))  # original grid row index per cropped row
    rows = rows[r0:r1]

    def solid(rr, cc):
        """True if the cell at the original grid coords is a full amethyst block."""
        return 0 <= rr < len(d["rows"]) and 0 <= cc < len(d["rows"][0]) and (
            Path(d["legend"][d["rows"][rr][cc]]["path"]).stem in BLOCKISH
            if d["rows"][rr][cc] in d["legend"] else False)

    def attach_deg(rr, cc, name):
        """Rotation (deg clockwise) so a crystal's base touches an adjacent block."""
        if name not in CRYSTALS:
            return 0
        # priority: base left (tip right), base down (tip up), base up (tip down), base right
        if solid(rr, cc - 1): return 90
        if solid(rr, cc + 1): return 270
        if solid(rr + 1, cc): return 0
        if solid(rr - 1, cc): return 180
        return 0

    fill_cells = set()
    if do_fill:
        crystal_cells = [(r, c) for r in range(len(rows)) for c in range(len(rows[0]))
                         if rows[r][c] != " " and legend.get(rows[r][c]) in CRYSTALS]
        fill_cells.update(crystal_cells)
        # empty cells touching a crystal (8-neighborhood) are cave interior
        for r, c in crystal_cells:
            for rr in range(r - 1, r + 2):
                for cc in range(c - 1, c + 2):
                    if 0 <= rr < len(rows) and 0 <= cc < len(rows[0]) and rows[rr][cc] == " ":
                        fill_cells.add((rr, cc))

    def key_out_cream(t):
        """Amethyst sprites have baked-in cream sparkle pixels; make them transparent
        so whatever is behind (page, dark interior fill) shows through."""
        px = t.load()
        for y in range(t.height):
            for x in range(t.width):
                if px[x, y] == (255, 253, 213, 255):
                    px[x, y] = (0, 0, 0, 0)
        return t

    frames_by_name = {Path(v["path"]).stem: v.get("frames", 1) for v in d["legend"].values()}

    def cell(ch, r, c_orig):
        if legend.get(ch) is None and ch != " ":
            # mixed berry vine: lit or plain, 50/50, seeded
            return load("cave_vines_plant_lit" if rng.random() < 0.5 else "cave_vines_plant")
        name = legend.get(ch)
        if not name:
            return None
        if frames_by_name.get(name, 1) > 1:
            # animated flipbook: cutout — composite stays transparent here and the
            # site overlays this cell with the full sheet, animated by a ticker
            anim_cells.append({"r": r, "c": c_orig - c0,
                               "sheet": f"{Path(out_name).stem}-{name}.png", "frames": frames_by_name[name]})
            return None
        t = load(name)
        if name in CRYSTALS:
            t = key_out_cream(t)
        if (r, c_orig) in explicit_rot:
            deg = explicit_rot[(r, c_orig)]
        elif name in CRYSTALS and bud_random:
            deg = rng.choice((0, 90, 180, 270))  # buds connect to random sides
        else:
            deg = attach_deg(r_orig_rows[r], c_orig, name)
        if deg == 90:
            t = t.transpose(Image.Transpose.ROTATE_270)
        elif deg == 180:
            t = t.transpose(Image.Transpose.ROTATE_180)
        elif deg == 270:
            t = t.transpose(Image.Transpose.ROTATE_90)
        return t

    CS = round(TILE * SCALE)  # cell size on the canvas; works for fractional scales
    img = Image.new("RGBA", (CS * (c1 - c0), CS * len(rows)), (0, 0, 0, 0))
    for (r, c) in fill_cells:  # dark interior fill under the crystals
        img.paste(dark_deepslate(), (c * CS, r * CS))
    for r, row in enumerate(rows):
        for i, c in enumerate(range(c0, c1)):
            t = cell(row[c], r, c)
            if t is not None:
                img.paste(t, (i * CS, r * CS), t)
    img.save(OUT / out_name, optimize=True)

    # full flipbook sheets for animated cells + a manifest the site can wire up
    if anim_cells:
        sheets = {}
        for ac in anim_cells:
            name = Path(ac["sheet"]).stem.replace(f"{Path(out_name).stem}-", "")
            if name not in sheets:
                img2 = Image.open(SRC / f"{name}.png" if (SRC / f"{name}.png").exists() else MC / f"{name}.png").convert("RGBA")
                w, h = img2.size
                img2 = img2.resize((round(TILE * SCALE), round(TILE * SCALE) * (h // w)), Image.NEAREST)
                img2.save(OUT / ac["sheet"], optimize=True)
                sheets[name] = True
        import json as _json
        (OUT / f"{Path(out_name).stem}-anim.json").write_text(_json.dumps(anim_cells, indent=1))

    sheet = Image.new("RGBA", (img.width + 40, img.height + 40), (243, 231, 204, 255))
    sheet.paste(img, (20, 20), img)
    sheet.save(PREVIEW / f"{Path(out_name).stem}-preview.png")
    print(f"{out_name} {img.size} = {c1-c0} cols x {len(rows)} rows (native {SCALE}x)")
    return img

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    PREVIEW.mkdir(parents=True, exist_ok=True)
    rng = random.Random(5)
    # latest vN.json is the main gutter art; every other design json (sv*, etc.)
    # renders to its own <stem>.png as a standalone decoration
    main_design = latest_design()
    render_design(main_design, rng, "lush-vines.png")
    for extra in sorted(VERSIONS.glob("*.json")):
        if extra.name == main_design.name or extra.name.startswith("v"):
            continue
        render_design(extra, rng, f"{extra.stem}.png")

if __name__ == "__main__":
    main()
