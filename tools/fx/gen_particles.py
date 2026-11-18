"""Writes the particle effects of every move except the full adaptation set.

    python3 tools/fx/gen_particles.py

The eleven effects of the full adaptation (adapt_mandala, adapt_gather,
adapt_halo, adapt_ripple, adapt_flare, adapt_dharma, adapt_nova,
adapt_mandala_burst, adapt_rays, adapt_sparks, adapt_embers) are tuned by
hand and are not touched here.

Textures named fb_* are flipbook sheets imported from the Elemental Weapon
addon by import_flipbooks.py, which also writes their layout to flipbooks.json.

/woa:performance picks one of three tiers for each player. The script spawns
the effect ids it always did; the table at the end of this file says what each
id turns into on low and on ultra, and is written into main.js between the
fx-tiers markers.

Billboard sizes are half extents, in blocks. Every particle that moves needs
`particle_motion_dynamic`, even an empty one.
"""

import copy
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "Wheel of Adaptation RP" / "particles"
SCRIPT = ROOT / "Wheel of Adaptation BP" / "scripts" / "main.js"
TEX = "textures/particle/xvoid/"

T = "v.particle_age / v.particle_lifetime"
R1 = "v.particle_random_1"

WHITE = (1.0, 1.0, 1.0)
PALE = (1.0, 0.93, 0.62)
GOLD = (1.0, 0.8, 0.3)
AMBER = (1.0, 0.7, 0.2)
ICE = (0.92, 0.96, 1.0)
MINT = (0.55, 1.0, 0.8)
CYAN = (0.4, 0.95, 1.0)
AIR1 = (0.88, 0.96, 1.0)
AIR2 = (0.75, 0.9, 1.0)
AIR3 = (0.7, 0.85, 1.0)
INK0 = (0.02, 0.02, 0.03)
INK1 = (0.06, 0.05, 0.1)
INK2 = (0.1, 0.07, 0.18)
DUSK0 = (0.06, 0.05, 0.1)
DUSK1 = (0.2, 0.18, 0.3)
DUSK2 = (0.38, 0.36, 0.5)
VIOLET = (0.75, 0.75, 1.0)

FLIP = json.loads((Path(__file__).parent / "flipbooks.json").read_text())

EFFECTS = {}
LF_FILES = {"wheel_mote"}  # this one file had LF endings from the start

FULL_UV = {"texture_width": 1, "texture_height": 1, "uv": [0, 0], "uv_size": [1, 1]}


def glint_uv(fps=10):
    """The glint sheets hold four 32 px frames, played as a twinkle."""
    return {
        "texture_width": 128,
        "texture_height": 32,
        "flipbook": {
            "base_UV": [0, 0],
            "size_UV": [32, 32],
            "step_UV": [32, 0],
            "frames_per_second": fps,
            "max_frame": 4,
            "loop": True,
        },
    }


def flip_uv(name, fps=None, loop=False, reverse=False):
    """Plays a fb_* sheet. Without fps the frames are spread over the particle lifetime."""
    (w, h), n = FLIP[name]["cell"], FLIP[name]["frames"]
    book = {
        "base_UV": [w * (n - 1) if reverse else 0, 0],
        "size_UV": [w, h],
        "step_UV": [-w if reverse else w, 0],
        "max_frame": n,
    }
    if fps is None:
        book["stretch_to_lifetime"] = True
    else:
        book["frames_per_second"] = fps
    if loop:
        book["loop"] = True
    return {"texture_width": w * n, "texture_height": h, "flipbook": book}


def grad(*stops):
    """stops: (position, rgb, alpha)"""
    return {
        "color": {
            "interpolant": T,
            "gradient": {f"{pos:.2f}": [*rgb, float(alpha)] for pos, rgb, alpha in stops},
        }
    }


def gold_fade():
    return grad((0, WHITE, 1), (0.33, PALE, 1), (0.67, GOLD, 1), (1, AMBER, 0))


def white_fade(end=ICE):
    return grad((0, WHITE, 1), (0.5, ICE, 1), (1, end, 0))


def vec(name):
    return [f"v.{name}.x", f"v.{name}.y", f"v.{name}.z"]


def once(n=1):
    return {
        "minecraft:emitter_rate_instant": {"num_particles": n},
        "minecraft:emitter_lifetime_once": {"active_time": 0.05},
    }


def effect(name, material, texture, *parts):
    components = {}
    for part in parts:
        components.update(part)
    EFFECTS[name] = {
        "format_version": "1.10.0",
        "particle_effect": {
            "description": {
                "identifier": f"xvoid:{name}",
                "basic_render_parameters": {"material": material, "texture": TEX + texture},
            },
            "components": components,
        },
    }


def shape(kind, **fields):
    return {f"minecraft:emitter_shape_{kind}": fields}


def life(value):
    return {"minecraft:particle_lifetime_expression": {"max_lifetime": value}}


def speed(value):
    return {"minecraft:particle_initial_speed": value}


def spin(rotation=0, rate=0):
    return {"minecraft:particle_initial_spin": {"rotation": rotation, "rotation_rate": rate}}


def motion(drag=None, accel=None, rotation_drag=None):
    fields = {}
    if accel is not None:
        fields["linear_acceleration"] = accel
    if drag is not None:
        fields["linear_drag_coefficient"] = drag
    if rotation_drag is not None:
        fields["rotation_drag_coefficient"] = rotation_drag
    return {"minecraft:particle_motion_dynamic": fields}


def billboard(size, facing="lookat_xyz", uv=None):
    if isinstance(size, (str, int, float)):
        size = [size, size]
    return {
        "minecraft:particle_appearance_billboard": {
            "size": list(size),
            "facing_camera_mode": facing,
            "uv": uv or FULL_UV,
        }
    }


def tint(gradient):
    return {"minecraft:particle_appearance_tinting": gradient}


# Reusable looks -------------------------------------------------------------


def needles(name, count, emitter_shape, lifetime, velocity, length, width, gradient, drag=5.0, gravity=0.0,
            material="particles_add"):
    """Sparks drawn as needles that point where they fly."""
    effect(
        name, material, "fx_streak", once(count), emitter_shape, life(lifetime), speed(velocity),
        motion(drag=drag, accel=[0, gravity, 0] if gravity else None),
        billboard([f"{length} * (1 - {T})", f"{width} * (1 - 0.5 * {T})"], "lookat_direction"),
        tint(gradient),
    )


def speed_lines(name, count, emitter_shape, lifetime, velocity, length, grow, width, gradient, drag,
                material="particles_add"):
    """Long streaks that stretch while they fade. Used by dash, blink and air blast."""
    effect(
        name, material, "fx_streak", once(count), emitter_shape, life(lifetime), speed(velocity), motion(drag=drag),
        billboard([f"{length} + {T} * {grow}", f"{width} * (1 - {T})"], "lookat_direction"),
        tint(gradient),
    )


def pop(name, texture, lifetime, start, grow, gradient, facing="lookat_xyz", rotation=None, rate=0, count=1,
        material="particles_add"):
    """One sprite that opens fast and fades: flashes, rings, seals. fb_* textures play as a flipbook."""
    parts = [once(count), shape("point"), life(lifetime), speed(0)]
    if rotation is not None or rate:
        parts += [spin(rotation or 0, rate), motion(rotation_drag=1.0)]
    uv = flip_uv(texture) if texture in FLIP and FLIP[texture]["frames"] > 1 else None
    parts += [billboard(f"{start} + {grow} * math.sqrt({T})", facing, uv), tint(gradient)]
    effect(name, material, texture, *parts)


def facing_pop(name, texture, direction, lifetime, start, grow, gradient, rate=0, material="particles_add"):
    """Like pop(), but the sprite stands across a direction given by the script."""
    parts = [once(1), shape("point", direction=vec(direction)), life(lifetime), speed(0.2)]
    if rate:
        parts.append(spin("math.random(0, 360)", rate))
    uv = flip_uv(texture) if texture in FLIP and FLIP[texture]["frames"] > 1 else None
    parts += [
        motion(rotation_drag=1.0) if rate else motion(),
        billboard(f"{start} + {grow} * math.sqrt({T})", "direction_z", uv),
        tint(gradient),
    ]
    effect(name, material, texture, *parts)


def twinkle(size, extra):
    return f"({size} + {extra} * {R1}) * math.sin(180 * {T})"


# Wheel -----------------------------------------------------------------------

effect(
    "wheel_spin", "particles_add", "adapt_glint", once(16),
    shape("disc", radius=0.75, plane_normal="y", surface_only=True, direction="outwards"),
    life("math.random(0.35, 0.6)"), speed("math.random(0.6, 1.6)"), motion(drag=3.0),
    billboard(twinkle(0.1, 0.08), uv=glint_uv(12)),
    tint(grad((0, WHITE, 1), (0.5, PALE, 1), (1, GOLD, 1))),
)

effect(
    "adapt_charge", "particles_add", "adapt_glint", once(22),
    shape("sphere", radius=1.8, surface_only=True, direction="inwards"),
    life(0.42), speed(4.2), motion(drag=1.0),
    billboard(f"0.06 + 0.1 * {T}", uv=glint_uv(12)),
    tint(grad((0, AMBER, 0), (0.5, GOLD, 1), (1, PALE, 1))),
)

effect(
    "wheel_mote", "particles_add", "adapt_glint",
    {
        "minecraft:emitter_local_space": {"position": True, "rotation": False},
        "minecraft:emitter_rate_steady": {
            "spawn_rate": "v.emitter_age > 1.25 && v.emitter_age < 3.5 ? 15 : 0",
            "max_particles": 30,
        },
        "minecraft:emitter_lifetime_once": {"active_time": 3.8},
    },
    shape("disc", radius=0.6, plane_normal="y", surface_only=True, direction=[0, 1, 0]),
    life("math.random(0.8, 1.2)"), speed("math.random(0.2, 0.45)"), motion(drag=0.8, accel=[0, 0.3, 0]),
    billboard(twinkle(0.06, 0.05), uv=glint_uv(10)),
    tint(grad((0, WHITE, 1), (0.6, PALE, 1), (1, GOLD, 1))),
)

