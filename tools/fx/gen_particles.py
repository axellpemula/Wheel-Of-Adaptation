"""Writes the particle effects of every move except the full adaptation set.

    python3 tools/fx/gen_particles.py

The eleven effects of the full adaptation (adapt_mandala, adapt_gather,
adapt_halo, adapt_ripple, adapt_flare, adapt_dharma, adapt_nova,
adapt_mandala_burst, adapt_rays, adapt_sparks, adapt_embers) are tuned by
hand and are not touched here.

Textures named fb_* are flipbook sheets imported from the Elemental Weapon
addon by import_flipbooks.py, which also writes their layout to flipbooks.json.

Billboard sizes are half extents, in blocks. Every particle that moves needs
`particle_motion_dynamic`, even an empty one.
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "Wheel of Adaptation RP" / "particles"
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
        "minecraft:emitter_rate_steady": {"spawn_rate": 24, "max_particles": 12},
        "minecraft:emitter_lifetime_once": {"active_time": 0.45},
    },
    shape("disc", radius=1.4, plane_normal="y", surface_only=True, offset=[0, 1.7, 0]),
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


def main():
    for name, data in EFFECTS.items():
        text = json.dumps(data, indent=2) + "\n"
        if name not in LF_FILES:
            text = text.replace("\n", "\r\n")
        (OUT / f"{name}.json").write_bytes(text.encode("utf-8"))
    print(f"{len(EFFECTS)} particle effects written to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
