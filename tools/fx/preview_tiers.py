"""Draws a rough side view of a few moves on low, medium and ultra.

    .venv/bin/python tools/fx/preview_tiers.py

This is not the game renderer. It reads the particle files and the tier table
in main.js, runs a small simulation of every emitter and paints the sprites
from a camera that looks slightly down. It is good enough to compare the three
tiers and to catch a sprite that is far too large or too small. Writes
preview_tiers.jpg next to this script.
"""

import json
import math
import random
import re
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PACK = ROOT / "Wheel of Adaptation RP"
SCRIPT = ROOT / "Wheel of Adaptation BP" / "scripts" / "main.js"
TILT = math.radians(20)  # how far the camera looks down
STEP = 1 / 30

GROUND = (0, 0.08, 0)
WHEEL = (0, 2.45, 0)
BODY = (0, 0.9, 0)
TARGET = (0, 1.0, 0)

# move -> (seconds after the start, blocks across, [(script id, where), ...])
# A third value in a spawn is how many seconds earlier that copy started; the
# domain respawns its effects every two seconds and the copies overlap.
# The w_* effects are the ones the wheel plays itself, the same on every tier.
SCENES = {
    "wheel turn": (0.14, 9, [
        ("w_wheel_spin", WHEEL), ("w_adapt_halo", WHEEL), ("w_wheel_crackle", WHEEL), ("w_fx_arcs_gold", WHEEL),
        ("w_twinkle_gold", WHEEL), ("wheel_turn_more", WHEEL), ("adapt_ripple", GROUND),
    ]),
    "full adaptation, 0.25 s": (0.25, 34, None),
    "full adaptation, 1.3 s": (1.3, 34, None),
    "undying": (0.35, 34, [
        ("adapt_shockwave", GROUND), ("adapt_seal", GROUND), ("adapt_pillar", GROUND), ("undying_flame", GROUND),
        ("adapt_octagram", GROUND), ("ground_flash", GROUND), ("ring_wave_gold", GROUND), ("dust_burst", GROUND),
        ("adapt_storm", GROUND), ("adapt_bolts", GROUND), ("adapt_beam", GROUND), ("quake_crack", GROUND),
        ("adapt_burst", BODY), ("adapt_flash", BODY), ("shatter_gold", BODY),
    ]),
    "teleport kick hit": (0.12, 9, [
        ("kick_impact", TARGET), ("kick_burst", TARGET), ("kick_ring", TARGET), ("impact_gold", TARGET),
        ("fx_arcs_gold", TARGET), ("dust_small", GROUND),
    ]),
    "sword slash hit": (0.12, 9, [
        ("slash_ink_spark", TARGET), ("slash_cut", TARGET), ("impact_ice", TARGET), ("shatter_ice", TARGET),
        ("fx_arcs_ice", TARGET),
    ]),
    "sword swing and flying slash": (0.1, 9, [
        ("slash_moon", (0, 1.5, 0)), ("slash_wave_moon", (0, 1.5, 0)), ("fx_arcs_ice", (0, 1.5, 0)),
        ("slash_spark", (0, 1.5, 0)),
    ]),
    "positive energy strike": (0.12, 9, [
        ("positive_burst", TARGET), ("positive_flash", TARGET), ("positive_ring", TARGET), ("twinkle_mint", TARGET),
        ("ring_pop_mint", TARGET),
    ]),
    "heal": (0.4, 14, [
        ("positive_burst", BODY), ("positive_flash", BODY), ("positive_ring", BODY), ("twinkle_mint", BODY),
        ("ring_pop_mint", BODY), ("positive_rise", GROUND), ("regen_pulse", GROUND), ("positive_rays", GROUND),
        ("positive_seal", GROUND), ("ring_wave_mint", GROUND),
    ]),
    "punch": (0.1, 9, [
        ("punch_impact", TARGET), ("punch_burst", TARGET), ("impact_ice", TARGET), ("ring_pop_ice", TARGET),
    ]),
    "dash": (0.1, 9, [
        ("dash_lines", BODY), ("dash_flash", BODY), ("fx_arcs_ice", BODY), ("dust_small", GROUND),
        ("dash_ring", GROUND), ("dash_shock", GROUND),
    ]),
    "air blast": (0.12, 14, [
        ("air_muzzle", (-3, 1.5, 0)), ("shatter_ice", (-3, 1.5, 0)), ("fx_arcs_ice", (-3, 1.5, 0)),
        ("air_streak", (-1, 1.5, 0)), ("air_ring", (-1, 1.5, 0)), ("air_streak", (1, 1.5, 0)),
        ("air_streak", (3, 1.5, 0)), ("air_ring", (3, 1.5, 0)),
    ]),
    "teleport": (0.12, 9, [
        ("blink_in", BODY), ("blink_ring", BODY), ("blink_spiral", BODY), ("dust_small", GROUND),
    ]),
    "guard and nullify": (0.12, 9, [
        ("guard_spark", (-2, 1.2, 0)), ("guard_flash", (-2, 1.2, 0)), ("ring_pop_gold", (-2, 1.2, 0)),
        ("nullify_ward", (2, 1.2, 0)), ("nullify_ripple", (2, 1.2, 0)), ("nullify_sparks", (2, 1.2, 0)),
        ("fx_arcs_gold", (2, 1.2, 0)),
    ]),
    "counter": (0.12, 9, [
        ("counter_cut", TARGET), ("kick_burst", TARGET), ("kick_ring", TARGET), ("impact_gold", TARGET),
        ("shatter_gold", TARGET), ("fx_arcs_gold", TARGET),
    ]),
    "aura while worn (ultra only)": (0.12, 9, [("ultra_aura", WHEEL), ("ultra_aura_ground", GROUND)]),
    "domain, one second into a copy": (1.0, 84, [
        ("seal_wall", (0, 1, 0)), ("seal_wall", (0, 1, 0), 2.0), ("seal_wall", (0, 1, 0), 4.0),
        ("seal_floor", (0, 0.15, 0)), ("seal_sky", (0, 40, 0)),
    ]),
    "quake": (0.3, 34, [
        ("quake_ring", GROUND), ("quake_dust", GROUND), ("quake_crack", GROUND), ("ground_flash", GROUND),
        ("ring_wave_gold", GROUND), ("dust_burst", GROUND),
    ]),
}
FULL = [
    ("adapt_flare", WHEEL), ("adapt_dharma", WHEEL), ("adapt_sparks", WHEEL), ("adapt_boom", WHEEL),
    ("fx_arcs_gold", WHEEL), ("shatter_gold", WHEEL), ("adapt_nova", GROUND), ("adapt_mandala_burst", GROUND),
    ("adapt_rays", GROUND), ("adapt_embers", GROUND), ("adapt_bolts", GROUND), ("adapt_octagram", GROUND),
    ("ground_flash", GROUND), ("ring_wave_gold", GROUND), ("dust_burst", GROUND), ("adapt_storm", GROUND),
    ("adapt_stars", GROUND), ("adapt_fire", GROUND), ("adapt_beam", GROUND), ("quake_crack", GROUND),
]
for key in ("full adaptation, 0.25 s", "full adaptation, 1.3 s"):
    SCENES[key] = (SCENES[key][0], SCENES[key][1], FULL)