pop("ray_spark", "adapt_flare", 0.4, 0.12, 0.3, grad((0, WHITE, 1), (0.5, PALE, 1), (1, AMBER, 0)), rate=90)

# Undying: the wheel refuses death -------------------------------------------

needles(
    "adapt_burst", 40, shape("sphere", radius=0.25, direction="outwards"), "math.random(0.5, 0.9)",
    "math.random(5.0, 9.0)", 0.36, 0.04, gold_fade(), drag=4.5, gravity=-2.0,
)
pop("adapt_flash", "fb_burst", 0.55, 2.8, 1.8, grad((0, WHITE, 1), (0.35, PALE, 1), (1, AMBER, 0.7)))
effect(
    "adapt_pillar", "particles_add", "adapt_ray", once(16),
    shape("disc", radius=0.95, plane_normal="y", surface_only=True, direction=[0, 1, 0]),
    life("math.random(0.7, 1.2)"), speed("math.random(3.3, 3.8)"), motion(accel=[0, 0, 0]),
    billboard([f"(0.09 + 0.12 * {R1}) * (1 - 0.5 * {T})", "0.6 + 3.2 * v.particle_age"], "lookat_y"),
    tint(grad((0, WHITE, 0), (0.15, PALE, 0.85), (0.6, GOLD, 0.55), (1, AMBER, 0))),
)
pop("adapt_seal", "adapt_mandala", 1.3, 1.2, 2.0, gold_fade(), "emitter_transform_xz", rate=-200)
pop(
    "adapt_shockwave", "adapt_nova", 0.6, 0.6, 5.5, grad((0, WHITE, 1), (0.5, PALE, 1), (1, AMBER, 0)),
    "emitter_transform_xz", rotation="math.random(0, 360)",
)

# Nullified hit: a ward stands between the player and the attack --------------

facing_pop(
    "nullify_ward", "adapt_ward", "ward_dir", 0.55, 0.3, 0.55,
    grad((0, WHITE, 1), (0.25, PALE, 1), (0.6, GOLD, 0.8), (1, AMBER, 0)),
)
facing_pop(
    "nullify_ripple", "fb_burst", "ward_dir", 0.42, 1.2, 0.9, grad((0, WHITE, 1), (0.4, PALE, 1), (1, AMBER, 0.6)),
)
needles(
    "nullify_sparks", 16, shape("disc", radius=0.3, plane_normal=vec("ward_dir"), direction="outwards"),
    "math.random(0.25, 0.5)", "math.random(3.0, 6.0)", 0.26, 0.035, gold_fade(), drag=4.0, gravity=-3.0,
)

# Sword of Extermination ------------------------------------------------------

effect(
    "slash_trail", "particles_add", "soft_dot", once(1), shape("point"), life(0.3), speed(0),
    billboard(f"0.42 * (1 - {T})"),
    tint(grad((0, WHITE, 1), (0.5, (0.9, 0.95, 1.0), 1), (1, (0.65, 0.8, 1.0), 0))),
)
effect(
    "slash_ink", "particles_blend", "soft_dot", once(1), shape("point"), life(0.34), speed(0),
    billboard(f"0.5 * (1 - {T} * 0.6)"),
    tint(grad((0, INK0, 0.95), (0.5, INK1, 0.7), (1, INK2, 0))),
)
needles(
    "slash_ink_spark", 4, shape("sphere", radius=0.1, direction="outwards"), "math.random(0.25, 0.45)",
    "math.random(1.5, 3.2)", 0.2, 0.045, grad((0, INK0, 0.95), (0.5, INK1, 0.75), (1, INK2, 0)), drag=4.0,
    gravity=-3.0, material="particles_blend",
)
effect(
    "slash_spark", "particles_add", "fx_glint", once(3), shape("sphere", radius=0.25, direction="outwards"),
    life("math.random(0.25, 0.45)"), speed("math.random(0.6, 1.6)"), motion(drag=3.0),
    billboard(twinkle(0.09, 0.08), uv=glint_uv(12)), tint(grad((0, WHITE, 1), (1, ICE, 1))),
)
pop(
    "slash_cut", "fb_slash", 0.3, 1.2, 0.4, grad((0, WHITE, 1), (0.5, ICE, 1), (1, (0.65, 0.8, 1.0), 0.7)),
    rotation="math.random(0, 360)", count=2,
)

# Positive energy: strike, purify, heal ---------------------------------------

needles(
    "positive_burst", 24, shape("sphere", radius=0.25, direction="outwards"), "math.random(0.35, 0.7)",
    "math.random(3.0, 6.0)", 0.26, 0.035, white_fade((0.7, 1.0, 0.9)),
)
pop(
    "positive_flash", "fb_flare", 0.34, 0.9, 0.4, grad((0, WHITE, 1), (0.4, ICE, 1), (1, MINT, 0.7)),
    rotation="math.random(0, 90)",
)
pop("positive_ring", "fx_shock", 0.35, 0.2, 1.4, grad((0, WHITE, 0.8), (0.5, MINT, 0.5), (1, CYAN, 0)))
effect(
    "positive_rise", "particles_add", "fx_glint", once(26),
    shape("disc", radius=0.7, plane_normal="y", direction=[0, 1, 0]),
    life("math.random(0.8, 1.4)"), speed("math.random(0.8, 2.0)"), motion(drag=1.0, accel=[0, 0.8, 0]),
    billboard(twinkle(0.08, 0.07), uv=glint_uv(10)),
    tint(grad((0, WHITE, 1), (0.5, ICE, 1), (1, MINT, 1))),
)
effect(
    "positive_rays", "particles_add", "fx_ray", once(10),
    shape("disc", radius=0.75, plane_normal="y", surface_only=True, direction=[0, 1, 0]),
    life("math.random(0.6, 1.0)"), speed(3.0), motion(accel=[0, 0, 0]),
    billboard([f"(0.07 + 0.1 * {R1}) * (1 - 0.5 * {T})", "0.5 + 3.0 * v.particle_age"], "lookat_y"),
    tint(grad((0, WHITE, 0), (0.15, ICE, 0.7), (0.6, MINT, 0.45), (1, CYAN, 0))),
)
pop(
    "positive_seal", "fx_wheel", 1.0, 0.7, 1.1, grad((0, WHITE, 0.9), (0.4, MINT, 0.7), (1, CYAN, 0)),
    "emitter_transform_xz", rate=140,
)
pop(
    "regen_pulse", "fx_shock", 0.8, 0.5, 3.5, grad((0, WHITE, 1), (0.5, MINT, 1), (1, CYAN, 0)),
    "emitter_transform_xz", rotation="math.random(0, 360)",
)
effect(
    "positive_aura", "particles_add", "fx_glint",
    {
        "minecraft:emitter_local_space": {"position": True, "rotation": True},
        "minecraft:emitter_rate_steady": {"spawn_rate": 16, "max_particles": 24},
        "minecraft:emitter_lifetime_once": {"active_time": 0.5},
    },
    shape("box", half_dimensions=[0.04, 0.55, 0.04], direction="outwards"),
    life("math.random(0.35, 0.7)"), speed("math.random(0.02, 0.12)"), motion(drag=1.5, accel=[0, 0.35, 0]),
    billboard(twinkle(0.05, 0.04), uv=glint_uv(12)), tint(grad((0, WHITE, 1), (1, ICE, 1))),
)

# Air blast -------------------------------------------------------------------

AIR_FADE = grad((0, AIR1, 0.85), (0.5, AIR2, 0.45), (1, AIR3, 0))

effect(
    "air_charge", "particles_blend", "fx_streak",
    {
        "minecraft:emitter_rate_steady": {"spawn_rate": 34, "max_particles": 24},
        "minecraft:emitter_lifetime_once": {"active_time": 0.45},
    },
    shape("sphere", radius=1.0, surface_only=True, direction="inwards"),
    life(0.25), speed(4.0), motion(),
    billboard([f"0.26 * (1 - 0.6 * {T})", 0.035], "lookat_direction"),
    tint(grad((0, AIR3, 0), (0.4, AIR1, 0.9), (1, WHITE, 0.6))),
)
effect(
    "air_core", "particles_add", "fx_flare", once(1), shape("point"), life(0.5), speed(0),
    spin(0, 120), motion(rotation_drag=0.0),
    billboard(f"0.08 + 0.5 * {T} * {T} + 0.04 * math.sin(1440 * {T})"),
    tint(grad((0, AIR3, 0), (0.5, AIR1, 0.9), (0.9, WHITE, 1), (1, WHITE, 0))),
)
facing_pop("air_ring", "fb_swirl", "blast_dir", 0.4, 0.5, 2.4, AIR_FADE, rate=420, material="particles_blend")
facing_pop("air_muzzle", "fb_burst", "blast_dir", 0.36, 1.6, 1.6, grad((0, WHITE, 1), (0.5, AIR2, 0.9), (1, AIR3, 0.5)))
speed_lines(
    "air_streak", 4, shape("disc", radius=0.6, plane_normal=vec("blast_dir"), direction=vec("blast_dir")),
    "math.random(0.1, 0.2)", "math.random(18.0, 26.0)", 1.2, 1.6, 0.06, AIR_FADE, 6.0, material="particles_blend",
)

# Teleport kick ---------------------------------------------------------------

DUSK_FADE = grad((0, DUSK0, 0.9), (0.5, DUSK1, 0.6), (1, DUSK2, 0))

