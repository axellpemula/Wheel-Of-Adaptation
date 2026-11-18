"""Generates the particle textures of the effects.

    python3 -m venv .venv && .venv/bin/pip install pillow numpy
    .venv/bin/python tools/fx/gen_textures.py

Writes the PNG files into the resource pack and a preview sheet next to this
script. Every texture is an intensity map, alpha carries the brightness.

  adapt_*  RGB carries a baked amber -> gold -> white ramp (the wheel).
  fx_*     RGB is white, the particle tints it (every other move).
  seal_*   Baked gold like adapt_*, for the domain seal.
"""

import math
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(ROOT, "Wheel of Adaptation RP", "textures", "particle", "xvoid")
SS = 4  # supersampling factor of the line art

# brightness -> colour. Dim parts stay amber, bright parts burn to white.
RAMP = [
    (0.00, (255, 132, 20)),
    (0.35, (255, 178, 56)),
    (0.65, (255, 216, 110)),
    (0.85, (255, 240, 190)),
    (1.00, (255, 255, 248)),
]


def ramp(i):
    xs = [p[0] for p in RAMP]
    out = np.zeros(i.shape + (3,))
    for c in range(3):
        out[..., c] = np.interp(i, xs, [p[1][c] for p in RAMP])
    return out


def to_image(i, gold=True):
    """Intensity map (0..1) -> RGBA image."""
    i = np.clip(i, 0.0, 1.0)
    rgba = np.zeros(i.shape + (4,), dtype=np.uint8)
    rgba[..., :3] = np.round(ramp(i)).astype(np.uint8) if gold else 255
    rgba[..., 3] = np.round(255 * i**0.85).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def window(size, start=0.86, end=1.0):
    """Radial fade so nothing touches the border of the texture."""
    r = radius(size) / (size / 2)
    return np.clip((end - r) / (end - start), 0.0, 1.0)


def grid(w, h=None):
    h = h or w
    y, x = np.mgrid[0:h, 0:w]
    return x + 0.5 - w / 2, y + 0.5 - h / 2


def radius(size):
    x, y = grid(size)
    return np.hypot(x, y)


class Art:
    """Antialiased line art drawn at SS times the size, centred on (0, 0)."""

    def __init__(self, size):
        self.size = size
        self.im = Image.new("L", (size * SS, size * SS), 0)
        self.d = ImageDraw.Draw(self.im)
        self.c = size * SS / 2

    def p(self, x, y):
        return (self.c + x * SS, self.c + y * SS)

    def ring(self, r, t, v=255):
        a = r + t / 2
        self.d.ellipse([self.p(-a, -a), self.p(a, a)], outline=v, width=max(1, round(t * SS)))

    def dot(self, x, y, r, v=255):
        self.d.ellipse([self.p(x - r, y - r), self.p(x + r, y + r)], fill=v)

    def line(self, pts, t, v=255):
        self.d.line([self.p(x, y) for x, y in pts], fill=v, width=max(1, round(t * SS)), joint="curve")

    def poly(self, pts, v=255):
        self.d.polygon([self.p(x, y) for x, y in pts], fill=v)

    def array(self):
        small = self.im.resize((self.size, self.size), Image.LANCZOS)
        return np.asarray(small, dtype=float) / 255.0


def polar(r, deg):
    a = math.radians(deg)
    return (r * math.cos(a), r * math.sin(a))


def blur(i, sigma):
    im = Image.fromarray(np.round(np.clip(i, 0, 1) * 255).astype(np.uint8), "L")
    return np.asarray(im.filter(ImageFilter.GaussianBlur(sigma)), dtype=float) / 255.0


def glow(i, layers):
    """Line art plus soft bloom. layers = [(sigma, gain), ...]."""
    out = i.copy()
    for sigma, gain in layers:
        out = out + blur(i, sigma) * gain
    return out


def petal(r0, r1, deg, half, steps=14):
    """Pointed lotus arch from two base points on r0 to a tip on r1."""
    left, right = [], []
    for k in range(steps + 1):
        u = k / steps
        r = r0 + (r1 - r0) * u
        spread = half * (1 - u**1.7)
        left.append(polar(r, deg - spread))
        right.append(polar(r, deg + spread))
    return left + right[::-1]


# --------------------------------------------------------------------------
# textures
# --------------------------------------------------------------------------