class Maths:
    pi = math.pi
    sqrt = staticmethod(lambda x: math.sqrt(max(0.0, x)))
    sin = staticmethod(lambda d: math.sin(math.radians(d)))
    cos = staticmethod(lambda d: math.cos(math.radians(d)))
    min = staticmethod(min)
    max = staticmethod(max)
    abs = staticmethod(abs)
    floor = staticmethod(math.floor)
    pow = staticmethod(pow)
    random = staticmethod(lambda a, b: random.uniform(a, b))


def molang(expr, env):
    if isinstance(expr, (int, float)):
        return float(expr)
    text = expr.replace("&&", " and ").replace("||", " or ").replace("math.", "M.")
    text = re.sub(r"\bv(?:ariable)?\.([a-z_0-9]+)\.([xyz])", r"V['\1.\2']", text)
    text = re.sub(r"\bv(?:ariable)?\.([a-z_0-9]+)", r"V['\1']", text)
    if "?" in text:
        test, rest = text.split("?", 1)
        yes, no = rest.rsplit(":", 1)
        text = f"(({yes}) if ({test}) else ({no}))"
    return float(eval(text, {"V": env, "M": Maths}))  # noqa: S307 - our own files


def tiers():
    block = SCRIPT.read_text(encoding="utf-8")
    block = block[block.index("/* fx-tiers:begin"):block.index("/* fx-tiers:end */")]
    table = {}
    for name, body in re.findall(r'"xvoid:([a-z0-9_]+)": \{(.*)\},', block):
        entry = {}
        for key in ("low", "medium", "ultra"):
            found = re.search(key + r": \[(.*?)\]", body)
            if found is not None:
                entry[key] = re.findall(r'"xvoid:([a-z0-9_]+)"', found.group(1))
        table[name] = entry
    return table


