#!/usr/bin/env python3
"""Textures for the /woa:list window (ui/xvoid_list.json).

Writes small nine-slice images to RP/textures/ui/xvoid/list/ and, with
--preview FILE, a rough mock-up of the window built from them.

    python tools/fx/gen_list_ui.py [--preview out.png]

Needs pillow.
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "Wheel of Adaptation RP" / "textures" / "ui" / "xvoid" / "list"

INK = (11, 10, 14)
BG = (24, 21, 30)
BG_HI = (34, 30, 42)
GOLD = (242, 196, 58)
GOLD_DARK = (158, 102, 24)
EDGE = (58, 52, 72)
PALE = (250, 242, 224)
DIM = (128, 122, 148)


def rgba(colour, alpha=255):
    return (*colour, alpha)


def rings(size, fill, *borders):
    """A square of `fill` with one-pixel borders, outermost first."""
    img = Image.new("RGBA", (size, size), fill)
    draw = ImageDraw.Draw(img)
    for i, colour in enumerate(borders):
        if colour is not None:
            draw.rectangle([i, i, size - 1 - i, size - 1 - i], outline=colour)
    return img


def panel():
    img = rings(16, rgba(BG, 244), rgba(INK, 248), rgba(GOLD_DARK), rgba(BG_HI, 244))
    for x, y in [(1, 1), (2, 1), (1, 2)]:
        for fx in (x, 15 - x):
            for fy in (y, 15 - y):
                img.putpixel((fx, fy), rgba(GOLD))
    return img


def title():
    img = rings(16, rgba((30, 28, 36), 250), rgba(INK, 248), rgba(GOLD_DARK))
    draw = ImageDraw.Draw(img)
    draw.line([2, 2, 13, 2], fill=rgba(BG_HI, 250))
    draw.line([1, 14, 14, 14], fill=rgba(GOLD))
    return img


def row_locked():
    img = rings(12, (0, 0, 0, 0), rgba(GOLD), rgba(GOLD, 70))
    ImageDraw.Draw(img).rectangle([0, 0, 1, 11], fill=rgba(GOLD))
    return img


def from_rows(rows, colours):
    img = Image.new("RGBA", (len(rows[0]), len(rows)), (0, 0, 0, 0))
    for y, line in enumerate(rows):
        for x, ch in enumerate(line):
            if ch in colours:
                img.putpixel((x, y), colours[ch])
    return img


CLOSE = [
    "................",
    "................",
    "................",
    "...##......##...",
    "...###....###...",
    "....###..###....",
    ".....######.....",
    "......####......",
    "......####......",
    ".....######.....",
    "....###..###....",
    "...###....###...",
    "...##......##...",
    "................",
    "................",
    "................",
]

LOCK_ON = [
    "............",
    "....####....",
    "...##..##...",
    "...#....#...",
    "...#....#...",
    "..########..",
    "..########..",
    "..###..###..",
    "..###..###..",
    "..########..",
    "..########..",
    "............",
]

LOCK_OFF = [
    "............",
    "....####....",
    "...##..##...",
    "...#....#...",
    "...#........",
    "..########..",
    "..#......#..",
    "..#..##..#..",
    "..#..##..#..",
    "..#......#..",
    "..########..",
    "............",
]


def textures():
    return {
        "panel": (panel(), [6, 6, 6, 6]),
        "title": (title(), [4, 4, 4, 4]),
        "row": (rings(12, rgba((36, 32, 46), 240), rgba(EDGE)), [4, 4, 4, 4]),
        "row_hover": (rings(12, rgba((54, 47, 68), 250), rgba(GOLD)), [4, 4, 4, 4]),
        "row_pressed": (rings(12, rgba((18, 16, 24), 250), rgba(GOLD_DARK)), [4, 4, 4, 4]),
        "row_locked": (row_locked(), [4, 4, 4, 4]),
        "card": (rings(12, (0, 0, 0, 96), rgba((48, 44, 60), 220)), [4, 4, 4, 4]),
        "rule": (Image.new("RGBA", (2, 1), rgba(GOLD, 217)), None),
        "close": (from_rows(CLOSE, {"#": rgba(PALE)}), None),
        "lock_on": (from_rows(LOCK_ON, {"#": rgba(GOLD)}), None),
        "lock_off": (from_rows(LOCK_OFF, {"#": rgba(DIM)}), None),
        "scroll_handle": (from_rows(["###", "###", "###", "###", "###"], {"#": rgba(GOLD_DARK)}), [1, 2, 1, 1]),
        "scroll_track": (from_rows(["###", "###", "###", "###", "###"], {"#": (0, 0, 0, 120)}), [1, 2, 1, 1]),
    }


def write():
    OUT.mkdir(parents=True, exist_ok=True)
    made = textures()
    for name, (img, slice_) in made.items():
        img.save(OUT / f"{name}.png")
        if slice_:
            (OUT / f"{name}.json").write_text(
                json.dumps({"nineslice_size": slice_, "base_size": list(img.size)}, indent=2) + "\n"
            )
        print(f"{name}.png {img.width}x{img.height}")
    return made


def nine(img, slice_, w, h):
    """Stretch `img` to w x h like the game does with nineslice_size [l, t, r, b]."""
    left, top, right, bottom = slice_
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    xs = [(0, left, 0, left), (left, img.width - right, left, w - right), (img.width - right, img.width, w - right, w)]
    ys = [(0, top, 0, top), (top, img.height - bottom, top, h - bottom), (img.height - bottom, img.height, h - bottom, h)]
    for sx0, sx1, dx0, dx1 in xs:
        for sy0, sy1, dy0, dy1 in ys:
            if dx1 > dx0 and dy1 > dy0:
                part = img.crop((sx0, sy0, sx1, sy1)).resize((dx1 - dx0, dy1 - dy0), Image.NEAREST)
                out.alpha_composite(part, (dx0, dy0))
    return out


def preview(made, path):
    """The window as ui/xvoid_list.json lays it out; text is only a stand-in font."""
    w, h, scale = 296, 210, 3
    canvas = Image.new("RGBA", (w + 40, h + 40), (96, 132, 96, 255))
    ox = oy = 20
    draw = ImageDraw.Draw(canvas)

    def put(name, x, y, bw, bh):
        img, slice_ = made[name]
        part = nine(img, slice_, bw, bh) if slice_ else img.resize((bw, bh), Image.NEAREST)
        canvas.alpha_composite(part, (ox + x, oy + y))

    put("title", 0, 0, w - 27, 30)
    emblem = ROOT / "Wheel of Adaptation RP" / "textures" / "ui" / "xvoid" / "emblem" / "emblem_0_0_0.png"
    if emblem.exists():
        canvas.alpha_composite(Image.open(emblem).convert("RGBA"), (ox + 4, oy + 1))
    draw.text((ox + 36, oy + 10), "Wheel of Adaptation", fill=GOLD)
    put("row", w - 24, 3, 24, 24)
    put("close", w - 20, 7, 16, 16)
    put("panel", 0, 33, w, h - 33)

    x0, y, rw = 6, 39, w - 12 - 8
    put("scroll_track", w - 10, 39, 4, h - 45)
    put("scroll_handle", w - 10, 39, 4, 70)

    def header(text):
        nonlocal y
        draw.text((ox + x0 + 2, oy + y + 4), text, fill=GOLD)
        put("rule", x0, y + 17, rw, 1)
        y += 20

    def label(lines, colour=(237, 237, 245)):
        nonlocal y
        bh = 10 * len(lines) + 10
        put("card", x0, y, rw, bh)
        for i, line in enumerate(lines):
            draw.text((ox + x0 + 7, oy + y + 5 + 10 * i), line, fill=colour)
        y += bh + 3

    def button(text, state="row", lock=None):
        nonlocal y
        put(state, x0, y, rw, 22)
        if lock == "on":
            put("row_locked", x0, y, rw, 22)
        if lock:
            put(f"lock_{lock}", x0 + rw - 18, y + 5, 12, 12)
        draw.text((ox + x0 + 7, oy + y + 6), text, fill=(255, 255, 255))
        y += 25

    header("Analysing (1)")
    label(["o Enderman  II", "[####......] 40%  1/2"])
    y += 4
    header("Adapted (3/8)")
    label(["Tap an adaptation to lock it (1/2). A locked one is never forgotten."], (170, 170, 170))
    button("o Warden  VII  Locked", lock="on")
    button("o Zombies  I", state="row_hover", lock="off")
    button("o Sword  II", lock="off")
    canvas = canvas.crop((0, 0, w + 40, h + 40)).resize(((w + 40) * scale, (h + 40) * scale), Image.NEAREST)
    canvas.save(path)
    print(f"preview -> {path}")


if __name__ == "__main__":
    textures_made = write()
    if "--preview" in sys.argv:
        preview(textures_made, sys.argv[sys.argv.index("--preview") + 1])