def mandala():
    """Ground seal: rim, tick band, lotus ring, octagram, eight-spoked wheel."""
    a = Art(256)
    a.ring(119, 3.0)
    a.ring(112, 1.2, 200)
    for k in range(64):
        long = k % 8 == 0
        a.line([polar(101 if long else 104, k * 5.625), polar(111, k * 5.625)], 1.6 if long else 1.0, 235 if long else 170)
    a.ring(99, 2.2)
    for k in range(8):  # back row, short petals
        a.line(petal(64, 84, k * 45 + 22.5, 13), 1.2, 170)
    for k in range(8):  # front row, long petals
        a.line(petal(64, 96, k * 45, 20), 2.0)
        a.dot(*polar(88, k * 45), 1.8)
    a.ring(63, 2.4)
    a.ring(57, 1.0, 190)
    for k in range(8):  # octagram {8/3}
        a.line([polar(56, k * 45 + 22.5), polar(56, k * 45 + 22.5 + 135)], 1.1, 175)
    for k in range(8):  # wheel
        a.line([polar(15, k * 45), polar(56, k * 45)], 2.4)
        a.dot(*polar(39, k * 45), 3.2)
    a.ring(15, 2.6)
    a.dot(0, 0, 5.5)
    for k in range(8):  # knobs on the rim
        x, y = polar(119, k * 45 + 22.5)
        a.dot(x, y, 4.6)
    i = a.array()
    i = glow(i * 0.7, [(1.6, 0.5), (5, 0.4), (12, 0.28)])
    return i * window(256, 0.93, 1.0)


def wheel():
    """The Dharma wheel itself: rim, eight spokes, eight handles with knobs."""
    a = Art(256)
    a.ring(74, 7.0)
    a.ring(62, 1.8, 215)
    a.ring(86, 1.2, 180)
    for k in range(8):
        a.line([polar(19, k * 45), polar(106, k * 45)], 5.0)
        a.dot(*polar(108, k * 45), 8.0)
        a.line([polar(30, k * 45 + 22.5), polar(60, k * 45 + 22.5)], 1.2, 150)
    a.ring(19, 5.0)
    a.dot(0, 0, 7.5)
    i = a.array()
    i = glow(i * 0.72, [(2, 0.5), (6, 0.42), (14, 0.3)])
    return i * window(256, 0.93, 1.0)


def nova():
    """Shock ring: hard leading edge, long inner tail, streaked like a wave."""
    size = 256
    x, y = grid(size)
    r = np.hypot(x, y)
    th = np.arctan2(y, x)
    rng = np.random.default_rng(7)
    streak = np.zeros_like(r)
    for f in (5, 8, 13, 21, 34, 55):
        streak += rng.uniform(0.5, 1.0) / math.sqrt(f) * np.sin(f * th + rng.uniform(0, 6.28))
    streak = 0.5 + 0.5 * streak / np.abs(streak).max()
    r0 = 112.0
    edge = np.exp(-(((r - r0) / 2.6) ** 2))
    tail = np.where(r < r0, np.exp(-(r0 - r) / 20.0), np.exp(-(((r - r0) / 3.4) ** 2)))
    inner = np.exp(-(((r - 88.0) / 1.6) ** 2)) * 0.45
    i = edge * 0.95 + tail * (0.18 + 0.5 * streak**2) + inner
    return i * window(size, 0.94, 1.0)


def flare():
    """Star flare: hot core, soft bloom, four long and four short rays."""
    size = 128
    x, y = grid(size)
    r = np.hypot(x, y)
    core = np.exp(-((r / 5.0) ** 2))
    bloom = np.exp(-((r / 20.0) ** 2)) * 0.4

    def ray(u, v, length, width):
        return np.exp(-np.abs(v) / width) * np.exp(-np.abs(u) / length)

    d1, d2 = (x + y) / math.sqrt(2), (x - y) / math.sqrt(2)
    rays = ray(x, y, 26, 1.5) + ray(y, x, 26, 1.5)
    rays += 0.55 * (ray(d1, d2, 11, 1.2) + ray(d2, d1, 11, 1.2))
    i = core * 1.2 + bloom + rays * 0.9
    return i * window(size, 0.78, 1.0)


def ray():
    """Light shaft: soft column with a thin hot core, faded at both ends."""
    w, h = 32, 128
    x, y = grid(w, h)
    v = (y + h / 2) / h
    env = np.sin(math.pi * np.clip(v, 0, 1)) ** 1.6
    body = np.exp(-((x / 6.0) ** 2)) * 0.6
    core = np.exp(-((x / 1.6) ** 2)) * 0.75
    side = np.clip((w / 2 - np.abs(x)) / 4.0, 0, 1)
    return (body + core) * env * side