speed_lines(
    "blink_out", 14, shape("box", half_dimensions=[0.45, 0.9, 0.45], direction=vec("kick_dir")),
    "math.random(0.15, 0.25)", "math.random(10.0, 16.0)", 0.6, 1.4, 0.08, DUSK_FADE, 6.0, material="particles_blend",
)
speed_lines(
    "blink_in", 14, shape("sphere", radius=0.3, direction="outwards"),
    "math.random(0.15, 0.25)", "math.random(6.0, 10.0)", 0.6, 1.4, 0.08, DUSK_FADE, 6.0, material="particles_blend",
)
speed_lines(
    "blink_trail", 3, shape("box", half_dimensions=[0.25, 0.6, 0.25], direction=vec("kick_dir")),
    "math.random(0.08, 0.15)", "math.random(20.0, 30.0)", 1.6, 2.0, 0.06,
    grad((0, WHITE, 1), (0.5, ICE, 1), (1, (0.55, 0.55, 0.8), 0)), 8.0,
)
facing_pop(
    "blink_ring", "fb_burst", "kick_dir", 0.32, 1.1, 0.9, grad((0, WHITE, 1), (0.4, VIOLET, 1), (1, (0.5, 0.5, 0.8), 0.6)),
)
needles(
    "kick_impact", 18, shape("sphere", radius=0.2, direction="outwards"), "math.random(0.2, 0.4)",
    "math.random(4.5, 8.0)", 0.4, 0.045, gold_fade(),
)
pop(
    "kick_burst", "fb_hit", 0.3, 1.5, 0.6, grad((0, WHITE, 1), (0.35, PALE, 1), (1, AMBER, 0.7)),
    rotation="math.random(0, 360)",
)
pop("kick_ring", "fx_shock", 0.32, 0.2, 1.5, grad((0, WHITE, 0.9), (0.5, GOLD, 0.6), (1, AMBER, 0)))

# Punch -----------------------------------------------------------------------

needles(
    "punch_impact", 8, shape("sphere", radius=0.1, direction="outwards"), "math.random(0.15, 0.3)",
    "math.random(2.5, 4.5)", 0.24, 0.035, white_fade(),
)
pop(
    "punch_burst", "fb_hit", 0.24, 0.8, 0.3, grad((0, WHITE, 1), (0.5, ICE, 1), (1, ICE, 0.6)),
    rotation="math.random(0, 360)",
)

# Dash ------------------------------------------------------------------------

speed_lines(
    "dash_lines", 14, shape("box", half_dimensions=[0.4, 0.8, 0.4], direction=vec("dash_dir")),
    "math.random(0.12, 0.22)", "math.random(8.0, 14.0)", 0.9, 1.2, 0.06, white_fade(), 4.0,
)
effect(
    "dash_ring", "particles_blend", "fb_smoke", once(9),
    shape("disc", radius=0.3, plane_normal="y", direction="outwards"),
    life("math.random(0.4, 0.65)"), speed("math.random(3.0, 5.0)"),
    spin("math.random(0, 360)", "math.random(-60, 60)"), motion(drag=6.0, accel=[0, 0.6, 0]),
    billboard(f"0.3 + 0.25 * {T}", uv=flip_uv("fb_smoke")),
    tint(grad((0, (0.92, 0.92, 0.96), 0.7), (0.7, (0.8, 0.8, 0.85), 0.5), (1, (0.75, 0.75, 0.8), 0))),
)
pop(
    "dash_shock", "fx_shock", 0.3, 0.3, 1.5, grad((0, WHITE, 0.6), (0.5, ICE, 0.35), (1, ICE, 0)),
    "emitter_transform_xz", rotation="math.random(0, 360)",
)

# Guard -----------------------------------------------------------------------

needles(
    "guard_catch", 14, shape("sphere", radius=0.15, direction="outwards"), "math.random(0.25, 0.45)",
    "math.random(2.0, 4.0)", 0.2, 0.03, gold_fade(), drag=3.5, gravity=-2.0,
)
needles(
    "guard_spark", 10, shape("sphere", radius=0.1, direction="outwards"), "math.random(0.2, 0.35)",
    "math.random(2.5, 4.5)", 0.2, 0.03, white_fade(),
)
pop(
    "guard_flash", "fb_flare", 0.3, 0.7, 0.4, grad((0, WHITE, 1), (0.4, PALE, 1), (1, GOLD, 0.7)),
    rotation="math.random(0, 90)",
)

# New mechanics: counter, fall quake, reflected projectile --------------------

pop(
    "counter_cut", "fb_slash", 0.32, 1.4, 0.4, grad((0, WHITE, 1), (0.4, PALE, 1), (1, AMBER, 0.7)),
    rotation="math.random(0, 360)", count=2,
)
pop(
    "quake_ring", "adapt_nova", 0.5, 0.5, 3.8, grad((0, WHITE, 1), (0.4, PALE, 0.9), (1, AMBER, 0)),
    "emitter_transform_xz", rotation="math.random(0, 360)",
)
effect(
    "quake_dust", "particles_blend", "fb_smoke", once(18),
    shape("disc", radius=0.6, plane_normal="y", direction="outwards"),
    life("math.random(0.6, 0.95)"), speed("math.random(5.0, 9.0)"),
    spin("math.random(0, 360)", "math.random(-60, 60)"), motion(drag=4.0, accel=[0, 0.8, 0]),
    billboard(f"0.45 + 0.45 * {T}", uv=flip_uv("fb_smoke")),
    tint(grad((0, (0.9, 0.88, 0.82), 0.75), (0.7, (0.8, 0.77, 0.72), 0.55), (1, (0.75, 0.72, 0.68), 0))),
)
speed_lines(
    "reflect_bolt", 2, shape("point", direction=vec("ward_dir")), "math.random(0.12, 0.2)",
    "math.random(20.0, 30.0)", 1.2, 1.6, 0.07, gold_fade(), 8.0,
)
effect(
    "heal_sever", "particles_blend", "soft_dot", once(9),
    shape("sphere", radius=0.45, direction="outwards"),
    life("math.random(0.5, 0.85)"), speed("math.random(0.4, 1.3)"),
    motion(drag=2.0, accel=[0, -3.5, 0]),
    billboard(f"0.11 * (1 - {T} * 0.7)"),
    tint(grad((0, (1.0, 0.4, 0.35), 0.95), (0.45, (0.75, 0.1, 0.15), 0.85), (1, (0.3, 0.0, 0.05), 0))),
)

# Flipbook layers drawn by hand for the Elemental Weapon addon -----------------

GOLD_BOOK = grad((0, WHITE, 1), (0.35, PALE, 1), (1, AMBER, 0.7))

pop("wheel_crackle", "fb_crackle", 0.36, 0.8, 0.5, GOLD_BOOK, rotation="math.random(0, 360)")
pop("adapt_boom", "fb_burst", 0.6, 2.4, 2.2, GOLD_BOOK)
effect(
    "adapt_bolts", "particles_add", "fb_bolt",
    {
        "minecraft:emitter_rate_steady": {"spawn_rate": 30, "max_particles": 24},
        "minecraft:emitter_lifetime_once": {"active_time": 1.2},
    },
    shape("disc", radius=2.2, plane_normal="y", offset=[0, 1.7, 0]),
    life("math.random(0.22, 0.4)"), speed(0),
    billboard([f"0.98 + 0.52 * {R1}", f"1.3 + 0.7 * {R1}"], "lookat_y", flip_uv("fb_bolt")),
    tint(grad((0, WHITE, 1), (0.4, PALE, 1), (1, GOLD, 0.8))),
)
effect(
    "undying_flame", "particles_add", "fb_flame",
    {
        "minecraft:emitter_rate_steady": {"spawn_rate": 30, "max_particles": 28},
        "minecraft:emitter_lifetime_once": {"active_time": 0.8},
    },
    shape("disc", radius=0.95, plane_normal="y", direction=[0, 1, 0]),
    life("math.random(0.55, 0.9)"), speed("math.random(1.2, 2.6)"), motion(drag=0.6, accel=[0, 1.2, 0]),
    billboard(
        [f"(0.4 + 0.25 * {R1}) * (1 - 0.45 * {T})", f"(0.48 + 0.3 * {R1}) * (1 - 0.45 * {T})"],
        uv=flip_uv("fb_flame", fps=14, loop=True),
    ),
    tint(grad((0, WHITE, 0), (0.12, PALE, 1), (0.6, GOLD, 0.9), (1, AMBER, 0))),
)
effect(
    "quake_crack", "particles_blend", "fb_crack", once(1), shape("point"), life(2.4), speed(0),
    spin("math.random(0, 360)", 0), motion(rotation_drag=1.0),
    billboard(f"2.3 * math.min(1, 0.55 + 6 * {T})", "emitter_transform_xz"),
    tint(grad((0, WHITE, 1), (0.7, WHITE, 0.9), (1, WHITE, 0))),
)
pop(
    "heal_crackle", "fb_crackle", 0.42, 0.7, 0.5, grad((0, (1.0, 0.6, 0.55), 1), (0.4, (1.0, 0.25, 0.2), 1), (1, (0.6, 0.05, 0.1), 0.7)),
    rotation="math.random(0, 360)",
)
effect(
    "dash_flash", "particles_add", "fb_streak", once(1), shape("point", direction=vec("dash_dir")),
    life(0.3), speed(0.1), motion(),
    billboard([f"2.1 + 0.9 * {T}", f"1.4 + 0.6 * {T}"], "lookat_direction", flip_uv("fb_streak")),
    tint(grad((0, WHITE, 1), (0.6, ICE, 0.9), (1, ICE, 0.5))),
)


# Overdrive layers -------------------------------------------------------------
# A second pass for strong devices: lightning arcs, impact lines, shards, ring
# waves, twinkles, dust clouds and a ground seal on top of the effects above.

def steady(rate, limit, seconds):
    return {
        "minecraft:emitter_rate_steady": {"spawn_rate": rate, "max_particles": limit},
        "minecraft:emitter_lifetime_once": {"active_time": seconds},
    }


def arcs(name, emitter, radius, size, gradient, offset=(0, 0, 0)):
    """Short lightning arcs that flicker around a point."""
    effect(
        name, "particles_add", "fb_arc", emitter,
        shape("sphere", radius=radius, surface_only=True, offset=list(offset)),
        life("math.random(0.16, 0.34)"), speed(0),
        spin("math.random(0, 360)", 0), motion(rotation_drag=1.0),
        billboard(f"{size} * (0.7 + 0.6 * {R1})", uv=flip_uv("fb_arc", fps=26, loop=True)),
        tint(gradient),
    )


def ring_wave(name, count, lifetime, start, grow, gradient):
    """Rings that run along the ground one after another."""
    effect(
        name, "particles_add", "fb_ripple", steady(count / 0.45, count, 0.45), shape("point"),
        life(lifetime), speed(0),
        billboard(f"{start} + {grow} * math.sqrt({T})", "emitter_transform_xz", flip_uv("fb_ripple")),
        tint(gradient),
    )