TEXTURES = {}


def texture(path):
    if path not in TEXTURES:
        TEXTURES[path] = np.asarray(Image.open(PACK / (path + ".png")).convert("RGBA")).astype(np.float32) / 255
    return TEXTURES[path]


def unit(vector):
    length = math.sqrt(sum(c * c for c in vector)) or 1.0
    return [c / length for c in vector]


def random_unit():
    while True:
        v = [random.uniform(-1, 1) for _ in range(3)]
        if 0.05 < sum(c * c for c in v) <= 1:
            return unit(v)


def birth(parts, env):
    """Start position and flight direction of one particle."""
    kind = next(k for k in parts if k.startswith("minecraft:emitter_shape_"))
    spec = parts[kind]
    offset = [molang(c, env) for c in spec.get("offset", [0, 0, 0])]
    direction = spec.get("direction", "outwards")
    if kind.endswith("point"):
        local = [0.0, 0.0, 0.0]
    elif kind.endswith("sphere"):
        radius = molang(spec.get("radius", 1), env)
        scale = 1.0 if spec.get("surface_only") else random.random() ** (1 / 3)
        local = [c * radius * scale for c in random_unit()]
    elif kind.endswith("disc"):
        radius = molang(spec.get("radius", 1), env)
        scale = 1.0 if spec.get("surface_only") else math.sqrt(random.random())
        angle = random.uniform(0, math.tau)
        local = [math.cos(angle) * radius * scale, 0.0, math.sin(angle) * radius * scale]
        if spec.get("plane_normal", "y") != "y":  # a disc that faces the script direction: stand it up
            local = [0.0, local[0], local[2]]
    else:
        half = [molang(c, env) for c in spec.get("half_dimensions", [1, 1, 1])]
        local = [random.uniform(-h, h) for h in half]
    if isinstance(direction, list):
        flight = unit([molang(c, env) for c in direction])
    elif direction == "inwards":
        flight = unit([-c for c in local]) if any(local) else random_unit()
    else:
        flight = unit(local) if any(local) else random_unit()
    return [local[i] + offset[i] for i in range(3)], flight


