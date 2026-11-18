"""Item icon and sounds of the Seal of Judgment (the domain item).

    python3 -m venv .venv && .venv/bin/pip install pillow numpy soundfile
    .venv/bin/python tools/fx/gen_seal_assets.py [path to the Elemental Weapon resource pack]

The icon is pixel art on a 32 px grid. The inventory icon is saved at 64 px like the
other items. A texture that size is drawn four times too large in the hand, so the
held item is an attachable (attachables/seal_of_judgment.json) that builds its model
from the same art at its native 32 px and scales it by half.
The sounds are synthesised here, mono so the game can place them in the world.
Only the chain sound is taken from the Elemental Weapon addon (sounds/chuan.ogg,
the sound of its Heavenly Chain skill); without the path that one is skipped.
The particle textures of the seal come from gen_textures.py.
"""

import math
import os
import sys

import numpy as np
import soundfile as sf
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
RP = os.path.join(ROOT, "Wheel of Adaptation RP")
ICON = os.path.join(RP, "textures", "items", "xvoid", "seal_of_judgment.png")
HELD = os.path.join(RP, "textures", "entity", "xvoid", "seal_of_judgment.png")
SOUNDS = os.path.join(RP, "sounds", "xvoid")
RATE = 44100

# --------------------------------------------------------------------------
# icon
# --------------------------------------------------------------------------

N = 32
C = (N - 1) / 2
PALETTE = {
    "o": (48, 26, 8), "d": (150, 88, 18), "g": (236, 168, 40), "l": (255, 220, 112), "w": (255, 250, 220),
    "n": (22, 20, 46), "m": (44, 40, 84), "c": (120, 128, 146), "C": (206, 214, 228), "k": (58, 62, 76),
}
BOLT = [(18, 6, 3), (17, 7, 3), (16, 8, 3), (15, 9, 3), (14, 10, 3), (13, 11, 3), (12, 12, 3), (11, 13, 4),
        (11, 14, 9), (12, 15, 8), (16, 16, 3), (15, 17, 3), (14, 18, 3), (13, 19, 3), (12, 20, 3), (11, 21, 3),
        (11, 22, 2), (10, 23, 2), (10, 24, 1)]


def art():
    """The wheel with its eight handles, a ring of chain inside the rim and a bolt across the hub."""
    px = [[None] * N for _ in range(N)]

    def put(x, y, c):
        if 0 <= x < N and 0 <= y < N:
            px[y][x] = c

    for k in range(8):
        a = math.radians(k * 45)
        for y in range(N):
            for x in range(N):
                dx, dy = x - C, y - C
                along, across = dx * math.cos(a) + dy * math.sin(a), -dx * math.sin(a) + dy * math.cos(a)
                if 11 < along < 13.2 and abs(across) < 0.8:
                    put(x, y, "g")
                if math.hypot(along - 13.9, across) < 1.75:
                    put(x, y, "l" if dx + dy < 0 else "g")
    for y in range(N):
        for x in range(N):
            dx, dy = x - C, y - C
            r = math.hypot(dx, dy)
            if r < 7.3:
                put(x, y, "m" if r < 4.3 else "n")
            elif r < 9.4:
                link = int((math.degrees(math.atan2(dy, dx)) % 360) / 15)
                put(x, y, ("C" if r > 8.2 else "c") if link % 2 else "k")
            elif r < 12.3:
                put(x, y, "l" if dx + dy < -6 and r > 10.6 else ("d" if dx + dy > 6 and r < 11.2 else "g"))
    for x, y, n in BOLT:
        for i in range(n):
            put(x + i, y, "w" if i < n - 1 or n == 1 else "l")
        put(x - 1, y, "g")
    im = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    for y in range(N):
        for x in range(N):
            c = px[y][x]
            if c is None:
                near = ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1))
                if any(0 <= i < N and 0 <= j < N and px[j][i] is not None for i, j in near):
                    c = "o"
            if c:
                im.putpixel((x, y), PALETTE[c] + (255,))
    return im