def twinkles(name, emitter, radius, size, gradient, offset=(0, 0, 0)):
    effect(
        name, "particles_add", "fb_twinkle", emitter,
        shape("sphere", radius=radius, direction="outwards", offset=list(offset)),
        life("math.random(0.45, 0.95)"), speed("math.random(0.2, 1.0)"), motion(drag=1.5, accel=[0, 0.4, 0]),
        billboard(twinkle(size, size), uv=flip_uv("fb_twinkle")),
        tint(gradient),
    )


def dust(name, count, radius, velocity, size, grow, lifetime):
    effect(
        name, "particles_blend", "fb_cloud", once(count),
        shape("disc", radius=radius, plane_normal="y", direction="outwards"),
        life(lifetime), speed(velocity),
        spin("math.random(0, 360)", "math.random(-40, 40)"), motion(drag=3.0, accel=[0, 0.7, 0]),
        billboard(f"{size} + {grow} * {T}"),
        tint(grad((0, (0.88, 0.86, 0.82), 0), (0.15, (0.86, 0.84, 0.8), 0.55), (0.6, (0.8, 0.78, 0.75), 0.35),
                  (1, (0.75, 0.73, 0.7), 0))),
    )


GOLD_ARC = grad((0, WHITE, 1), (0.5, PALE, 1), (1, GOLD, 0.6))
ICE_ARC = grad((0, WHITE, 1), (0.5, ICE, 1), (1, (0.6, 0.8, 1.0), 0.6))
ICE_BOOK = grad((0, WHITE, 1), (0.5, ICE, 1), (1, (0.65, 0.8, 1.0), 0.7))
MINT_BOOK = grad((0, WHITE, 1), (0.4, ICE, 1), (1, MINT, 0.7))

arcs("fx_arcs_gold", once(5), 0.9, 0.75, GOLD_ARC)
arcs("fx_arcs_ice", once(4), 0.8, 0.65, ICE_ARC)
arcs("adapt_storm", steady(48, 30, 1.6), 2.6, 1.15, GOLD_ARC, offset=(0, 1.3, 0))

pop("impact_gold", "fb_cracks", 0.36, 1.7, 0.8, GOLD_BOOK, rotation="math.random(0, 360)")
pop("impact_ice", "fb_cracks", 0.3, 1.1, 0.5, ICE_BOOK, rotation="math.random(0, 360)")
pop(
    "ground_flash", "fb_cracks", 0.5, 3.6, 2.2, GOLD_BOOK,
    "emitter_transform_xz", rotation="math.random(0, 360)",
)
pop("shatter_gold", "fb_shatter", 0.32, 1.3, 0.6, GOLD_BOOK, rotation="math.random(0, 360)")
pop("shatter_ice", "fb_shatter", 0.3, 1.0, 0.5, ICE_BOOK, rotation="math.random(0, 360)")

ring_wave("ring_wave_gold", 3, 0.75, 0.8, 5.0, grad((0, WHITE, 1), (0.4, PALE, 1), (1, AMBER, 0.5)))
ring_wave("ring_wave_mint", 3, 0.8, 0.5, 2.6, grad((0, WHITE, 1), (0.4, MINT, 1), (1, CYAN, 0.5)))
pop("ring_pop_gold", "fb_ripple", 0.34, 0.5, 1.0, grad((0, WHITE, 1), (0.4, PALE, 1), (1, GOLD, 0.6)))
pop("ring_pop_ice", "fb_ripple", 0.3, 0.4, 0.8, ICE_BOOK)
pop("ring_pop_mint", "fb_ripple", 0.36, 0.5, 1.0, MINT_BOOK)

twinkles("twinkle_gold", once(10), 1.2, 0.14, grad((0, WHITE, 1), (0.5, PALE, 1), (1, GOLD, 1)))
twinkles("twinkle_mint", once(10), 1.0, 0.13, grad((0, WHITE, 1), (0.5, MINT, 1), (1, CYAN, 1)))
twinkles(
    "adapt_stars", steady(40, 60, 2.0), 3.2, 0.2, grad((0, WHITE, 1), (0.5, PALE, 1), (1, GOLD, 1)),
    offset=(0, 1.4, 0),
)

dust("dust_burst", 24, 0.9, "math.random(4.0, 8.0)", 0.6, 1.1, "math.random(0.9, 1.5)")
dust("dust_small", 7, 0.3, "math.random(1.5, 3.5)", 0.35, 0.6, "math.random(0.5, 0.9)")

effect(
    "adapt_octagram", "particles_add", "fb_octagram", once(1), shape("point"), life(2.6), speed(0),
    spin("math.random(0, 360)", 70), motion(rotation_drag=0.0),
    billboard(f"3.6 * math.min(1, 0.35 + 5 * {T})", "emitter_transform_xz"),
    tint(grad((0, WHITE, 0), (0.1, PALE, 1), (0.7, GOLD, 0.9), (1, AMBER, 0))),
)
effect(
    "adapt_fire", "particles_add", "fb_flame", steady(60, 56, 1.4),
    shape("disc", radius=2.4, plane_normal="y", surface_only=True, direction=[0, 1, 0]),
    life("math.random(0.5, 0.9)"), speed("math.random(1.0, 2.4)"), motion(drag=0.6, accel=[0, 1.2, 0]),
    billboard(
        [f"(0.4 + 0.25 * {R1}) * (1 - 0.45 * {T})", f"(0.48 + 0.3 * {R1}) * (1 - 0.45 * {T})"],
        uv=flip_uv("fb_flame", fps=14, loop=True),
    ),
    tint(grad((0, WHITE, 0), (0.12, PALE, 1), (0.6, GOLD, 0.9), (1, AMBER, 0))),
)
effect(
    "adapt_beam", "particles_add", "adapt_ray", once(1), shape("point", offset=[0, 9, 0]), life(0.8), speed(0),
    billboard([f"1.3 * (1 - {T}) * (1 - {T})", 12], "lookat_y"),
    tint(grad((0, WHITE, 1), (0.4, PALE, 0.9), (1, GOLD, 0))),
)

# Sword: a blade of light across the swing and along the flying slash.
effect(
    "slash_moon", "particles_add", "fb_moon", once(1), shape("point"), life(0.26), speed(0),
    billboard([f"1.5 + 0.4 * {T}", f"0.62 + 0.16 * {T}"], uv=flip_uv("fb_moon")),
    tint(grad((0, WHITE, 0.9), (0.5, ICE, 0.85), (1, (0.65, 0.8, 1.0), 0.5))),
)
effect(
    "slash_wave_moon", "particles_add", "fb_moon", once(1), shape("point"), life(0.24), speed(0),
    billboard([f"2.3 + 0.5 * {T}", f"0.95 + 0.2 * {T}"], uv=flip_uv("fb_moon")),
    tint(grad((0, WHITE, 0.9), (0.5, ICE, 0.85), (1, (0.55, 0.75, 1.0), 0.5))),
)

# Air blast and teleport: a vortex that winds up.
effect(
    "air_spiral", "particles_add", "fb_spiral", once(1), shape("point"), life(0.5), speed(0),
    spin("math.random(0, 360)", -900), motion(rotation_drag=0.0),
    billboard(f"1.1 - 0.7 * {T}"),
    tint(grad((0, AIR3, 0), (0.3, AIR2, 0.8), (1, WHITE, 1))),
)
effect(
    "blink_spiral", "particles_add", "fb_spiral", once(1), shape("point"), life(0.4), speed(0),
    spin("math.random(0, 360)", 720), motion(rotation_drag=0.0),
    billboard(f"0.5 + 1.0 * math.sqrt({T})"),
    tint(grad((0, WHITE, 1), (0.4, VIOLET, 0.8), (1, (0.5, 0.5, 0.8), 0))),
)


# Performance tiers ------------------------------------------------------------
# medium  the effects above, unchanged
# low     the cheap core of every move: single sprites and thinned bursts
# ultra   medium made larger and denser, plus the u_* layers below

TIERS = {}
RAND = "math.random(0, 360)"


def load(name):
    """An effect by name: generated in this run, or one of the hand-tuned files."""
    if name in EFFECTS:
        return EFFECTS[name]
    return json.loads((OUT / f"{name}.json").read_text(encoding="utf-8"))


def scaled(value, factor, whole=False):
    if isinstance(value, (int, float)):
        return max(1, round(value * factor)) if whole else round(value * factor, 4)
    return f"({value}) * {factor}"


def variant(name, suffix, count=1.0, size=1.0, seconds=1.0):
    """A copy of an effect with more or fewer particles, larger sprites or a longer emitter."""
    data = copy.deepcopy(load(name))
    new = f"{name}_{suffix}"
    data["particle_effect"]["description"]["identifier"] = f"xvoid:{new}"
    parts = data["particle_effect"]["components"]
    instant = parts.get("minecraft:emitter_rate_instant")
    if instant and count != 1.0:
        instant["num_particles"] = scaled(instant["num_particles"], count, whole=True)
    rate = parts.get("minecraft:emitter_rate_steady")
    if rate:
        rate["spawn_rate"] = scaled(rate["spawn_rate"], count)
        rate["max_particles"] = scaled(rate["max_particles"], count * seconds, whole=True)
        if seconds != 1.0:
            once_ = parts["minecraft:emitter_lifetime_once"]
            once_["active_time"] = scaled(once_["active_time"], seconds)
    if size != 1.0:
        board = parts["minecraft:particle_appearance_billboard"]
        board["size"] = [scaled(side, size) for side in board["size"]]
    EFFECTS[new] = data
    return new


def lite(name, count=0.4):
    return variant(name, "lite", count=count)


def grand(name, count=2.2, size=1.25, seconds=1.0):
    return variant(name, "ultra", count=count, size=size, seconds=seconds)


def tier(name, low=None, ultra=None, medium=None, thin=None):
    """What the script id `name` spawns per tier. None keeps the effect itself, [] spawns nothing."""
    entry = TIERS.setdefault(name, {})
    for key, value in (("low", low), ("medium", medium), ("ultra", ultra)):
        if value is not None:
            entry[key] = list(value)
    if thin:
        entry["thin"] = thin