def simulate(name, origin, now):
    """Particles of one emitter that are alive at `now`: (data, parts, position, velocity, age, life, env)."""
    data = json.loads((PACK / "particles" / f"{name}.json").read_text(encoding="utf-8"))["particle_effect"]
    parts = data["components"]
    env = {f"{name}.{axis}": value for name in ("blast_dir", "kick_dir", "dash_dir") for axis, value in zip("xyz", (1.0, 0.0, 0.0))}
    env.update({"ward_dir.x": 0.0, "ward_dir.y": 0.0, "ward_dir.z": 1.0})
    env.update({"ride.x": 0.0, "ride.y": 1.0, "ride.z": 0.0, "ride_speed": 0.0})  # a wearer who stands still
    births = []
    if "minecraft:emitter_rate_instant" in parts:
        births = [0.0] * int(molang(parts["minecraft:emitter_rate_instant"]["num_particles"], env))
    else:
        rate = parts["minecraft:emitter_rate_steady"]
        active = molang(parts["minecraft:emitter_lifetime_once"]["active_time"], env)
        clock, owed = 0.0, 0.0
        while clock < min(active, now):
            env["emitter_age"] = clock
            owed += molang(rate["spawn_rate"], env) * STEP
            while owed >= 1:
                births.append(clock)
                owed -= 1
            clock += STEP
    alive = []
    motion = parts.get("minecraft:particle_motion_dynamic", {})
    accel = motion.get("linear_acceleration", [0, 0, 0])
    drag = motion.get("linear_drag_coefficient", 0)
    for born in births:
        age = now - born
        env = dict(env, particle_random_1=random.random(), particle_random_2=random.random(), particle_age=0.0)
        life = molang(parts["minecraft:particle_lifetime_expression"]["max_lifetime"], env)
        env["particle_lifetime"] = life
        if age < 0 or age >= life:
            continue
        position, flight = birth(parts, env)
        speed = molang(parts["minecraft:particle_initial_speed"], env)
        velocity = [c * speed for c in flight]
        spin = parts.get("minecraft:particle_initial_spin", {})
        turn = molang(spin.get("rotation", 0), env) + molang(spin.get("rotation_rate", 0), env) * age
        clock = 0.0
        while clock < age:
            env["particle_age"] = clock
            push = [molang(c, env) for c in accel]
            slow = molang(drag, env)
            velocity = [velocity[i] + (push[i] - slow * velocity[i]) * STEP for i in range(3)]
            position = [position[i] + velocity[i] * STEP for i in range(3)]
            clock += STEP
        env["particle_age"] = age
        alive.append((data, [position[i] + origin[i] for i in range(3)], velocity if speed else flight, age, life, turn, env))
    return alive


def frame(data, age, life):
    parts = data["components"]
    image = texture(data["description"]["basic_render_parameters"]["texture"])
    uv = parts["minecraft:particle_appearance_billboard"]["uv"]
    scale_x, scale_y = image.shape[1] / uv["texture_width"], image.shape[0] / uv["texture_height"]
    if "flipbook" in uv:
        flip = uv["flipbook"]
        count = flip["max_frame"]
        index = int(age / life * count) if flip.get("stretch_to_lifetime") else int(age * flip["frames_per_second"])
        index = index % count if flip.get("loop") else min(count - 1, index)
        x = flip["base_UV"][0] + flip.get("step_UV", [0, 0])[0] * index
        y = flip["base_UV"][1] + flip.get("step_UV", [0, 0])[1] * index
        w, h = flip["size_UV"]
    else:
        (x, y), (w, h) = uv["uv"], uv["uv_size"]
    return image[int(y * scale_y):int((y + h) * scale_y), int(x * scale_x):int((x + w) * scale_x)]


def colour(parts, env):
    spec = parts["minecraft:particle_appearance_tinting"]["color"]
    if isinstance(spec, list):
        return [molang(c, env) for c in spec] + ([1.0] if len(spec) == 3 else [])
    at = molang(spec["interpolant"], env)
    stops = sorted((float(k), v) for k, v in spec["gradient"].items())
    xs = [s[0] for s in stops]
    return [float(np.interp(at, xs, [(s[1] + [1.0])[c] for s in stops])) for c in range(4)]