def glint():
    """Twinkle flipbook, 4 frames of 32x32: seed, star, flash, star."""
    size = 32
    x, y = grid(size)
    r = np.hypot(x, y)
    d1, d2 = (x + y) / math.sqrt(2), (x - y) / math.sqrt(2)

    def star(core, length, diag):
        i = np.exp(-((r / core) ** 2)) * 1.1
        i += (np.exp(-np.abs(y) / 0.9) * np.exp(-np.abs(x) / length)) * 0.9
        i += (np.exp(-np.abs(x) / 0.9) * np.exp(-np.abs(y) / length)) * 0.9
        if diag:
            i += (np.exp(-np.abs(d2) / 0.8) * np.exp(-np.abs(d1) / diag)) * 0.55
            i += (np.exp(-np.abs(d1) / 0.8) * np.exp(-np.abs(d2) / diag)) * 0.55
        return i * window(size, 0.7, 1.0)

    return np.hstack([star(1.6, 1.4, 0), star(2.0, 3.4, 0), star(2.6, 5.6, 2.6), star(2.0, 3.4, 1.2)])


def ward():
    """Barrier sigil of a nullified hit: two crossed octagons around a small wheel."""
    a = Art(256)
    a.ring(117, 2.0, 210)
    for off, t, v in ((22.5, 3.0, 255), (0.0, 1.3, 190)):
        pts = [polar(109, off + k * 45) for k in range(9)]
        a.line(pts, t, v)
    a.ring(80, 2.2)
    a.ring(73, 1.0, 180)
    for k in range(8):
        a.line([polar(80, k * 45 + 22.5), polar(100, k * 45 + 22.5)], 2.0)
        a.dot(*polar(100, k * 45 + 22.5), 3.2)
        # kite between the wheel and the inner ring
        d = k * 45
        a.line([polar(40, d), polar(56, d - 9), polar(72, d), polar(56, d + 9), polar(40, d)], 1.4, 215)
        a.dot(*polar(56, d + 22.5), 2.0, 220)
    a.ring(24, 3.2)
    for k in range(8):
        a.line([polar(8, k * 45), polar(35, k * 45)], 2.4)
        a.dot(*polar(36, k * 45), 3.6)
    a.dot(0, 0, 4.5)
    i = glow(a.array() * 0.72, [(1.6, 0.5), (5, 0.4), (12, 0.28)])
    return i * window(256, 0.93, 1.0)


def streak():
    """Needle for sparks that fly along their own direction. Pointed at both ends."""
    w, h = 64, 16
    x, y = grid(w, h)
    u = np.clip(1 - np.abs(x) / (w / 2 - 1), 0, 1)
    core = np.exp(-((y / 1.2) ** 2)) * u**1.3
    halo = np.exp(-((y / 3.2) ** 2)) * u**2.2 * 0.45
    return core + halo


def crescent():
    """Sword cut: an arc that is thick in the middle, with a faint wake inside."""
    size = 128
    x, y = grid(size)
    cy, big = 31.0, 46.0
    r = np.hypot(x, y - cy)
    th = np.degrees(np.arctan2(x, -(y - cy)))  # 0 = top of the arc
    taper = np.clip(1 - (np.abs(th) / 72.0) ** 2, 0, 1)
    width = 0.6 + 4.6 * taper
    edge = np.exp(-(((r - big) / width) ** 2)) * taper**0.6
    wake = np.where(r < big, np.exp(-(big - r) / 11.0), 0.0) * taper**1.5 * 0.4
    hot = np.exp(-(((r - big) / (0.35 * width)) ** 2)) * taper * 0.5
    return (edge * 0.8 + wake + hot) * window(size, 0.9, 1.0)


def burst():
    """Impact star: thin spikes thrown out of an empty centre."""
    a = Art(128)
    rng = np.random.default_rng(11)
    n = 26
    for k in range(n):
        deg = k * 360 / n + rng.uniform(-5, 5)
        long = k % 2 == 0
        r0 = rng.uniform(11, 17)
        r1 = rng.uniform(44, 58) if long else rng.uniform(26, 38)
        half = rng.uniform(1.6, 2.6) if long else rng.uniform(1.0, 1.6)
        bx, by = polar(r0, deg)
        nx, ny = polar(half, deg + 90)
        mx, my = polar(r0 + (r1 - r0) * 0.25, deg)
        a.poly([polar(r0 - 3, deg), (mx + nx, my + ny), polar(r1, deg), (mx - nx, my - ny)])
        del bx, by
    i = glow(a.array() * 0.85, [(1.5, 0.45), (5, 0.3)])
    return i * window(128, 0.9, 1.0)