def window(rate, start, stop, limit):
    """An emitter that waits, then spawns for a short while."""
    return {
        "minecraft:emitter_rate_steady": {
            "spawn_rate": f"v.emitter_age >= {start} && v.emitter_age < {stop} ? {rate} : 0",
            "max_particles": limit,
        },
        "minecraft:emitter_lifetime_once": {"active_time": stop + 0.05},
    }


def book(texture, reverse=False):
    return flip_uv(texture, reverse=reverse) if texture in FLIP and FLIP[texture]["frames"] > 1 else None


def flat(name, texture, lifetime, size, gradient, rate=0, offset=(0, 0, 0), emitter=None, material="particles_add",
         reverse=False):
    """A sprite that lies on the ground (or floats level in the air) and turns."""
    effect(
        name, material, texture, emitter or once(1), shape("point", offset=list(offset)), life(lifetime), speed(0),
        spin(RAND, rate), motion(rotation_drag=0.0),
        billboard(size, "emitter_transform_xz", book(texture, reverse)), tint(gradient),
    )


def ring_train(name, texture, count, gap, lifetime, start, grow, gradient, facing="emitter_transform_xz"):
    """Several rings, one after another."""
    effect(
        name, "particles_add", texture, steady(round(1 / gap, 3), count, round(gap * count + 0.03, 3)), shape("point"),
        life(lifetime), speed(0),
        billboard(f"{start} + {grow} * math.sqrt({T})", facing, book(texture)), tint(gradient),
    )


def glints(name, emitter, emitter_shape, lifetime, velocity, size, gradient, drag=1.5, lift=0.0, texture="fx_glint"):
    effect(
        name, "particles_add", texture, emitter, emitter_shape, life(lifetime), speed(velocity),
        motion(drag=drag, accel=[0, lift, 0]), billboard(twinkle(size, size), uv=glint_uv(11)), tint(gradient),
    )


def flames(name, emitter, radius, velocity, scale=1.0, surface=True):
    effect(
        name, "particles_add", "fb_flame", emitter,
        shape("disc", radius=radius, plane_normal="y", surface_only=surface, direction=[0, 1, 0]),
        life("math.random(0.5, 0.95)"), speed(velocity), motion(drag=0.6, accel=[0, 1.2, 0]),
        billboard(
            [f"{scale} * (0.4 + 0.25 * {R1}) * (1 - 0.45 * {T})", f"{scale} * (0.48 + 0.3 * {R1}) * (1 - 0.45 * {T})"],
            uv=flip_uv("fb_flame", fps=14, loop=True),
        ),
        tint(grad((0, WHITE, 0), (0.12, PALE, 1), (0.6, GOLD, 0.9), (1, AMBER, 0))),
    )


def pillar(name, texture, emitter, emitter_shape, lifetime, width, height, gradient):
    effect(
        name, "particles_add", texture, emitter, emitter_shape, life(lifetime), speed(0),
        billboard([f"{width} * (1 - {T}) * (1 - {T})", height], "lookat_y"), tint(gradient),
    )


RED = (1.0, 0.25, 0.2)
GOLD_GLINT = grad((0, WHITE, 1), (0.5, PALE, 1), (1, GOLD, 1))
ICE_GLINT = grad((0, WHITE, 1), (0.5, ICE, 1), (1, (0.6, 0.8, 1.0), 1))
MINT_GLINT = grad((0, WHITE, 1), (0.5, MINT, 1), (1, CYAN, 1))
GOLD_RING = grad((0, WHITE, 1), (0.4, PALE, 1), (1, AMBER, 0.5))
SEAL_FADE = grad((0, WHITE, 0), (0.1, PALE, 1), (0.75, GOLD, 0.9), (1, AMBER, 0))
VIOLET_BOOK = grad((0, WHITE, 1), (0.4, VIOLET, 1), (1, (0.5, 0.5, 0.8), 0.6))
# Thinner versions for the extra layers that sit right on a target, so a hit does not turn into a white blob
SOFT_GOLD = grad((0, PALE, 0.5), (0.35, GOLD, 0.5), (1, AMBER, 0.3))
SOFT_ICE = grad((0, WHITE, 0.5), (0.5, ICE, 0.5), (1, (0.65, 0.8, 1.0), 0.3))
SOFT_VIOLET = grad((0, WHITE, 0.5), (0.4, VIOLET, 0.5), (1, (0.5, 0.5, 0.8), 0.3))
AIR_BOOK = grad((0, WHITE, 1), (0.5, AIR2, 0.9), (1, AIR3, 0.5))
DUST_FADE = grad(
    (0, (0.88, 0.86, 0.82), 0), (0.15, (0.86, 0.84, 0.8), 0.55), (0.6, (0.8, 0.78, 0.75), 0.35),
    (1, (0.75, 0.73, 0.7), 0),
)

# Layers shared by many moves
arcs("u_arcs_gold", once(12), 1.4, 1.0, GOLD_ARC)
arcs("u_arcs_ice", once(10), 1.2, 0.9, ICE_ARC)
arcs("u_arcs_red", once(8), 1.0, 0.8, grad((0, (1.0, 0.7, 0.65), 1), (0.5, RED, 1), (1, (0.6, 0.05, 0.1), 0.6)))
pop("u_impact_gold", "fb_cracks", 0.46, 2.3, 1.0, GOLD_BOOK, rotation=RAND)
pop("u_impact_ice", "fb_cracks", 0.4, 1.9, 0.9, ICE_BOOK, rotation=RAND)
needles(
    "u_shower_gold", 30, shape("sphere", radius=0.2, direction="outwards"), "math.random(0.4, 0.8)",
    "math.random(5.0, 11.0)", 0.55, 0.05, gold_fade(), drag=2.5, gravity=-9.0,
)
needles(
    "u_shower_ice", 22, shape("sphere", radius=0.2, direction="outwards"), "math.random(0.35, 0.7)",
    "math.random(4.0, 9.0)", 0.45, 0.045, white_fade(), drag=2.5, gravity=-7.0,
)
ring_train("u_rings_gold", "fb_ripple", 3, 0.09, 0.42, 0.6, 1.8, GOLD_RING, "lookat_xyz")
ring_train("u_rings_ice", "fb_ripple", 3, 0.09, 0.4, 0.5, 1.5, ICE_BOOK, "lookat_xyz")
ring_train("u_rings_mint", "fb_ripple", 3, 0.09, 0.42, 0.6, 1.8, MINT_BOOK, "lookat_xyz")
dust("u_dust", 40, 1.2, "math.random(6.0, 13.0)", 0.8, 1.5, "math.random(1.2, 2.2)")
flat("u_ground_flash", "fb_cracks", 0.65, f"7.0 + 4.0 * math.sqrt({T})", GOLD_BOOK)
ring_train("u_ring_wave", "fb_ripple", 6, 0.2, 1.1, 1.0, 13.0, GOLD_RING)
ring_train("u_ring_wave_small", "fb_ripple", 3, 0.12, 0.7, 0.5, 4.2, GOLD_RING)
ring_train("u_ring_wave_mint", "fb_ripple", 5, 0.16, 0.95, 0.6, 6.0, grad((0, WHITE, 1), (0.4, MINT, 1), (1, CYAN, 0.5)))
ring_train("u_shock_train", "adapt_nova", 5, 0.25, 0.9, 0.8, 10.5, grad((0, WHITE, 1), (0.4, PALE, 0.9), (1, AMBER, 0)))
flat(
    "u_fissure", "fb_fissure", 5.0, f"5.2 * math.min(1, 0.5 + 8 * {T})",
    grad((0, WHITE, 1), (0.8, WHITE, 0.9), (1, WHITE, 0)), material="particles_blend",
)

# Wheel turn
needles(
    "u_wheel_spokes", 16, shape("disc", radius=0.5, plane_normal="y", surface_only=True, direction="outwards"),
    "math.random(0.3, 0.5)", "math.random(6.0, 10.0)", 1.0, 0.05, gold_fade(), drag=3.0,
)
flat(
    "u_wheel_disc", "adapt_wheel", 0.55, f"0.7 + 1.9 * math.sqrt({T})",
    grad((0, WHITE, 0.9), (0.4, PALE, 0.7), (1, AMBER, 0)), rate=240,
)
glints(
    "u_ground_glint", once(18), shape("disc", radius=1.3, plane_normal="y", surface_only=True, direction=[0, 1, 0]),
    "math.random(0.6, 1.1)", "math.random(0.8, 2.2)", 0.08, GOLD_GLINT, lift=0.6, texture="adapt_glint",
)

# Full adaptation: the build-up
effect(
    "u_charge_lines", "particles_add", "fx_streak", once(34),
    shape("sphere", radius=5.0, surface_only=True, direction="inwards"),
    life(0.38), speed(12.0), motion(),
    billboard([f"0.9 * (1 - 0.5 * {T})", 0.05], "lookat_direction"),
    tint(grad((0, AMBER, 0), (0.4, GOLD, 1), (1, WHITE, 0.8))),
)
pop("u_implode_gold", "fb_implode", 0.42, 2.6, -0.8, GOLD_BOOK, rotation=RAND)
flat("u_charge_ground", "fb_ripple", 0.42, f"4.6 - 4.0 * {T}", GOLD_RING, offset=(0, -2.35, 0), reverse=True)

