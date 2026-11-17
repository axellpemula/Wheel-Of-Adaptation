"""Imports hand-drawn flipbook sheets from the Elemental Weapon resource pack.

    git clone https://github.com/axellpemula/Elemental-Weapon /tmp/ew
    .venv/bin/python tools/fx/import_flipbooks.py "/tmp/ew/[RPG]Elemental Weapon RP"

Both addons are by xVoid_Axell. Each sheet is cut into frames, the chosen
frames are scaled into square (or fixed) cells and written as one horizontal
strip `fb_<name>.png`. The frame layout goes to `flipbooks.json`, which
gen_particles.py reads, so run this script first.

Most sheets are turned into white intensity maps (alpha carries the
brightness) so the particle can tint them with the colours of this addon.
"""

import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(ROOT, "Wheel of Adaptation RP", "textures", "particle", "xvoid")

# name: (source file, source frame w, h, frames to keep, cell w, h, mode)
#   glow   white, alpha = alpha * brightest channel   (for particles_add)
#   lum    white, alpha = alpha * luminance ^ 1.6     (keeps the shading of warm art)
#   shape  white, alpha kept                          (for particles_blend)
#   keep   colours kept
# "+crop" cuts the empty border off a single image first.
SHEETS = {
    "fb_burst": ("prelight", 322, 262, [0, 1, 2, 3, 4, 5, 6], 160, 160, "glow"),
    "fb_flare": ("shoki", 334, 292, [0, 1, 2, 3, 4], 160, 160, "glow"),
    "fb_hit": ("hithotni", 256, 256, [0, 1, 2, 3, 4, 5], 160, 160, "glow"),
    "fb_slash": ("thunderslash1", 192, 192, list(range(10)), 160, 160, "glow"),
    "fb_bolt": ("ptlight", 200, 200, [0, 1, 4, 5, 6, 7, 8, 9, 10], 96, 128, "glow"),
    "fb_crackle": ("hakiptr", 192, 192, list(range(10)), 128, 128, "glow"),
    "fb_flame": ("apigdglow", 125, 150, list(range(10)), 80, 96, "lum"),
    "fb_streak": ("taj", 300, 200, list(range(8)), 192, 128, "glow"),
    "fb_smoke": ("devbkr", 400, 400, list(range(3, 14)), 96, 96, "shape"),
    "fb_swirl": ("anginmuter", 768, 768, [0], 192, 192, "shape"),
    "fb_crack": ("retaknew", 256, 256, [0], 256, 256, "keep"),
    "fb_arc": ("idlepetir3", 480, 476, list(range(12)), 128, 128, "glow"),
    "fb_cracks": ("sreks", 291, 301, list(range(2, 12)), 160, 160, "glow"),
    "fb_shatter": ("dev", 278, 270, [0, 1, 2, 3, 4], 128, 128, "glow"),
    "fb_ripple": ("tetes", 192, 192, list(range(7)), 128, 128, "glow"),
    "fb_twinkle": ("blinka", 192, 192, list(range(5)), 64, 64, "glow"),
    "fb_moon": ("holyslash", 400, 400, list(range(10)), 160, 160, "glow"),
    "fb_octagram": ("lingkarans", 512, 512, [0], 256, 256, "glow"),
    "fb_cloud": ("smoke_04", 512, 512, [0], 128, 128, "shape"),
    "fb_spiral": ("26b", 128, 128, [0], 128, 128, "glow"),
    "fb_implode": ("pecahice", 331, 300, list(range(6)), 128, 128, "glow"),
    "fb_nodes": ("tai3", 512, 512, [0], 256, 256, "glow"),
    "fb_dotring": ("circ", 640, 640, [0], 256, 256, "glow"),
    "fb_fissure": ("kretek", 2000, 2000, [0], 320, 320, "keep+crop"),
}


