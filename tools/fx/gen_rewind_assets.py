"""Files of the Return by Death scene: the wheel variant that turns backwards and glows,
and the two body animations (collapse, get up).

    python3 -B tools/fx/gen_rewind_assets.py

Writes the behaviour item, the attachable and two animation files. The timings here
match woaRbd in scripts/main.js: 0.8 s collapse (two slow reverse clicks of the wheel),
3 s rewind (continuous reverse spin), then the flash; the wheel variant lasts 4.8 s.
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BP = os.path.join(ROOT, "Wheel of Adaptation BP") + os.sep
RP = os.path.join(ROOT, "Wheel of Adaptation RP") + os.sep
def rd(p): return open(p, "rb").read().decode("utf-8")
def wr(p, s, crlf=True):
    s = s.replace("\r\n", "\n")
    if crlf: s = s.replace("\n", "\r\n")
    open(p, "wb").write(s.encode("utf-8"))

# 1. behaviour item: copy of the "full" variant
src = rd(BP + "items/wheel_of_adaptation_full.json")
assert src.count("xvoid:wheel_of_adaptation_full") == 1
wr(BP + "items/wheel_of_adaptation_rewind.json", src.replace("xvoid:wheel_of_adaptation_full", "xvoid:wheel_of_adaptation_rewind"), "\r\n" in src)

# 2. attachable: glowing wheel that turns backwards
LEN = 4.8
att = json.loads(rd(RP + "attachables/wheel_of_adaptation_full.json"))
d = att["minecraft:attachable"]["description"]
d["identifier"] = "xvoid:wheel_of_adaptation_rewind"
d["animations"] = {
    "hide_first_person": "animation.xvoid.wheel.hide_first_person",
    "idle": "animation.mahoraga_wheel.idle",
    "rewind": "animation.xvoid.wheel.rewind",
    "glow_fx": "animation.xvoid.wheel.rewind_mote",
    "fx_spin": "animation.xvoid.wheel.rewind_spin",
    "fx_halo": "animation.xvoid.wheel.rewind_halo",
    "fx_arcs": "animation.xvoid.wheel.rewind_arcs",
    "fx_crackle": "animation.xvoid.wheel.rewind_crackle",
    "fx_gather": "animation.xvoid.wheel.rewind_gather",
}
d["scripts"] = {
    "pre_animation": [
        "v.glow_time = (v.glow_time ?? 0) + q.delta_time;",
        "v.glow = v.glow_time < 0.8 ? 0.2 + v.glow_time / 0.8 * 0.55 : (v.glow_time < 4.1 ? 0.88 + 0.12 * math.sin(v.glow_time * 720) : math.max(0, (4.7 - v.glow_time) / 0.6));",
    ],
    "animate": ["idle", {"hide_first_person": "c.is_first_person"}, "rewind", "glow_fx"]
    + [{k: "!c.is_first_person"} for k in ["fx_spin", "fx_halo", "fx_arcs", "fx_crackle", "fx_gather"]],
}
d["particle_effects"] = {
    "mote": "xvoid:wheel_mote",
    "gather": "xvoid:w_adapt_gather",
    "spin": "xvoid:w_wheel_spin",
    "halo": "xvoid:w_adapt_halo",
    "arcs": "xvoid:w_fx_arcs_gold",
    "crackle": "xvoid:w_wheel_crackle",
}
wr(RP + "attachables/wheel_of_adaptation_rewind.json", json.dumps(att, indent=2) + "\n")

# 3. animations
def r(v): return round(v, 4)
def key(t): return ("%.4f" % t).rstrip("0").rstrip(".") if t else "0.0"
hub = {}
def put(t, a): hub[key(t)] = [0, r(a), 0]
# two slow reverse clicks (same shape as step_back, mirrored direction of "step")
put(0.0, 0); put(0.06, 6); put(0.26, -49); put(0.36, -45); put(0.46, -45)
put(0.52, -39); put(0.68, -94); put(0.78, -90); put(0.8, -90)
# continuous reverse spin: ease in, cruise, ease out. 32 notches (4 full turns) in 3 s
T0, T1, TURN = 0.8, 3.8, 1440.0
def ease(u):   # smooth start and stop, constant speed in the middle
    a = 0.25
    v = 1.0 / (1.0 - a)
    if u < a: return v * u * u / (2 * a)
    if u > 1 - a: return 1.0 - v * (1 - u) * (1 - u) / (2 * a)
    return v * (u - a / 2)
n = 60
for i in range(1, n + 1):
    u = i / n
    put(T0 + (T1 - T0) * u, -90 - TURN * ease(u))
END = -90 - TURN
assert END % 45 == 0
put(3.9, END - 5); put(4.02, END + 3); put(4.12, END); put(LEN, END)
mount = {"rotation": {
    "0.0": {"post": [0, 0, 0], "lerp_mode": "catmullrom"},
    "0.1": {"post": [-7.5, 0, 0], "lerp_mode": "catmullrom"},
    "0.25": {"post": [-12.5, 0, 0], "lerp_mode": "catmullrom"},
    "4.2": {"post": [-12.5, 0, 0], "lerp_mode": "catmullrom"},
    "4.5": {"post": [0, 0, 0], "lerp_mode": "catmullrom"},
}}
def fx(name, times):
    return {"animation_length": LEN, "particle_effects": {key(t): {"effect": name, "locator": "glow"} for t in times}}
anims = {
    "animation.xvoid.wheel.rewind": {"animation_length": LEN, "bones": {"wheel_mount": mount, "hub": {"rotation": hub}}},
    "animation.xvoid.wheel.rewind_mote": fx("mote", [0.0, 1.6, 3.2]),
    "animation.xvoid.wheel.rewind_spin": fx("spin", [0.26, 0.68, 1.3, 1.9, 2.5, 3.1, 3.9]),
    "animation.xvoid.wheel.rewind_halo": fx("halo", [0.26, 0.68, 1.6, 2.6, 3.9]),
    "animation.xvoid.wheel.rewind_arcs": fx("arcs", [0.8, 1.6, 2.4, 3.2, 3.9]),
    "animation.xvoid.wheel.rewind_crackle": fx("crackle", [0.8, 1.4, 2.0, 2.6, 3.2, 3.9]),
    "animation.xvoid.wheel.rewind_gather": fx("gather", [0.0, 0.8, 1.8, 2.8]),
}
wr(RP + "animations/wheel_rewind.animation.json", json.dumps({"format_version": "1.8.0", "animations": anims}, indent=2) + "\n")

# 4. player body: collapse on the back, stay down, then get up
DOWN = 12.0   # longer than the whole scene; the "rise" animation replaces it
pose = {"rightArm": [-6, 0, 38], "leftArm": [-10, 0, -30], "rightLeg": [0, 0, 7], "leftLeg": [0, 0, -10], "head": [-6, 22, 0]}
def limb(v, t_in):
    return {"rotation": {"0.0": [0, 0, 0], key(t_in): v, key(DOWN): v}}
fall = {"animation_length": DOWN, "bones": {
    "root": {
        "rotation": {"0.0": [0, 0, 0], "0.12": [9, 0, 0], "0.42": [-84, 0, 3], "0.52": [-93, 0, 2], "0.62": [-90, 0, 2], key(DOWN): [-90, 0, 2]},
        "position": {"0.0": [0, 0, 0], "0.42": [0, 2.2, 0], key(DOWN): [0, 2.2, 0]},
    },
    **{b: limb(v, 0.6) for b, v in pose.items()},
}}
rise = {"animation_length": 0.6, "bones": {
    "root": {
        "rotation": {"0.0": [-90, 0, 2], "0.3": [-38, 0, 0], "0.5": [4, 0, 0], "0.6": [0, 0, 0]},
        "position": {"0.0": [0, 2.2, 0], "0.4": [0, 0, 0], "0.6": [0, 0, 0]},
    },
    **{b: {"rotation": {"0.0": v, "0.45": [0, 0, 0], "0.6": [0, 0, 0]}} for b, v in pose.items()},
}}
wr(RP + "animations/return_by_death.animation.json", json.dumps({"format_version": "1.8.0", "animations": {
    "animation.xvoid.rbd.fall": fall, "animation.xvoid.rbd.rise": rise}}, indent=2) + "\n")
print("ok", len(hub), "hub keys, end", END)