# Full adaptation and undying: the release
flat("u_nova_big", "adapt_nova", 1.1, f"1.0 + 13.0 * math.sqrt({T})", grad((0, WHITE, 1), (0.4, PALE, 0.9), (1, AMBER, 0)))
flat("u_octagram_outer", "fb_octagram", 4.5, f"7.6 * math.min(1, 0.3 + 4 * {T})", SEAL_FADE, rate=-40)
flat("u_dotring", "fb_dotring", 4.5, f"9.8 * math.min(1, 0.25 + 3 * {T})", SEAL_FADE, rate=25)
flat("u_nodes", "fb_nodes", 4.0, f"5.4 * math.min(1, 0.4 + 5 * {T})", SEAL_FADE, rate=-90)
flat("u_seal_big", "adapt_mandala", 2.2, f"3.0 + 3.6 * math.sqrt({T})", gold_fade(), rate=120)
flat("u_sky_wheel", "adapt_wheel", 3.6, f"7.0 * math.min(1, 0.4 + 3 * {T})", SEAL_FADE, rate=60, offset=(0, 9, 0))
flat(
    "u_sky_ring", "adapt_nova", 1.4, f"2.0 + 12.0 * math.sqrt({T})",
    grad((0, WHITE, 1), (0.4, PALE, 0.8), (1, AMBER, 0)), offset=(0, 9, 0),
)
pillar(
    "u_beam", "adapt_ray", once(1), shape("point", offset=[0, 11, 0]), 1.6, 3.4, 16,
    grad((0, WHITE, 1), (0.4, PALE, 0.9), (1, GOLD, 0)),
)
pillar(
    "u_beam_ring", "adapt_ray", once(12), shape("disc", radius=5.0, plane_normal="y", surface_only=True, offset=[0, 6, 0]),
    "math.random(0.9, 1.4)", 0.6, 8, grad((0, WHITE, 0.9), (0.4, PALE, 0.8), (1, GOLD, 0)),
)
arcs("u_storm", steady(90, 90, 3.5), 4.6, 1.7, GOLD_ARC, offset=(0, 2.0, 0))
effect(
    "u_bolts", "particles_add", "fb_bolt", steady(45, 60, 3.0),
    shape("disc", radius=6.5, plane_normal="y", offset=[0, 2.6, 0]),
    life("math.random(0.22, 0.4)"), speed(0),
    billboard([f"1.95 + 1.05 * {R1}", f"2.6 + 1.4 * {R1}"], "lookat_y", flip_uv("fb_bolt")),
    tint(grad((0, WHITE, 1), (0.4, PALE, 1), (1, GOLD, 0.8))),
)
twinkles("u_stars", steady(90, 220, 4.0), 6.5, 0.26, GOLD_GLINT, offset=(0, 2.5, 0))
glints(
    "u_embers", steady(110, 320, 3.2), shape("disc", radius=5.5, plane_normal="y", direction=[0, 1, 0]),
    "math.random(1.2, 2.4)", "math.random(1.5, 5.0)", 0.09, GOLD_GLINT, drag=0.4, lift=1.0, texture="adapt_glint",
)
flames("u_fire_ring", steady(150, 170, 3.0), 4.6, "math.random(1.2, 3.0)", scale=1.5)
flames("u_fire_column", steady(110, 130, 2.2), 1.1, "math.random(5.0, 10.0)", scale=1.3, surface=False)
needles(
    "u_rays", 44, shape("sphere", radius=0.6, direction="outwards", offset=[0, 1.2, 0]), "math.random(0.5, 0.9)",
    "math.random(9.0, 18.0)", 1.8, 0.07, gold_fade(), drag=3.0,
)
pop("u_dharma_big", "adapt_wheel", 1.3, 1.6, 4.2, grad((0, WHITE, 0.9), (0.3, PALE, 0.8), (1, AMBER, 0)), rate=90)
pop("u_flare_big", "adapt_flare", 0.7, 2.5, 5.0, grad((0, WHITE, 0.9), (0.3, PALE, 0.7), (1, AMBER, 0)), rate=40)
pop("u_boom_big", "fb_burst", 0.85, 4.0, 3.6, grad((0, WHITE, 0.85), (0.35, PALE, 0.85), (1, AMBER, 0.6)))

# Nullify
facing_pop("u_ward_big", "adapt_ward", "ward_dir", 0.75, 0.6, 1.0, grad((0, PALE, 0.7), (0.3, GOLD, 0.65), (1, AMBER, 0)))
facing_pop("u_ward_wave", "fb_burst", "ward_dir", 0.6, 2.2, 2.0, SOFT_GOLD)

# Sword
effect(
    "u_moon_echo", "particles_add", "fb_moon", window(25, 0.06, 0.16, 1), shape("point"), life(0.3), speed(0),
    billboard([f"2.6 + 0.6 * {T}", f"1.05 + 0.25 * {T}"], uv=flip_uv("fb_moon")),
    tint(grad((0, ICE, 0.7), (0.5, (0.6, 0.8, 1.0), 0.6), (1, (0.4, 0.6, 1.0), 0.3))),
)
glints(
    "u_swing_sparks", once(24), shape("sphere", radius=1.2, direction="outwards"), "math.random(0.3, 0.6)",
    "math.random(1.0, 4.0)", 0.1, ICE_GLINT, drag=2.0,
)
pop("u_wave_glow", "fx_flare", 0.22, 2.2, 0.6, grad((0, WHITE, 0.5), (1, ICE, 0)), rotation=0)
glints(
    "u_wave_sparks", once(14), shape("sphere", radius=1.6, direction="outwards"), "math.random(0.3, 0.7)",
    "math.random(0.5, 2.5)", 0.09, ICE_GLINT, drag=1.5, lift=-1.5,
)
effect(
    "u_wave_dust", "particles_blend", "fb_cloud", once(3),
    shape("disc", radius=1.4, plane_normal="y", direction=[0, 1, 0], offset=[0, -1.5, 0]),
    life("math.random(0.5, 0.9)"), speed("math.random(0.4, 1.2)"),
    spin(RAND, "math.random(-40, 40)"), motion(drag=2.0, accel=[0, 0.5, 0]),
    billboard(f"0.35 + 0.6 * {T}"), tint(DUST_FADE),
)
pop(
    "u_cross_slash", "fb_moon", 0.3, 1.5, 0.4, SOFT_ICE, rotation=RAND, count=2,
)
pop(
    "u_counter_cross", "fb_moon", 0.34, 1.7, 0.4, SOFT_GOLD, rotation=RAND, count=2,
)

# Positive energy
pop("u_positive_flare", "fb_flare", 0.4, 2.2, 1.0, MINT_BOOK, rotation="math.random(0, 90)")
flat("u_positive_seal", "fx_wheel", 1.6, f"2.6 + 2.0 * math.sqrt({T})", grad((0, WHITE, 1), (0.5, MINT, 0.9), (1, CYAN, 0)), rate=120)
pillar(
    "u_mint_pillar", "fx_ray", once(1), shape("point", offset=[0, 8, 0]), 1.2, 1.6, 10,
    grad((0, WHITE, 1), (0.4, MINT, 0.9), (1, CYAN, 0)),
)

# Air blast
pop("u_air_implode", "fb_implode", 0.5, 1.8, -0.6, AIR_BOOK, rotation=RAND)
effect(
    "u_air_spiral", "particles_add", "fb_spiral", once(1), shape("point"), life(0.5), speed(0),
    spin(RAND, 700), motion(rotation_drag=0.0), billboard(f"2.4 - 1.6 * {T}"),
    tint(grad((0, AIR3, 0), (0.3, AIR2, 0.5), (1, WHITE, 0.7))),
)
facing_pop("u_air_muzzle", "fb_burst", "blast_dir", 0.5, 3.2, 3.0, AIR_BOOK)
effect(
    "u_air_cone", "particles_add", "fx_streak", once(36),
    shape("sphere", radius=0.5, direction=[f"v.blast_dir.{axis} + math.random(-0.35, 0.35)" for axis in "xyz"]),
    life("math.random(0.15, 0.3)"), speed("math.random(16.0, 30.0)"), motion(drag=5.0),
    billboard([f"1.4 + 1.8 * {T}", f"0.07 * (1 - {T})"], "lookat_direction"),
    tint(grad((0, WHITE, 0.9), (0.5, AIR2, 0.6), (1, AIR3, 0))),
)
facing_pop("u_air_ring", "fb_ripple", "blast_dir", 0.45, 0.8, 2.6, AIR_BOOK)

# Teleport kick, punch, dash, guard
facing_pop("u_blink_ring", "fb_burst", "kick_dir", 0.45, 2.0, 1.8, SOFT_VIOLET)
effect(
    "u_blink_bolt", "particles_add", "fb_bolt", once(3), shape("sphere", radius=0.5), life("math.random(0.2, 0.35)"),
    speed(0), billboard([1.35, 1.8], "lookat_y", flip_uv("fb_bolt")), tint(VIOLET_BOOK),
)
pop("u_blink_implode", "fb_implode", 0.36, 1.8, -0.5, SOFT_VIOLET, rotation=RAND)
pop("u_kick_boom", "fb_burst", 0.5, 1.7, 1.6, SOFT_GOLD)
pop("u_punch_ring", "fb_burst", 0.36, 1.2, 1.0, SOFT_ICE)
flat("u_dash_ring", "fb_ripple", 0.5, f"0.6 + 3.2 * math.sqrt({T})", ICE_BOOK)
pop("u_guard_seal", "adapt_ward", 0.45, 0.9, 1.0, grad((0, WHITE, 1), (0.3, PALE, 0.9), (1, AMBER, 0)))

# Quake
effect(
    "u_quake_pillars", "particles_blend", "fb_cloud", once(22),
    shape("disc", radius=3.2, plane_normal="y", surface_only=True, direction=[0, 1, 0]),
    life("math.random(0.8, 1.4)"), speed("math.random(5.0, 10.0)"),
    spin(RAND, "math.random(-40, 40)"), motion(drag=2.5),
    billboard(f"0.6 + 1.0 * {T}"), tint(DUST_FADE),
)

# A quiet aura around the wheel while it is worn (ultra only)
arcs("u_aura_arcs", once(3), 0.75, 0.55, grad((0, WHITE, 0.8), (0.5, PALE, 0.8), (1, GOLD, 0.4)))
glints(
    "u_aura_motes", once(6), shape("disc", radius=0.8, plane_normal="y", direction=[0, 1, 0]),
    "math.random(0.8, 1.3)", "math.random(0.2, 0.6)", 0.075, GOLD_GLINT, drag=0.8, lift=0.3, texture="adapt_glint",
)
flat("u_aura_ring", "fb_ripple", 1.3, f"0.4 + 1.5 * {T}", grad((0, PALE, 0.45), (0.5, GOLD, 0.4), (1, AMBER, 0.2)))

# Domain seal (Seal of Judgment) ----------------------------------------------
#
# The script passes v.life (seconds), v.len (half length in blocks) and v.dir.
# Circle, chains and wall last as long as the domain does, which has no set
# length: the script respawns them every LOOP seconds and each copy fades over
# its first and last quarter second, so two copies always add up to one.