# --------------------------------------------------------------------------
# sounds
# --------------------------------------------------------------------------


def clock(seconds):
    return np.arange(int(seconds * RATE)) / RATE


def noise(rng, seconds):
    return rng.uniform(-1, 1, int(seconds * RATE))


def lowpass(x, cutoff):
    """One-pole low-pass, run twice for a steeper slope."""
    a = 1 - math.exp(-2 * math.pi * cutoff / RATE)
    for _ in range(2):
        y = np.empty_like(x)
        acc = 0.0
        for k, v in enumerate(x):
            acc += a * (v - acc)
            y[k] = acc
        x = y
    return x


def highpass(x, cutoff):
    return x - lowpass(x, cutoff)


def bell(t, base, partials, decay):
    """Struck metal: partials that are not harmonic, the high ones die first."""
    out = np.zeros_like(t)
    for ratio, gain in partials:
        out += gain * np.sin(2 * math.pi * base * ratio * t) * np.exp(-t * decay * (0.6 + 0.4 * ratio))
    return out


def place(out, x, at):
    k = int(at * RATE)
    n = min(len(x), len(out) - k)
    if n > 0:
        out[k : k + n] += x[:n]


def fade(x, attack=0.002, release=0.03):
    a, r = int(attack * RATE), int(release * RATE)
    x = x.copy()
    x[:a] *= np.linspace(0, 1, a)
    x[-r:] *= np.linspace(1, 0, r)
    return x


def finish(x, peak=0.8, release=0.03):
    """Soft clip, normalise, and leave headroom: the encoder overshoots on hard transients."""
    x = np.tanh(x * 1.2)
    return fade(x / np.max(np.abs(x)) * peak, release=release)


TUBULAR = [(1.0, 1.0), (2.76, 0.55), (5.4, 0.3), (8.93, 0.16)]
GONG = [(1.0, 1.0), (1.48, 0.7), (2.0, 0.55), (2.63, 0.45), (3.41, 0.3), (4.52, 0.22), (5.9, 0.14)]


def tick(rng):
    """One handle lights up: the click of a clock escapement under a small bell."""
    t = clock(0.7)
    out = bell(t, 1245, TUBULAR, 6.5) * 0.5
    out += np.sin(2 * math.pi * 170 * t) * np.exp(-t * 55) * 0.9
    place(out, highpass(noise(rng, 0.012), 2500) * np.exp(-clock(0.012) * 400) * 1.2, 0)
    place(out, highpass(noise(rng, 0.008), 3500) * np.exp(-clock(0.008) * 500) * 0.5, 0.045)
    return finish(out)


def opening(rng):
    """The circle rises: a swell of air, then a temple gong with a long sub tail."""
    t = clock(4.2)
    out = np.zeros_like(t)
    swell = clock(0.9)
    place(out, highpass(noise(rng, 0.9), 900) * (swell / 0.9) ** 3 * 0.5, 0)
    hit = clock(3.3)
    gong = bell(hit, 73, GONG, 0.55) + 0.5 * bell(hit, 73 * 1.007, GONG, 0.5)
    gong *= 1 - np.exp(-hit * 90)
    place(out, gong * 0.8, 0.9)
    place(out, np.sin(2 * math.pi * (38 + 30 * np.exp(-hit * 5)) * hit) * np.exp(-hit * 1.3) * 0.9, 0.9)
    place(out, highpass(noise(rng, 1.6), 3000) * np.exp(-clock(1.6) * 3.2) * 0.35, 0.9)
    shimmer = clock(2.6)
    place(out, bell(shimmer, 1568, TUBULAR, 1.6) * 0.12 + bell(shimmer, 2093, TUBULAR, 1.9) * 0.08, 1.0)
    return finish(out, release=0.6)