def vortex():
    """Wind ring: tapered arcs chasing each other around a faint circle."""
    a = Art(128)
    a.ring(53, 1.0, 110)
    for k in range(5):
        start = k * 72
        steps = 26
        for j in range(steps):
            u0, u1 = j / steps, (j + 1) / steps
            r_a, r_b = 53 - 20 * u0**1.3, 53 - 20 * u1**1.3
            head = min(1.0, u0 / 0.14) ** 0.7  # rounded nose, long tail
            width = 0.5 + 3.4 * head * (1 - u0) ** 1.3
            a.line([polar(r_a, start + 118 * u0), polar(r_b, start + 118 * u1)], width, int(255 * (1 - 0.35 * u0)))
    i = glow(a.array() * 0.8, [(1.5, 0.45), (4, 0.3)])
    return i * window(128, 0.92, 1.0)


def puff():
    """Soft cloud for dust, smoke and wind. Lumpy on purpose."""
    size = 64
    x, y = grid(size)
    rng = np.random.default_rng(5)
    i = np.exp(-((np.hypot(x, y) / 15.0) ** 2))
    for k in range(12):
        deg, dist, rad = k * 30 + rng.uniform(-12, 12), rng.uniform(6, 13), rng.uniform(5, 8)
        px, py = polar(dist, deg)
        i += np.exp(-((np.hypot(x - px, y - py) / rad) ** 2)) * rng.uniform(0.18, 0.34)
    return (i / i.max()) ** 1.3 * 0.9 * window(size, 0.6, 0.98)


# --------------------------------------------------------------------------
# domain seal
# --------------------------------------------------------------------------


def oval(cx, cy, rx, ry, deg, steps=28):
    """Closed outline of an ellipse turned by deg."""
    a = math.radians(deg)
    pts = []
    for k in range(steps + 1):
        t = 2 * math.pi * k / steps
        x, y = rx * math.cos(t), ry * math.sin(t)
        pts.append((cx + x * math.cos(a) - y * math.sin(a), cy + x * math.sin(a) + y * math.cos(a)))
    return pts


def seal_circle():
    """Circle of the domain seal: the wheel inside a ring of chain.

    Eight-fold on purpose. The sky circle is respawned every two seconds while
    it turns 45 degrees, so the hand-over between two particles is invisible.
    """
    a = Art(512)
    a.ring(233, 3.2)
    a.ring(224, 1.2, 190)
    for k in range(64):  # minute marks on the rim
        d = k * 5.625
        a.line([polar(226, d), polar(232, d)], 1.6 if k % 8 else 3.0, 230)
    # chain band
    a.ring(213, 1.3, 170)
    a.ring(193, 1.3, 170)
    for k in range(48):
        d = k * 7.5 + 3.75
        cx, cy = polar(203, d)
        if k % 2:
            ex, ey = polar(7.5, d + 90)
            a.line([(cx - ex, cy - ey), (cx + ex, cy + ey)], 3.2)
        else:
            a.line(oval(cx, cy, 5.2, 10.5, d), 2.4)
    # two squares make the eight-pointed star the wheel sits in
    for off in (0.0, 45.0):
        a.line([polar(190, off + k * 90) for k in range(5)], 2.4, 235)
    a.ring(134, 9.0)
    a.ring(149, 1.4, 190)
    a.ring(120, 1.6, 200)
    for k in range(8):
        d = k * 45
        a.line([polar(30, d), polar(176, d)], 6.0)  # spoke and handle
        a.dot(*polar(178, d), 10.0)
        m = d + 22.5
        a.line([polar(150, m), polar(164, m)], 3.0)  # hour marks between the handles
        a.line([polar(74, m), polar(92, m - 5.5), polar(110, m), polar(92, m + 5.5), polar(74, m)], 1.8, 220)
        a.dot(*polar(92, m), 2.6)
        a.line(petal(34, 62, m, 15), 1.5, 215)
    a.ring(64, 2.6)
    a.ring(24, 6.0)
    a.dot(0, 0, 9.5)
    i = glow(a.array() * 0.74, [(2, 0.5), (7, 0.4), (18, 0.3)])
    return i * window(512, 0.94, 1.0)


def fork(rng, a, b, rough, depth):
    """Lightning path from a to b by midpoint displacement."""
    if depth == 0:
        return [a, b]
    mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
    length = math.hypot(b[0] - a[0], b[1] - a[1])
    nx, ny = -(b[1] - a[1]) / length, (b[0] - a[0]) / length
    off = rng.normal(0, rough * length)
    mid = (mx + nx * off, my + ny * off)
    return fork(rng, a, mid, rough, depth - 1)[:-1] + fork(rng, mid, b, rough, depth - 1)