FLIP["seal_bolt"] = {"cell": [128, 512], "frames": 4}
SEAL_RADIUS, SEAL_HEIGHT, SEAL_LOOP, SEAL_FADE_TIME = 32, 40, 2.0, 0.25
SEAL_LIFE = SEAL_LOOP + SEAL_FADE_TIME
SEAL_TURN = 45 / SEAL_LOOP  # the circle is eight-fold: 45 degrees per copy keeps the hand-over invisible
SEAL_IN = round(SEAL_FADE_TIME / SEAL_LIFE, 3)


def seal_cross(colour=WHITE, alpha=1.0):
    return grad((0, colour, 0), (SEAL_IN, colour, alpha), (1 - SEAL_IN, colour, alpha), (1, colour, 0))


# charging: the dial under the host, one handle after the other
effect(
    "seal_dial", "particles_add", "adapt_wheel", once(1), shape("point", offset=[0, 0.08, 0]), life(6.7), speed(0),
    billboard(f"3.2 * (1 + 0.04 * math.sin(480 * v.particle_age))", "emitter_transform_xz"),
    tint(grad((0, GOLD, 0), (0.06, GOLD, 0.5), (0.88, PALE, 0.75), (1, WHITE, 0))),
)
effect(
    "seal_knob", "particles_add", "adapt_flare", once(1), shape("point"), life("v.life"), speed(0),
    billboard(f"0.5 + 0.9 * math.exp(-9 * v.particle_age) + 0.06 * math.sin(600 * v.particle_age)"),
    tint(grad((0, WHITE, 1), (0.9, PALE, 1), (1, GOLD, 0))),
)
pop("seal_tick_pop", "ring", 0.4, 0.15, 0.9, GOLD_RING, facing="emitter_transform_xz")

# opening: the circle leaves the wheel, climbs and widens until it roofs the domain
SEAL_EASE = "(1 - math.exp(-2 * v.particle_age))"
effect(
    "seal_rise", "particles_add", "seal_circle", once(1), shape("point", direction=[0, 1, 0]), life(4.0 + SEAL_FADE_TIME),
    speed(SEAL_HEIGHT * 2), spin(0, SEAL_TURN), motion(drag=2.0, rotation_drag=0.0),
    billboard(f"0.8 + {SEAL_RADIUS - 0.8} * {SEAL_EASE}", "emitter_transform_xz"),
    tint(grad((0, WHITE, 1), (1 - round(SEAL_FADE_TIME / (4.0 + SEAL_FADE_TIME), 3), WHITE, 1), (1, WHITE, 0))),
)
effect(
    "seal_sky", "particles_add", "seal_circle", once(1), shape("point"), life(SEAL_LIFE), speed(0),
    spin(0, SEAL_TURN), motion(rotation_drag=0.0), billboard(SEAL_RADIUS, "emitter_transform_xz"), tint(seal_cross()),
)
effect(
    "seal_sky_inner", "particles_add", "seal_circle", once(1), shape("point", offset=[0, 3, 0]), life(SEAL_LIFE),
    speed(0), spin(22.5, -SEAL_TURN), motion(rotation_drag=0.0),
    billboard(SEAL_RADIUS * 0.55, "emitter_transform_xz"), tint(seal_cross(PALE, 0.55)),
)
effect(
    "seal_beam", "particles_add", "adapt_ray", once(1), shape("point", offset=[0, SEAL_HEIGHT / 2, 0]), life(1.1),
    speed(0), billboard([f"0.4 + 2.2 * (1 - {T}) * (1 - {T})", SEAL_HEIGHT / 2], "lookat_y"),
    tint(grad((0, WHITE, 1), (0.4, PALE, 0.9), (1, GOLD, 0))),
)
effect(
    "seal_shock", "particles_add", "adapt_nova", once(1), shape("point", offset=[0, 0.12, 0]), life(1.3), speed(0),
    billboard(f"1 + {SEAL_RADIUS - 1} * math.sqrt({T})", "emitter_transform_xz"),
    tint(grad((0, WHITE, 1), (0.6, PALE, 0.8), (1, AMBER, 0))),
)
effect(
    "seal_fall", "particles_add", "seal_circle", once(1), shape("point"), life(1.4), speed(0), spin(0, 120),
    motion(rotation_drag=0.0), billboard(f"{SEAL_RADIUS} * (1 - 0.92 * {T} * {T})", "emitter_transform_xz"),
    tint(grad((0, WHITE, 1), (0.5, PALE, 0.8), (1, AMBER, 0))),
)

# the edge of the domain: shafts of light standing on the rim
effect(
    "seal_wall", "particles_add", "adapt_ray", steady(40, 120, SEAL_LOOP),
    shape("disc", radius=SEAL_RADIUS, plane_normal="y", surface_only=True, direction=[0, 1, 0]),
    life("math.random(1.6, 2.4)"), speed("math.random(0.6, 2.2)"), motion(),
    billboard([f"0.1 + 0.12 * {R1}", f"(2.2 + 2.6 * {R1}) * math.sin(180 * {T})"], "lookat_y"),
    tint(grad((0, GOLD, 0), (0.25, PALE, 0.7), (0.75, GOLD, 0.6), (1, AMBER, 0))),
)
facing_pop("seal_repel", "adapt_ward", "dir", 0.5, 0.5, 1.1, grad((0, WHITE, 1), (0.5, PALE, 0.8), (1, AMBER, 0)))

# binding: chains from four small seals around the target
SEAL_CHAIN = dict(material="particles_add", texture="seal_chain")
for name, length, gradient in (
    ("seal_chain_in", "v.len * math.min(1, v.particle_age / 0.16)",
     grad((0, WHITE, 1), (0.1, WHITE, 1), (1 - SEAL_IN, WHITE, 1), (1, WHITE, 0))),
    ("seal_chain", "v.len", seal_cross()),
):
    effect(
        name, SEAL_CHAIN["material"], SEAL_CHAIN["texture"], once(1), shape("point", direction=vec("dir")),
        life(SEAL_LIFE), speed(0.05), motion(), billboard([length, 0.2], "lookat_direction"), tint(gradient),
    )
effect(
    "seal_anchor", "particles_add", "adapt_ward", once(1), shape("point", direction=vec("dir")), life(SEAL_LIFE),
    speed(0.05), spin(0, 90 / SEAL_LOOP), motion(rotation_drag=0.0), billboard(0.75, "direction_z"),
    tint(seal_cross(PALE, 0.9)),
)
pop("seal_bind_flash", "fb_burst", 0.35, 0.5, 1.2, gold_fade())

# the lightning: a flipbook bolt from the circle down to the target
effect(
    "seal_bolt", "particles_add", "seal_bolt", once(1), shape("point"), life(0.44), speed(0),
    billboard(["v.len * 0.25", "v.len"], "lookat_y", flip_uv("seal_bolt")),
    tint(grad((0, WHITE, 1), (0.75, WHITE, 1), (1, PALE, 0))),
)
effect(
    "seal_bolt_wide", "particles_add", "seal_bolt", once(1), shape("point"), life(0.7), speed(0),
    billboard(["v.len * 0.34", "v.len"], "lookat_y", flip_uv("seal_bolt")),
    tint(grad((0, PALE, 0.55), (0.6, GOLD, 0.45), (1, AMBER, 0))),
)
effect(
    "seal_bolt_core", "particles_add", "adapt_ray", once(1), shape("point"), life(0.3), speed(0),
    billboard([f"1.1 * (1 - {T})", "v.len"], "lookat_y"), tint(grad((0, WHITE, 0.9), (0.5, PALE, 0.7), (1, GOLD, 0))),
)
pop("seal_bolt_hit", "adapt_flare", 0.4, 2.2, 3.2, gold_fade())
pop("seal_bolt_sky", "adapt_flare", 0.35, 3.5, 4.0, gold_fade())
pop("seal_bolt_ring", "adapt_nova", 0.55, 0.6, 4.4, GOLD_RING, facing="emitter_transform_xz")
needles(
    "seal_bolt_sparks", 16, shape("sphere", radius=0.4, direction="outwards"), "math.random(0.3, 0.6)",
    "math.random(6, 15)", 0.9, 0.07, gold_fade(), drag=3.0, gravity=-9.0,
)

# afterwards: the host is spent
effect(
    "seal_tired", "particles_blend", "fx_puff", once(2), shape("sphere", radius=0.35), life("math.random(0.7, 1.1)"),
    speed(0.3), motion(drag=1.0, accel=[0, -0.6, 0]), billboard(f"(0.12 + 0.1 * {R1}) * (1 + {T})"),
    tint(grad((0, (0.5, 0.48, 0.42), 0), (0.2, (0.45, 0.43, 0.4), 0.45), (1, (0.3, 0.3, 0.3), 0))),
)

# The table: script id -> what it spawns on low and on ultra ------------------

# wheel turn
tier("wheel_spin", low=[lite("wheel_spin", 0.5)], ultra=[grand("wheel_spin", 2.5, 1.3), "u_wheel_spokes", "u_wheel_disc"])
tier("wheel_crackle", low=[], ultra=[variant("wheel_crackle", "ultra", size=1.5)])
tier("adapt_ripple", low=[], ultra=["adapt_ripple", "u_ring_wave_small", "u_ground_glint"])
tier("fx_arcs_gold", low=[], ultra=["u_arcs_gold"])
tier("fx_arcs_ice", low=[], ultra=["u_arcs_ice"])
tier("twinkle_gold", low=[], ultra=[grand("twinkle_gold", 3.0, 1.3)])
tier("twinkle_mint", low=[], ultra=[grand("twinkle_mint", 3.0, 1.3)])