def paint(canvas, particles, scale, centre):
    height, width = canvas.shape[:2]
    for data, position, velocity, age, life, turn, env in sorted(particles, key=lambda p: p[1][2]):
        parts = data["components"]
        board = parts["minecraft:particle_appearance_billboard"]
        try:
            half_w, half_h = (molang(side, env) for side in board["size"])
        except Exception:  # noqa: BLE001 - a size this script cannot read is skipped
            continue
        if half_w <= 0 or half_h <= 0:
            continue
        tint = colour(parts, env)
        if tint[3] <= 0.01:
            continue
        mode = board["facing_camera_mode"]
        angle = turn
        if mode == "emitter_transform_xz":
            half_h *= math.sin(TILT)
        elif mode == "lookat_direction":
            angle = math.degrees(math.atan2(velocity[1] * math.cos(TILT) - velocity[2] * math.sin(TILT), velocity[0]))
        elif mode == "lookat_y":
            angle = 0
        pixels_w, pixels_h = max(1, round(2 * half_w * scale)), max(1, round(2 * half_h * scale))
        if max(pixels_w, pixels_h) > 4000:
            continue
        sprite = Image.fromarray((np.clip(frame(data, age, life), 0, 1) * 255).astype(np.uint8), "RGBA")
        if mode == "emitter_transform_xz":
            sprite = sprite.rotate(angle, resample=Image.BILINEAR).resize((pixels_w, pixels_h), Image.BILINEAR)
        else:
            sprite = sprite.resize((pixels_w, pixels_h), Image.BILINEAR)
            if angle:
                sprite = sprite.rotate(angle, resample=Image.BILINEAR, expand=True)
        pixels = np.asarray(sprite).astype(np.float32) / 255
        x = round(centre[0] + position[0] * scale - pixels.shape[1] / 2)
        y = round(centre[1] - (position[1] * math.cos(TILT) - position[2] * math.sin(TILT)) * scale - pixels.shape[0] / 2)
        left, top, right, bottom = max(0, x), max(0, y), min(width, x + pixels.shape[1]), min(height, y + pixels.shape[0])
        if left >= right or top >= bottom:
            continue
        part = pixels[top - y:bottom - y, left - x:right - x]
        alpha = part[..., 3:4] * tint[3]
        shade = part[..., :3] * np.array(tint[:3], dtype=np.float32)
        area = canvas[top:bottom, left:right]
        if data["description"]["basic_render_parameters"]["material"] == "particles_add":
            area += shade * alpha
        else:
            area *= 1 - alpha
            area += shade * alpha


def cell(scene, level, table, size=(520, 330)):
    now, across, spawns = SCENES[scene]
    scale = size[0] / across
    centre = (size[0] / 2, size[1] * 0.82)
    canvas = np.zeros((size[1], size[0], 3), dtype=np.float32)
    canvas[:] = np.array([0.07, 0.085, 0.12])
    canvas[int(centre[1]):] = np.array([0.1, 0.115, 0.13])
    px, py = round(0.3 * scale), round(1.8 * scale)  # a player for scale
    canvas[int(centre[1] - py):int(centre[1]), int(centre[0] - px):int(centre[0] + px)] = np.array([0.2, 0.23, 0.28])
    random.seed(7)
    particles, emitters = [], 0
    for name, origin, *earlier in spawns:
        for effect in table.get(name, {}).get(level, [name] if (PACK / "particles" / f"{name}.json").exists() else []):
            emitters += 1
            particles += simulate(effect, origin, now + (earlier[0] if earlier else 0.0))
    paint(canvas, particles, scale, centre)
    image = Image.fromarray((np.clip(canvas, 0, 1) * 255).astype(np.uint8))
    ImageDraw.Draw(image).text((6, 4), f"{emitters} emitters, {len(particles)} particles alive", fill=(170, 180, 190))
    return image


def main():
    table = tiers()
    levels = ("low", "medium", "ultra")
    size, label, head = (520, 330), 150, 26
    sheet = Image.new("RGB", (label + size[0] * 3, head + size[1] * len(SCENES)), (14, 16, 22))
    draw = ImageDraw.Draw(sheet)
    for column, level in enumerate(levels):
        draw.text((label + column * size[0] + size[0] // 2 - 20, 7), level.upper(), fill=(255, 215, 120))
    for row, scene in enumerate(SCENES):
        draw.text((8, head + row * size[1] + size[1] // 2), scene, fill=(230, 230, 230))
        for column, level in enumerate(levels):
            sheet.paste(cell(scene, level, table, size), (label + column * size[0], head + row * size[1]))
    sheet.save(HERE / "preview_tiers.jpg", quality=84)
    print("wrote", (HERE / "preview_tiers.jpg").relative_to(ROOT), sheet.size)


if __name__ == "__main__":
    main()