def thunder(rng):
    """Lightning that lands next to you: a crack, a few echoes of it, and the ground answering."""
    t = clock(2.6)
    out = np.zeros_like(t)
    place(out, highpass(noise(rng, 0.2), 1200) * np.exp(-clock(0.2) * 26) * 1.5, 0)
    at = 0.03
    for _ in range(9):  # the crack tears, it is not one clean click
        length = rng.uniform(0.03, 0.09)
        place(out, noise(rng, length) * np.exp(-clock(length) * rng.uniform(30, 70)) * rng.uniform(0.4, 0.9), at)
        at += rng.uniform(0.02, 0.07)
    boom = clock(1.2)
    place(out, np.sin(2 * math.pi * (34 + 60 * np.exp(-boom * 9)) * boom) * np.exp(-boom * 3.2) * 1.6, 0.01)
    rumble = lowpass(noise(rng, 2.5), 140) * 7
    rumble *= np.exp(-clock(2.5) * 1.5) * (0.65 + 0.35 * np.sin(2 * math.pi * 5.3 * clock(2.5) + 1.0))
    place(out, rumble, 0.05)
    place(out, lowpass(noise(rng, 1.4), 900) * np.exp(-clock(1.4) * 4) * 0.9, 0.04)
    return finish(out, 0.72, 0.3)


def repel(rng):
    """The edge of the domain throws something back: a short bowed thud with a glassy ring."""
    t = clock(0.6)
    sweep = 250 * np.exp(-t * 7) + 95
    out = np.sin(2 * math.pi * np.cumsum(sweep) / RATE) * np.exp(-t * 8)
    out += bell(t, 880, TUBULAR, 9) * 0.3
    place(out, highpass(noise(rng, 0.05), 2000) * np.exp(-clock(0.05) * 90) * 0.5, 0)
    return finish(out)


def closing(rng):
    """The domain lets go: the gong again, lower and falling, air running out."""
    t = clock(3.0)
    drop = 1 - 0.18 * t / 3.0
    out = np.zeros_like(t)
    for ratio, gain in GONG:
        phase = 2 * math.pi * np.cumsum(98 * ratio * drop) / RATE
        out += gain * np.sin(phase) * np.exp(-t * (0.9 + 0.35 * ratio))
    out *= 1 - np.exp(-t * 60)
    air = lowpass(highpass(noise(rng, 3.0), 500), 2600 * 0.6)
    out += air * np.exp(-t * 1.8) * 1.4
    return finish(out, release=0.5)


SYNTH = {"seal_tick": tick, "seal_open": opening, "seal_thunder": thunder, "seal_repel": repel, "seal_close": closing}


def encode(path, data, rate, limit=0.92):
    """Write Vorbis, then read it back: the codec overshoots on sharp attacks, so turn the take down until it fits."""
    data = data.astype(np.float32)
    for _ in range(6):
        sf.write(path, data, rate, format="OGG", subtype="VORBIS")
        peak = float(np.max(np.abs(sf.read(path)[0])))
        if peak <= limit:
            break
        data = data * (limit / peak * 0.98)
    return peak


def main():
    os.makedirs(os.path.dirname(ICON), exist_ok=True)
    art().resize((64, 64), Image.NEAREST).save(ICON, optimize=True)
    art().save(HELD, optimize=True)
    print(f"seal_of_judgment.png 64x64 (inventory), {N}x{N} (held)")
    for k, (name, make) in enumerate(SYNTH.items()):
        data = make(np.random.default_rng(40 + k))
        peak = encode(os.path.join(SOUNDS, f"{name}.ogg"), data, RATE)
        print(f"{name}.ogg {len(data) / RATE:.2f}s peak {peak:.2f}")
    if len(sys.argv) > 1:
        data, rate = sf.read(os.path.join(sys.argv[1], "sounds", "chuan.ogg"), always_2d=True)
        mono = data.mean(axis=1)
        mono = fade(mono / np.max(np.abs(mono)) * 0.8, 0.002, 0.05)
        peak = encode(os.path.join(SOUNDS, "seal_chain.ogg"), mono, rate)
        print(f"seal_chain.ogg {len(mono) / rate:.2f}s peak {peak:.2f} (from chuan.ogg)")


if __name__ == "__main__":
    main()