# full adaptation
tier("adapt_charge", low=[lite("adapt_charge")], ultra=[grand("adapt_charge", 2.5, 1.3), "u_charge_lines", "u_implode_gold", "u_charge_ground"])
tier("adapt_gather", low=[lite("adapt_gather")], ultra=[grand("adapt_gather", 2.0, 1.2)])
tier("adapt_flare", ultra=["adapt_flare", "u_flare_big", "u_boom_big"])
tier("adapt_dharma", ultra=["adapt_dharma", "u_dharma_big"])
tier("adapt_sparks", low=[lite("adapt_sparks")], ultra=[grand("adapt_sparks", 2.5, 1.2)])
tier("adapt_boom", low=[])
tier("adapt_nova", ultra=["adapt_nova", "u_nova_big", "u_shock_train"])
tier("adapt_rays", low=[lite("adapt_rays", 0.5)], ultra=["adapt_rays", "u_rays"])
tier("adapt_embers", low=[], ultra=[grand("adapt_embers", 2.0, 1.2), "u_embers"])
tier("adapt_bolts", low=[], ultra=["u_bolts"])
tier("adapt_octagram", low=[], ultra=["adapt_octagram", "u_octagram_outer", "u_dotring", "u_nodes"])
tier("ground_flash", low=[], ultra=["ground_flash", "u_ground_flash"])
tier("ring_wave_gold", low=[], ultra=["u_ring_wave"])
tier("dust_burst", low=[], ultra=["u_dust"])
tier("dust_small", low=[], ultra=[grand("dust_small", 2.5, 1.4)])
tier("adapt_storm", low=[], ultra=["u_storm"])
tier("adapt_stars", low=[], ultra=["u_stars"])
tier("adapt_fire", low=[], ultra=[grand("adapt_fire", 2.0, 1.2, seconds=2.0), "u_fire_ring"])
tier("adapt_beam", low=[], ultra=["u_beam", "u_beam_ring", "u_sky_wheel", "u_sky_ring"])
tier("quake_crack", low=[], ultra=["quake_crack", "u_fissure"])
tier("shatter_gold", low=[], ultra=[variant("shatter_gold", "ultra", size=1.4), "u_shower_gold"])
tier("shatter_ice", low=[], ultra=[variant("shatter_ice", "ultra", size=1.7), "u_shower_ice"])

# undying
tier("adapt_shockwave", ultra=["adapt_shockwave", "u_shock_train", "u_embers"])
tier("adapt_seal", ultra=["adapt_seal", "u_seal_big"])
tier("adapt_pillar", low=[lite("adapt_pillar")], ultra=[grand("adapt_pillar", 2.5, 1.3)])
tier("undying_flame", low=[], ultra=[grand("undying_flame", 2.2, 1.2, seconds=2.2), "u_fire_column"])
tier("adapt_burst", low=[lite("adapt_burst")], ultra=[grand("adapt_burst", 2.2, 1.3)])
tier("adapt_flash", ultra=["adapt_flash", "u_flare_big"])

# nullify
tier("nullify_ward", ultra=["nullify_ward", "u_ward_big", "u_ward_wave"])
tier("nullify_sparks", low=[lite("nullify_sparks")], ultra=[grand("nullify_sparks", 2.5, 1.3)])

# sword
tier("slash_trail", thin=2)
tier("slash_ink", low=[])
tier("slash_spark", low=[], ultra=[grand("slash_spark", 2.5, 1.2)])
tier("slash_ink_spark", low=[lite("slash_ink_spark", 0.5)], ultra=[grand("slash_ink_spark", 2.0, 1.2)])
tier("slash_moon", ultra=[variant("slash_moon", "ultra", size=1.4), "u_moon_echo", "u_swing_sparks"])
tier("slash_wave_moon", ultra=[variant("slash_wave_moon", "ultra", size=1.4), "u_wave_glow", "u_wave_sparks", "u_wave_dust"])
tier("slash_cut", ultra=[variant("slash_cut", "ultra", size=1.15), "u_cross_slash"])
tier("impact_gold", low=[], ultra=["impact_gold", "u_impact_gold", "u_shower_gold"])
tier("impact_ice", low=[], ultra=["impact_ice", "u_impact_ice", "u_shower_ice"])

# positive energy
tier("positive_burst", low=[lite("positive_burst")], ultra=[grand("positive_burst", 2.2, 1.25)])
tier("positive_flash", ultra=["positive_flash", "u_positive_flare"])
tier("ring_pop_mint", low=[], ultra=["u_rings_mint"])
tier("ring_pop_gold", low=[], ultra=["u_rings_gold"])
tier("ring_pop_ice", low=[], ultra=["u_rings_ice"])
tier("positive_rise", low=[lite("positive_rise")], ultra=[grand("positive_rise", 2.5, 1.3)])
tier("positive_rays", low=[], ultra=[grand("positive_rays", 2.5, 1.3)])
tier("positive_seal", ultra=["positive_seal", "u_positive_seal", "u_mint_pillar"])
tier("ring_wave_mint", low=[], ultra=["u_ring_wave_mint"])

# air blast
tier("air_charge", low=[lite("air_charge")], ultra=[grand("air_charge", 2.0, 1.3)])
tier("air_core", ultra=["air_core", "u_air_implode"])
tier("air_spiral", low=[], ultra=[variant("air_spiral", "ultra", size=1.8), "u_air_spiral"])
tier("air_muzzle", ultra=["air_muzzle", "u_air_muzzle", "u_air_cone"])
tier("air_streak", low=[lite("air_streak", 0.5)], ultra=[grand("air_streak", 3.0, 1.2)])
tier("air_ring", ultra=[variant("air_ring", "ultra", size=1.5), "u_air_ring"])

# teleport kick
tier("blink_out", low=[lite("blink_out")], ultra=[grand("blink_out", 2.2, 1.2)])
tier("blink_in", low=[lite("blink_in")], ultra=[grand("blink_in", 2.2, 1.2)])
tier("blink_trail", low=[lite("blink_trail")], ultra=[grand("blink_trail", 2.0, 1.2)])
tier("blink_ring", ultra=["blink_ring", "u_blink_ring"])
tier("blink_spiral", low=[], ultra=[variant("blink_spiral", "ultra", size=1.7), "u_blink_bolt", "u_blink_implode"])
tier("kick_impact", low=[lite("kick_impact")], ultra=[grand("kick_impact", 2.2, 1.3)])
tier("kick_burst", ultra=[variant("kick_burst", "ultra", size=1.15), "u_kick_boom"])
tier("kick_ring", ultra=["kick_ring", "u_rings_gold"])

# punch, dash, guard
tier("punch_impact", low=[lite("punch_impact")], ultra=[grand("punch_impact", 2.5, 1.3)])
tier("punch_burst", ultra=[variant("punch_burst", "ultra", size=1.5), "u_punch_ring"])
tier("dash_lines", low=[lite("dash_lines")], ultra=[grand("dash_lines", 2.5, 1.2)])
tier("dash_ring", low=[], ultra=[grand("dash_ring", 2.2, 1.3)])
tier("dash_flash", low=[], ultra=[variant("dash_flash", "ultra", size=1.5)])
tier("dash_shock", ultra=["dash_shock", "u_dash_ring"])
tier("guard_spark", low=[lite("guard_spark")], ultra=[grand("guard_spark", 2.5, 1.3)])
tier("guard_catch", low=[lite("guard_catch")], ultra=[grand("guard_catch", 2.5, 1.3)])
tier("guard_flash", ultra=[variant("guard_flash", "ultra", size=1.5), "u_guard_seal"])

# counter, quake, reflect, heal cut
tier("counter_cut", ultra=[variant("counter_cut", "ultra", size=1.15), "u_counter_cross"])
tier("quake_ring", ultra=["quake_ring", "u_shock_train"])
tier("quake_dust", low=[lite("quake_dust")], ultra=[grand("quake_dust", 2.2, 1.3), "u_quake_pillars"])
tier("reflect_bolt", ultra=[grand("reflect_bolt", 3.0, 1.3)])
tier("heal_sever", low=[lite("heal_sever")], ultra=[grand("heal_sever", 2.0, 1.2)])
tier("heal_crackle", low=[], ultra=[variant("heal_crackle", "ultra", size=1.5), "u_arcs_red"])

# domain seal
tier("seal_sky", ultra=["seal_sky", "seal_sky_inner"])
tier("seal_wall", low=[lite("seal_wall", 0.4)], ultra=[grand("seal_wall", 1.6, 1.0)])
tier("seal_anchor", low=[])
tier("seal_bolt", ultra=["seal_bolt", "seal_bolt_wide"])
tier("seal_bolt_sparks", low=[], ultra=[grand("seal_bolt_sparks", 2.2, 1.2)])
tier("seal_bolt_ring", low=[])
tier("seal_tired", low=[])

# ids that exist only as a hook for ultra
tier("ultra_aura", low=[], medium=[], ultra=["u_aura_arcs", "u_aura_motes"])
tier("ultra_aura_ground", low=[], medium=[], ultra=["u_aura_ring"])

HOOKS = {"ultra_aura", "ultra_aura_ground"}
BEGIN, END = "/* fx-tiers:begin (written by tools/fx/gen_particles.py) */", "/* fx-tiers:end */"


def tier_table():
    known = set(EFFECTS) | {path.stem for path in OUT.glob("*.json")}
    lines = []
    for name, entry in TIERS.items():
        assert name in known or name in HOOKS, f"tier for unknown effect {name}"
        fields = []
        for key in ("low", "medium", "ultra"):
            if key in entry:
                for target in entry[key]:
                    assert target in known, f"{name}.{key}: unknown effect {target}"
                fields.append(f"{key}: [" + ", ".join(f'"xvoid:{target}"' for target in entry[key]) + "]")
        if "thin" in entry:
            fields.append(f"thin: {entry['thin']}")
        lines.append(f'    "xvoid:{name}": {{ ' + ", ".join(fields) + " },")
    return "var FX_TIERS = {\n" + "\n".join(lines) + "\n};"


def write_table():
    source = SCRIPT.read_text(encoding="utf-8")
    pattern = re.compile(re.escape(BEGIN) + r".*?" + re.escape(END), re.S)
    assert len(pattern.findall(source)) == 1, "fx-tiers markers not found in main.js"
    SCRIPT.write_text(pattern.sub(lambda _: f"{BEGIN}\n{tier_table()}\n{END}", source), encoding="utf-8")


def main():
    for name, data in EFFECTS.items():
        text = json.dumps(data, indent=2) + "\n"
        if name not in LF_FILES:
            text = text.replace("\n", "\r\n")
        (OUT / f"{name}.json").write_bytes(text.encode("utf-8"))
    print(f"{len(EFFECTS)} particle effects written to {OUT.relative_to(ROOT)}")
    write_table()
    print(f"{len(TIERS)} tier rules written to {SCRIPT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