def seal_bolt():
    """Flipbook of the giant lightning, 4 frames of 128x512: leader, strike, strike, embers."""
    w, h = 128, 512
    rng = np.random.default_rng(23)
    top, bottom = (rng.uniform(-10, 10), -h / 2 - 6), (0.0, h / 2 + 6)
    trunk = fork(rng, top, bottom, 0.2, 6)
    widest = max(abs(x) for x, _ in trunk)
    trunk = [(x * min(1.0, 40 / widest), y) for x, y in trunk]
    branches = []
    for k in range(7):
        at = trunk[int(rng.uniform(0.08, 0.8) * len(trunk))]
        side = 1 if at[0] < 0 else -1
        if rng.uniform() < 0.3:
            side = -side
        end = (at[0] + side * rng.uniform(18, 46), at[1] + rng.uniform(40, 110))
        path = fork(rng, at, end, 0.22, 4)
        reach = max(abs(x) for x, _ in path)
        if reach > 52:  # pull the branch back towards its root so it stays inside the frame
            path = [(at[0] + (x - at[0]) * max(0.0, 52 - abs(at[0])) / (reach - abs(at[0])), y) for x, y in path]
        branches.append(path)

    def frame(trunk_t, branch_t, branch_n, level, gaps=0.0):
        im = Image.new("L", (w * SS, h * SS), 0)
        d = ImageDraw.Draw(im)

        def draw(path, t, v=255):
            pts = [((x + w / 2) * SS, (y + h / 2) * SS) for x, y in path]
            if not gaps:
                d.line(pts, fill=v, width=max(1, round(t * SS)), joint="curve")
                return
            for p, q in zip(pts, pts[1:]):
                if rng.uniform() > gaps:
                    d.line([p, q], fill=v, width=max(1, round(t * SS)))

        for path in branches[:branch_n]:
            draw(path, branch_t, 200)
        draw(trunk, trunk_t)
        i = np.asarray(im.resize((w, h), Image.LANCZOS), dtype=float) / 255.0
        i = glow(i * 0.8, [(2, 0.55), (6, 0.4), (14, 0.3)]) * level
        x, y = grid(w, h)
        return i * np.clip((w / 2 - np.abs(x)) / 12.0, 0, 1)

    return np.hstack([frame(2.2, 1.2, 3, 0.8), frame(7.0, 2.6, 7, 1.15), frame(4.5, 2.0, 7, 1.0), frame(2.0, 1.2, 5, 0.6, 0.45)])


# name -> (intensity map, baked gold ramp?)
TEXTURES = {
    "adapt_mandala": (mandala, True),
    "adapt_wheel": (wheel, True),
    "adapt_nova": (nova, True),
    "adapt_flare": (flare, True),
    "adapt_ray": (ray, True),
    "adapt_glint": (glint, True),
    "adapt_ward": (ward, True),
    "fx_wheel": (wheel, False),
    "fx_shock": (nova, False),
    "fx_flare": (flare, False),
    "fx_ray": (ray, False),
    "fx_glint": (glint, False),
    "fx_streak": (streak, False),
    "fx_crescent": (crescent, False),
    "fx_burst": (burst, False),
    "fx_vortex": (vortex, False),
    "fx_puff": (puff, False),
    "seal_circle": (seal_circle, True),
    "seal_bolt": (seal_bolt, True),
}


def preview(images):
    """Contact sheet: every texture added onto a dark background."""
    cell, pad, cols = 200, 10, 6
    rows = math.ceil(len(images) / cols)
    sheet = np.zeros(((cell + pad) * rows + pad, (cell + pad) * cols + pad, 3))
    sheet[...] = (14, 14, 22)
    for k, im in enumerate(images.values()):
        scale = min(cell / im.width, cell / im.height)
        big = im.resize((round(im.width * scale), round(im.height * scale)), Image.NEAREST)
        a = np.asarray(big, dtype=float)
        ox = pad + (k % cols) * (cell + pad) + (cell - big.width) // 2
        oy = pad + (k // cols) * (cell + pad) + (cell - big.height) // 2
        sheet[oy : oy + big.height, ox : ox + big.width] += a[..., :3] * a[..., 3:4] / 255.0
    Image.fromarray(np.clip(sheet, 0, 255).astype(np.uint8), "RGB").save(os.path.join(HERE, "preview_textures.png"))


def main():
    os.makedirs(OUT, exist_ok=True)
    images = {}
    for name, (make, gold) in TEXTURES.items():
        im = to_image(make(), gold)
        im.save(os.path.join(OUT, f"{name}.png"), optimize=True)
        images[name] = im
        print(f"{name}.png {im.width}x{im.height}")
    preview(images)


if __name__ == "__main__":
    main()