def convert(frame, mode):
    a = np.asarray(frame.convert("RGBA")).astype(np.float64) / 255.0
    if mode == "keep":
        return a
    alpha = a[..., 3]
    if mode == "glow":
        alpha = alpha * a[..., :3].max(axis=2)
    elif mode == "lum":
        alpha = alpha * (a[..., :3] @ np.array([0.3, 0.59, 0.11])) ** 1.6
    out = np.ones_like(a)
    out[..., 3] = alpha
    return out


def fit(frame, cw, ch):
    """Scales a frame into the cell without changing its proportions."""
    w, h = frame.size
    k = min(cw / w, ch / h)
    size = (max(1, round(w * k)), max(1, round(h * k)))
    cell = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    cell.paste(frame.resize(size, Image.LANCZOS), ((cw - size[0]) // 2, (ch - size[1]) // 2))
    return cell


def build(src_dir, name):
    source, fw, fh, frames, cw, ch, mode = SHEETS[name]
    sheet = Image.open(os.path.join(src_dir, "textures", "particle", source + ".png")).convert("RGBA")
    if mode.endswith("+crop"):
        mode = mode[: -len("+crop")]
        left, top, right, bottom = sheet.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
        half = max(sheet.size[0] / 2 - left, right - sheet.size[0] / 2, sheet.size[1] / 2 - top, bottom - sheet.size[1] / 2)
        cx, cy = sheet.size[0] / 2, sheet.size[1] / 2
        sheet = sheet.crop((int(cx - half), int(cy - half), int(cx + half), int(cy + half)))
        fw, fh = sheet.size
    cells = []
    for index in frames:
        frame = sheet.crop((index * fw, 0, min(sheet.size[0], (index + 1) * fw), fh))
        cells.append(convert(fit(frame, cw, ch), mode))
    strip = np.concatenate(cells, axis=1)
    if mode != "keep":
        peak = strip[..., 3].max()
        if peak > 0:
            strip[..., 3] = np.clip(strip[..., 3] / peak, 0, 1)
    strip[strip[..., 3] < 2 / 255.0] = (1, 1, 1, 0) if mode != "keep" else (0, 0, 0, 0)
    image = Image.fromarray((strip * 255 + 0.5).astype(np.uint8), "RGBA")
    image.save(os.path.join(OUT, name + ".png"), optimize=True)
    return image, {"cell": [cw, ch], "frames": len(frames), "source": source + ".png"}


def preview(images):
    pad, label = 6, 14
    width = max(im.size[0] for im in images.values()) + 2 * pad
    height = sum(im.size[1] + label + pad for im in images.values()) + pad
    sheet = Image.new("RGBA", (width, height), (18, 18, 24, 255))
    draw = ImageDraw.Draw(sheet)
    y = pad
    for name, im in images.items():
        draw.text((pad, y), f"{name}  {im.size[0]}x{im.size[1]}  <- {SHEETS[name][0]}.png", fill=(255, 220, 120, 255))
        y += label
        backdrop = Image.new("RGBA", im.size, (70, 70, 84, 255) if SHEETS[name][6].startswith("keep") else (18, 18, 24, 255))
        backdrop.alpha_composite(im)
        sheet.paste(backdrop, (pad, y))
        y += im.size[1] + pad
    sheet.convert("RGB").quantize(64).save(os.path.join(HERE, "preview_flipbooks.png"), optimize=True)


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    src_dir = sys.argv[1]
    images, layout = {}, {}
    for name in SHEETS:
        images[name], layout[name] = build(src_dir, name)
        size = os.path.getsize(os.path.join(OUT, name + ".png")) // 1024
        print(f"{name:12s} {images[name].size[0]:5d}x{images[name].size[1]:<4d} {layout[name]['frames']:2d} frames {size:4d} K")
    with open(os.path.join(HERE, "flipbooks.json"), "w") as f:
        json.dump(layout, f, indent=2)
        f.write("\n")
    preview(images)


if __name__ == "__main__":
    main()
