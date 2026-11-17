// Wheel of Adaptation by xVoid_Axell. All Rights Reserved.
import { EquipmentSlot as Lm, system as Hm, world as re } from "@minecraft/server";
function ue(...e) {
    return e;
}
function hr(...e) {
    return e;
}
var Km = ["wooden", "stone", "copper", "iron", "golden", "diamond", "netherite"];
function Te(e) {
    return Km.map((t) => `minecraft:${t}_${e}`);
}
var f = { turn1: 1, turn2: 2, turn3: 3, turn4: 4, turn5: 5, turn6: 6, turn7: 7, turn8: 8 },
    Q = "xvoid:wheel_of_adaptation",
    _r = {
        spin: "xvoid:wheel_of_adaptation_spin",
        full: "xvoid:wheel_of_adaptation_full",
        react: "xvoid:wheel_of_adaptation_react",
        first: "xvoid:wheel_of_adaptation_first",
        fast: "xvoid:wheel_of_adaptation_fast",
        step: "xvoid:wheel_of_adaptation_step",
        step_back: "xvoid:wheel_of_adaptation_step_back",
    },
    be = new Set([Q, ...Object.values(_r)]),
    br = "xvoid:sword_of_extermination",
    mt = "xvoid:adaptation",
    lt = { soulbound: !0, equipWheel: !0, delayTicks: 20 },
    $e = { spin: 40, full: 76, react: 25, first: 79, fast: 17, step: 15, step_back: 15 },
    w = {
        spin: "xvoid.wheel.spin",
        first: "xvoid.wheel.first",
        fast: "xvoid.wheel.fast",
        adapted: "xvoid.wheel.adapted",
        nullify: "xvoid.wheel.nullify",
        heal: "xvoid.wheel.heal",
        slash: "xvoid.sword.slash",
        slashHit: "xvoid.sword.slash_hit",
        stab: "xvoid.sword.stab",
        equip: "armor.equip_netherite",
        purify: "xvoid.sword.purify",
        cure: "xvoid.sword.restore",
        undying: "xvoid.wheel.undying",
    },
    I = {
        spin: "xvoid:wheel_spin",
        charge: "xvoid:adapt_charge",
        regen: "xvoid:regen_pulse",
        rise: "xvoid:positive_rise",
        slashTrail: "xvoid:slash_trail",
        slashSpark: "xvoid:slash_spark",
        ink: "xvoid:slash_ink",
        inkSpark: "xvoid:slash_ink_spark",
        positive: "xvoid:positive_burst",
        halo: "xvoid:adapt_halo",
        ripple: "xvoid:adapt_ripple",
        gather: "xvoid:adapt_gather",
        mandala: "xvoid:adapt_mandala",
        flare: "xvoid:adapt_flare",
        dharma: "xvoid:adapt_dharma",
        sparks: "xvoid:adapt_sparks",
        nova: "xvoid:adapt_nova",
        mandalaBurst: "xvoid:adapt_mandala_burst",
        rays: "xvoid:adapt_rays",
        embers: "xvoid:adapt_embers",
        burst: "xvoid:adapt_burst",
        flash: "xvoid:adapt_flash",
        pillar: "xvoid:adapt_pillar",
        seal: "xvoid:adapt_seal",
        shockwave: "xvoid:adapt_shockwave",
        ward: "xvoid:nullify_ward",
        wardRipple: "xvoid:nullify_ripple",
        wardSparks: "xvoid:nullify_sparks",
        slashCut: "xvoid:slash_cut",
        positiveFlash: "xvoid:positive_flash",
        positiveRing: "xvoid:positive_ring",
        positiveRays: "xvoid:positive_rays",
        positiveSeal: "xvoid:positive_seal",
        airCore: "xvoid:air_core",
        airMuzzle: "xvoid:air_muzzle",
        blinkRing: "xvoid:blink_ring",
        kickBurst: "xvoid:kick_burst",
        kickRing: "xvoid:kick_ring",
        punchBurst: "xvoid:punch_burst",
        dashShock: "xvoid:dash_shock",
        guardFlash: "xvoid:guard_flash",
        goldHit: "xvoid:kick_impact",
        counterCut: "xvoid:counter_cut",
        quakeRing: "xvoid:quake_ring",
        quakeDust: "xvoid:quake_dust",
        reflectBolt: "xvoid:reflect_bolt",
        healSever: "xvoid:heal_sever",
        crackle: "xvoid:wheel_crackle",
        boom: "xvoid:adapt_boom",
        bolts: "xvoid:adapt_bolts",
        flame: "xvoid:undying_flame",
        quakeCrack: "xvoid:quake_crack",
        healCrackle: "xvoid:heal_crackle",
        dashFlash: "xvoid:dash_flash",
        arcs: "xvoid:fx_arcs_gold",
        iceArcs: "xvoid:fx_arcs_ice",
        storm: "xvoid:adapt_storm",
        impactGold: "xvoid:impact_gold",
        impactIce: "xvoid:impact_ice",
        groundFlash: "xvoid:ground_flash",
        shatterGold: "xvoid:shatter_gold",
        shatterIce: "xvoid:shatter_ice",
        ringWave: "xvoid:ring_wave_gold",
        ringWaveMint: "xvoid:ring_wave_mint",
        ringPopGold: "xvoid:ring_pop_gold",
        ringPopIce: "xvoid:ring_pop_ice",
        ringPopMint: "xvoid:ring_pop_mint",
        twinkle: "xvoid:twinkle_gold",
        twinkleMint: "xvoid:twinkle_mint",
        stars: "xvoid:adapt_stars",
        dust: "xvoid:dust_burst",
        dustSmall: "xvoid:dust_small",
        octagram: "xvoid:adapt_octagram",
        fire: "xvoid:adapt_fire",
        beam: "xvoid:adapt_beam",
        slashMoon: "xvoid:slash_moon",
        waveMoon: "xvoid:slash_wave_moon",
        airSpiral: "xvoid:air_spiral",
        blinkSpiral: "xvoid:blink_spiral",
    },
    fe = {
        stab: "animation.extermination_sword.stab",
        slash: "animation.extermination_sword.slash",
        controller: "controller.xvoid.sword",
        stop: "q.any_animation_finished",
    },
    C = {
        handles: 8,
        heightAboveEyes: 0.825,
        spinInterval: 40,
        fastWindow: 60,
        firstJamTicks: 40,
        firstLock: 76,
        fullLock: 76,
        nullifyFlashInterval: 20,
        attackPrefixes: ["mob:", "proj:", "kind:"],
        fullClickTick: 38,
        forgottenNoticeTicks: 40,
        fullBuildTicks: [13, 25, 36],
    },
    ie = { useSlots: !1, useHunger: !1, partialMax: 1, slots: 8, spinExhaustion: 2 },
    rn = { effectWindow: 1 },
    ye = { cooldown: 1200, oneHit: 40, healDelay: 20, graceAfterHeal: 10, saveEvery: 20 },
    on = { maxBonus: 0.5, bonusPerLevel: 0.01, maxLevelBonus: 0.25 },
    _ = {
        purifyRatio: 0.2,
        purifyHeal: 2,
        purifyImmune: ue("minecraft:wither"),
        zombieVillagers: ue(
            "minecraft:zombie_villager",
            "minecraft:zombie_villager_v2"
        ),
        cureInto: "minecraft:villager_v2",
        stabCooldown: 14,
        strikeFxGap: 3,
        cooldownCategory: "xvoid:positive_slash",
        slashCooldown: 140,
        slashWindup: 8,
        slashStart: 1.4,
        slashRange: 12,
        slashSpeed: 1.5,
        slashRadius: 1.8,
        slashWidth: 1.8,
        slashDamage: 10,
        slashKnockback: 1.2,
        trailTicks: 3,
        trailArc: 1.15,
        trailTilt: 0.35,
        trailRadius: 1.7,
        slashCutsBlocks: !0,
        slashMaxBlocks: 32,
        slashCutStart: 1.5,
        uncuttable: new Set([
            "minecraft:bedrock",
            "minecraft:barrier",
            "minecraft:command_block",
            "minecraft:chain_command_block",
            "minecraft:repeating_command_block",
            "minecraft:structure_block",
            "minecraft:structure_void",
            "minecraft:jigsaw",
            "minecraft:end_portal",
            "minecraft:end_portal_frame",
            "minecraft:end_gateway",
            "minecraft:portal",
            "minecraft:reinforced_deepslate",
            "minecraft:border_block",
            "minecraft:allow",
            "minecraft:deny",
            "minecraft:light_block",
        ]),
    },
    me = {
        tagPrefix: "xvoid_w_",
        scanRadius: 32,
        scanInterval: 20,
        kinds: [
            { id: "sword", glyph: "weaponSword", items: Te("sword") },
            { id: "axe", glyph: "weaponAxe", items: Te("axe") },
            {
                id: "spear",
                glyph: "weaponSpear",
                items: Te("spear"),
            },
            { id: "trident", glyph: "weaponTrident", items: hr("minecraft:trident") },
            {
                id: "mace",
                glyph: "weaponMace",
                items: hr("minecraft:mace"),
            },
            { id: "shovel", glyph: "weaponShovel", items: Te("shovel") },
            { id: "pickaxe", glyph: "weaponPickaxe", items: Te("pickaxe") },
            { id: "hoe", glyph: "weaponHoe", items: Te("hoe") },
        ],
    },
    O = {
        show: "\xA7s\xA7h\xA7s\xA7h",
        active: "\xA7s\xA7h\xA7g\xA7r",
        spin: "\xA7s\xA7p\xA7i\xA7n",
        fast: "\xA7s\xA7h\xA7f\xA7s",
        hide: "\xA7s\xA7h\xA7h\xA7s",
        ring: "\xA7u\xA7u",
        mode: "\xA7t\xA7t",
        paused: "\xA7p\xA7s\xA7d\xA7r",
        ringMin: 1,
        ringMax: 8,
        barCells: 5,
        cellSteps: 8,
        refresh: 40,
        stay: 100,
        toastTicks: 70,
    },
    Ii = 58880;
import { EntityDamageCause as nr, EquipmentSlot as Nh, system as Be } from "@minecraft/server";
import { system as qm } from "@minecraft/server";
import { MolangVariableMap as fxMolang } from "@minecraft/server";
import { system as Ae, world as vi } from "@minecraft/server";
var Ti = 1,
    Fm = 1200,
    zm = 3,
    $i = 200,
    Ai = 300,
    Bm = 1e3,
    Vm = 80,
    Wm = 300,
    Um = 50,
    Ri = 20,
    Gm = globalThis.console,
    an = "",
    Er = 0,
    kr = !1,
    yr = !1,
    Tr,
    Sr = [],
    wr = new Map(),
    sn = new Map(),
    Ci = new Set(),
    xr = new Set(),
    je = new Map(),
    Ir = new Set(),
    Pi = new Set();
function vr(e) {
    an ? Gm.log(`[${an} cat] ${e}`) : Sr.length < Um && Sr.push(e);
}
function pt(e, t, n = !1) {
    if (!n) {
        if (Er >= $i) {
            kr || ((kr = !0), vr(`cap ${JSON.stringify({ f: Ti, t: Ae.currentTick, n: $i })}`));
            return;
        }
        Er++;
    }
    vr(`${e} ${JSON.stringify({ f: Ti, t: Ae.currentTick, ...t })}`);
}
function gt(e) {
    let t = wr.get(e);
    return t || ((t = { c: 0, e: 0, s: 0 }), wr.set(e, t)), t;
}
function Oi(e) {
    if (typeof e == "object" && e !== null && "message" in e) {
        let t = e;
        return { n: String(t.name ?? "Error"), m: String(t.message), s: String(t.stack ?? "").slice(0, Bm) };
    }
    return { n: "throw", m: String(e), s: "" };
}
function jm(e) {
    try {
        return JSON.stringify(e).slice(0, Ai);
    } catch (t) {
        return `unserializable: ${String(t)}`.slice(0, Ai);
    }
}
function Di(e) {
    xr.add(e),
        !yr &&
            ((yr = !0),
            Ae.run(() => {
                yr = !1;
                let t = [...xr].map((n) => [n, sn.get(n), Ci.has(n) ? 1 : 0]);
                xr.clear();
                for (let n = 0; n < t.length; n += Ri) pt("reg", { l: t.slice(n, n + Ri) }, !0);
            }));
}
function $r(e, t) {
    if (sn.has(e)) throw new Error(`catcher: duplicate label ${e}`);
    return sn.set(e, t), Di(e), gt(e);
}
function Mi() {
    let e = {};
    for (let [n, r] of wr) (r.c || r.e || r.s) && ((e[n] = [r.c, r.e, r.s]), (r.c = r.e = r.s = 0));
    let t = {};
    for (let n of Ir) t[n] = je.get(n) ?? 0;
    Ir.clear(), pt("stats", { d: e, g: t }, !0);
}
function ht(e, t, n) {
    return (...r) => {
        t.c++;
        try {
            let o = n(...r);
            return o instanceof Promise && o.catch((i) => A(e, i)), o;
        } catch (o) {
            A(e, o);
            return;
        }
    };
}
function Ar(e) {
    if (an) throw new Error("catcher: initCatcher called twice");
    (an = e.mod), (Tr = e.echo), pt("boot", { m: e.mod, v: e.version, b: e.build, api: e.api }, !0);
    for (let t of Sr.splice(0)) vr(t);
    Ae.runInterval(() => {
        Mi(), (Er = 0), (kr = !1);
    }, Fm),
        vi.beforeEvents.playerLeave.subscribe(() => {
            vi.getAllPlayers().length <= 1 && Mi();
        });
}
function A(e, t, n) {
    gt(e).e++;
    let r = Oi(t),
        o = `${e}|${r.n}|${r.m.slice(0, Vm)}`;
    !je.has(o) && je.size >= Wm && je.clear();
    let i = (je.get(o) ?? 0) + 1;
    if ((je.set(o, i), i > zm)) {
        Ir.add(o);
        return;
    }
    pt("err", { l: e, ...r, c: n === void 0 ? void 0 : jm(n), g: o, k: i }), Tr?.(`err ${e}: ${r.n}: ${r.m}`);
}
function Rr(e, t) {
    if ((gt(e).s++, Pi.has(e))) return;
    Pi.add(e);
    let n = Oi(t);
    pt("swallow", { l: e, ...n }), Tr?.(`swallow ${e}: ${n.n}: ${n.m}`);
}
function N(e, t, n, r) {
    let o = ht(t, $r(t, "on"), n);
    return r === void 0 ? e.subscribe(o) : e.subscribe(o, r), o;
}
function Pr(e, t, n) {
    return Ae.runInterval(ht(e, $r(e, "every"), n), t);
}
function le(e, t, n) {
    return Ae.runTimeout(ht(e, gt(e), n), t);
}
function q(e, t) {
    return Ae.run(ht(e, gt(e), t));
}
function qe(e, t) {
    return ht(
        e,
        $r(
            e,
            "command"
        ),
        t
    );
}
function cn(e) {
    if (!sn.has(e)) throw new Error(`catcher: expectCalls on unknown label ${e}`);
    Ci.add(e), Di(e);
}
function W(e, t) {
    return { x: e.x + t.x, y: e.y + t.y, z: e.z + t.z };
}
function Ym(e, t) {
    return { x: e.x - t.x, y: e.y - t.y, z: e.z - t.z };
}
function F(e, t) {
    return { x: e.x * t, y: e.y * t, z: e.z * t };
}
function Xm(e, t) {
    return e.x * t.x + e.y * t.y + e.z * t.z;
}
function Ni(e) {
    return Math.sqrt(Xm(e, e));
}
function Mr(e) {
    let t = Ni(e);
    return t > 1e-6 ? F(e, 1 / t) : { x: 0, y: 0, z: 0 };
}
function Li(e, t) {
    return Ni(Ym(e, t));
}
function pe(e) {
    let t = e.location;
    return { x: t.x, y: t.y + 0.9, z: t.z };
}
function Re(e, t = 0.06) {
    let n = e.location;
    return { x: n.x, y: n.y + t, z: n.z };
}
function k(e) {
    try {
        return e?.typeId === "minecraft:player" ? e : void 0;
    } catch {
        return;
    }
}
var Jm = /\.js:(\d+)/;
function a(e) {
    try {
        return e();
    } catch (t) {
        let n = String(t?.stack);
        Rr(`attempt@${Jm.exec(n)?.[1] ?? 0}`, t);
        return;
    }
}
function ge(e, t) {
    return qm.runTimeout(() => a(t), e);
}
/* fx-tiers:begin (written by tools/fx/gen_particles.py) */
var FX_TIERS = {
    "xvoid:wheel_spin": { low: ["xvoid:wheel_spin_lite"], ultra: ["xvoid:wheel_spin_ultra", "xvoid:u_wheel_spokes", "xvoid:u_wheel_disc"] },
    "xvoid:wheel_crackle": { low: [], ultra: ["xvoid:wheel_crackle_ultra"] },
    "xvoid:adapt_ripple": { low: [], ultra: ["xvoid:adapt_ripple", "xvoid:u_ring_wave_small", "xvoid:u_ground_glint"] },
    "xvoid:fx_arcs_gold": { low: [], ultra: ["xvoid:u_arcs_gold"] },
    "xvoid:fx_arcs_ice": { low: [], ultra: ["xvoid:u_arcs_ice"] },
    "xvoid:twinkle_gold": { low: [], ultra: ["xvoid:twinkle_gold_ultra"] },
    "xvoid:twinkle_mint": { low: [], ultra: ["xvoid:twinkle_mint_ultra"] },
    "xvoid:adapt_charge": { low: ["xvoid:adapt_charge_lite"], ultra: ["xvoid:adapt_charge_ultra", "xvoid:u_charge_lines", "xvoid:u_implode_gold", "xvoid:u_charge_ground"] },
    "xvoid:adapt_gather": { low: ["xvoid:adapt_gather_lite"], ultra: ["xvoid:adapt_gather_ultra"] },
    "xvoid:adapt_flare": { ultra: ["xvoid:adapt_flare", "xvoid:u_flare_big", "xvoid:u_boom_big"] },
    "xvoid:adapt_dharma": { ultra: ["xvoid:adapt_dharma", "xvoid:u_dharma_big"] },
    "xvoid:adapt_sparks": { low: ["xvoid:adapt_sparks_lite"], ultra: ["xvoid:adapt_sparks_ultra"] },
    "xvoid:adapt_boom": { low: [] },
    "xvoid:adapt_nova": { ultra: ["xvoid:adapt_nova", "xvoid:u_nova_big", "xvoid:u_shock_train"] },
    "xvoid:adapt_rays": { low: ["xvoid:adapt_rays_lite"], ultra: ["xvoid:adapt_rays", "xvoid:u_rays"] },
    "xvoid:adapt_embers": { low: [], ultra: ["xvoid:adapt_embers_ultra", "xvoid:u_embers"] },
    "xvoid:adapt_bolts": { low: [], ultra: ["xvoid:u_bolts"] },
    "xvoid:adapt_octagram": { low: [], ultra: ["xvoid:adapt_octagram", "xvoid:u_octagram_outer", "xvoid:u_dotring", "xvoid:u_nodes"] },
    "xvoid:ground_flash": { low: [], ultra: ["xvoid:ground_flash", "xvoid:u_ground_flash"] },
    "xvoid:ring_wave_gold": { low: [], ultra: ["xvoid:u_ring_wave"] },
    "xvoid:dust_burst": { low: [], ultra: ["xvoid:u_dust"] },
    "xvoid:dust_small": { low: [], ultra: ["xvoid:dust_small_ultra"] },
    "xvoid:adapt_storm": { low: [], ultra: ["xvoid:u_storm"] },
    "xvoid:adapt_stars": { low: [], ultra: ["xvoid:u_stars"] },
    "xvoid:adapt_fire": { low: [], ultra: ["xvoid:adapt_fire_ultra", "xvoid:u_fire_ring"] },
    "xvoid:adapt_beam": { low: [], ultra: ["xvoid:u_beam", "xvoid:u_beam_ring", "xvoid:u_sky_wheel", "xvoid:u_sky_ring"] },
    "xvoid:quake_crack": { low: [], ultra: ["xvoid:quake_crack", "xvoid:u_fissure"] },
    "xvoid:shatter_gold": { low: [], ultra: ["xvoid:shatter_gold_ultra", "xvoid:u_shower_gold"] },
    "xvoid:shatter_ice": { low: [], ultra: ["xvoid:shatter_ice_ultra", "xvoid:u_shower_ice"] },
    "xvoid:adapt_shockwave": { ultra: ["xvoid:adapt_shockwave", "xvoid:u_shock_train", "xvoid:u_embers"] },
    "xvoid:adapt_seal": { ultra: ["xvoid:adapt_seal", "xvoid:u_seal_big"] },
    "xvoid:adapt_pillar": { low: ["xvoid:adapt_pillar_lite"], ultra: ["xvoid:adapt_pillar_ultra"] },
    "xvoid:undying_flame": { low: [], ultra: ["xvoid:undying_flame_ultra", "xvoid:u_fire_column"] },
    "xvoid:adapt_burst": { low: ["xvoid:adapt_burst_lite"], ultra: ["xvoid:adapt_burst_ultra"] },
    "xvoid:adapt_flash": { ultra: ["xvoid:adapt_flash", "xvoid:u_flare_big"] },
    "xvoid:nullify_ward": { ultra: ["xvoid:nullify_ward", "xvoid:u_ward_big", "xvoid:u_ward_wave"] },
    "xvoid:nullify_sparks": { low: ["xvoid:nullify_sparks_lite"], ultra: ["xvoid:nullify_sparks_ultra"] },
    "xvoid:slash_trail": { thin: 2 },
    "xvoid:slash_ink": { low: [] },
    "xvoid:slash_spark": { low: [], ultra: ["xvoid:slash_spark_ultra"] },
    "xvoid:slash_ink_spark": { low: ["xvoid:slash_ink_spark_lite"], ultra: ["xvoid:slash_ink_spark_ultra"] },
    "xvoid:slash_moon": { ultra: ["xvoid:slash_moon_ultra", "xvoid:u_moon_echo", "xvoid:u_swing_sparks"] },
    "xvoid:slash_wave_moon": { ultra: ["xvoid:slash_wave_moon_ultra", "xvoid:u_wave_glow", "xvoid:u_wave_sparks", "xvoid:u_wave_dust"] },
    "xvoid:slash_cut": { ultra: ["xvoid:slash_cut_ultra", "xvoid:u_cross_slash"] },
    "xvoid:impact_gold": { low: [], ultra: ["xvoid:impact_gold", "xvoid:u_impact_gold", "xvoid:u_shower_gold"] },
    "xvoid:impact_ice": { low: [], ultra: ["xvoid:impact_ice", "xvoid:u_impact_ice", "xvoid:u_shower_ice"] },
    "xvoid:positive_burst": { low: ["xvoid:positive_burst_lite"], ultra: ["xvoid:positive_burst_ultra"] },
    "xvoid:positive_flash": { ultra: ["xvoid:positive_flash", "xvoid:u_positive_flare"] },
    "xvoid:ring_pop_mint": { low: [], ultra: ["xvoid:u_rings_mint"] },
    "xvoid:ring_pop_gold": { low: [], ultra: ["xvoid:u_rings_gold"] },
    "xvoid:ring_pop_ice": { low: [], ultra: ["xvoid:u_rings_ice"] },
    "xvoid:positive_rise": { low: ["xvoid:positive_rise_lite"], ultra: ["xvoid:positive_rise_ultra"] },
    "xvoid:positive_rays": { low: [], ultra: ["xvoid:positive_rays_ultra"] },
    "xvoid:positive_seal": { ultra: ["xvoid:positive_seal", "xvoid:u_positive_seal", "xvoid:u_mint_pillar"] },
    "xvoid:ring_wave_mint": { low: [], ultra: ["xvoid:u_ring_wave_mint"] },
    "xvoid:air_charge": { low: ["xvoid:air_charge_lite"], ultra: ["xvoid:air_charge_ultra"] },
    "xvoid:air_core": { ultra: ["xvoid:air_core", "xvoid:u_air_implode"] },
    "xvoid:air_spiral": { low: [], ultra: ["xvoid:air_spiral_ultra", "xvoid:u_air_spiral"] },
    "xvoid:air_muzzle": { ultra: ["xvoid:air_muzzle", "xvoid:u_air_muzzle", "xvoid:u_air_cone"] },
    "xvoid:air_streak": { low: ["xvoid:air_streak_lite"], ultra: ["xvoid:air_streak_ultra"] },
    "xvoid:air_ring": { ultra: ["xvoid:air_ring_ultra", "xvoid:u_air_ring"] },
    "xvoid:blink_out": { low: ["xvoid:blink_out_lite"], ultra: ["xvoid:blink_out_ultra"] },
    "xvoid:blink_in": { low: ["xvoid:blink_in_lite"], ultra: ["xvoid:blink_in_ultra"] },
    "xvoid:blink_trail": { low: ["xvoid:blink_trail_lite"], ultra: ["xvoid:blink_trail_ultra"] },
    "xvoid:blink_ring": { ultra: ["xvoid:blink_ring", "xvoid:u_blink_ring"] },
    "xvoid:blink_spiral": { low: [], ultra: ["xvoid:blink_spiral_ultra", "xvoid:u_blink_bolt", "xvoid:u_blink_implode"] },
    "xvoid:kick_impact": { low: ["xvoid:kick_impact_lite"], ultra: ["xvoid:kick_impact_ultra"] },
    "xvoid:kick_burst": { ultra: ["xvoid:kick_burst_ultra", "xvoid:u_kick_boom"] },
    "xvoid:kick_ring": { ultra: ["xvoid:kick_ring", "xvoid:u_rings_gold"] },
    "xvoid:punch_impact": { low: ["xvoid:punch_impact_lite"], ultra: ["xvoid:punch_impact_ultra"] },
    "xvoid:punch_burst": { ultra: ["xvoid:punch_burst_ultra", "xvoid:u_punch_ring"] },
    "xvoid:dash_lines": { low: ["xvoid:dash_lines_lite"], ultra: ["xvoid:dash_lines_ultra"] },
    "xvoid:dash_ring": { low: [], ultra: ["xvoid:dash_ring_ultra"] },
    "xvoid:dash_flash": { low: [], ultra: ["xvoid:dash_flash_ultra"] },
    "xvoid:dash_shock": { ultra: ["xvoid:dash_shock", "xvoid:u_dash_ring"] },
    "xvoid:guard_spark": { low: ["xvoid:guard_spark_lite"], ultra: ["xvoid:guard_spark_ultra"] },
    "xvoid:guard_catch": { low: ["xvoid:guard_catch_lite"], ultra: ["xvoid:guard_catch_ultra"] },
    "xvoid:guard_flash": { ultra: ["xvoid:guard_flash_ultra", "xvoid:u_guard_seal"] },
    "xvoid:counter_cut": { ultra: ["xvoid:counter_cut_ultra", "xvoid:u_counter_cross"] },
    "xvoid:quake_ring": { ultra: ["xvoid:quake_ring", "xvoid:u_shock_train"] },
    "xvoid:quake_dust": { low: ["xvoid:quake_dust_lite"], ultra: ["xvoid:quake_dust_ultra", "xvoid:u_quake_pillars"] },
    "xvoid:reflect_bolt": { ultra: ["xvoid:reflect_bolt_ultra"] },
    "xvoid:heal_sever": { low: ["xvoid:heal_sever_lite"], ultra: ["xvoid:heal_sever_ultra"] },
    "xvoid:heal_crackle": { low: [], ultra: ["xvoid:heal_crackle_ultra", "xvoid:u_arcs_red"] },
    "xvoid:ultra_aura": { low: [], medium: [], ultra: ["xvoid:u_aura_arcs", "xvoid:u_aura_motes"] },
    "xvoid:ultra_aura_ground": { low: [], medium: [], ultra: ["xvoid:u_aura_ring"] },
};
/* fx-tiers:end */
var woaPerfProp = "xvoid:perf",
    woaPerfLevels = ["low", "medium", "ultra"],
    woaPerfCache = new Map(),
    woaFxView = { tick: -1, dims: new Map() },
    woaFxThin = new Map(),
    woaFxRange = 96 * 96;
function woaPerf(e) {
    let t = woaPerfCache.get(e.id);
    if (t === void 0) {
        let n = a(() => e.getDynamicProperty(woaPerfProp));
        (t = woaPerfLevels.includes(n) ? n : "medium"), woaPerfCache.set(e.id, t);
    }
    return t;
}
function woaViewers(e) {
    let t = Be.currentTick;
    woaFxView.tick !== t && ((woaFxView.tick = t), woaFxView.dims.clear());
    let n = e.id,
        r = woaFxView.dims.get(n);
    if (!r) {
        r = { mixed: !1, list: [] };
        for (let o of a(() => e.getPlayers()) ?? []) {
            let i = woaPerf(o);
            i !== "medium" && (r.mixed = !0), r.list.push({ player: o, tier: i, at: o.location });
        }
        woaFxView.dims.set(n, r);
    }
    return r;
}
function woaFxEmit(e, t, n, r) {
    try {
        r ? e.spawnParticle(t, n, r) : e.spawnParticle(t, n);
    } catch (o) {}
}
function fxSpawn(e, t, n, r) {
    let o = FX_TIERS[t],
        i = woaViewers(e);
    if (!i.mixed) {
        if (!o || !o.medium) return woaFxEmit(e, t, n, r);
        for (let c of o.medium) woaFxEmit(e, c, n, r);
        return;
    }
    let s = !0;
    if (o && o.thin) {
        let c = (woaFxThin.get(t) ?? 0) + 1;
        woaFxThin.set(t, c), (s = c % o.thin === 0);
    }
    for (let c of i.list) {
        let d = c.at.x - n.x,
            u = c.at.y - n.y,
            m = c.at.z - n.z;
        if (d * d + u * u + m * m > woaFxRange || (c.tier === "low" && !s)) continue;
        let b = o ? o[c.tier] : void 0;
        if (!b) woaFxEmit(c.player, t, n, r);
        else for (let y of b) woaFxEmit(c.player, y, n, r);
    }
}
function v(e, t, n) {
    fxSpawn(e, t, n);
}
function fxDir(e, t, n, r, o) {
    a(() => {
        let i = new fxMolang();
        i.setVector3(r, o), fxSpawn(e, t, n, i);
    });
}
function fxPositive(e, t) {
    v(e, I.positive, t), v(e, I.positiveFlash, t), v(e, I.positiveRing, t), v(e, I.twinkleMint, t), v(e, I.ringPopMint, t);
}
function fxUndying(e) {
    let t = e.dimension,
        n = Re(e, 0.08),
        r = pe(e);
    for (let o of [I.shockwave, I.seal, I.pillar, I.flame, I.octagram, I.groundFlash, I.ringWave, I.dust, I.storm, I.bolts, I.beam, I.quakeCrack]) v(t, o, n);
    for (let o of [I.burst, I.flash, I.shatterGold]) v(t, o, r);
}
function fxNullify(e, t) {
    let n = e.location,
        r = { x: 0.01, y: 1, z: 0.01 },
        o = { x: n.x, y: n.y + 0.1, z: n.z },
        i = t ? Math.hypot(t.x - n.x, t.z - n.z) : 0;
    if (t && i > 0.05) {
        let s = i > 1 ? Math.max(-0.6, Math.min(0.6, (t.y - n.y) / i)) : 0,
            c = Math.hypot(1, s);
        (r = { x: (t.x - n.x) / i / c, y: s / c, z: (t.z - n.z) / i / c }),
            (o = { x: n.x + r.x * 0.9, y: n.y + 1.15 + r.y * 0.5, z: n.z + r.z * 0.9 });
    }
    for (let s of [I.ward, I.wardRipple, I.wardSparks]) fxDir(e.dimension, s, o, "variable.ward_dir", r);
    v(e.dimension, I.arcs, o);
}
function z(e, t, n, r = 1, o = 1) {
    a(() => e.playSound(t, n, { pitch: r, volume: o }));
}
function Pe(e, t) {
    let n = e.getComponent("minecraft:health");
    !n || n.currentValue <= 0 || n.setCurrentValue(Math.min(n.effectiveMax, n.currentValue + t));
}
function Hi(e) {
    return (a(() => e.getComponent("minecraft:health")?.currentValue) ?? 0) > 0;
}
function Ye(e) {
    let t = e.getHeadLocation();
    return { x: t.x, y: t.y + C.heightAboveEyes, z: t.z };
}
function _t(e, t = w.spin) {
    let n = Ye(e);
    z(e.dimension, t, n), v(e.dimension, I.spin, n), v(e.dimension, I.halo, n), v(e.dimension, I.crackle, n), v(e.dimension, I.arcs, n), v(e.dimension, I.twinkle, n), v(e.dimension, I.ripple, Re(e, 0.08));
}
function Ki(e, t) {
    let n = Ye(e);
    z(e.dimension, w.adapted, n),
        v(e.dimension, I.charge, n),
        v(e.dimension, I.gather, n),
        v(e.dimension, I.mandala, Re(e, 0.08));
    for (let r of C.fullBuildTicks)
        ge(r, () => {
            if (!e.isValid) return;
            let o = Ye(e);
            v(e.dimension, I.spin, o),
                v(e.dimension, I.charge, o),
                v(e.dimension, I.halo, o),
                v(e.dimension, I.arcs, o),
                v(e.dimension, I.crackle, o),
                r + 12 <= C.fullClickTick && v(e.dimension, I.gather, o);
        });
    ge(C.fullClickTick, () => {
        if (!e.isValid) return;
        let r = e.dimension,
            o = Ye(e),
            i = Re(e, 0.08);
        for (let s of [I.flare, I.dharma, I.sparks, I.boom, I.arcs, I.shatterGold]) v(r, s, o);
        for (let s of [I.nova, I.mandalaBurst, I.rays, I.embers, I.bolts, I.octagram, I.groundFlash, I.ringWave, I.dust, I.storm, I.stars, I.fire, I.beam, I.quakeCrack]) v(r, s, i);
    });
    t && ge(C.fullClickTick, t);
}
function Fi(e, t) {
    z(e.dimension, w.nullify, Ye(e), 1, t);
}
import {
    CameraShakeType as ol,
    CommandPermissionLevel as il,
    CustomCommandParamType as al,
    CustomCommandStatus as Qi,
    system as sl,
} from "@minecraft/server";
import { system as Qm } from "@minecraft/server";
import {
    CommandPermissionLevel as ey,
    CustomCommandParamType as ty,
    CustomCommandStatus as ny,
    system as oy,
    world as iy,
} from "@minecraft/server";
var Zm = { 1: 20, 2: 30, 3: 40 },
    el = {
        adapted: 3,
        forgotten: 3,
        death: 3,
        exterminated: 3,
        modeChanged: 2,
        modeCooldown: 2,
        wheelBusy: 2,
        inventoryFull: 2,
        equip: 2,
        unequip: 2,
        cure: 2,
        shake: 2,
        progress: 1,
        modeCurrent: 1,
        switcherHint: 1,
        starving: 1,
        counter: 2,
        perf: 2,
        armor: 2,
        attackAdapted: 3,
        attackProgress: 1,
    },
    Cr = new Map();
function tl(e, t, n) {
    return !e || t >= e.priority ? !0 : n - e.at >= Zm[e.priority];
}
function T(e, t, n) {
    let r = Qm.currentTick,
        o = el[t],
        i = Cr.get(e.id),
        s = tl(i, o, r);
    if (!s) return !1;
    try {
        e.onScreenDisplay.setActionBar(n);
    } catch (c) {
        return !1;
    }
    return Cr.set(e.id, { name: t, priority: o, at: i?.name === t ? i.at : r }), !0;
}
function zi(e) {
    Cr.delete(e);
}
var Bi = {
        wheel: 0,
        shield: 1,
        heart: 2,
        heartDim: 3,
        handleOn: 4,
        handleOff: 5,
        pipOn: 6,
        pipOff: 7,
        skull: 8,
        arrow: 9,
        flame: 10,
        lava: 11,
        explosion: 12,
        impact: 13,
        water: 14,
        snow: 15,
        lightning: 16,
        magic: 17,
        wither: 18,
        sonic: 19,
        thorn: 20,
        anvil: 21,
        potion: 22,
        thermo: 23,
        player: 24,
        sword: 25,
        sparkle: 26,
        check: 27,
        suffocation: 28,
        magma: 29,
        hourglass: 30,
        dot: 31,
        swordDim: 33,
        weaponSword: 34,
        weaponAxe: 35,
        weaponSpear: 36,
        weaponTrident: 37,
        weaponMace: 38,
        weaponShovel: 39,
        weaponPickaxe: 40,
        weaponHoe: 41,
        modeAttack: 42,
        modeBalance: 43,
        modeDefense: 44,
        dash: 45,
        dashDim: 46,
        kick: 47,
        kickDim: 48,
        airBlast: 49,
        airBlastDim: 50,
        pipBar0: 51,
        pipBar1: 52,
        pipBar2: 53,
        pipBarPause1: 54,
        pipBarPause2: 55,
        pause: 56,
        zombie: 57,
        spider: 58,
        illager: 59,
        piglin: 60,
        hoglin: 61,
        slime: 62,
        guardian: 63,
        enderman: 64,
        blaze: 65,
        ghast: 66,
        warden: 67,
        dragon: 68,
        golem: 69,
        witch: 70,
        phantom: 71,
        breeze: 72,
        shulker: 73,
        vex: 74,
        ravager: 75,
        beast: 76,
        creaking: 77,
        silverfish: 78,
        endermite: 79,
        poison: 80,
        slowness: 81,
        weakness: 82,
        blind: 83,
        nausea: 84,
        hunger: 85,
        levitation: 86,
        instantDamage: 87,
        fireball: 88,
        dragonBreath: 89,
        pickaxeDim: 90,
        projectile: 91,
        wheelRedraw: 92,
        swordHud: 93,
        cure: 94,
        cross: 95,
        checkMark: 96,
        void: 97,
        barCell0: 98,
        barGreen1: 99,
        barGreen2: 100,
        barGreen3: 101,
        barGreen4: 102,
        barGreen5: 103,
        barGreen6: 104,
        barGreen7: 105,
        barGreen8: 106,
        barPause1: 107,
        barPause2: 108,
        barPause3: 109,
        barPause4: 110,
        barPause5: 111,
        barPause6: 112,
        barPause7: 113,
        barPause8: 114,
        barGold8: 115,
        pctGreen: 116,
        pctGrey: 117,
        pctGold: 118,
        pauseMark: 119,
        swordHudDim: 120,
        barehand: 121,
        undying: 122,
        undyingDim: 123,
    },
    l = Object.fromEntries(Object.entries(Bi).map(([e, t]) => [e, String.fromCharCode(Ii + t)])),
    nl = Object.keys(Bi),
    rl = new Map(nl.map((e) => [l[e], e]));
function Vi(e) {
    return rl.get(e);
}
function Wi(e) {
    return `woa.glyph.${e}`;
}
function Ui(e) {
    return typeof e == "string" ? { text: e } : e;
}
function x(...e) {
    return { rawtext: e.map(Ui) };
}
function p(e, ...t) {
    return t.length ? { translate: e, with: { rawtext: t.map(Ui) } } : { translate: e };
}
function B(e) {
    return p(Wi(e));
}
function bt(e) {
    let t = Vi(e);
    return t ? B(t) : "";
}
var Gi = new Set([
        "fire",
        "soul_fire",
        "lava",
        "magma",
        "sulfur_cube_magma",
        "explosion",
        "creeper_explosion",
        "charged_creeper_explosion",
        "tnt_explosion",
        "end_crystal_explosion",
        "bed_explosion",
        "fireball_explosion",
        "wither_birth_explosion",
        "wither_skull_explosion",
        "sulfur_cube_explosion",
        "elytra_firework",
        "firework",
        "fall",
        "fly_into_wall",
        "anvil",
        "falling_block",
        "piston",
        "stalactite",
        "stalagmite",
        "drowning",
        "suffocation",
        "freezing",
        "lightning",
        "magic",
        "wither",
        "sonic_boom",
        "contact",
        "cactus",
        "sweet_berry_bush",
        "thorns",
        "guardian_spikes",
        "elder_guardian_spikes",
        "temperature",
        "starvation",
        "void",
        "unknown",
        "projectile",
        "charging",
    ]),
    Or = {
        poison: "potion.poison",
        fatal_poison: "woa.effect.fatal_poison",
        wither: "woa.effect.wither",
        slowness: "potion.moveSlowdown",
        weakness: "potion.weakness",
        mining_fatigue: "potion.digSlowDown",
        blindness: "potion.blindness",
        darkness: "effect.darkness",
        nausea: "potion.confusion",
        hunger: "potion.hunger",
        levitation: "potion.levitation",
        infested: "potion.infested",
        oozing: "potion.oozing",
        weaving: "potion.weaving",
        wind_charged: "potion.windCharged",
        instant_damage: "potion.harm",
    },
    S = {
        hudFont: p("woa.hud.font"),
        adapted: p("woa.hud.adapted"),
        idle: p("woa.hud.idle"),
        seconds: (e) => p("woa.hud.seconds", String(e)),
        equip: x("\xA7p\xA7l\xAB ", p("woa.toast.equip"), " \xBB"),
        unequip: x(
            B("wheelRedraw"),
            " \xA7c",
            p(
                "woa.toast.unequip"
            )
        ),
        death: x(B("wheelRedraw"), " \xA7c", p("woa.toast.death")),
        progress: (e, t, n, r) =>
            x(
                "\xA7a\xA7l",
                p("woa.notice.adapting"),
                " \xA7f\xBB ",
                t,
                " \xA7f",
                e,
                ` \xA7a\xA7l[\xA7f${n}/${r}\xA7a\xA7l]`
            ),
        adaptedTag: x("\xA7p\xA7l", p("woa.toast.adapted")),
        cure: x(B("cure"), " \xA7a\xA7l", p("woa.toast.cured")),
        exterminated: x(B("swordHud"), " \xA7c\xA7l", p("woa.toast.exterminated")),
        forgotten: (e, t) => x("\xA7c", p("woa.toast.forgotten"), " \xA7f\xBB ", t, " \xA7f", e),
        starving: x("\xA77", p("woa.toast.starving")),
        soulbound: x("\xA77", p("woa.lore.soulbound")),
        inventoryFull: x(B("wheelRedraw"), " \xA7c\xA7l", p("woa.bound.inventory_full")),
        env: (e) =>
            p(`woa.env.${e}`),
        kind: (e) => p(`woa.kind.${e}`),
        explosionOf: (e) => p("woa.env.explosion_of", e),
        fireworkBy: (e) => p("woa.env.firework_by", e),
    };
var dn = "xvoid:shake_off",
    ji = ["on", "off"],
    Dr = "woa:shake_state",
    qi = { on: "woa.shake.on", off: "woa.shake.off" },
    Yi = {
        airBlast: { intensity: 0.6, duration: 0.35 },
        kick: { intensity: 0.8, duration: 0.3 },
        adapted: { intensity: 0.4, duration: 0.5 },
    };
function Nr(e) {
    return e === !0;
}
function Xi(e) {
    return Nr(e) ? "off" : "on";
}
function Ji(e) {
    return e === "off";
}
function Xe(e, t) {
    if (!e.isValid) return;
    if (Nr(a(() => e.getDynamicProperty(dn)))) {
        return;
    }
    let { intensity: n, duration: r } = Yi[t];
    try {
        e.camera.addShake({ intensity: n, duration: r, type: ol.Positional });
    } catch (o) {
        A("shake.add", o, { moment: t });
    }
}
function cl(e, t) {
    let n = Xi(a(() => e.getDynamicProperty(dn))),
        r = t ?? n;
    t !== void 0 && t !== n && e.setDynamicProperty(dn, Ji(t)), T(e, "shake", p(qi[r]));
}
var woaArmorProp = "xvoid:armor_off",
    woaArmorCache = new Map();
function woaArmorOff(e) {
    let t = woaArmorCache.get(e.id);
    return t === void 0 && ((t = a(() => e.getDynamicProperty(woaArmorProp)) === !0), woaArmorCache.set(e.id, t)), t;
}
function woaArmorSet(e, t) {
    if (!e.isValid) return;
    let n = woaArmorOff(e) ? "off" : "on",
        r = t ?? n;
    t !== void 0 &&
        t !== n &&
        (woaArmorCache.set(e.id, t === "off"),
        a(() => e.setDynamicProperty(woaArmorProp, t === "off")),
        a(() => Ve(e, R(e.id)))),
        T(e, "armor", p(`woa.armor.${r}`));
}
function woaPerfSet(e, t) {
    if (!e.isValid) return;
    let n = woaPerf(e),
        r = t ?? n;
    t !== void 0 && t !== n && (woaPerfCache.set(e.id, t), a(() => e.setDynamicProperty(woaPerfProp, t))),
        T(e, "perf", p(`woa.perf.${r}`));
}
function woaCommand(e) {
    return (t, n) => {
        let r = k(t.sourceEntity);
        return r
            ? (Be.run(() => a(() => e(r, n))), { status: Qi.Success })
            : { status: Qi.Failure, message: "Run it as a player" };
    };
}
function woaAura() {
    for (let e of a(() => re.getAllPlayers()) ?? [])
        a(() => {
            if (!e.isValid || !R(e.id)) return;
            let t = e.dimension;
            woaViewers(t).mixed &&
                (fxSpawn(t, "xvoid:ultra_aura", Ye(e)),
                Be.currentTick % 40 < 10 && fxSpawn(t, "xvoid:ultra_aura_ground", Re(e, 0.08)));
        });
}
function Zi() {
    Be.runInterval(woaAura, 10);
    sl.beforeEvents.startup.subscribe((e) => {
        e.customCommandRegistry.registerEnum("woa:performance_level", [...woaPerfLevels]),
            e.customCommandRegistry.registerCommand(
                {
                    name: "woa:performance",
                    description:
                        "Effect detail of Wheel of Adaptation for you: low, medium or ultra (no value shows the current level)",
                    permissionLevel: il.Any,
                    cheatsRequired: !1,
                    optionalParameters: [{ name: "woa:performance_level", type: al.Enum }],
                },
                woaCommand(woaPerfSet)
            ),
            e.customCommandRegistry.registerEnum("woa:armor_state", ["on", "off"]),
            e.customCommandRegistry.registerCommand(
                {
                    name: "woa:armor",
                    description:
                        "Mahoraga armor of Wheel of Adaptation for you: on gives it with the wheel, off removes it (no value shows the current state)",
                    permissionLevel: il.Any,
                    cheatsRequired: !1,
                    optionalParameters: [{ name: "woa:armor_state", type: al.Enum }],
                },
                woaCommand(woaArmorSet)
            ),
        e.customCommandRegistry.registerEnum(Dr, [...ji]),
            e.customCommandRegistry.registerCommand(
                {
                    name: "woa:shake",
                    description:
                        "Camera shake of Wheel of Adaptation moves: on or off for you (no value shows the current state)",
                    permissionLevel: il.Any,
                    cheatsRequired: !1,
                    optionalParameters: [{ name: Dr, type: al.Enum }],
                },
                qe("shake.command", (t, n) => {
                    let r = k(t.sourceEntity);
                    return r
                        ? (q("shake.run", () => cl(r, n)), { status: Qi.Success })
                        : {
                              status: Qi.Failure,
                              message:
                                  "Run it as a player",
                          };
                })
            );
    });
}
import { system as mp } from "@minecraft/server";
import { EntityDamageCause as $, EntityTypes as Gl, EquipmentSlot as jl } from "@minecraft/server";
import { EquipmentSlot as dl } from "@minecraft/server";
var ea = Math.max(1, Math.floor(me.scanInterval / me.kinds.length));
function ta(e) {
    return me.tagPrefix + e.id;
}
function ul(e, t) {
    let n = ta(t),
        r = `r=${me.scanRadius},type=!player`;
    a(() => e.runCommand(`tag @e[${r},tag=${n}] remove ${n}`));
    for (let o of t.items)
        a(() => e.runCommand(`tag @e[${r},hasitem={item=${o},location=slot.weapon.mainhand}] add ${n}`));
}
function na(e, t) {
    let n = t % me.scanInterval;
    if (n % ea !== 0) return;
    let r = me.kinds[n / ea];
    r && ul(e, r);
}
function fl(e) {
    let t = a(
        () =>
            e
                .getComponent(
                    "minecraft:equippable"
                )
                ?.getEquipment(dl.Mainhand)?.typeId
    );
    if (t) return me.kinds.find((n) => n.items.includes(t));
}
function ra(e) {
    let t = k(e);
    return t ? fl(t) : me.kinds.find((n) => a(() => e.hasTag(ta(n))));
}
import { EntityDamageCause as L } from "@minecraft/server";
var oa = { spins: f.turn2, icon: l.flame },
    G = { spins: f.turn3, icon: l.explosion },
    ia = { spins: f.turn1, icon: l.impact },
    Lr = { spins: f.turn1, icon: l.anvil },
    aa = { spins: f.turn1, icon: l.anvil },
    Hr = { spins: f.turn1, icon: l.thorn },
    sa = { spins: f.turn1, icon: l.thorn },
    ml = { spins: f.turn3, icon: l.thorn },
    ca = { spins: f.turn2, icon: l.magma };
var ll = {
        fire: oa,
        soul_fire: oa,
        explosion: G,
        creeper_explosion: G,
        charged_creeper_explosion: G,
        tnt_explosion: G,
        end_crystal_explosion: G,
        bed_explosion: G,
        fireball_explosion: G,
        wither_birth_explosion: G,
        wither_skull_explosion: G,
        sulfur_cube_explosion: G,
        elytra_firework: G,
        fall: ia,
        fly_into_wall: ia,
        anvil: Lr,
        falling_block: Lr,
        piston: Lr,
        stalactite: aa,
        stalagmite: aa,
        contact: Hr,
        cactus: Hr,
        sweet_berry_bush: Hr,
        thorns: ml,
        guardian_spikes: sa,
        elder_guardian_spikes: sa,
        magma: ca,
        sulfur_cube_magma: ca,
    },
    pl = [
        ["explosion_", G],
        ["firework_", G],
    ],
    fa = ["fire", "soul_fire"],
    ma = { "env:burning": "env:fire", "env:campfire": "env:fire", "env:soul_campfire": "env:soul_fire" },
    la = [
        "env:fire",
        "env:explosion",
        "env:impact",
        "env:crushing",
        "env:stalactite",
        "env:contact",
        "env:thorns",
        "env:magma",
    ];
function Kr(e) {
    return ll[e] ?? pl.find(([t]) => e.startsWith(t))?.[1];
}
function yt(e) {
    try {
        return e?.typeId;
    } catch {
        return;
    }
}
function gl(e, t) {
    try {
        return !!e && !!t && e.id === t.id;
    } catch {
        return !1;
    }
}
function pa(e) {
    let t = e.indexOf(":");
    return t >= 0 ? e.slice(t + 1) : e;
}
function ga(e, t) {
    try {
        let { x: n, y: r, z: o } = e.location;
        return e.dimension.getBlock({ x: Math.floor(n) + t.x, y: Math.floor(r) + t.y, z: Math.floor(o) + t.z })?.typeId;
    } catch {
        return;
    }
}
var un = [];
for (let e of [0, 1, -1])
    for (let [t, n] of [
        [0, 0],
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ])
        un.push({ x: t, y: e, z: n });
var hl = "minecraft:fire",
    _l = "minecraft:soul_fire",
    bl = "minecraft:cactus",
    yl = "minecraft:sweet_berry_bush";
function xl(e) {
    if (!e) return "fire";
    for (let t of [un[0], un[5]]) {
        let n = ga(e, t);
        if (n === _l) return "soul_fire";
        if (n === hl) return "fire";
    }
    return "fire";
}
function El(e) {
    if (!e) return "contact";
    let t = un.map((n) => ga(e, n));
    return t.includes(yl) ? "sweet_berry_bush" : t.includes(bl) ? "cactus" : "contact";
}
function kl(e) {
    try {
        return !!e?.getComponent("minecraft:is_charged");
    } catch {
        return !1;
    }
}
var da = {
        "minecraft:tnt":
            "tnt_explosion",
        "minecraft:ender_crystal": "end_crystal_explosion",
        "minecraft:sulfur_cube": "sulfur_cube_explosion",
        "minecraft:ghast": "fireball_explosion",
        "minecraft:wither": "wither_birth_explosion",
    },
    ua = {
        "minecraft:fireball": "fireball_explosion",
        "minecraft:wither_skull": "wither_skull_explosion",
        "minecraft:wither_skull_dangerous": "wither_skull_explosion",
    };
function Sl(e) {
    let t = yt(e.damagingProjectile),
        n = e.damagingEntity,
        r = yt(n);
    if (t && ua[t]) return ua[t];
    if (r === "minecraft:creeper")
        return kl(n)
            ? "charged_creeper_explosion"
            : "creeper_explosion";
    if (r && da[r]) return da[r];
    let o = t ?? r;
    return o ? `explosion_${pa(o)}` : "explosion";
}
function wl(e, t) {
    let n = e.damagingEntity,
        r = yt(n);
    return !r || gl(n, t) ? "elytra_firework" : `firework_${pa(r)}`;
}
function Il(e) {
    let t = yt(e.damagingEntity);
    return t === "minecraft:guardian"
        ? "guardian_spikes"
        : t === "minecraft:elder_guardian"
          ? "elder_guardian_spikes"
          : "thorns";
}
function vl(e) {
    return yt(e.damagingEntity) === "minecraft:sulfur_cube" ? "sulfur_cube_magma" : "magma";
}
function ha(e, t) {
    switch (e.cause) {
        case L.fire:
            return xl(t);
        case L.fireTick:
        case L.campfire:
            return "fire";
        case L.soulCampfire:
            return "soul_fire";
        case L.blockExplosion:
            return "bed_explosion";
        case L.entityExplosion:
            return Sl(e);
        case L.fireworks:
            return wl(e, t);
        case L.fall:
            return "fall";
        case L.flyIntoWall:
            return "fly_into_wall";
        case L.anvil:
            return "anvil";
        case L.fallingBlock:
            return "falling_block";
        case L.piston:
            return "piston";
        case L.stalactite:
            return "stalactite";
        case L.stalagmite:
            return "stalagmite";
        case L.contact:
            return El(t);
        case L.thorns:
            return Il(e);
        case L.magma:
            return vl(e);
        default:
            return;
    }
}
import { world as Ea } from "@minecraft/server";
var Fr = "xvoid:mob_tiers",
    Tl = [
        [500, f.turn7],
        [150, f.turn5],
        [100, f.turn4],
        [60, f.turn3],
        [30, f.turn2],
    ],
    $l = 1e30,
    Al = f.turn7,
    Rl = [
        [20, f.turn5],
        [10, f.turn3],
    ];
function Pl(e) {
    return e === void 0 || e > $l ? f.turn1 : (Tl.find(([t]) => e >= t)?.[1] ?? f.turn1);
}
function _a(e) {
    return Rl.find(([t]) => e >= t)?.[1] ?? f.turn1;
}
function ba(e) {
    let t = Pl(e.maxHp);
    return e.vanilla ? Math.max(e.listed, t) : Math.max(e.listed, t, e.boss ? Al : f.turn1, _a(e.damage));
}
function ya(e) {
    let t = e.shooterId && !xt(e.shooterId) ? e.shooterTier : f.turn1;
    return Math.max(f.turn1, t, _a(e.damage));
}
var Ml = { [f.turn6]: f.turn5, [f.turn8]: f.turn7 };
function xa(e) {
    if (typeof e != "string") return {};
    let t = JSON.parse(e);
    if (!t || typeof t != "object") return {};
    let n = {};
    for (let [r, o] of Object.entries(t))
        typeof o == "number" && o >= f.turn1 && o <= f.turn8 && (n[r] = Ml[Math.floor(o)] ?? Math.floor(o));
    return n;
}
function xt(e) {
    return e.startsWith("minecraft:");
}
function ka() {
    try {
        return xa(Ea.getDynamicProperty(Fr));
    } catch (e) {
        return A("mobTier.read", e), {};
    }
}
function zr(e) {
    return ka()[e];
}
function Sa(e, t, n) {
    let r = a(() => e.typeId);
    if (!r || r === "minecraft:player") return;
    let o = a(
            () =>
                e.getComponent(
                    "minecraft:health"
                )?.effectiveMax
        ),
        i = !!a(() => e.getComponent("minecraft:type_family")?.hasTypeFamily("boss")),
        s = ba({ listed: t, vanilla: xt(r), maxHp: o, boss: i, damage: n }),
        c = Ia(r, s, t);
    c && void 0;
}
function wa(e, t, n, r) {
    if (xt(e)) return;
    let o = ya({ shooterId: t, shooterTier: n, damage: r }),
        i = Ia(e, o, f.turn1);
    i && void 0;
}
function Ia(e, t, n) {
    let r = ka(),
        o = r[e];
    if (!(t <= (o ?? n))) {
        r[e] = t;
        try {
            Ea.setDynamicProperty(Fr, JSON.stringify(r));
        } catch (i) {
            A("mobTier.save", i, { typeId: e });
            return;
        }
        return { old: o };
    }
}
function h(e, t) {
    return t.map((n) => [n, e]);
}
var Cl = new Map([
        ...h("player", ["minecraft:player"]),
        ...h("wither", [
            "minecraft:wither",
            "minecraft:wither_skeleton",
        ]),
        ...h("zombie", [
            "minecraft:zombie",
            "minecraft:husk",
            "minecraft:drowned",
            "minecraft:zombie_villager",
            "minecraft:zombie_villager_v2",
            "minecraft:zombie_horse",
            "minecraft:zombie_nautilus",
            "minecraft:frostbite",
        ]),
        ...h("spider", ["minecraft:spider", "minecraft:cave_spider"]),
        ...h("illager", ["minecraft:vindicator", "minecraft:pillager", "minecraft:evocation_illager"]),
        ...h("piglin", ["minecraft:piglin", "minecraft:piglin_brute", "minecraft:zombie_pigman"]),
        ...h("hoglin", ["minecraft:hoglin", "minecraft:zoglin"]),
        ...h("slime", ["minecraft:slime", "minecraft:magma_cube"]),
        ...h("guardian", ["minecraft:guardian", "minecraft:elder_guardian"]),
        ...h("enderman", ["minecraft:enderman"]),
        ...h("blaze", ["minecraft:blaze"]),
        ...h("ghast", ["minecraft:ghast", "minecraft:happy_ghast"]),
        ...h("warden", ["minecraft:warden"]),
        ...h("dragon", ["minecraft:ender_dragon"]),
        ...h("golem", ["minecraft:iron_golem"]),
        ...h("witch", ["minecraft:witch"]),
        ...h("phantom", ["minecraft:phantom"]),
        ...h("breeze", ["minecraft:breeze"]),
        ...h("shulker", ["minecraft:shulker"]),
        ...h("vex", ["minecraft:vex"]),
        ...h("ravager", ["minecraft:ravager"]),
        ...h("creaking", ["minecraft:creaking"]),
        ...h("silverfish", ["minecraft:silverfish"]),
        ...h("endermite", ["minecraft:endermite"]),
        ...h("beast", ["minecraft:wolf", "minecraft:polar_bear", "minecraft:bee", "minecraft:panda", "minecraft:llama", "minecraft:trader_llama", "minecraft:goat", "minecraft:dolphin", "minecraft:fox", "minecraft:cat", "minecraft:ocelot", "minecraft:pufferfish", "minecraft:rabbit", "minecraft:nautilus"]),
    ]),
    Ol = new Map([
        ...h("wither", ["wither"]),
        ...h("poison", ["poison", "fatal_poison"]),
        ...h("slowness", ["slowness"]),
        ...h("weakness", ["weakness"]),
        ...h("blind", [
            "blin\
dness",
            "darkness",
        ]),
        ...h("nausea", ["nausea"]),
        ...h("hunger", ["hunger"]),
        ...h("levitation", ["levitation"]),
        ...h("instantDamage", ["instant_damage"]),
        ...h("pickaxeDim", ["mining_fatigue"]),
    ]),
    Dl = new Map([
        ...h("wither", ["minecraft:wither_skull", "minecraft:wither_skull_dangerous",]),
        ...h("shulker", ["minecraft:shulker_bullet"]),
        ...h("breeze", ["minecraft:wind_charge_projectile", "minecraft:breeze_wind_charge_projectile"]),
        ...h("weaponTrident", ["minecraft:thrown_trident"]),
        ...h("potion", ["minecraft:splash_potion", "minecraft:lingering_potion"]),
        ...h("fireball", ["minecraft:fireball", "minecraft:small_fireball"]),
        ...h("dragonBreath", ["minecraft:dragon_fireball"]),
        ...h("snow", ["minecraft:ice_ball"]),
        ...h("beast", ["minecraft:llama_spit"]),
        ...h("arrow", ["minecraft:arrow"]),
    ]),
    Nl = new Map([["projectile", "projectile"]]);
function va(e) {
    return Cl.get(e) ?? "skull";
}
function Ta(e) {
    return Ol.get(e) ?? "potion";
}
function $a(e) {
    return Dl.get(e) ?? "projectile";
}
function Aa(e) {
    return Nl.get(e);
}
import { system as fn } from "@minecraft/server";
var Br = "instant_damage";
var Ll = new Set(["none", "magic"]);
function Vr(e) {
    return e.replace("minecraft:", "") === Br;
}
function Wr(e) {
    return !Vr(e);
}
function Ra(e, t, n, r) {
    return t || !Ll.has(e) || n === void 0 ? !1 : r - n >= 0 && r - n <= 2;
}
var mn = new Map();
function Pa(e, t) {
    Vr(t) && (mn.set(e.id, fn.currentTick), void 0);
}
function Ma(e, t) {
    if (!t) return !1;
    let n = !!(a(() => e.damagingEntity) ?? a(() => e.damagingProjectile)),
        r = Ra(String(e.cause), n, mn.get(t.id), fn.currentTick);
    return r && void 0, r;
}
function Ca(e) {
    mn.delete(e);
}
var Hl = ["blunt", "slash", "pierce", "bite", "sting"];
var Kl = "blunt",
    Fl = "kind:",
    zl = {
        sword: "slash",
        axe: "slash",
        hoe: "slash",
        spear: "pierce",
        trident: "pierce",
        pickaxe: "pierce",
        mace: "blunt",
        shovel: "blunt",
    },
    Bl = {
        "minecraft:hoglin": "pierce",
        "minecraft:zoglin": "pierce",
        "minecraft:spider": "bite",
        "minecraft:cave_spider": "bite",
        "minecraft:wolf": "bite",
        "minecraft:silverfish": "bite",
        "minecraft:endermite": "bite",
        "minecraft:phantom": "bite",
        "minecraft:bee": "sting",
        "minecraft:pufferfish": "sting",
    },
    Vl = new Set([
        "minecraft:guardian",
        "minecraft:elder_guardian",
        "minecraft:evocation_illager",
    ]),
    Wl = {
        "mob:minecraft:blaze": "proj:minecraft:small_fireball",
        "mob:minecraft:ghast": "proj:minecraft:fireball",
        "mob:minecraft:shulker": "proj:minecraft:shulker_bullet",
        "mob:minecraft:breeze": "proj:minecraft:breeze_wind_charge_projectile",
    },
    Oa = { blunt: "weaponMace", slash: "weaponSword", pierce: "weaponSpear", bite: "beast", sting: "thorn" };
function Je(e) {
    return Fl + e;
}
function ln(e) {
    return Hl.includes(e);
}
function Et(e) {
    if (!(!e.startsWith("minecraft:") || Vl.has(e))) return Bl[e] ?? Kl;
}
function Ur(e) {
    return zl[e];
}
function Da(e) {
    let t = Wl[e];
    if (t) return t;
    if (e.startsWith("weapon:")) {
        let n = Ur(e.slice(7));
        return n ? Je(n) : e;
    }
    if (e.startsWith("mob:")) {
        let n = Et(e.slice(4));
        return n ? Je(n) : e;
    }
    return e;
}
var ql = [
        ["lava", f.turn2, l.lava, [$.lava]],
        ["drowning", f.turn1, l.water, [$.drowning]],
        ["suffocation", f.turn1, l.suffocation, [$.suffocation]],
        ["freezing", f.turn2, l.snow, [$.freezing]],
        ["lightning", f.turn2, l.lightning, [$.lightning]],
        ["magic", f.turn3, l.magic, [$.magic]],
        ["wither", f.turn3, l.wither, [$.wither]],
        ["sonic_boom", f.turn5, l.sonic, [$.sonicBoom]],
        ["temperature", f.turn2, l.thermo, [$.temperature]],
        ["starvation", f.turn1, l.heartDim, [$.starve]],
        ["void", f.turn6, l.void, [$.void]],
    ],
    Yl = new Set([$.selfDestruct]),
    Xl = { [$.none]: "unknown", [$.override]: "unknown" },
    Ha = f.turn1,
    Jl = {
        "minecraft:guardian": f.turn4,
        "minecraft:elder_guardian": f.turn4,
        "minecraft:evocation_illager": f.turn4,
    },
    Ql = {
        "minecraft:shulker_bullet": f.turn4,
        "minecraft:wither_skull": f.turn3,
        "minecraft:wither_skull_dangerous": f.turn3,
        "minecraft:dragon_fireball": f.turn3,
        "minecraft:fireball": f.turn3,
        "minecraft:splash_potion": f.turn3,
        "minecraft:lingering_potion": f.turn3,
        "minecraft:small_fireball": f.turn2,
        "minecraft:wind_charge_projectile": f.turn2,
        "minecraft:breeze_wind_charge_projectile": f.turn2,
    },
    Zl = {
        poison: f.turn1,
        fatal_poison: f.turn3,
        wither: f.turn3,
        levitation: f.turn4,
        instant_damage: f.turn3,
        slowness: f.turn1,
        weakness: f.turn1,
        mining_fatigue: f.turn3,
        blindness: f.turn1,
        darkness: f.turn3,
        nausea: f.turn1,
        hunger: f.turn1,
        infested: f.turn3,
        oozing: f.turn3,
        weaving: f.turn3,
        wind_charged: f.turn3,
    },
    ep = f.turn1,
    tp = f.turn1,
    Ka = new Map(),
    Fa = {},
    za = {};
for (let [e, t, n, r] of ql) {
    (Fa[e] = n), (za[e] = t);
    for (let o of r) Ka.set(o, { key: `env:${e}`, spins: t });
}
function jr(e) {
    return za[e] ?? Kr(e)?.spins ?? Ha;
}
function pn(e) {
    let t = e.indexOf(":");
    return t >= 0 ? e.slice(t + 1) : e;
}
function St(e) {
    return `mob:${e}`;
}
function qr(e) {
    return Jl[e] ?? ep;
}
function Me(e) {
    return { key: St(e), spins: Math.max(qr(e), zr(e) ?? 0) };
}
function Yr(e) {
    return { key: Je(e), spins: 1 };
}
function Na(e) {
    let t = Et(e),
        n = t ? Yr(t) : Me(e);
    return n;
}
function ae(e) {
    try {
        return e?.typeId;
    } catch {
        return;
    }
}
var np = 3.5,
    Ba = {
        "minecraft:skeleton": "minecraft:arrow",
        "minecraft:stray": "minecraft:arrow",
        "minecraft:bogged": "minecraft:arrow",
        "minecraft:parched": "minecraft:arrow",
        "minecraft:pillager": "minecraft:arrow",
        "minecraft:piglin": "minecraft:arrow",
        "minecraft:blaze": "minecraft:small_fireball",
        "minecraft:ghast": "minecraft:fireball",
        "minecraft:shulker": "minecraft:shulker_bullet",
        "minecraft:llama": "minecraft:llama_spit",
        "minecraft:trader_llama": "minecraft:llama_spit",
        "minecraft:snow_golem": "minecraft:snowball",
        "minecraft:wither": "minecraft:wither_skull",
        "minecraft:breeze": "minecraft:breeze_wind_charge_projectile",
        "minecraft:witch": "minecraft:splash_potion",
    };
function Va(e) {
    if (e) {
        if (/(^|:|_)(bow|crossbow)$/.test(e)) return "minecraft:arrow";
        if (/(^|:|_)trident$/.test(e)) return "minecraft:thrown_trident";
    }
}
function rp(e) {
    try {
        return e.getComponent("minecraft:equippable")?.getEquipment(jl.Mainhand)?.typeId;
    } catch {
        return;
    }
}
function op(e, t) {
    try {
        let n = e.location,
            r = t.location;
        return Math.hypot(n.x - r.x, n.y - r.y, n.z - r.z) <= np;
    } catch {
        return !1;
    }
}
function ip(e, t, n, r) {
    return n !== void 0 ? !Va(n) : Ba[t] ? !1 : !!r && op(e, r);
}
function ap(e, t) {
    return a(() => e.id === t.id) ?? !1;
}
function Wa(e) {
    let t = a(() => e.damagingEntity),
        n = a(() => e.damagingProjectile);
    return !!t && !!n && ap(t, n);
}
function gn(e, t = !1) {
    let n = a(() => e.damagingEntity),
        r = a(() => e.damagingProjectile);
    if (!n || !r || !Wa(e)) return n;
    let o = a(() => r.getComponent("minecraft:projectile")?.owner);
    return t && void 0, o;
}
function Xr(e, t) {
    let n = Ql[e] ?? tp,
        r = { key: `proj:${e}`, spins: Math.max(n, zr(e) ?? 0) };
    return t && void 0, r;
}
function Ua(e, t, n) {
    let r = e.cause;
    if (Ma(e, t)) return xe(Br);
    if (r === $.projectile) {
        let u = gn(e),
            m = ae(u),
            b = u ? rp(u) : void 0,
            y = ae(e.damagingProjectile) ?? Va(b) ?? (m ? Ba[m] : void 0);
        if (u && m && m !== "minecraft:player" && !Wa(e) && ip(u, m, b, t)) return Na(m);
        if (y) return Xr(y, m ?? "none");
    }
    if (r === $.entityAttack || r === $.maceSmash) {
        let u = e.damagingEntity,
            m = u ? ra(u) : void 0,
            b = m ? Ur(m.id) : void 0;
        if (b) return Yr(b);
    }
    if (r === $.entityAttack || r === $.maceSmash || r === $.ramAttack) {
        let u = ae(e.damagingEntity);
        if (u) return Na(u);
    }
    if (r === $.magic || r === $.wither) {
        let u = dp(e, t);
        if (u) return u;
    }
    let o = ha(e, t);
    if (o) return { key: `env:${o}`, spins: jr(o) };
    let i = Ka.get(r);
    if (i) return i;
    if (Yl.has(r)) return;
    let s = ae(e.damagingEntity);
    if (s) return Me(s);
    let c = ae(n);
    return c
        ? Me(c)
        : {
              key: `env:${
                  Xl[r] ??
                  String(r ?? "unknown")
                      .replace(/([a-z])([A-Z])/g, "$1_$2")
                      .toLowerCase()
              }`,
              spins: Ha,
          };
}
var sp = { [$.magic]: ["fatal_poison", "poison"], [$.wither]: ["wither"] };
function cp(e, t) {
    if (e)
        return t.find((n) => {
            try {
                return !!e.getEffect(n);
            } catch {
                return !1;
            }
        });
}
function La(e) {
    try {
        return e?.id;
    } catch {
        return;
    }
}
function dp(e, t) {
    let n = ae(e.damagingProjectile);
    if (n) return Xr(n, ae(e.damagingEntity));
    let r = e.damagingEntity,
        o = ae(r);
    if (r && o && La(r) !== La(t)) return Me(o);
    let i = cp(t, sp[e.cause] ?? []);
    if (!i) return;
    let s = xe(i);
    return s ? { ...s, lingering: !0 } : void 0;
}
function Jr(e) {
    return `env:${e}`;
}
function Ga(e) {
    return `proj:${e}`;
}
function wt(e) {
    let t = e.indexOf(":"),
        n = e.slice(0, t),
        r = e.slice(t + 1);
    if (n === "mob") return Me(r);
    if (n === "proj") return Xr(r);
    if (n === "env") return { key: e, spins: jr(r) };
    if (n === "effect") return xe(r);
    if (n === "kind") return ln(r) ? Yr(r) : void 0;
}
var ja = { freezing: "freezing" };
function xe(e) {
    let t = pn(e),
        n = ja[t];
    if (n) return { key: `env:${n}`, spins: jr(n) };
    let r = Zl[t];
    return r ? { key: `effect:${t}`, spins: r } : void 0;
}
function qa(e) {
    if (e.startsWith("effect:")) return [e.slice(7)];
    if (!e.startsWith("env:")) return [];
    let t = e.slice(4);
    return Object.entries(ja)
        .filter(([, n]) => n === t)
        .map(([n]) => n);
}
function kt(e) {
    return pn(e)
        .replace(/_v\d+$/, "")
        .split("_")
        .filter(Boolean)
        .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
        .join(" ");
}
function Ya(e) {
    let t = e.indexOf(":");
    return [e.slice(0, t), e.slice(t + 1)];
}
function up(e) {
    if (e.startsWith("explosion_")) return S.explosionOf(Gr(`minecraft:${e.slice(10)}`));
    if (e.startsWith("firework_")) return S.fireworkBy(Gr(`minecraft:${e.slice(9)}`));
}
function Gr(e) {
    if (!e.startsWith("minecraft:")) return kt(e);
    let t = a(() => Gl.get(e)?.localizationKey);
    return t ? p(t) : kt(e);
}
function Qr(e) {
    let [t, n] = Ya(e);
    return t === "env"
        ? Gi.has(n)
            ? S.env(n)
            : (up(n) ?? kt(n))
        : t === "effect"
          ? Or[n]
              ? p(Or[n])
              : kt(n)
          : t === "kind"
            ? ln(n)
                ? S.kind(n)
                : kt(n)
            : Gr(n);
}
var fp = new Set([
    "env:starvation",
    "env:unknown",
    "env:fire",
    "env:soul_fire",
    "env:lava",
    "env:magma",
    "env:sulfur_cube_magma",
    "env:drowning",
    "env:suffocation",
    "env:freezing",
    "env:contact",
    "env:cactus",
    "env:sweet_berry_bush",
    "env:temperature",
    "env:wither",
]);
function Xa(e) {
    return fp.has(e) || e.startsWith("effect:");
}
function hn(e) {
    return Qr(e);
}
function Ja(e) {
    return x(S.adaptedTag, " \xA7f\xBB ", bt(Ee(e)), " \xA7f", hn(e));
}
function Ee(e) {
    let [t, n] = Ya(e);
    if (t === "env") {
        let r = Aa(n);
        return Fa[n] ?? Kr(n)?.icon ?? (r ? l[r] : l.magic);
    }
    return t === "effect" ? l[Ta(n)] : t === "proj" ? l[$a(n)] : t === "kind" ? (ln(n) ? l[Oa[n]] : l.skull) : l[va(n)];
}
var lp = {
        dash: { ready: "dash", dim: "dashDim" },
        kick: { ready: "kick", dim: "kickDim" },
        airBlast: { ready: "airBlast", dim: "airBlastDim" },
        slash: { ready: "swordHud", dim: "swordHudDim" },
    },
    pp = { sword: "swordHud", barehand: "barehand" },
    gp = { attack: 0, balance: 1, defense: 2 },
    Zr = new Map();
function Qa(e) {
    let t = Zr.get(e);
    return t || ((t = { sent: "", sub: "", refreshAt: 0, traced: "", rows: "", line2: "" }), Zr.set(e, t)), t;
}
function _n(e) {
    return typeof e == "string" ? e : JSON.stringify(e);
}
var bn = O.barCells * O.cellSteps,
    hp = [
        l.barCell0,
        l.barGreen1,
        l.barGreen2,
        l.barGreen3,
        l.barGreen4,
        l.barGreen5,
        l.barGreen6,
        l.barGreen7,
        l.barGreen8,
    ],
    _p = [
        l.barCell0,
        l.barPause1,
        l.barPause2,
        l.barPause3,
        l.barPause4,
        l.barPause5,
        l.barPause6,
        l.barPause7,
        l.barPause8,
    ],
    bp = {
        running: { color: "\xA7a", pct: l.pctGreen },
        paused: {
            color: "\xA77",
            pct: l.pctGrey,
        },
        spinning: { color: "\xA7a", pct: l.pctGreen },
        done: { color: "\xA76", pct: l.pctGold },
    };
function Za(e, t) {
    return t <= 0 ? 0 : Math.max(0, Math.min(bn, Math.floor((e * bn) / t)));
}
function yp(e, t) {
    return t <= 0 ? 0 : Math.max(0, Math.min(100, Math.floor((e * 100) / t)));
}
function xp(e, t) {
    let n = "";
    for (let r = 0; r < O.barCells; r++) {
        let o = Math.max(0, Math.min(O.cellSteps, e - r * O.cellSteps));
        n += t === "done" ? l.barGold8 : t === "spinning" ? l.barGreen8 : (t === "paused" ? _p : hp)[o];
    }
    return n;
}
function ke(e) {
    return e.entry
        ? e.spinning && e.entry.s < e.entry.n
            ? "spinning"
            : e.completing || e.entry.s >= e.entry.n || (e.need > 0 && e.hits >= e.need)
              ? "done"
              : e.paused
                ? "paused"
                : "running"
        : "running";
}
function es(e) {
    let t = ke(e);
    return t === "done" || t === "spinning" ? 100 : yp(e.hits, e.need);
}
function ts(e) {
    return e.entry ? (ke(e) === "spinning" ? Math.min(e.entry.n, e.entry.s + 1) : e.entry.s) : 0;
}
function to(e, t = !0) {
    if (!e.entry) return "";
    let n = ke(e),
        r = bp[n],
        o = n === "done" || n === "spinning" ? bn : Za(e.hits, e.need),
        i = n === "paused" ? `\xA7r${l.pauseMark}` : "",
        s = t
            ? ` ${r.color}${ts(e)}\
/${e.entry.n}`
            : "";
    return `\xA7r${xp(o, n)}${i} ${r.color}${es(e)}\xA7r${r.pct}${s}`;
}
function eo(e) {
    if (!e.key || !e.entry) return `${O.ring}\xA70\xA70\xA70\xA7r`;
    let t = Math.max(O.ringMin, Math.min(O.ringMax, e.entry.n)),
        n = ke(e) === "done" || ke(e) === "spinning" ? e.entry.s + 1 : e.entry.s,
        r = Math.max(0, Math.min(t, n)),
        o = r < t && ke(e) === "paused" ? 1 : 0;
    return `${O.ring}\xA7${t}\xA7${r}\xA7${o}\xA7r`;
}
function Ep(e) {
    return `${O.mode}\xA7${gp[e]}\xA7r`;
}
function kp(e) {
    if (e.atk) return [`\xA7r${l.sword} ${Ee(e.atk.key)} ${to(e.atk)}`];
    if (!e.key || !e.entry) return [`${l.hourglass} \xA78`, S.idle];
    let t = e.others ? `  \xA77+${e.others}` : "";
    return [`\xA7r${Ee(e.key)} ${to(e, !1)}${t}`];
}
function Sp(e) {
    if (!e.key || !e.entry)
        return `none more=${e.others ?? 0}`;
    let t = ke(e);
    return `${e.key}=${es(e)}pct${t === "running" ? "" : `,${t}`} s=${ts(e)}/${e.entry.n} more=${e.others ?? 0}`;
}
function wp(e, t) {
    let n = e.slots ? `\xA76${e.adapted}/${e.slots}` : `\xA76${e.adapted}`;
    return x(
        t,
        eo(e),
        S.hudFont,
        `${l.shield} ${n} \xA77`,
        S.adapted,
        `
`,
        ...kp(e)
    );
}
function no(e) {
    return S.seconds(Math.ceil(e / 20));
}
function Ip(e) {
    return [
        ...(e.modeRefused && e.modeCooldown > 0 ? [`${l.hourglass} \xA77`, no(e.modeCooldown), " "] : []),
        "\xA7f",
        p(`woa.mode.${e.mode}`),
    ];
}
function vp(e, t) {
    return { dash: e.dashTicks, kick: e.kickTicks, airBlast: e.blastTicks, slash: e.swordTicks }[t] ?? 0;
}
function Tp(e) {
    let t = e.moveMsg;
    if (t) {
        let n = lp[t.move];
        return t.kind === "ready" ? [`\xA7r${l[n.ready]}`] : [`\xA7r${l[n.dim]} \xA77`, no(vp(e, t.move))];
    }
    return e.hand ? [`\xA7r${l[pp[e.hand]]}`] : [];
}
function $p(e) {
    let t = e.undyingTicks ?? 0;
    return t > 0 ? [`\xA7r${l.undyingDim} \xA77`, no(t)] : [`\xA7r${l.undying}`];
}
function Ap(e) {
    let t = Tp(e);
    return [...t, ...(t.length ? ["  "] : []), ...$p(e)];
}
function Rp(e) {
    let t = e.undyingTicks ?? 0,
        n = e.moveMsg ? `${e.moveMsg.move}:${e.moveMsg.kind}` : "none";
    return `hand=${e.hand ?? "none"} msg=${n} undying=${t > 0 ? `${Math.ceil(t / 20)}s` : "ready"} modeWait=${e.modeRefused ? Math.ceil(e.modeCooldown / 20) : 0}`;
}
function Pp(e) {
    return x(
        Ep(e.mode),
        ...Ip(e),
        `
`,
        ...Ap(e)
    );
}
function ns(e, t, n, r, o) {
    t.sent === "" && typeof n != "string" && void 0,
        (t.sent = _n(n)),
        (t.sub = _n(r)),
        (t.refreshAt = mp.currentTick + O.refresh);
    try {
        e.onScreenDisplay.setTitle(n, { subtitle: r, fadeInDuration: 0, stayDuration: o, fadeOutDuration: 0 });
    } catch (i) {
        t.sent = "";
    }
}
function rs(e, t, n) {
    let r = Qa(e.id),
        o =
            (t.active ? O.active : "") +
            (t.motion === "still" ? "" : O.spin) +
            (t.motion === "fast" ? O.fast : "") +
            (t.paused ? O.paused : ""),
        i = wp(t, O.show + o),
        s = Pp(t);
    if (_n(i) === r.sent && _n(s) === r.sub && n < r.refreshAt) return;
    let c = `${eo(t)}\
|${t.mode}`;
    c !== r.traced && ((r.traced = c), void 0);
    let d = Sp(t);
    d !== r.rows && ((r.rows = d), void 0);
    let u = Rp(t);
    u !== r.line2 && ((r.line2 = u), void 0), ns(e, r, i, s, O.stay);
}
function os(e) {
    let t = Qa(e.id);
    t.sent !== O.hide && ns(e, t, O.hide, " ", 1);
}
function is(e) {
    Zr.delete(e);
}
import { system as Mp } from "@minecraft/server";
function as() {
    return { message: void 0, modeUntil: 0, waiting: new Set() };
}
function ss(e, t, n) {
    let r = n + 40;
    return t === "mode"
        ? ((e.modeUntil = r), r)
        : ((e.message = { move: t, kind: "refused", until: r }), e.waiting.add(t), r);
}
function cs(e, t, n) {
    for (let o of [...e.waiting]) {
        let i = n[o];
        if (i === void 0) {
            e.waiting.delete(o);
            continue;
        }
        i > 0 || (e.waiting.delete(o), (e.message = { move: o, kind: "ready", until: t + 20 }));
    }
    let r = e.message;
    if (!(!r || t >= r.until)) return { move: r.move, kind: r.kind };
}
function ds(e, t) {
    return t < e.modeUntil;
}
var It = new Map();
function Cp(e) {
    let t = It.get(e);
    return t || ((t = as()), It.set(e, t)), t;
}
function se(e, t, n) {
    let r = Mp.currentTick,
        o = ss(Cp(e.id), t, r);
}
function us(e, t, n) {
    let r = It.get(e);
    return r ? cs(r, t, n) : void 0;
}
function fs(e, t) {
    let n = It.get(e);
    return !!n && ds(n, t);
}
function ms(e) {
    It.delete(e);
}
import {
    ButtonState as qp,
    EquipmentSlot as Yp,
    InputButton as Xp,
    system as Mn,
    world as Jp,
} from "@minecraft/server";
import { system as Tt, world as wn } from "@minecraft/server";
import { EquipmentSlot as ps, ItemStack as Op, system as ls } from "@minecraft/server";
var Ce = new Map(),
    Dp = new Set(["react", "step", "step_back"]),
    gs = new Set(["spin", "fast", "first", "full"]);
function ro(e) {
    return !!e && e !== Q && be.has(e);
}
function oo(e, t) {
    let n = new Op(t, 1);
    e.nameTag && (n.nameTag = e.nameTag),
        e.keepOnDeath && (n.keepOnDeath = !0),
        e.lockMode && a(() => (n.lockMode = e.lockMode));
    let r = a(() => e.getRawLore()) ?? [];
    r.length && a(() => n.setLore(r));
    let o = a(() => e.getComponent("minecraft:enchantable")?.getEnchantments()) ?? [];
    return o.length && a(() => n.getComponent("minecraft:enchantable")?.addEnchantments(o)), n;
}
function hs(e) {
    let t = e.getComponent("minecraft:equippable");
    if (!t) return;
    let n = t.getEquipment(ps.Head);
    if (!(!n || !be.has(n.typeId))) return { equipment: t, item: n };
}
function yn(e, t) {
    let n = hs(e);
    return !n || n.item.typeId === t ? !1 : (n.equipment.setEquipment(ps.Head, oo(n.item, t)), !0);
}
function ce(e, t) {
    let n = _r[t],
        r = hs(e);
    if (!n || !r) return !1;
    let o = ls.currentTick;
    return (
        Ce.set(e.id, { kind: t, start: o, until: o + $e[t] + 1 }),
        r.item.typeId === n ? (yn(e, Q), ls.run(() => a(() => yn(e, n))), !0) : (yn(e, n), !0)
    );
}
function vt(e, t) {
    return t < (Ce.get(e)?.until ?? 0);
}
function _s(e, t) {
    let n = Ce.get(e);
    return !!n && t < n.until && gs.has(n.kind);
}
function bs(e, t) {
    let n = Ce.get(e);
    if (!(!n || t >= n.until || !gs.has(n.kind))) return { kind: n.kind, left: n.until - t };
}
function ys(e, t) {
    let n = Ce.get(e);
    return n && t < n.until ? n.kind : void 0;
}
function xs(e, t) {
    let n = Ce.get(e);
    return !n || t >= n.until || Dp.has(n.kind) || (n.kind === "first" && t < n.start + C.firstJamTicks)
        ? "still"
        : n.kind === "fast"
          ? "fast"
          : "spin";
}
function Es(e, t, n) {
    ro(t) && !vt(e.id, n) && yn(e, Q);
}
function ks(e) {
    let t = e.getComponent("minecraft:inventory")?.container;
    if (t)
        for (let n = 0; n < t.size; n++) {
            let r = t.getItem(n);
            r && ro(r.typeId) && t.setItem(n, oo(r, Q));
        }
}
function Ss(e) {
    if (e.typeId !== "minecraft:item") return;
    let t = a(() => e.getComponent("minecraft:item")?.itemStack);
    if (!t || !ro(t.typeId)) return;
    let n = e.location,
        r = e.dimension;
    e.remove(), r.spawnItem(oo(t, Q), n);
}
function ws(e) {
    Ce.delete(e);
}
var Is = "crafter.fail",
    vs = "woa.wheel.busy";
function Ts(e, t) {
    return e === void 0 || t - e >= 40;
}
var io = new Map();
function xn(e, t) {
    let n = bs(e.id, t);
    if (!n) return;
    let r = io.get(e.id),
        o = Ts(r, t);
    return (
        o && (io.set(e.id, t), T(e, "wheelBusy", x(B("wheelRedraw"), " \xA7c\xA7l", p(vs))), a(() => e.playSound(Is))),
        `wheel turning anim=${n.kind} left=${n.left}\
t`
    );
}
function $s(e) {
    io.delete(e);
}
var As = "xvoid:mode_switcher",
    Oe = ["attack", "balance", "defense"],
    Sn = "balance";
var ao = "xvoid:mode",
    En = { attack: "xvoid:mode_switcher_attack", balance: As, defense: "xvoid:mode_switcher_defense" },
    kn = {
        attack: {
            none: En.attack,
            sword: "xvoid:mode_switcher_attack_sword",
        },
        balance: {
            none: En.balance,
            sword: "xvoid:mode_switcher_sword",
            barehand:
                "xvoid:mode_switcher_barehand",
        },
        defense: { none: En.defense, barehand: "xvoid:mode_switcher_defense_barehand" },
    },
    Z = new Set(Oe.flatMap((e) => Object.values(kn[e]))),
    Np = new Set(Oe.flatMap((e) => [kn[e].sword, kn[e].barehand]).filter((e) => !!e));
function Lp(e, t) {
    return e === void 0 ? !1 : t.has(e) || Np.has(e);
}
function so(e, t, n, r) {
    let o = kn[e];
    return (Lp(n, r) ? o[t] : void 0) ?? o.none;
}
function Rs(e) {
    return Oe.includes(e) ? e : Sn;
}
function Ps(e, t) {
    let r = (Oe.indexOf(e) + (t ? Oe.length - 1 : 1)) % Oe.length;
    return Oe[r];
}
function co(e, t) {
    return e === void 0 ? 0 : Math.max(0, e + 200 - t);
}
function uo(e, t) {
    return e >= 20 ? "switch" : t ? "tap" : "wait";
}
var Hp = { attack: "\xA7c\xA7l", balance: "\xA7p\xA7l", defense: "\xA7w\xA7l" },
    Kp = {
        attack: "modeAttack",
        balance: "modeBalance",
        defense:
            "modeDefense",
    },
    De = new Map(),
    $t = new Map(),
    Cs = [];
function Os(e) {
    return x(B(Kp[e]), " ", Hp[e], p(`woa.mode.${e}`));
}
function fo(e) {
    return !!e && Z.has(e.typeId);
}
function E(e) {
    return Rs(a(() => e.getDynamicProperty(ao)));
}
function Ds(e, t) {
    return co($t.get(e.id), t);
}
function In(e) {
    Cs.push(e);
}
function Ns(e, t) {
    let n = E(e);
    a(() => e.setDynamicProperty(ao, t));
    for (let r of Cs) a(() => r(e, t, n));
}
function Ls(e) {
    De.delete(e), $t.delete(e);
}
function Hs(e) {
    let t = E(e);
    Ns(e, Sn), $t.delete(e.id), De.delete(e.id);
}
function Fp(e) {
    let t = E(e);
    T(e, "modeCurrent", p("woa.mode.current", Os(t)));
}
function zp(e, t, n) {
    let r = t ? "step_back" : "step";
    a(() => e.playSound(w.fast));
    let o = ys(e.id, n);
    if (_s(e.id, n)) {
        return;
    }
    let i = ce(e, r);
}
function Ks(e, t, n) {
    t.done = !0;
    let r = xn(e, n);
    if (r) {
        return;
    }
    let o = co($t.get(e.id), n);
    if (o > 0) {
        T(e, "modeCooldown", p("woa.mode.cooldown", String(Math.ceil(o / 20)))), se(e, "mode", o);
        return;
    }
    let i = E(e),
        s = Ps(i, t.backwards);
    Ns(e, s), $t.set(e.id, n), T(e, "modeChanged", p("woa.mode.changed", Os(s))), zp(e, t.backwards, n);
}
function Ms(e, t) {
    let n = De.get(e.id);
    if ((De.delete(e.id), !n || n.done)) return;
    let r = uo(t - n.start, !0);
    r === "switch" ? Ks(e, n, t) : Fp(e);
}
function Fs() {
    wn.afterEvents.itemStartUse.subscribe((e) => {
        if (!fo(e.itemStack)) return;
        let t = e.source;
        De.set(t.id, { start: Tt.currentTick, backwards: t.isSneaking, done: !1 });
    }),
        wn.afterEvents.itemReleaseUse.subscribe((e) => {
            fo(e.itemStack) && a(() => Ms(e.source, Tt.currentTick));
        }),
        wn.afterEvents.itemStopUse.subscribe((e) => {
            fo(e.itemStack) && a(() => Ms(e.source, Tt.currentTick));
        }),
        Tt.runInterval(() => {
            if (!De.size) return;
            let e = Tt.currentTick;
            for (let t of wn.getAllPlayers()) {
                let n = De.get(t.id);
                !n ||
                    n.done ||
                    (uo(e - n.start, !1) ===
                        "switch" &&
                        a(() => Ks(t, n, e)));
            }
        }, 1);
}
import { system as Tn } from "@minecraft/server";
var At = "xvoid:sword_of_extermination_aura",
    mo = "xvoid:sword_of_extermination_aura_out",
    Se = new Set([br, At, mo]),
    vn = 30,
    Rt = 5;
function de(e) {
    return !!e && Se.has(e);
}
function Bp(e, t) {
    return e !== void 0 && t < e;
}
function lo(e, t) {
    return e !== void 0 && t >= e && t < e + Rt;
}
function Qe(e, t) {
    return Bp(e, t) ? At : lo(e, t) ? mo : br;
}
function zs(e) {
    return e + vn;
}
var Ne = new Map(),
    Bs = [];
function Vs(e) {
    Bs.push(e);
}
function po(e) {
    for (let t of Bs) a(() => t(e));
}
function Ws(e) {
    return Qe(Ne.get(e), Tn.currentTick);
}
function Vp(e) {
    if (!e.isValid) return;
    let t = Ne.get(e.id),
        n = Tn.currentTick;
    lo(t, n) &&
        (po(e),
        le(
            "swordAura.off",
            Rt,
            () => Wp(e)
        ));
}
function Wp(e) {
    if (!e.isValid) return;
    let t = Ne.get(e.id),
        n = Tn.currentTick;
    t === void 0 || n < t + Rt || (Ne.delete(e.id), po(e));
}
function go(e, t) {
    let n = Tn.currentTick,
        r = Qe(Ne.get(e.id), n),
        o = zs(n);
    Ne.set(e.id, o);
    let i = r === At;
    le(
        "swordAura.fade",
        vn,
        () => Vp(e)
    ),
        i || po(e);
}
function Us(e) {
    Ne.delete(e);
}
var Pt = "xvoid:barehand",
    ho = "xvoid:barehand_retract",
    P = new Set([Pt, ho]),
    $n = "xvoid:balance_hand",
    Up = ["sword", "barehand"],
    Gp = "sword",
    Mt = 8,
    jp = 8,
    Gs = "xvoid.blade.extend",
    js = "xvoid.blade.retract",
    Ct = {
        sheath: "animation.extermination_sword.hand_sheath",
        draw: "animation.extermination_sword.hand_draw",
        controller: "controller.xvoid.hand_flick",
        stop: "q.any_animation_finished",
        blendOut: 0.1,
    };
function qs(e) {
    return Up.includes(e) ? e : Gp;
}
function Ys(e) {
    return e === "sword" ? "barehand" : "sword";
}
function An(e, t) {
    return e === "attack" ? "sword" : e === "defense" ? "barehand" : t;
}
function Xs(e) {
    return e ? ho : Pt;
}
function Js(e) {
    return e === "balance";
}
function Qs(e, t) {
    return e !== void 0 && t.has(e);
}
function Zs(e, t) {
    return e !== void 0 && t - e <= jp;
}
function ec(e, t) {
    if (e !== t) return t === "barehand" ? "sheath" : "draw";
}
var Rn = new Map(),
    _o = new Map(),
    Pn = new Map(),
    rc = [],
    Qp = new Set([...Se, ...P]);
function bo(e) {
    return qs(a(() => e.getDynamicProperty($n)));
}
function yo(e) {
    return An(E(e), bo(e));
}
function Cn(e) {
    return yo(e) === "sword" ? Ws(e.id) : Xs(Mn.currentTick < (Pn.get(e.id) ?? 0));
}
function oc(e) {
    rc.push(e);
}
function Y(e, t) {
    return t < (_o.get(e) ?? 0);
}
function tc(e) {
    for (let t of rc) a(() => t(e));
}
function ic(e, t, n, r, o) {
    let i = ec(t, n);
    if (!i) return;
    _o.set(e.id, o + Mt);
    let s = n === "sword" ? Gs : js,
        c = Ct[i],
        d =
            a(
                () => (
                    e.playAnimation(c, {
                        controller: Ct.controller,
                        stopExpression: Ct.stop,
                        blendOutTime: Ct.blendOut,
                    }),
                    !0
                )
            ) === !0;
    n === "barehand"
        ? (Pn.set(e.id, o + Mt),
          Mn.runTimeout(() => {
              e.isValid && tc(e);
          }, Mt + 1))
        : Pn.delete(e.id),
        tc(e);
}
function Zp(e, t) {
    let n = bo(e),
        r = Ys(n);
    a(() => e.setDynamicProperty($n, r)), ic(e, n, r, "tap", t);
}
function eg(e, t, n) {
    if (!t.wearing(e)) return "no wheel";
    let r = E(e);
    if (!Js(r)) return `mode=${r}`;
    if (!e.isOnGround)
        return "in the air";
    let o = a(() => e.getComponent("minecraft:equippable")?.getEquipment(Yp.Mainhand)?.typeId);
    return Qs(o, Qp) ? (Y(e.id, n) ? "locked" : t.busy(e)) : `holding=${o ?? "nothing"}`;
}
function nc(e) {
    return (
        a(() => String(e.inputInfo.lastInputModeUsed)) ??
        "unknown"
    );
}
function tg(e, t) {
    if (e.button !== Xp.Sneak) return;
    let n = e.player,
        r = Mn.currentTick;
    if (e.newButtonState !== qp.Pressed) {
        return;
    }
    let o = Rn.get(n.id),
        i = Zs(o, r);
    if (!i) {
        Rn.set(n.id, r);
        return;
    }
    Rn.delete(n.id);
    let s = eg(n, t, r);
    if (s) {
        return;
    }
    Zp(n, r);
}
function ac(e) {
    N(Jp.afterEvents.playerButtonInput, "modeItem.sneakTap", (t) => tg(t, e)),
        In((t, n, r) => {
            if (!e.wearing(t)) return;
            let o = bo(t);
            ic(t, An(r, o), An(n, o), "mode", Mn.currentTick);
        });
}
function sc(e) {
    a(() => e.setDynamicProperty($n, void 0)), xo(e.id);
}
function xo(e) {
    Rn.delete(e), _o.delete(e), Pn.delete(e);
}
function On(e, t, n) {
    return t <= 0 || t === n ? Math.min(e, n) : e >= t ? n : Math.min(n, Math.max(0, Math.round((e / t) * n)));
}
var cc = new Set(["void"]),
    dc = 20,
    Le = 60,
    Eo = Le * 20,
    ng = 100,
    ko = 20,
    uc = 10;
function fc() {
    return { p: 0, activeLeft: 0, lastHit: -dc };
}
function he(e) {
    return Math.round(e * 100) / 100;
}
function So(e) {
    return e === void 0 ? 0 : e + 1;
}
function mc(e, t) {
    let n = 1 - 0.2 * So(t);
    return n > 0 ? e / n : e;
}
function rg(e) {
    return Math.min(40, 10 + 1 * Math.max(0, e));
}
function lc(e, t, n, r = 0) {
    if (((e.activeLeft = Le), t - e.lastHit < dc)) return 0;
    e.lastHit = t;
    let o = he(rg(r) * n);
    return (e.p = he(e.p + o)), o;
}
function pc(e, t) {
    if (e.activeLeft <= 0) return 0;
    e.activeLeft--;
    let n = 1 * t;
    return (e.p = he(e.p + n)), n;
}
function Ze(e) {
    return 40 * Math.max(1, e);
}
function gc(e, t) {
    return e.p >= Ze(t);
}
function hc(e, t) {
    return (e.p = he(Math.max(0, e.p - Ze(t)))), e.p;
}
function He(e) {
    return e.activeLeft > 0;
}
function _c(e, t, n) {
    return Math.floor(e / n) !== Math.floor(t / n);
}
function bc(e, t) {
    return e - t >= ng;
}
function yc(e) {
    return e !== void 0 && e <= 0;
}
function wo() {
    return { ...fc(), weight: 0, taken: 0, lastPulse: 0 };
}
var og = 4,
    ig = 2,
    et = new Map(),
    Ot = new Set(),
    X = new Set(),
    tt = new Map();
function xc() {
    return {
        map: new Map(),
        pending: new Map(),
        spin: 0,
        lastSpin: 0,
        lastFlash: 0,
        lastKey: void 0,
        lastKeyAt: 0,
        hudKey: void 0,
        hudKeyAt: 0,
        hudShown: void 0,
        graceUntil: 0,
        shieldTick: -10,
        recentEffects: [],
        dirty: !1,
        firstSpin: void 0,
        landing: void 0,
        lastTurn: void 0,
        atk: new Map(),
        atkTurnAt: -100,
        atkLast: void 0,
        atkLastAt: -1e9,
        counter: void 0,
    };
}
function R(e) {
    return Ot.has(e);
}
function ee(e) {
    let t = et.get(e.id);
    return t || ((t = xc()), et.set(e.id, t)), t;
}
function Ec(e) {
    let t = xc(),
        n = e.getDynamicProperty(mt);
    if (typeof n == "string")
        try {
            let r = JSON.parse(n),
                o = (r.v ?? 1) < ig;
            for (let [i, s] of Object.entries(r.m ?? {})) {
                if (o && la.includes(i)) continue;
                let c = Da(ma[i] ?? i),
                    d = wt(c)?.spins ?? s[1],
                    u = On(s[0], s[1], d);
                d !== s[1] && void 0;
                let m = t.map.get(c),
                    b = m !== void 0;
                t.map.set(c, { s: Math.max(u, m?.s ?? 0), n: d, used: Math.max(s[2] ?? 0, m?.used ?? 0) });
                let y = Math.max(s[3] ?? 0, t.pending.get(c)?.p ?? 0),
                    K = t.map.get(c).s;
                if (((c !== i || b) && void 0, y > 0 && K < d)) {
                    let U = wo();
                    (U.p = he(y)),
                        (U.activeLeft = Math.max(
                            0,
                            Math.min(Le, Math.max(s[4] ?? 0, t.pending.get(c)?.activeLeft ?? 0))
                        )),
                        t.pending.set(c, U);
                } else t.pending.delete(c);
            }
            (t.spin = (r.p ?? 0) % C.handles), woaAtkLoad(t, r.a);
        } catch (r) {
            A(
                "state.load",
                r,
                { player: e.id }
            ),
                t.map.clear(),
                t.pending.clear();
        }
    return et.set(e.id, t), t;
}
function Dn(e, t) {
    let n = {};
    for (let [o, i] of t.map) {
        let s = i.s < i.n ? t.pending.get(o) : void 0,
            c = s ? he(s.p) : 0;
        (i.s > 0 || c > 0) && (n[o] = [i.s, i.n, i.used ?? 0, c, s?.activeLeft ?? 0]);
    }
    let r = { m: n, p: t.spin, v: og, a: woaAtkSave(t) };
    e.setDynamicProperty(mt, JSON.stringify(r));
}
function kc(e) {
    let t = et.get(e.id);
    t
        ? (t.map.clear(), t.pending.clear(), t.atk.clear(), (t.counter = void 0), (t.landing = void 0), Dn(e, t))
        : e.setDynamicProperty(mt, void 0);
}
function Sc(e) {
    et.delete(e.id), e.setDynamicProperty(mt, void 0);
}
function wc(e) {
    et.delete(e), Ot.delete(e), X.delete(e);
}
function Ic(e) {
    if (e.firstSpin || e.landing) return !1;
    for (let t of e.map.values()) if (t.s > 0) return !1;
    return !0;
}
function Dt(e) {
    let t = 0;
    for (let n of e.map.values()) n.s >= n.n && t++;
    return t;
}
function te(...e) {
    return e.map(St);
}
function Nn(...e) {
    return e.map(Ga);
}
function we(...e) {
    return e.map(Jr);
}
var ag = [
        ...we(
            "explosion",
            "creeper_explosion",
            "charged_creeper_explosion",
            "tnt_explosion",
            "end_crystal_explosion",
            "bed_explosion",
            "fireball_explosion",
            "wither_birth_explosion",
            "wither_skull_explosion",
            "sulfur_cube_explosion",
            "elytra_firework"
        ),
        ...Nn(
            "minecraft:fireball",
            "minecraft:wither_skull",
            "minecraft:wither_skull_dangerous"
        ),
    ],
    vc = [
        {
            name: "warden",
            members: [
                ...te(
                    "minecraft:warden"
                ),
                ...we("sonic_boom"),
            ],
        },
        {
            name: "wither",
            members: [
                ...te("minecraft:wither"),
                ...Nn(
                    "minecraft:wither_skull",
                    "minecraft:wither_skull_dangerous"
                ),
                ...we("wither_skull_explosion", "wither_birth_explosion"),
            ],
        },
        { name: "ender_dragon", members: [...te("minecraft:ender_dragon"), ...Nn("minecraft:dragon_fireball")] },
    ];
function Tc(e) {
    return vc.find((t) => t.members.includes(e));
}
var sg = [
    ...vc.map((e) => [...e.members]),
    te(
        "minecraft:zombie",
        "minecraft:husk",
        "minecraft:drowned",
        "minecraft:zombie_villager",
        "minecraft:zombie_villager_v2",
        "minecraft:zombie_pigman"
    ),
    te(
        "minecraft:skeleton",
        "minecraft:stray",
        "minecraft:bogged",
        "minecraft:parched"
    ),
    te("minecraft:spider", "minecraft:cave_spider"),
    te("minecraft:vindicator", "minecraft:pillager", "minecraft:evocation_illager", "minecraft:vex"),
    te("minecraft:piglin", "minecraft:piglin_brute", "minecraft:zombie_pigman"),
    te("minecraft:hoglin", "minecraft:zoglin"),
    te("minecraft:slime", "minecraft:magma_cube"),
    te(
        "minecraft:guardian",
        "minecraft:elder_guardian"
    ),
    ag,
    [...we("fire", "soul_fire", "lava", "magma", "sulfur_cube_magma"), ...Nn("minecraft:small_fireball")],
    we("anvil", "falling_block", "piston", "stalactite", "stalagmite"),
    we("fall", "fly_into_wall"),
    we("contact", "cactus", "sweet_berry_bush"),
    we("thorns", "guardian_spikes", "elder_guardian_spikes"),
];
function cg(e) {
    return e.startsWith("env:explosion_") || e.startsWith("env:firework_") ? Jr("explosion") : e;
}
var dg = { "env:lava": ["env:fire"] };
function $c(e) {
    return dg[e] ?? [];
}
function Ac(e) {
    let t = new Set(),
        n = cg(e);
    for (let r of sg) if (r.includes(n)) for (let o of r) o !== e && t.add(o);
    return [...t];
}
var Rc = ["VIII", "III", "VII", "II", "IV", "VI", "IX", "I", "V", "X"];
var Ln = {
    "a falu h\u0151se": "village_hero",
    "a nautilusz lehelete": "breath_of_the_nautilus",
    abbaulähmung: "mining_fatigue",
    absorbering: "absorption",
    absorción: "absorption",
    absorpcia: "absorption",
    absorpcja: "absorption",
    absorptie: "absorption",
    absorption: "absorption",
    absorção: "absorption",
    "adem van de nautilus": "breath_of_the_nautilus",
    "am\xE9lioration de sant\xE9": "health_boost",
    angripen: "infested",
    "an\u0131nda hasar": "instant_damage",
    "an\u0131nda sa\u011Fl\u0131k": "instant_health",
    apnea: "water_breathing",
    assorbimento: "absorption",
    "ate\u015Fe dayan\u0131kl\u0131l\u0131k": "fire_resistance",
    "avalia\xE7\xE3o sinistra": "trial_omen",
    aveuglement: "blindness",
    avvelenamento: "poison",
    "azonnali s\xE9r\xFCl\xE9s": "instant_damage",
    "azonnali \xE9leter\u0151": "instant_health",
    açlık: "hunger",
    "bad omen": "bad_omen",
    bahnenie: "oozing",
    "bask\u0131n kehaneti": "raid_omen",
    befallen: "infested",
    befengt: "infested",
    berisi: "infested",
    "bertenaga angin": "wind_charged",
    blindhed: "blindness",
    blindheid: "blindness",
    blindheit: "blindness",
    blindhet: "blindness",
    blindness: "blindness",
    "bohater wioski": "village_hero",
    "bonus de vie": "health_boost",
    "boost kesehatan": "health_boost",
    "breath of the nautilus": "breath_of_the_nautilus",
    bulantı: "nausea",
    bulaşmış: "infested",
    "byns hj\xE4lte": "village_hero",
    bányászfáradtság: "mining_fatigue",
    "b\xF3nus de vida": "health_boost",
    "caduta lenta": "slow_falling",
    "cansado de minar": "mining_fatigue",
    "carica ventosa": "wind_charged",
    "carregado de vento": "wind_charged",
    "cattivo presagio": "bad_omen",
    "ca\xEDda lenta": "slow_falling",
    cecità: "blindness",
    cegueira: "blindness",
    ceguera: "blindness",
    chradnutie: "wither",
    "chute lente": "slow_falling",
    "con carga de viento": "wind_charged",
    "conduit power": "conduit_power",
    csatornaeffektus: "conduit_power",
    cécité: "blindness",
    célérité: "haste",
    "danno istantaneo": "instant_damage",
    "dano instant\xE2neo": "instant_damage",
    "danos instant\xE2neos": "instant_damage",
    darkness: "darkness",
    dayanıklılık: "resistance",
    "da\xF1o instant\xE1neo": "instant_damage",
    debilidad: "weakness",
    debolezza: "weakness",
    "dech lod\u011Bnky": "breath_of_the_nautilus",
    decomposição: "wither",
    "desafio de press\xE1gio": "trial_omen",
    direktheilung: "instant_health",
    direktschaden: "instant_damage",
    dokuma: "weaving",
    dorfheld: "village_hero",
    dorpsheld: "village_hero",
    doygunluk: "saturation",
    "drohende pr\xFCfung": "trial_omen",
    "drohendes unheil": "bad_omen",
    druipen: "oozing",
    duisternis: "darkness",
    dunkelheit: "darkness",
    "dych lodenky": "breath_of_the_nautilus",
    "d\xE5rlig j\xE6rtegn": "bad_omen",
    "d\xE5rligt tegn": "bad_omen",
    décomposition: "wither",
    "d\xE9g\xE2ts instantan\xE9s": "instant_damage",
    "d\xFDchanie vo vode": "water_breathing",
    "d\xFDch\xE1n\xED pod vodou": "water_breathing",
    eile: "haste",
    eldresistens: "fire_resistance",
    ellenállás: "resistance",
    "elnyelt \xE9leter\u0151": "absorption",
    emiş: "absorption",
    "energia condotta": "conduit_power",
    "energia zo \u017Eiari\u010Da": "conduit_power",
    "energie ze z\xE1\u0159i\u010De": "conduit_power",
    "eroe del villaggio": "village_hero",
    erő: "strength",
    escuridão: "darkness",
    exaustão: "mining_fatigue",
    exudación: "oozing",
    faiblesse: "weakness",
    faim: "hunger",
    fame: "hunger",
    fart: "speed",
    "fatica del minatore": "mining_fatigue",
    "fatiga de extracci\xF3n": "mining_fatigue",
    "fatigue de minage": "mining_fatigue",
    fertőzött: "infested",
    feuerresistenz: "fire_resistance",
    "fire resistance": "fire_resistance",
    fjærfall: "slow_falling",
    fløderkraft: "conduit_power",
    fome: "hunger",
    force: "strength",
    "force de conduit": "conduit_power",
    forza: "strength",
    força: "strength",
    "fosztogat\xF3-\xF3men": "raid_omen",
    fraqueza: "weakness",
    fuerza: "strength",
    "f\xF4lego de n\xE1utilo": "breath_of_the_nautilus",
    "f\xF6raning om r\xE4d": "raid_omen",
    "f\xF6raning om utmaning": "trial_omen",
    "gece g\xF6r\xFC\u015F\xFC": "night_vision",
    geleiderkracht: "conduit_power",
    geschwindigkeit: "speed",
    gesundheitsbonus: "health_boost",
    "getroffen door windvlaag": "wind_charged",
    gezondheidsboost:"health_boost",
    geïnfesteerd: "infested",
    gift: "poison",
    gotejante: "oozing",
    "gu\xE9rison instantan\xE9e": "instant_health",
    gyengeség: "weakness",
    gyorsaság: "speed",
    gæller: "water_breathing",
    görünmezlik: "invisibility",
    głód: "hunger",
    haast: "haste",
    "haaste-enne": "trial_omen",
    hambre: "hunger",
    hast: "haste",
    haste: "haste",
    hastighed: "speed",
    hastighet: "speed",
    hastverk: "haste",
    "havaya y\xFCkselme": "levitation",
    "health boost": "health_boost",
    heiveröitys: "weakness",
    helbredsboost: "health_boost",
    "helmiveneen henk\xE4ys": "breath_of_the_nautilus",
    helseøkning: "health_boost",
    "hero of the village":"village_hero",
    "her\xF3i da aldeia": "village_hero",
    "her\xF3i da vila": "village_hero",
    hidastus: "slowness",
    hlad: "hunger",
    honger: "hunger",
    hoppkraft: "jump_boost",
    hoppøkning: "jump_boost",
    "hrdina dediny": "village_hero",
    "hrdina vesnice": "village_hero",
    hunger: "hunger",
    "huono enne": "bad_omen",
    "hurtig skade": "instant_damage",
    "hurtigt helbred": "instant_health",
    hálószövés:"weaving",
    hälsobonus: "health_boost",
    "h\xE9roe de la aldea": "village_hero",
    "h\xE9ros du village": "village_hero",
    hız: "speed",
    ildmodstand: "fire_resistance",
    ildmotstand: "fire_resistance",
    illamående: "nausea",
    imeytyminen: "absorption",
    "impulso en salto": "jump_boost",
    infestación: "infested",
    infestado: "infested",
    infestation: "infested",
    "infestazione applicata": "infested",
    infestação: "infested",
    infested: "infested",
    inficeret: "infested",
    "instant damage": "instant_damage",
    "instant health": "instant_health",
    invisibilidad: "invisibility",
    invisibilidade: "invisibility",
    invisibility: "invisibility",
    invisibilità: "invisibility",
    invisibilité: "invisibility",
    "jatuh perlahan": "slow_falling",
    jed: "poison",
    johdinvoima: "conduit_power",
    "jump boost": "jump_boost",
    kaivuuhidastus: "mining_fatigue",
    "kanal g\xFCc\xFC": "conduit_power",
    karanlık: "darkness",
    "kazma yorgunlu\u011Fu": "mining_fatigue",
    kebutaan: "blindness",
    kecepatan: "speed",
    kegelapan: "darkness",
    "kekuatan konduit": "conduit_power",
    kelambatan: "slowness",
    kelaparan: "hunger",
    "kelelahan pertambangan": "mining_fatigue",
    kelemahan: "weakness",
    "kemampuan menghilang": "invisibility",
    "kerusakan instan": "instant_damage",
    "kesehatan instan": "instant_health",
    ketahanan: "resistance",
    "ketahanan api": "fire_resistance",
    kidukset: "water_breathing",
    kracht: "strength",
    kuntotehoste: "health_boost",
    kuvvet: "strength",
    kvalme: "nausea",
    kvickhet: "haste",
    kyllästyminen: "saturation",
    "kyl\xE4n sankari": "village_hero",
    körlük: "blindness",
    "k\xF6t\xFC kehanet": "bad_omen",
    "k\xF6y\xFCn kahraman\u0131": "village_hero",
    "landsbyens helt": "village_hero",
    langsamkeit: "slowness",
    langsomhed: "slowness",
    "langsomt fald": "slow_falling",
    "langzaam vallen": "slow_falling",
    "lass\xFA zuhan\xE1s": "slow_falling",
    lassúság: "slowness",
    lebegés: "levitation",
    ledningskraft: "conduit_power",
    leijuminen: "levitation",
    lenteur: "slowness",
    lentezza: "slowness",
    lentidão: "slowness",
    lentitud: "slowness",
    "lep\u0161\xED v\xFDskok": "jump_boost",
    levitace: "levitation",
    levitación: "levitation",
    levitasi: "levitation",
    levitasjon: "levitation",
    levitatie: "levitation",
    levitation: "levitation",
    levitazione: "levitation",
    levitação: "levitation",
    levitácia: "levitation",
    lewitacja: "levitation",
    lisävoima: "strength",
    láthatatlanság: "invisibility",
    långsamhet: "slowness",
    "l\xE5ngsamt fall": "slow_falling",
    lévitation: "levitation",
    magasugrás: "jump_boost",
    "mal presagio": "bad_omen",
    "mau press\xE1gio": "bad_omen",
    "mauvais pr\xE9sage": "bad_omen",
    meereskraft: "conduit_power",
    "mejora de salud": "health_boost",
    menenun: "weaving",
    mengalir: "oozing",
    "meningkatkan lompatan": "jump_boost",
    metning: "saturation",
    mijnmoeheid: "mining_fatigue",
    minetræthed: "mining_fatigue",
    "mining fatigue": "mining_fatigue",
    misselijkheid: "nausea",
    "moc przewodni": "conduit_power",
    modstand: "resistance",
    motstand: "resistance",
    mrok: "darkness",
    mual: "nausea",
    myrkky: "poison",
    mättnad: "saturation",
    mætning: "saturation",
    méreg: "poison",
    mörker: "darkness",
    mörkerseende: "night_vision",
    mørke: "darkness",
    "nabit\xE9 vetrom": "wind_charged",
    nachtsicht: "night_vision",
    nachtzicht: "night_vision",
    "napas nautilus": "breath_of_the_nautilus",
    nasycenie: "saturation",
    nasýtenie: "saturation",
    nattesyn: "night_vision",
    nattsyn: "night_vision",
    "natychmiastowe obra\u017Cenia": "instant_damage",
    "natychmiastowe zdrowie": "instant_health",
    nausea: "nausea",
    nausée: "nausea",
    "nautilens \xE5nde": "breath_of_the_nautilus",
    "nautilus-atem": "breath_of_the_nautilus",
    neviditelnost: "invisibility",
    neviditeľnosť: "invisibility",
    nevolnost: "nausea",
    nevoľnosť: "nausea",
    niewidzialność: "invisibility",
    "night vision": "night_vision",
    nopeutus: "speed",
    "notilus nefesi": "breath_of_the_nautilus",
    "no\u010Dn\xE9 videnie": "night_vision",
    "no\u010Dn\xED vid\u011Bn\xED": "night_vision",
    nudności: "nausea",
    nyálkaképzés: "oozing",
    náusea: "nausea",
    náuseas: "nausea",
    näivetys: "wither",
    näkymättömyys: "invisibility",
    nälkä: "hunger",
    obscurité: "darkness",
    obumieranie: "wither",
    "oddech \u0142odzika": "breath_of_the_nautilus",
    "oddychanie pod wod\u0105": "water_breathing",
    odolnost: "resistance",
    odolnosť: "resistance",
    "odolnos\u0165 proti oh\u0148u": "fire_resistance",
    odporność: "resistance",
    "odporno\u015B\u0107 na ogie\u0144": "fire_resistance",
    ohnivzdornost: "fire_resistance",
    "okam\u017Eit\xE9 po\u0161kodenie": "instant_damage",
    "okam\u017Eit\xE9 po\u0161kozen\xED": "instant_damage",
    "okam\u017Eit\xE9 uzdraven\xED": "instant_health",
    "okam\u017Eit\xE9 zdravie": "instant_health",
    "omedelbar h\xE4lsa": "instant_health",
    "omedelbar skada": "instant_damage",
    "omen pr\xF3by": "trial_omen",
    "ond f\xF6raning": "bad_omen",
    "onmiddellijke genezing": "instant_health",
    "onmiddellijke schade": "instant_damage",
    onzichtbaarheid: "invisibility",
    oozing: "oozing",
    oscuridad: "darkness",
    oscurità: "darkness",
    osynlighet: "invisibility",
    "pahlawan desa": "village_hero",
    pakostnice: "wither",
    parantuminen: "regeneration",
    pegajoso: "oozing",
    "penglihatan malam": "night_vision",
    penyerapan: "absorption",
    "perleb\xE5tens \xE5ndedrett": "breath_of_the_nautilus",
    "pernapasan air": "water_breathing",
    "pertanda buruk": "bad_omen",
    "pertanda buruk serbuan": "raid_omen",
    "pertanda ujian": "trial_omen",
    pikakaivuu: "haste",
    pikaparannus: "instant_health",
    pikavahinko: "instant_damage",
    pimeys: "darkness",
    pimeänäkö: "night_vision",
    plyndringstegn: "raid_omen",
    plyndringsvarsel: "raid_omen",
    "poder de canal": "conduit_power",
    "poder de conducto": "conduit_power",
    "poder del conducto": "conduit_power",
    pohlcení: "absorption",
    poison: "poison",
    pomalosť: "slowness",
    "pomal\xFD p\xE1d": "slow_falling",
    "pos\xEDlen\xED skoku": "jump_boost",
    "pos\xEDlen\xED zdrav\xED": "health_boost",
    "powolne opadanie": "slow_falling",
    powolność: "slowness",
    pośpiech: "haste",
    "presagio d'incursione": "raid_omen",
    "presagio de asalto": "raid_omen",
    "presagio de prueba": "trial_omen",
    "presagio di sfida": "trial_omen",
    pressa: "haste",
    "press\xE1gio de ataque": "raid_omen",
    "press\xE1gio de invas\xE3o": "raid_omen",
    prisa: "haste",
    "prisa minera": "haste",
    proefomen: "trial_omen",
    "prote\xE7\xE3o do mar": "conduit_power",
    "pr\xE9sage d'invasion": "raid_omen",
    "pr\xE9sage d'\xE9preuve": "trial_omen",
    "pr\xF3ba-\xF3men": "trial_omen",
    prøvelsesjærtegn: "trial_omen",
    prøvelsestegn: "trial_omen",
    punominen: "weaving",
    pärlbåtsandning: "breath_of_the_nautilus",
    pírko: "slow_falling",
    "queda lenta": "slow_falling",
    racun: "poison",
    "raid omen": "raid_omen",
    rapidez: "haste",
    rapidité: "speed",
    regenerace: "regeneration",
    regeneración: "regeneration",
    regeneracja: "regeneration",
    regenerasi: "regeneration",
    regenerasjon: "regeneration",
    regeneratie: "regeneration",
    regeneration: "regeneration",
    regeneração: "regeneration",
    regenerering: "regeneration",
    regenerácia: "regeneration",
    regeneráció: "regeneration",
    resistance: "resistance",
    resistencia: "resistance",
    "resistencia al fuego": "fire_resistance",
    resistens: "resistance",
    "resistente al fuego": "fire_resistance",
    resistenz: "resistance",
    resistenza: "resistance",
    "resistenza al fuoco": "fire_resistance",
    resistência: "resistance",
    "resist\xEAncia ao fogo": "fire_resistance",
    "respiraci\xF3n acu\xE1tica": "water_breathing",
    "respiraci\xF3n de nautilo": "breath_of_the_nautilus",
    "respiration aquatique": "water_breathing",
    "respiration du nautile": "breath_of_the_nautilus",
    "respira\xE7\xE3o aqu\xE1tica": "water_breathing",
    "respira\xE7\xE3o subaqu\xE1tica": "water_breathing",
    "respiro del nautilo": "breath_of_the_nautilus",
    rigenerazione: "regeneration",
    "rooftocht voorteken": "raid_omen",
    "rossz \xF3men": "bad_omen",
    rychlost: "speed",
    rynnäkköenne: "raid_omen",
    régénération: "regeneration",
    "r\xE9sist. au feu": "fire_resistance",
    résistance: "resistance",
    "r\xE9sistance au feu": "fire_resistance",
    "r\xFCzgar sald\u0131r\u0131s\u0131": "wind_charged",
    rýchlosť: "speed",
    saastunut: "infested",
    "salto ampliato": "jump_boost",
    "salud instant\xE1nea": "instant_health",
    "salud mejorada": "health_boost",
    "salute ampliata": "health_boost",
    "salute istantanea": "instant_health",
    "sanfter fall": "slow_falling",
    satiété: "saturation",
    saturación: "saturation",
    saturasi: "saturation",
    saturation: "saturation",
    saturação: "saturation",
    "sauts am\xE9lior\xE9s": "jump_boost",
    sazietà: "saturation",
    "sa\xFAde instant\xE2nea": "instant_health",
    "sa\u011Fl\u0131k artt\u0131r\u0131c\u0131": "health_boost",
    schwebekraft: "levitation",
    schwäche: "weakness",
    semangat: "haste",
    "ser\xFCven kehaneti": "trial_omen",
    sickernd: "oozing",
    sietokyky: "resistance",
    sietség: "haste",
    sila: "strength",
    siver: "oozing",
    siła: "strength",
    "sk\xFA\u0161obn\xE9 znamenie": "trial_omen",
    slabost: "weakness",
    slabosť: "weakness",
    "slecht voorteken": "bad_omen",
    slemmig: "oozing",
    slepota: "blindness",
    "slow falling": "slow_falling",
    slowness: "slowness",
    snelheid: "speed",
    "soin instantan\xE9": "instant_health",
    sokeutus: "blindness",
    sollecitudine: "haste",
    "sopro do n\xE1utilo": "breath_of_the_nautilus",
    sorvasztó: "wither",
    souffle: "wind_charged",
    "souffle du nautile": "breath_of_the_nautilus",
    speed: "speed",
    spinnande: "weaving",
    sprongkracht: "jump_boost",
    "sprungverst.": "jump_boost",
    strength: "strength",
    styrka: "strength",
    styrke: "strength",
    stärke: "strength",
    "suda nefes alma": "water_breathing",
    sult: "hunger",
    superhop: "jump_boost",
    supersalto:"jump_boost",
    supuración: "oozing",
    svaghed: "weakness",
    svaghet: "weakness",
    svakhet: "weakness",
    sytost: "saturation",
    szybkość: "speed",
    széllökés: "wind_charged",
    sättigung: "saturation",
    síla: "strength",
    sötétség: "darkness",
    sızma: "oozing",
    słabość: "weakness",
    tecelagem: "weaving",
    tehohyppy: "jump_boost",
    tejedura: "weaving",
    tejer: "weaving",
    telítettség: "saturation",
    temnota: "darkness",
    tenaga: "strength",
    tessitura: "weaving",
    tippuhidastus: "slow_falling",
    tissage: "weaving",
    tkanie: "weaving",
    tkaní: "weaving",
    traagheid: "slowness",
    trasudazione: "oozing",
    treghet: "slowness",
    "trial omen": "trial_omen",
    trucizna: "poison",
    trötthet: "mining_fatigue",
    tulensieto: "fire_resistance",
    tuulipanostettu: "wind_charged",
    tytende: "oozing",
    tűzállóság: "fire_resistance",
    "ukr\xFDvaj\xEDc\xED rybenku": "infested",
    unsichtbarkeit: "invisibility",
    unterwasseratmung: "water_breathing",
    usynlighed: "invisibility",
    usynlighet: "invisibility",
    utvinningsutmattelse: "mining_fatigue",
    vakság: "blindness",
    valuminen: "oozing",
    vannkrefter: "conduit_power",
    vannpusting: "water_breathing",
    vattenandning: "water_breathing",
    velocidad: "speed",
    velocidade: "speed",
    velocità: "speed",
    veneno: "poison",
    ventania: "wind_charged",
    vergif: "poison",
    vergiftung: "poison",
    verzadiging: "saturation",
    vevende: "weaving",
    "vida extra": "health_boost",
    "vida instant\xE2nea": "instant_health",
    vindladdad: "wind_charged",
    vindladet: "wind_charged",
    vindladning: "wind_charged",
    viscosité: "oozing",
    "vision nocturne": "night_vision",
    "visione notturna": "night_vision",
    "visi\xF3n nocturna": "night_vision",
    "vis\xE3o noturna": "night_vision",
    vuurvast: "fire_resistance",
    vytékající: "oozing",
    vævning: "weaving",
    vízlégzés: "water_breathing",
    "v\u011Btrem nabit\xFD": "wind_charged",
    "water breathing": "water_breathing",
    wateradem: "water_breathing",
    weakness: "weakness",
    weaving: "weaving",
    weben: "weaving",
    weerstand: "resistance",
    weven: "weaving",
    "widzenie w ciemno\u015Bci": "night_vision",
    "wind charged": "wind_charged",
    windgeladen: "wind_charged",
    wither: "wither",
    wyciekanie: "oozing",
    "wzmocnienie skoku": "jump_boost",
    "wzmocnienie zdrowia": "health_boost",
    "yava\u015F d\xFC\u015Fme": "slow_falling",
    yavaşlık: "slowness",
    yenilenme: "regeneration",
    yökötys: "nausea",
    "z \u0142adunkiem wiatru": "wind_charged",
    zainfekowane: "infested",
    zamorené: "infested",
    zayıflık: "weakness",
    zehir: "poison",
    zhon: "haste",
    "zku\u0161ebn\xED znamen\xED": "trial_omen",
    "zlep\u0161enie zdravia": "health_boost",
    "zl\xE9 znamenie": "bad_omen",
    "zm\u0119czenie przy kopaniu": "mining_fatigue",
    "znamenie n\xE1jazdu": "raid_omen",
    "znamen\xED n\xE1jezdu": "raid_omen",
    zpomalení: "slowness",
    zrychlení: "haste",
    zwakheid: "weakness",
    "zwiastun najazdu": "raid_omen",
    "z\u0131plama artt\u0131rma": "jump_boost",
    "z\u0142y omen": "bad_omen",
    återhämtning: "regeneration",
    çabukluk: "haste",
    éhség: "hunger",
    éjjellátás: "night_vision",
    életerősítés: "health_boost",
    émelygés: "nausea",
    "\xE9nergie de conduit": "conduit_power",
    épuisement: "mining_fatigue",
    "\xF8yeblikkelig helse": "instant_health",
    "\xF8yeblikkelig skade": "instant_damage",
    "\xFAnava p\u0159i t\u011B\u017Eb\u011B": "mining_fatigue",
    "\xFAnava z \u0165a\u017Eby": "mining_fatigue",
    übelkeit: "nausea",
    "\xFCberfall-omen": "raid_omen",
    ślepota: "blindness",
    "\u0161patn\xE9 znamen\xED": "bad_omen",
    "\u03AC\u03BC\u03B5\u03C3\u03B7 \u03B6\u03B7\u03BC\u03B9\u03AC": "instant_damage",
    "\u03AC\u03BC\u03B5\u03C3\u03B7 \u03C5\u03B3\u03B5\u03AF\u03B1": "instant_health",
    "\u03AE\u03C1\u03C9\u03B1\u03C2 \u03C4\u03BF\u03C5 \u03C7\u03C9\u03C1\u03B9\u03BF\u03CD": "village_hero",
    αδυναμία: "weakness",
    αιώρηση: "levitation",
    "\u03B1\u03BD\u03AC\u03C3\u03B1 \u03C4\u03BF\u03C5 \u03BD\u03B1\u03C5\u03C4\u03AF\u03BB\u03BF\u03C5":
        "breath_of_the_nautilus",
    αναβλύζει: "oozing",
    αναζωογόνηση: "regeneration",
    "\u03B1\u03BD\u03B1\u03C0\u03BD\u03BF\u03AE \u03C3\u03C4\u03BF \u03BD\u03B5\u03C1\u03CC": "water_breathing",
    "\u03B1\u03BD\u03B8/\u03BA\u03CC\u03C4\u03B7\u03C4\u03B1 \u03C3\u03C4\u03B7 \u03C6\u03C9\u03C4\u03B9\u03AC": "fire_resistance",
    ανθεκτικότητα: "resistance",
    απορρόφηση: "absorption",
    αφάνεια: "invisibility",
    βιασύνη: "haste",
    βραδύτητα: "slowness",
    δηλητήριο: "poison",
    "\u03B4\u03BF\u03BA\u03B9\u03BC\u03B1\u03C3\u03AF\u03B1 \u03BF\u03B9\u03C9\u03BD\u03CC\u03C2": "trial_omen",
    δύναμη: "strength",
    "\u03B4\u03CD\u03BD\u03B1\u03BC\u03B7 \u03B1\u03B3\u03C9\u03B3\u03BF\u03CD": "conduit_power",
    "\u03B5\u03BD\u03AF\u03C3\u03C7\u03C5\u03C3\u03B7 \u03AC\u03BB\u03BC\u03B1\u03C4\u03BF\u03C2": "jump_boost",
    "\u03B5\u03BD\u03AF\u03C3\u03C7\u03C5\u03C3\u03B7 \u03C5\u03B3\u03B5\u03AF\u03B1\u03C2": "health_boost",
    "\u03B5\u03C0\u03AF\u03B8\
\u03B5\u03C3\u03B7 \u03B1\u03BD\u03AD\u03BC\u03BF\u03C5": "wind_charged",
    "\u03B5\u03C0\u03B9\u03B2\u03C1\u03AC\u03B4\u03C5\u03BD\u03C3\u03B7 \u03C0\u03C4\u03CE\u03C3\u03B7\u03C2": "slow_falling",
    "\u03BA\u03B1\u03BA\u03CC\u03C2 \u03BF\u03B9\u03C9\u03BD\u03CC\u03C2": "bad_omen",
    κορεσμός: "saturation",
    "\u03BA\u03CC\u03C0\u03C9\u03C3\u03B7 \u03B5\u03BE\u03CC\u03C1\u03C5\u03BE\u03B7\u03C2": "mining_fatigue",
    μαρασμός: "wither",
    "\u03BC\u03B5 \u03AD\u03BD\u03C4\u03BF\u03BC\u03BF \xAB\u03C8\u03B1\u03C1\u03AC\u03BA\u03B9\xBB": "infested",
    ναυτία: "nausea",
    "\u03BD\u03C5\u03C7\u03C4\u03B5\u03C1\u03B9\u03BD\u03AE \u03CC\u03C1\u03B1\u03C3\u03B7": "night_vision",
    "\u03BF\u03B9\u03C9\u03BD\u03CC\u03C2 \u03B5\
\u03C0\u03B9\u03B4\u03C1\u03BF\u03BC\u03AE\u03C2": "raid_omen",
    πείνα: "hunger",
    σκοτάδι: "darkness",
    ταχύτητα: "speed",
    τύφλωση: "blindness",
    ύφανση: "weaving",
    "\u0431\u0430\u0432\u043D\u043E \u043F\u0430\u0434\u0430\u043D\u0435": "slow_falling",
    бързина: "haste",
    "\u0432\u0435\u0442\u0440\u043E\u0432\u043E\u0439 \u0437\u0430\u0440\u044F\u0434": "wind_charged",
    "\u0432\u0438\u0445\u0440\u043E\u0432\u0430 \u043A\u0443\u043B\u044F \u0433\u043E\u0442\u043E\u0432\u0430": "wind_charged",
    вогнестійкість: "fire_resistance",
    "\u0432\u0442\
\u043E\u043C\u0430 \u0432\u0456\u0434 \u0432\u0438\u0434\u043E\u0431\u0443\u0432\u0430\u043D\u043D\u044F": "mining_fatigue",
    відновлення: "regeneration",
    гадене: "nausea",
    "\u0433\u0435\u0440\u043E\u0439 \u0434\u0435\u0440\u0435\u0432\u043D\u0438": "village_hero",
    "\u0433\u0435\u0440\u043E\u0439 \u043D\u0430 \u0441\u0435\u043B\u043E\u0442\u043E": "village_hero",
    глад: "hunger",
    голод: "hunger",
    "\u0434\u0438\u0445\u0430\u043D\u043D\u044F \u043D\u0430\u0443\u0442\u0438\u043B\u0443\u0441\u0430": "breath_of_the_nautilus",
    "\u0434\u0438\u0445\u0430\u043D\u043D\u044F \u043F\u0456\u0434 \u0432\u043E\u0434\u043E\u044E": "water_breathing",
    "\u0434\u0443\u0440\u043D\u043E\u0435 \u0437\u043D\u0430\u043C\u0435\u043D\u0438\u0435": "bad_omen",
    "\u0434\u044A\u0445\
\u044A\u0442 \u043E\u0442 \u043D\u0430\u0443\u0442\u0438\u043B\u0443\u0441": "breath_of_the_nautilus",
    "\u0434\u044B\u0445\u0430\u043D\u0438\u0435 \u043D\u0430\u0443\u0442\u0438\u043B\u0443\u0441\u0430": "breath_of_the_nautilus",
    "\u0434\u044B\u0445\u0430\u043D\u0438\u0435 \u043F\u043E\u0434 \u0432\u043E\u0434\u043E\u0439": "water_breathing",
    "\u0436\u0438\u0432\u043B\u0435\u043D\u043D\u044F \u0432\u0456\u0434 \u043F\u0440\u043E\u0432\u0456\u0434\u043D\u0438\u043A\u0430": "conduit_power",
    забавяне: "slowness",
    "\u0437\u0430\u043C\u0435\u0434\u043B\u0435\u043D\u043D\u043E\u0435 \u043F\u0430\u0434\u0435\u043D\u0438\u0435": "slow_falling",
    заражение: "infested",
    заражено: "infested",
    заразено: "infested",
    заслизлення: "oozing",
    згублення: "wither",
    "\u0437\u043D\u0430\u043C\u0435\u043D\u0438\u0435 \u0438\u0441\u043F\u044B\u0442\u0430\u043D\u0438\u044F": "trial_omen",
    "\u0437\u043D\u0430\u043C\u0435\u043D\u0438\u0435 \u043D\u0430\u043B\u0435\u0442\u0430": "raid_omen",
    "\u0437\u043D\u0430\u043C\u0435\u043D\u043D\
\u044F \u0432\u0438\u043F\u0440\u043E\u0431\u0443\u0432\u0430\u043D\u043D\u044F": "trial_omen",
    иссушение: "wither",
    левитация: "levitation",
    левітація: "levitation",
    "\u043B\u043E\u0448\u0430 \u043F\u043E\u043B\u0438\u0447\u0431\u0430": "bad_omen",
    "\u043C\u0433\u043D\u043E\u0432\u0435\u043D\u043D\u043E\u0435 \u043E\u0437\u0434\u043E\u0440\u043E\u0432\u043B\u0435\u043D\u0438\u0435": "instant_health",
    медлительность: "slowness",
    "\u043C\u0438\u043D\u044C\u043E\u0440\u0441\
\u043A\u0430 \u0443\u043C\u043E\u0440\u0430": "mining_fatigue",
    "\u043C\u0438\u0442\u0442\u0454\u0432\u0435 \u043E\u0434\u0443\u0436\u0430\u043D\u043D\u044F": "instant_health",
    "\u043C\u0438\u0442\u0442\u0454\u0432\u0435 \u043F\u043E\u0448\u043A\u043E\u0434\u0436\u0435\u043D\u043D\u044F": "instant_damage",
    "\u043C\u043E\u043C\u0435\u043D\u0442\u0430\u043B\u043D\u043E \u043B\u0435\u043A\u0443\u0432\u0430\u043D\u0435": "instant_health",
    "\u043C\u043E\u043C\u0435\u043D\u0442\u0430\u043B\u043D\u043E \u043D\u0430\u0440\u0430\u043D\u044F\u0432\u0430\u043D\u0435": "instant_damage",
    "\u043C\u043E\u043C\u0435\u043D\u0442\u0430\u043B\u044C\u043D\u044B\u0439 \u0443\u0440\u043E\u043D": "instant_damage",
    мрак: "darkness",
    наситеност: "saturation",
    насиченість: "saturation",
    насыщенность: "saturation",
    невидимост: "invisibility",
    невидимость: "invisibility",
    невидимість: "invisibility",
    "\u043D\u043E\u0447\u043D\u043E\u0435 \u0437\u0440\u0435\u043D\u0438\u0435": "night_vision",
    "\u043D\u043E\u0449\u043D\u043E \u0432\u0438\u0436\u0434\u0430\u043D\u0435": "night_vision",
    нудота: "nausea",
    "\u043D\u0456\u0447\u043D\u0435 \u0431\u0430\u0447\u0435\u043D\u043D\u044F": "night_vision",
    "\u043E\u0433\u043D\u0435\u043D\u0430 \u0443\u0441\u0442\u043E\u0439\u0447\u0438\u0432\u043E\u0441\u0442": "fire_resistance",
    огнестойкость: "fire_resistance",
    "\u043E\u0437\u043D\u0430\u043A\
\u0430 \u0440\u0435\u0439\u0434\u0443": "raid_omen",
    опір: "resistance",
    отравление: "poison",
    отрова: "poison",
    отрута: "poison",
    "\u043F\u043E\u0432\u0438\u0448\u0430\u0432\u0430\u043D\u0435 \u043D\u0430 \u0437\u0434\u0440\u0430\u0432\
\u0435\u0442\u043E": "health_boost",
    "\u043F\u043E\u0432\u0456\u043B\u044C\u043D\u0435 \u043F\u0430\u0434\u0456\u043D\u043D\u044F": "slow_falling",
    "\u043F\u043E\u0433\u0430\u043D\u0435 \u0437\u043D\u0430\u043C\u0435\u043D\u043D\u044F": "bad_omen",
    поглинання: "absorption",
    поглощение: "absorption",
    поглъщане: "absorption",
    "\u043F\u043E\u0434\u0432\u043E\u0434\u043D\u043E \u0434\u0438\u0448\u0430\u043D\u0435": "water_breathing",
    "\u043F\
\u043E\u043A\u0440\u0430\u0449\u0435\u043D\u043D\u044F \u0437\u0434\u043E\u0440\u043E\u0432\u2019\u044F": "health_boost",
    "\u043F\u043E\u043B\u0438\u0447\u0431\u0430 \u0437\u0430 \u0438\u0437\u043F\u0438\u0442\u0430\u043D\u0438\u0435": "trial_omen",
    "\u043F\u043E\u043B\u0438\u0447\u0431\u0430 \u0437\u0430 \u043D\u0430\u0448\u0435\u0441\u0442\u0432\u0438\u0435": "raid_omen",
    поспіх: "haste",
    проворство: "haste",
    регенерация: "regeneration",
    "\u0441 \u043F\u044A\u043B\u0435\u043D \u0432\u044F\u0442\u044A\u0440\u0435\u043D \u0437\u0430\u0440\u044F\u0434": "wind_charged",
    сила: "strength",
    "\u0441\u0438\u043B\u0430 \u043E\u0442 \u043F\u0440\u043E\u0432\u043E\u0434\u043D\u0438\u043A": "conduit_power",
    "\u0441\u0438\u043B\u0430 \u043F\u0440\u043E\u0432\u043E\u0434\u043D\u0438\u043A\u0430": "conduit_power",
    "\u0441\u0438\u043B\u0435\u043D \u0441\u043A\u043E\u043A": "jump_boost",
    скорост: "speed",
    скорость: "speed",
    слабкість: "weakness",
    слабост: "weakness",
    слабость: "weakness",
    слепота: "blindness",
    слизь: "oozing",
    слузливост: "oozing",
    сліпота: "blindness",
    стойкость: "resistance",
    стрибучість: "jump_boost",
    суперпрыжок: "jump_boost",
    "\u0441\u0456\u043B\u044C\u0441\u044C\u043A\u0438\u0439 \u0433\u0435\u0440\u043E\u0439": "village_hero",
    темрява: "darkness",
    ткацтво: "weaving",
    ткачество: "weaving",
    тошнота: "nausea",
    тъкачество: "weaving",
    тьма: "darkness",
    "\u0443\u0432\u0435\u043B\u0438\u0447\u0435\u043D\u0438\u0435 \u0437\u0434\u043E\u0440\u043E\u0432\u044C\u044F": "health_boost",
    уповільнення: "slowness",
    устойчивост: "resistance",
    чезнене: "wither",
    "\u0448\u0430\u0445\u0442\u0435\u0440\u0441\u043A\u0430\u044F \u0443\u0441\u0442\u0430\u043B\u043E\u0441\u0442\u044C": "mining_fatigue",
    швидкість: "speed",
    ウィザー: "wither",
    オウムガイの息吹: "breath_of_the_nautilus",
    コンジットパワー: "conduit_power",
    不吉な予感: "bad_omen",
    不祥之兆: "bad_omen",
    中毒: "poison",
    伤害吸收: "absorption",
    体力増強: "health_boost",
    再生: "regeneration",
    再生能力: "regeneration",
    凋零: "wither",
    凶兆: "bad_omen",
    劇毒: "poison",
    力量: "strength",
    即時ダメージ: "instant_damage",
    即時回復: "instant_health",
    反胃: "nausea",
    吐き気: "nausea",
    吸收: "absorption",
    噁心: "nausea",
    增速: "haste",
    夜視: "night_vision",
    夜视: "night_vision",
    失明: "blindness",
    寄生: "infested",
    巣張り: "weaving",
    已蓄风: "wind_charged",
    开采疲劳: "mining_fatigue",
    弱体化: "weakness",
    急速: "haste",
    戰鬥預兆: "raid_omen",
    抗性: "resistance",
    抗火: "fire_resistance",
    採掘速度上昇:
        "haste",
    採掘速度低下: "mining_fatigue",
    攻撃力上昇: "strength",
    暗視: "night_vision",
    村の英雄: "village_hero",
    村庄英雄: "village_hero",
    村莊英雄: "village_hero",
    毒: "poison",
    水下呼吸: "water_breathing",
    水中呼吸: "water_breathing",
    水靈之力: "conduit_power",
    浮遊: "levitation",
    渗浆: "oozing",
    満腹度回復: "saturation",
    滲出: "oozing",
    滲液: "oozing",
    漂浮: "levitation",
    潮涌能量: "conduit_power",
    火炎耐性: "fire_resistance",
    生命值提升: "health_boost",
    生命恢复: "regeneration",
    生命提升: "health_boost",
    盘丝: "weaving",
    瞬间伤害: "instant_damage",
    瞬间治疗: "instant_health",
    移動速度上昇: "speed",
    移動速度低下: "slowness",
    空腹: "hunger",
    立即傷害: "instant_damage",
    立即治療: "instant_health",
    編織: "weaving",
    緩慢: "slowness",
    緩降: "slow_falling",
    缓慢: "slowness",
    缓降: "slow_falling",
    编织: "weaving",
    耐性: "resistance",
    落下速度低下: "slow_falling",
    蓄風: "wind_charged",
    蓄风: "wind_charged",
    蘊風: "wind_charged",
    虚弱: "weakness",
    虛弱: "weakness",
    虫蚀: "infested",
    虫食い: "infested",
    蛀蝕: "infested",
    衝撃吸収: "absorption",
    袭击之兆: "raid_omen",
    襲撃の予感: "raid_omen",
    試煉預兆: "trial_omen",
    試練の予感: "trial_omen",
    试炼之兆: "trial_omen",
    跳跃增强: "jump_boost",
    跳躍力上昇: "jump_boost",
    跳躍增強: "jump_boost",
    透明化: "invisibility",
    速度: "speed",
    開採倦怠: "mining_fatigue",
    隐身: "invisibility",
    隱形: "invisibility",
    飘浮: "levitation",
    飢餓: "hunger",
    飽和: "saturation",
    饥饿: "hunger",
    饱和: "saturation",
    鸚鵡螺之息: "breath_of_the_nautilus",
    鹦鹉螺之息: "breath_of_the_nautilus",
    黑暗: "darkness",
    "\uACF5\uC911 \uBD80\uC591": "levitation",
    나약함: "weakness",
    "\uB290\uB9B0 \uB099\uD558": "slow_falling",
    독: "poison",
    돌풍: "wind_charged",
    "\uB9C8\uC744\uC758 \uC601\uC6C5": "village_hero",
    멀미: "nausea",
    방적: "weaving",
    "\uBC8C\uB808 \uBA39\uC74C": "infested",
    "\uC0DD\uBA85\uB825 \uAC15\uD654": "health_boost",
    성급함: "haste",
    속도: "speed",
    "\uC18D\uB3C4 \uAC10\uC18C": "slowness",
    "\uC218\uC911 \uD638\uD761": "water_breathing",
    "\uC2B5\uACA9 \uC9D5\uC870": "raid_omen",
    시듦: "wither",
    "\uC2DC\uB828 \uC9D5\uC870": "trial_omen",
    실명: "blindness",
    "\uC575\uBB34\uC870\uAC1C\uC758 \uC228\uACB0": "breath_of_the_nautilus",
    "\uC57C\uAC04 \uD22C\uC2DC": "night_vision",
    어둠: "darkness",
    재생: "regeneration",
    저항: "resistance",
    "\uC804\uB2EC\uCCB4\uC758 \uD798": "conduit_power",
    점액화: "oozing",
    "\uC810\uD504 \uAC15\uD654": "jump_boost",
    "\uC989\uC2DC \uCE58\uC720": "instant_health",
    "\uC989\uC2DC \uD53C\uD574": "instant_damage",
    "\uCC44\uAD74 \uD53C\uB85C": "mining_fatigue",
    투명: "invisibility",
    포화: "saturation",
    허기: "hunger",
    "\uD654\uC5FC \uC800\uD56D": "fire_resistance",
    흉조: "bad_omen",
    흡수: "absorption",
    힘: "strength",
};
var Hn = "minecraft:",
    ug = /[a-z]/,
    Pc = /\s+\d+$/,
    fg = ["freezing"],
    Oc = new Set([...Object.values(Ln), ...fg]),
    mg = /^(?:effect|potion)\.([a-z_]+)$/;
function Mc(e) {
    let t = mg.exec(e)?.[1];
    return t !== void 0 && Oc.has(t) ? t : void 0;
}
var lg = Rc.map((e) => e.toLowerCase()).sort((e, t) => t.length - e.length);
function Cc(e) {
    if (Pc.test(e)) return e.replace(Pc, "");
    for (let t of lg) {
        if (!e.endsWith(t) || e.length === t.length) continue;
        let n = e.charAt(e.length - t.length - 1);
        if (n === " " || !ug.test(n)) return e.slice(0, e.length - t.length).trimEnd();
    }
    return e;
}
function Kn(e) {
    let t = e.trim().toLowerCase();
    if (t.startsWith(Hn)) return t;
    let n = Ln[t] ?? Ln[Cc(t)] ?? (Oc.has(t) ? t : void 0) ?? Mc(t) ?? Mc(Cc(t));
    return n === void 0 ? void 0 : Hn + n;
}
function Io(e) {
    return e.startsWith(Hn) ? e : Hn + e;
}
import { system as Co } from "@minecraft/server";
import { system as Qc } from "@minecraft/server";
import { system as pg, world as gg } from "@minecraft/server";
var hg = 0.01,
    Fn = new Map();
function _g(e, t) {
    try {
        return e.clearVelocity(), !0;
    } catch (n) {
        try {
            return e.applyKnockback({ x: 0, z: 0 }, 0), !0;
        } catch (r) {
            return !1;
        }
    }
}
function bg(e, t) {
    if (!(Math.hypot(t.x, t.y, t.z) < hg))
        try {
            e.applyKnockback({ x: t.x, z: t.z }, t.y);
        } catch (n) {}
}
function Dc(e, t) {
    let n = Fn.get(e.id);
    !n || !e.isValid || (Fn.delete(e.id), _g(e, t) && n.velocity && bg(e, n.velocity));
}
function Nt(e, t) {
    Fn.set(e.id, { entity: e, velocity: t }), pg.run(() => Dc(e, "next tick"));
}
function Nc() {
    gg.afterEvents.entityHurt.subscribe((e) => {
        Fn.has(e.hurtEntity.id) && Dc(e.hurtEntity, "after hurt");
    });
}
var zn = ["resistance", "speed", "slowness"],
    Ke = "health_boost";
var Fe = "absorption";
var $o = "xvoid:absorb_at",
    Ao = {
        attack: {
            effects: { resistance: 0, speed: 0, slowness: void 0 },
            swim: 1,
            melee: 1.3,
            positive: 2.25,
            knockback: 1.5,
            jumpCap: void 0,
            absorption: void 0,
            adaptRate: 0.5,
            cooldown: 1,
            regenPause: 100,
            spinHeal: { base: 0.25, perLevel: 0.025, max: 0.6, complete: 0.5 },
            regen: [
                { minLevel: 20, amount: 1, every: 20 },
                { minLevel: 10, amount: 1, every: 40 },
                { minLevel: 5, amount: 1, every: 80 },
            ],
        },
        balance: {
            effects: {
                resistance: 1,
                speed: void 0,
                slowness: void 0,
            },
            swim: 1,
            melee: 1,
            positive: 1.75,
            knockback: 1,
            jumpCap: void 0,
            absorption: void 0,
            adaptRate: 1,
            cooldown: 1.25,
            regenPause: 60,
            spinHeal: { base: 0.4, perLevel: 0.04, max: 0.8, complete: 1 },
            regen: [
                { minLevel: 20, amount: 1, every: 20 },
                { minLevel: 10, amount: 1, every: 40 },
                { minLevel: 5, amount: 1, every: 60 },
                { minLevel: 1, amount: 1, every: 80 },
            ],
        },
        defense: {
            effects: { resistance: 3, speed: void 0, slowness: 0 },
            swim: 0.6,
            melee: 0.7,
            positive: 1.75,
            knockback: 0,
            jumpCap: void 0,
            absorption: 3,
            adaptRate: 0.75,
            cooldown: 1,
            regenPause: 60,
            spinHeal: { base: 0.5, perLevel: 0.05, max: 1, complete: 1 },
            regen: [
                { minLevel: 20, amount: 2, every: 20 },
                { minLevel: 10, amount: 1, every: 20 },
                { minLevel: 5, amount: 1, every: 40 },
                { minLevel: 1, amount: 1, every: 80 },
            ],
        },
    },
    Lc = [
        ...new Set(
            Object.values(Ao)
                .map((e) => e.swim)
                .filter((e) => e < 1)
        ),
    ],
    Bn = 60,
    yg = 20,
    xg = 0.001,
    Hc = 0.6,
    Kc = 0.4,
    Fc = 0.36,
    zc = 20;
function Bc(e, t, n) {
    let r = t.x - e.x,
        o = t.z - e.z,
        i = Math.hypot(r, o);
    if (!(i < 0.001)) return { x: (r / i) * n, z: (o / i) * n };
}
function Vc(e, t) {
    let n = Math.hypot(e.x, e.z);
    if (!(n <= t)) return { x: (e.x / n) * t, z: (e.z / n) * t };
}
function Lt(e) {
    return e.startsWith("minecraft:") ? e.slice(10) : e;
}
function vo(e) {
    return e.duration <= Bn;
}
var Eg = { slowness: [1, 2] };
function Wc(e, t) {
    return Math.ceil(e * t);
}
function Uc(e) {
    return !!e && e.amplifier === 4 && e.duration > 1e6;
}
function Gc(e, t) {
    return t === void 0 ? (Uc(e) ? "remove" : "keep") : e ? (e.amplifier < t ? "add" : "keep") : "add";
}
function To(e) {
    return !!e && e.amplifier === 3 && e.duration > 1e6;
}
function kg(e, t) {
    return e === void 0 || t < e || t - e >= 600;
}
function jc(e, t, n, r) {
    return t === void 0
        ? To(e)
            ? "remove"
            : "keep"
        : kg(n, r)
          ? e
              ? To(e)
                  ? "refill"
                  : e.amplifier < t
                    ? "add"
                    : "keep"
              : "add"
          : "keep";
}
function qc(e, t, n) {
    if (Lt(t) === Ke) return Uc(n);
    if (Lt(t) === Fe) return To(n);
    let r = Lt(t);
    return !zn.includes(r) || !vo(n) ? !1 : e.effects[r] === n.amplifier || (Eg[r]?.includes(n.amplifier) ?? !1);
}
function Yc(e, t, n) {
    return t === void 0
        ? e && n && vo(e)
            ? "remove"
            : "keep"
        : e
          ? e.amplifier === t
              ? e.duration <= Bn - yg
                  ? "add"
                  : "keep"
              : n && vo(e)
                ? "replace"
                : t > e.amplifier
                  ? "add"
                  : "keep"
          : "add";
}
function Xc(e, t, n) {
    return n ? e.complete : Math.min(e.max, e.base + e.perLevel * t);
}
function Jc(e, t) {
    return e.find((n) => t >= n.minLevel);
}
function Vn(e, t) {
    return e * t;
}
function Wn(e, t) {
    return Math.abs(e - t) > xg;
}
var ze = new Set(),
    Ro = new Map(),
    nt = new Map();
function V(e) {
    return Ao[E(e)];
}
function ne(e, t) {
    return Wc(t, V(e).cooldown);
}
function Po(e, t) {
    return ze.has(`${e}:${Lt(t)}`);
}
function rt(e, t, n) {
    return qc(V(e), t, n);
}
function Zc(e, t, n) {
    return Xc(V(e).spinHeal, t, n);
}
function ed(e, t) {
    return Jc(V(e).regen, t);
}
function Mo(e, t) {
    let n = a(() => e.getEffect(t));
    return n ? { amplifier: n.amplifier, duration: n.duration } : void 0;
}
function Ig(e, t, n) {
    let r = `${e.id}:${t}`;
    ze.add(r);
    try {
        a(() => e.addEffect(t, Bn, { amplifier: n, showParticles: !1 }));
    } finally {
        ze.delete(r);
    }
    Ro.set(r, n);
}
function td(e, t, n) {
    let r = Mo(e, t),
        o = `${e.id}:${t}`,
        i = Yc(r, n, r !== void 0 && Ro.get(o) === r.amplifier);
    i !== "keep" &&
        ((i === "remove" || i === "replace") && (a(() => e.removeEffect(t)), Ro.delete(o)),
        n !== void 0 && (i === "add" || i === "replace") && Ig(e, t, n),
        !(i === "add" && r?.amplifier === n) && void 0);
}
function nd(e, t) {
    let n = Mo(e, Ke),
        r = Gc(n, t);
    if (r !== "keep") {
        if (
            r ===
            "remove"
        )
            a(() => e.removeEffect(Ke));
        else {
            let o = `${e.id}:${Ke}`;
            ze.add(o);
            try {
                a(() => e.addEffect(Ke, 2e7, { amplifier: t, showParticles: !1 }));
            } finally {
                ze.delete(o);
            }
        }
    }
}
function rd(e, t, n) {
    let r = Mo(e, Fe),
        o = a(() => e.getDynamicProperty($o)),
        i = typeof o == "number" ? o : void 0,
        s = jc(r, t, i, n);
    if (s !== "keep") {
        if (s === "remove") a(() => e.removeEffect(Fe));
        else {
            let c = `${e.id}:${Fe}`;
            ze.add(c);
            try {
                a(() => e.addEffect(Fe, 2e7, { amplifier: t, showParticles: !1 }));
            } finally {
                ze.delete(c);
            }
            a(() => e.setDynamicProperty($o, n));
        }
    }
}
function od(e, t) {
    let n = a(() => e.getComponent("minecraft:underwater_movement"));
    if (!n) return;
    let r = n.currentValue;
    if (t === 1) {
        if (!Lc.some((i) => !Wn(r, Vn(n.defaultValue, i)))) return;
        a(() => n.resetToDefaultValue());
        return;
    }
    let o = Vn(n.defaultValue, t);
    Wn(r, o) && (a(() => n.setCurrentValue(o)), void 0);
}
function vg(e) {
    let t = a(() => e.getComponent("minecraft:movement"));
    !t || Wn(t.currentValue, Vn(t.defaultValue, Hc)) || (a(() => t.resetToDefaultValue()), void 0);
}
function id(e) {
    return Math.hypot(e.x, e.z).toFixed(3);
}
function Tg(e, t, n) {
    if (t === void 0) {
        nt.delete(e.id);
        return;
    }
    let r = !e.isInWater && !e.isGliding && !e.isFlying && !a(() => e.getComponent("minecraft:riding"));
    if (e.isOnGround || !r) {
        let d = nt.get(e.id);
        if ((d && (nt.delete(e.id), void 0), e.isOnGround && n % zc === 0)) {
            let u = e.getVelocity();
            Math.hypot(u.x, u.z) > 0.01 && void 0;
        }
        return;
    }
    let o = e.getVelocity(),
        i = Math.hypot(o.x, o.z),
        s = nt.get(e.id);
    if (s) {
        s.ticks++, (s.peak = Math.max(s.peak, i));
        return;
    }
    let c = Vc(o, t);
    nt.set(e.id, { takeOff: i, cut: c !== void 0, peak: 0, ticks: 1 }), c && a(() => e.applyKnockback(c, o.y));
}
function ad(e, t) {
    let n = V(e);
    vg(e), od(e, n.swim), Tg(e, n.jumpCap, t);
    for (let r of zn) td(e, r, n.effects[r]);
    nd(e, void 0), rd(e, n.absorption, t);
}
function sd(e) {
    od(e, 1);
    for (let t of zn) td(e, t, void 0);
    nd(e, void 0), rd(e, void 0, Qc.currentTick), nt.delete(e.id);
}
function cd(e, t, n) {
    if (!t) return;
    let r = V(e).knockback;
    if (r === 1) return;
    if (r <= 0) {
        Nt(e);
        return;
    }
    if (!n) return;
    let o = Bc(n, e.location, Kc * r);
    o &&
        Qc.run(() => {
            if (!e.isValid) return;
            let i = id(e.getVelocity());
            a(() => e.applyKnockback(o, Fc));
        });
}
var Oo = new Map(),
    Un = new Map();
function dd(e) {
    let t = new Map();
    for (let n of a(() => e.getEffects()) ?? []) {
        let r = a(() => ({ typeId: n.typeId, duration: n.duration, amplifier: n.amplifier }));
        r && xe(r.typeId) && t.set(r.typeId, { duration: r.duration, amplifier: r.amplifier });
    }
    return t;
}
function ud(e, t) {
    Oo.set(e.id, { tick: t, effects: dd(e) });
}
function Gn(e, t) {
    return Un.get(e)?.has(t) ?? !1;
}
function $g(e, t, n) {
    let r = Un.get(e.id);
    r || ((r = new Set()), Un.set(e.id, r)),
        r.add(t),
        a(() => e.removeEffect(t)),
        a(() => e.addEffect(t, n.duration, { amplifier: n.amplifier })),
        Co.run(() => r.delete(t));
}
function fd(e) {
    let t = Oo.get(e.id);
    t &&
        Co.run(() => {
            if (!e.isValid) return;
            let n = Co.currentTick;
            for (let [r, o] of dd(e)) {
                if (rt(e, r, o)) continue;
                let i = t.effects.get(r);
                if (!i) {
                    a(() => e.removeEffect(r));
                    continue;
                }
                if (i.duration < 0) continue;
                let s = Math.max(1, i.duration - (n - t.tick));
                (o.duration <= s + 2 && o.amplifier <= i.amplifier) ||
                    ($g(e, r, { duration: s, amplifier: i.amplifier }), void 0);
            }
        });
}
function Do(e) {
    Oo.delete(e), Un.delete(e);
}
var Ag = ["none", "override"];
function md(e, t, n) {
    return Ag.includes(e) && !t && n < 40;
}
function ld(e) {
    let t;
    for (let n of e)
        n.typeId.startsWith("minecraft:") ||
            n.inanimate ||
            n.distance > 8 ||
            ((!t || n.distance < t.distance) && (t = n));
    return t;
}
function pd(e, t, n) {
    let r = !!a(() => e.damagingEntity) || !!a(() => e.damagingProjectile);
    if (!md(String(e.cause), r, n)) return;
    let o = t.location,
        s = (a(() => t.dimension.getEntities({ location: o, maxDistance: 8 })) ?? [])
            .filter((d) => a(() => d.id) !== t.id)
            .map((d) => ({
                entity: d,
                typeId: a(() => d.typeId) ?? "minecraft:unknown",
                distance: Math.hypot(d.location.x - o.x, d.location.y - o.y, d.location.z - o.z),
                inanimate: !!a(() => d.getComponent("minecraft:type_family")?.hasTypeFamily("inanimate")),
            })),
        c = ld(s);
    return c?.entity;
}
import {
    CommandPermissionLevel as Xk,
    CustomCommandParamType as Jk,
    CustomCommandStatus as Qk,
    system as Pg,
} from "@minecraft/server";
var gd = "xvoid:undying_cooldown";
var Ht = new Map(),
    hd = new Map();
function _d(e, t, n) {
    let r = hd.get(e) ?? "normal",
        o = !n && r !== "never" && (t || r === "always");
    return o;
}
function No(e, t) {
    a(() => e.setDynamicProperty(gd, t));
}
function Kt(e, t) {
    let n = Ht.get(e.id);
    if (n === void 0) {
        let r = a(() => e.getDynamicProperty(gd));
        (n = typeof r == "number" && r > 0 ? t + r : 0), Ht.set(e.id, n), n > 0 && void 0;
    }
    return n;
}
function bd(e, t, n) {
    Ht.set(e.id, t + n), Pg.run(() => No(e, n));
}
function Lo(e) {
    Ht.set(e.id, 0), No(e, void 0);
}
function yd(e, t) {
    let n = Kt(e, t);
    n !== 0 && (t >= n ? (Lo(e), void 0) : t % ye.saveEvery === 0 && No(e, n - t));
}
function xd(e) {
    Ht.delete(e), hd.delete(e);
}
function Ed(e, t) {
    return e === void 0 || t - e > 100;
}
var Ho = new Map();
function kd(e, t, n) {
    let r = Ho.get(e);
    r || ((r = new Map()), Ho.set(e, r));
    let o = Ed(r.get(t), n);
    return r.set(t, n), o;
}
function Sd(e) {
    Ho.delete(e);
}
import { system as Mg, world as Cg } from "@minecraft/server";
function wd(e, t, n) {
    return e === void 0 ? 0 : Math.max(0, e + n - t);
}
var jn = new Map();
function Id() {
    Cg.afterEvents.entityHurt.subscribe((e) => {
        let t = e.hurtEntity;
        if (t.typeId !== "minecraft:player" || e.damage <= 0) return;
        let n = Mg.currentTick;
        jn.set(t.id, n);
    });
}
function vd(e, t, n) {
    let r = jn.get(e);
    return r === void 0 ? !0 : wd(r, t, n) > 0 ? !1 : (jn.delete(e), !0);
}
function Td(e) {
    jn.delete(e);
}
import {
    CommandPermissionLevel as yS,
    CustomCommandStatus as xS,
    EquipmentSlot as zo,
    ItemStack as ES,
    system as SS,
} from "@minecraft/server";
var Fo = [
        {
            id: "xvoid:mahoraga_chest",
            slot: "slot.armor.chest",
            layer: "variable.chest_layer_visible = 0.0;",
            prefix: "chest_",
        },
        {
            id: "xvoid:mahoraga_legs",
            slot: "slot.armor.legs",
            layer: "variable.leg_layer_visible = 0.0;",
            prefix: "legs_",
        },
        {
            id: "xvoid:mahoraga_boots",
            slot: "slot.armor.feet",
            layer: "variable.boot_layer_visible = 0.0;",
            prefix: "boots_",
        },
    ],
    Og = 0.1,
    Ft = new Set(Fo.map((e) => e.id));
function $d(e) {
    return 1 + Og * Math.max(0, Math.min(Fo.length, e));
}
var Dg = [zo.Chest, zo.Legs, zo.Feet];
function Ng(e) {
    let t = a(() => e.getComponent("minecraft:equippable"));
    return t ? Dg.filter((n) => Ft.has(a(() => t.getEquipment(n)?.typeId) ?? "")).length : 0;
}
function Ad(e) {
    let t = Ng(e);
    return { rate: $d(t), pieces: t };
}
import {
    ButtonState as Lg,
    EquipmentSlot as Hg,
    InputButton as Kg,
    MolangVariableMap as Fg,
    system as Bt,
    world as zg,
} from "@minecraft/server";
var D = {
    cooldownTicks: 40,
    iframeTicks: 5,
    burstTicks: 8,
    burstSpeed: 1,
    startLift: 0.3,
    hold: 0.02,
    tailSpeed: 0.35,
    tailMaxTicks: 20,
    travelTraceTicks: 12,
    minAirTicks: 6,
    wallReach: 1.2,
    wallHeights: [0.1, 1],
};
function Rd(e, t) {
    return e !== void 0 && t - e < D.minAirTicks;
}
function Bo(e) {
    return e === 0 ? D.startLift : D.hold;
}
var Vo = new Set(["attack", "balance", "defense"]),
    Pd = "xvoid.dash",
    Md = "xvoid:dash_lines",
    Cd =
        "xvoid:dash_ring",
    Od = "variable.dash_dir",
    zt = {
        name: "animation.barehand.dash",
        controller: "controller.xvoid.barehand_dash",
        stop: "q.any_animation_finished",
        blendOut: 0.1,
    },
    Dd = new Set(["selfDestruct", "void", "override"]);
function Nd(e, t) {
    let n = Math.hypot(e.x, e.z) || 1,
        r = e.x / n,
        o = e.z / n,
        i = Math.hypot(t.x, t.y) > 0.1 ? t : { x: 0, y: 1 },
        s = r * i.y + o * i.x,
        c = o * i.y - r * i.x,
        d = Math.hypot(s, c) || 1;
    return { x: s / d, z: c / d };
}
function Wo(e, t, n = D.cooldownTicks) {
    return e === void 0 ? 0 : Math.max(0, e + n - t);
}
function Ld(e, t) {
    return e !== void 0 && t - e < D.iframeTicks;
}
function qn(e, t) {
    return { x: e.x * t, z: e.z * t };
}
var ot = new Map(),
    Yn = new Map();
function Hd(e) {
    let t = a(() => e.getComponent("minecraft:equippable")?.getEquipment(Hg.Mainhand)?.typeId);
    return !!t && (de(t) || P.has(t));
}
function Bg(e, t) {
    if (!Vo.has(E(e))) return `mode ${E(e)}`;
    if (e.isInWater || e.isGliding || e.isFlying) return "water, gliding or flying";
    if (a(() => e.getComponent("minecraft:riding"))) return "riding";
    if (Y(e.id, t))
        return "hand switch";
    let n = Wo(ot.get(e.id), t, ne(e, D.cooldownTicks));
    if (n > 0) return se(e, "dash", n), `cooldown ${n}t`;
}
function Vg(e, t) {
    let n = e.location,
        r = new Fg();
    r.setVector3(Od, { x: -t.x, y: 0, z: -t.z }),
        a(() => fxSpawn(e.dimension, Md, { x: n.x, y: n.y + 1, z: n.z }, r)),
        a(() => fxSpawn(e.dimension, I.dashFlash, { x: n.x, y: n.y + 1, z: n.z }, r)),
        v(e.dimension, I.iceArcs, { x: n.x, y: n.y + 1, z: n.z }),
        v(e.dimension, I.dustSmall, { x: n.x, y: n.y + 0.2, z: n.z }),
        a(() => fxSpawn(e.dimension, Cd, { x: n.x, y: n.y + 0.1, z: n.z })),
        v(e.dimension, I.dashShock, { x: n.x, y: n.y + 0.1, z: n.z }),
        a(() => {
            e.playAnimation(zt.name, { controller: zt.controller, stopExpression: zt.stop, blendOutTime: zt.blendOut });
        });
}
function Wg(e, t, n, r) {
    let o = e.location;
}
function Ug(e, t, n) {
    let r = qn(t, D.burstSpeed),
        o = qn(t, D.tailSpeed),
        i = 0,
        s = Bt.runInterval(() => {
            if ((i++, !e.isValid)) {
                Bt.clearRun(s);
                return;
            }
            if (i < D.burstTicks) {
                a(() => e.applyKnockback(r, Bo(i)));
                return;
            }
            let c = e.isOnGround;
            if (c || i >= D.burstTicks + D.tailMaxTicks) {
                Bt.clearRun(s), Wg(e, n, i, c);
                return;
            }
            let d = a(() => e.getVelocity().y) ?? 0;
            a(() => e.applyKnockback(o, d));
        }, 1);
}
function Gg(e, t) {
    let n = e.location;
    for (let r of D.wallHeights) {
        let o = a(() =>
            e.dimension.getBlockFromRay(
                { x: n.x, y: n.y + r, z: n.z },
                { x: t.x, y: 0, z: t.z },
                { maxDistance: D.wallReach, includePassableBlocks: !1, includeLiquidBlocks: !1 }
            )
        );
        if (o) return a(() => o.block.typeId) ?? "block";
    }
}
function jg(e) {
    let t = Bt.currentTick;
    if (e.isOnGround) {
        Yn.set(e.id, t);
        return;
    }
    if (!Hd(e)) return;
    let n = t - (Yn.get(e.id) ?? t - D.minAirTicks);
    if (Rd(Yn.get(e.id), t)) {
        return;
    }
    let r = Bg(e, t);
    if (r) {
        return;
    }
    let o = a(() => e.inputInfo.getMovementVector()) ?? { x: 0, y: 0 },
        i = Nd(e.getViewDirection(), o),
        s = Gg(e, i);
    if (s) {
        return;
    }
    ot.set(e.id, t);
    let c = e.location;
    a(() => e.applyKnockback(qn(i, D.burstSpeed), Bo(0))), Vg(e, i), Ug(e, i, c);
}
function Kd() {
    zg.afterEvents.playerButtonInput.subscribe((e) => {
        e.button !== Kg.Jump || e.newButtonState !== Lg.Pressed || a(() => jg(e.player));
    });
}
function Fd(e, t) {
    let n = Bt.currentTick;
    if (!Ld(ot.get(t.id), n)) return;
    let r = e.damageSource.cause;
    Dd.has(r) || ((e.cancel = !0), void 0);
}
function zd(e, t) {
    if (!(!Hd(e) || !Vo.has(E(e)))) return Wo(ot.get(e.id), t, ne(e, D.cooldownTicks));
}
function Bd(e) {
    ot.delete(e), Yn.delete(e);
}
import {
    EntityDamageCause as uu,
    EquipmentSlot as Jg,
    MolangVariableMap as su,
    system as Jn,
    world as cu,
} from "@minecraft/server";
var Ie = { damage: 6, gapTicks: 15, knockback: 0.8, lift: 0.3, reach: 4.5, radius: 1.2 },
    it = {
        name: "animation.barehand.punch",
        controller:
            "controller.xvoid.barehand_punch",
        stop: "q.any_animation_finished",
        blendOut: 0.1,
    },
    Vd = "xvoid:punch_impact",
    Uo = "xvoid.punch";
function Wd(e, t) {
    return e === void 0 || t - e >= Ie.gapTicks;
}
function Ud(e, t, n, r, o) {
    let i = Math.hypot(t.x, t.y, t.z) || 1,
        s = t.x / i,
        c = t.y / i,
        d = t.z / i,
        u = n.x - e.x,
        m = n.y - e.y,
        b = n.z - e.z,
        y = u * s + m * c + b * d;
    if (y <= 0 || y > r) return;
    let K = Math.hypot(u - s * y, m - c * y, b - d * y);
    return K <= o ? { along: y, off: K } : void 0;
}
function Gd(e, t) {
    return e === void 0 || t - e >= Ie.gapTicks;
}
function at(e, t, n) {
    let r = t.x - e.x,
        o = t.z - e.z,
        i = Math.hypot(r, o);
    return i < 1e-4 ? { x: 0, z: 0 } : { x: (r / i) * n, z: (o / i) * n };
}
var qg = { veryLight: 1.5, light: 1.2, normal: 1, heavy: 0.6, veryHeavy: 0.25, boss: 0.1 },
    Yg = [
        [
            "veryLight",
            ue(
                "minecraft:chicken",
                "minecraft:rabbit",
                "minecraft:bat",
                "minecraft:parrot",
                "minecraft:bee",
                "minecraft:allay",
                "minecraft:vex",
                "minecraft:silverfish",
                "minecraft:endermite",
                "minecraft:frog",
                "minecraft:cod",
                "minecraft:salmon",
                "minecraft:tropicalfish",
                "minecraft:pufferfish"
            ),
        ],
        [
            "light",
            ue(
                "minecraft:fox",
                "minecraft:cat",
                "minecraft:ocelot",
                "minecraft:wolf",
                "minecraft:armadillo",
                "minecraft:skeleto\
n",
                "minecraft:stray",
                "minecraft:wither_skeleton",
                "minecraft:bogged",
                "minecraft:phantom",
                "minecraft:piglin",
                "minecraft:breeze"
            ),
        ],
        [
            "heavy",
            ue(
                "minecraft:cow",
                "minecraft:mooshroom",
                "minecraft:horse",
                "minecraft:skeleton_horse",
                "minecraft:zombie_horse",
                "minecraft:donkey",
                "minecraft:mule",
                "minecraft:camel",
                "minecraft:camel_husk",
                "minecraft:llama",
                "minecraft:trader_llama",
                "minecraft:polar_bear",
                "minecraft:panda",
                "minecraft:hoglin",
                "minecraft:zoglin",
                "minecraft:strider",
                "minecraft:turtle",
                "minecraft:piglin_brute",
                "minecraft:nautilus",
                "minecraft:zombie_nautilus"
            ),
        ],
        [
            "veryHeavy",
            ue(
                "minecraft:iron_golem",
                "minecraft:ravager",
                "minecraft:sniffer",
                "minecraft:elder_guardian",
                "minecraft:ghast",
                "minecraft:happy_ghast",
                "minecraft:warden"
            ),
        ],
        ["boss", ue("minecraft:ender_dragon", "minecraft:wither")],
    ],
    jd = new Map();
for (let [e, t] of Yg) for (let n of t) jd.set(n, e);
function Go(e, t) {
    return t ? "veryLight" : (jd.get(e) ?? "normal");
}
function qd(e, t) {
    return qg[Go(e, t)];
}
function Yd(e) {
    return !!a(() => e.getComponent("minecraft:is_baby"));
}
function st(e) {
    return Go(e.typeId, Yd(e));
}
function ct(e) {
    return qd(e.typeId, Yd(e));
}
var M = {
        damage: 14,
        cooldownTicks: 140,
        knockback: 3.5,
        lift: 0.5,
        minRange: 4,
        maxRange: 16,
        tapTicks: 6,
        hitDelayTicks: 4,
        standOff: 1.5,
        hitReach: 4,
        trailStep: 1,
    },
    jo = new Set(["balance"]),
    qo = "xvoid.teleport",
    Xd = "xvoid.kick_hit",
    Jd = "xvoid:blink_out",
    Qd =
        "xvoid:blink_trail",
    Zd = "xvoid:blink_in",
    eu = "xvoid:kick_impact",
    Yo = "variable.kick_dir",
    Vt = {
        name: "animation.barehand.kick",
        controller:
            "controller.xvoid.barehand_kick",
        stop: "q.any_animation_finished",
        blendOut: 0.1,
    },
    Xg = new Set([
        "minecraft:short_grass",
        "minecraft:tall_grass",
        "minecraft:short_dry_grass",
        "minecraft:tall_dry_grass",
        "minecraft:fern",
        "minecraft:large_fern",
        "minecraft:deadbush",
        "minecraft:bush",
        "minecraft:firefly_bush",
        "minecraft:seagrass",
        "minecraft:kelp",
        "minecraft:nether_sprouts",
        "minecraft:crimson_roots",
        "minecraft:warped_roots",
        "minecraft:hanging_roots",
        "minecraft:dandelion",
        "minecraft:golden_dandelion",
        "minecraft:poppy",
        "minecraft:blue_orchid",
        "minecraft:allium",
        "minecraft:azure_bluet",
        "minecraft:red_tulip",
        "minecraft:orange_tulip",
        "minecraft:white_tulip",
        "minecraft:pink_tulip",
        "minecraft:oxeye_daisy",
        "minecraft:cornflower",
        "minecraft:lily_of_the_valley",
        "minecraft:torchflower",
        "minecraft:open_eyeblossom",
        "minecraft:closed_eyeblossom",
        "minecraft:cactus_flower",
        "minecraft:sunflower",
        "minecraft:lilac",
        "minecraft:rose_bush",
        "minecraft:peony",
        "minecraft:pink_petals",
        "minecraft:wildflowers",
        "minecraft:leaf_litter",
        "minecraft:spore_blossom",
        "minecraft:oak_sapling",
        "minecraft:spruce_sapling",
        "minecraft:birch_sapling",
        "minecraft:jungle_sapling",
        "minecraft:acacia_sapling",
        "minecraft:dark_oak_sapling",
        "minecraft:cherry_sapling",
        "minecraft:pale_oak_sapling",
        "minecraft:poplar_sapling",
        "minecraft:crimson_fungus",
        "minecraft:warped_fungus",
        "minecraft:brown_mushroom",
        "minecraft:red_mushroom",
        "minecraft:wheat",
        "minecraft:carrots",
        "minecraft:potatoes",
        "minecraft:beetroot",
        "minecraft:torchflower_crop",
        "minecraft:vine",
        "minecraft:glow_lichen",
        "minecraft:sculk_vein",
        "minecraft:cave_vines",
        "minecraft:cave_vines_body_with_berries",
        "minecraft:cave_vines_head_with_berries",
        "minecraft:twisting_vines",
        "minecraft:weeping_vines",
        "minecraft:pale_hanging_moss",
        "minecraft:snow_layer",
        "minecraft:white_carpet",
        "minecraft:orange_carpet",
        "minecraft:magenta_carpet",
        "minecraft:light_blue_carpet",
        "minecraft:yellow_carpet",
        "minecraft:lime_carpet",
        "minecraft:pink_carpet",
        "minecraft:gray_carpet",
        "minecraft:light_gray_carpet",
        "minecraft:cyan_carpet",
        "minecraft:purple_carpet",
        "minecraft:blue_carpet",
        "minecraft:brown_carpet",
        "minecraft:green_carpet",
        "minecraft:red_carpet",
        "minecraft:black_carpet",
        "minecraft:moss_carpet",
        "minecraft:pale_moss_carpet",
        "minecraft:torch",
        "minecraft:soul_torch",
        "minecraft:copper_torch",
        "minecraft:redstone_torch",
        "minecraft:unlit_redstone_torch",
        "minecraft:redstone_wire",
        "minecraft:rail",
        "minecraft:golden_rail",
        "minecraft:detector_rail",
        "minecraft:activator_rail",
    ]);
function tu(e) {
    return e.isAir || e.isLiquid || Xg.has(e.typeId);
}
function Xo(e, t, n = M.cooldownTicks) {
    return e === void 0 ? 0 : Math.max(0, e + n - t);
}
function nu(e) {
    return e >= 0 && e <= M.tapTicks;
}
function ru(e) {
    return e >= M.minRange && e <= M.maxRange;
}
function ou(e, t) {
    let n = e.x - t.x,
        r = e.z - t.z,
        o = Math.hypot(n, r) || 1;
    return {
        x: t.x + (n / o) * M.standOff,
        y: t.y,
        z: t.z + (r / o) * M.standOff,
    };
}
function iu(e, t) {
    let n = t.x - e.x,
        r = t.y - e.y,
        o = t.z - e.z,
        i = Math.hypot(n, r, o) || 1;
    return { x: n / i, y: r / i, z: o / i };
}
function au(e, t) {
    let n = Math.hypot(t.x - e.x, t.y - e.y, t.z - e.z),
        r = Math.floor(n / M.trailStep),
        o = [];
    for (let i = 1; i < r; i++) {
        let s = i / r;
        o.push({ x: e.x + (t.x - e.x) * s, y: e.y + (t.y - e.y) * s, z: e.z + (t.z - e.z) * s });
    }
    return o;
}
var Qn = new Map(),
    Xn = new Map(),
    dt = new Map();
function du(e) {
    return !!e && P.has(e.typeId);
}
function fu(e) {
    let t = a(() => e.getComponent("minecraft:equippable")?.getEquipment(Jg.Mainhand)?.typeId);
    return !!t && P.has(t);
}
function Qg(e, t) {
    if (!jo.has(E(e)))
        return `mode ${E(e)}`;
    if (Y(e.id, t)) return "hand switch";
    let n = Xo(Qn.get(e.id), t, ne(e, M.cooldownTicks));
    if (n > 0) return se(e, "kick", n), `cooldown ${n}t`;
}
function Zg(e) {
    let t = a(() =>
        e.getEntitiesFromViewDirection({
            maxDistance: M.maxRange,
            excludeFamilies: [
                "inanimate",
            ],
            excludeTypes: ["minecraft:item", "minecraft:xp_orb"],
        })
    );
    for (let n of t ?? [])
        if (n.entity.id !== e.id && a(() => n.entity.getComponent("minecraft:health")))
            return { target: n.entity, distance: n.distance };
}
function eh(e, t) {
    for (let n of [0, 1]) {
        let r = a(() => e.dimension.getBlock({ x: Math.floor(t.x), y: Math.floor(t.y) + n, z: Math.floor(t.z) }));
        if (r && !tu(r)) return r.typeId;
    }
}
function th(e, t, n) {
    let r = iu(t, n),
        o = new su();
    o.setVector3(Yo, r);
    let i = new su();
    i.setVector3(Yo, { x: -r.x, y: -r.y, z: -r.z });
    let s = e.dimension;
    a(() => fxSpawn(s, Jd, { x: t.x, y: t.y + 1, z: t.z }, o));
    for (let c of au(t, n)) a(() => fxSpawn(s, Qd, { x: c.x, y: c.y + 1, z: c.z }, o));
    a(() => fxSpawn(s, Zd, { x: n.x, y: n.y + 1, z: n.z }, i)),
        a(() => fxSpawn(s, I.blinkRing, { x: t.x, y: t.y + 1, z: t.z }, o)),
        a(() => fxSpawn(s, I.blinkRing, { x: n.x, y: n.y + 1, z: n.z }, i)),
        v(s, I.blinkSpiral, { x: t.x, y: t.y + 1, z: t.z }),
        v(s, I.blinkSpiral, { x: n.x, y: n.y + 1, z: n.z }),
        v(s, I.dustSmall, { x: n.x, y: n.y + 0.2, z: n.z }),
        a(() => s.playSound(qo, t)),
        a(() => s.playSound(qo, n));
}
function nh(e, t) {
    if (!e.isValid || !t.isValid) {
        dt.delete(e.id);
        return;
    }
    let n = Math.hypot(t.location.x - e.location.x, t.location.z - e.location.z);
    if (n > M.hitReach) {
        dt.delete(e.id);
        return;
    }
    dt.set(e.id, t.id);
    let r = a(() => t.applyDamage(M.damage, { cause: uu.entityAttack, damagingEntity: e }));
    dt.delete(e.id);
    let o = t.location;
    if (
        (a(() => fxSpawn(e.dimension, eu, { x: o.x, y: o.y + 1, z: o.z })),
        v(e.dimension, I.kickBurst, { x: o.x, y: o.y + 1, z: o.z }),
        v(e.dimension, I.kickRing, { x: o.x, y: o.y + 1, z: o.z }),
        v(e.dimension, I.impactGold, { x: o.x, y: o.y + 1, z: o.z }),
        v(e.dimension, I.arcs, { x: o.x, y: o.y + 1, z: o.z }),
        v(e.dimension, I.dustSmall, { x: o.x, y: o.y + 0.2, z: o.z }),
        a(() => e.dimension.playSound(Xd, o)),
        !t.isValid)
    ) {
        return;
    }
    let i = ct(t),
        s = at(e.location, o, M.knockback * i);
    a(() => t.applyKnockback(s, M.lift * i));
}
function rh(e, t) {
    if (!fu(e)) return;
    let n = Jn.currentTick,
        r = Zg(e);
    if (!r) {
        return;
    }
    let { target: o, distance: i } = r,
        s = Qg(e, n);
    if (s) {
        return;
    }
    if (!ru(i)) {
        return;
    }
    let c = e.location,
        d = ou(c, o.location),
        u = eh(e, d);
    if (u) {
        return;
    }
    let m = { x: o.location.x, y: o.location.y + 1, z: o.location.z };
    if (!(a(() => (e.teleport(d, { facingLocation: m }), !0)) === !0)) {
        return;
    }
    Qn.set(e.id, n),
        th(e, c, d),
        a(() => {
            e.playAnimation(Vt.name, { controller: Vt.controller, stopExpression: Vt.stop, blendOutTime: Vt.blendOut });
        }),
        Jn.runTimeout(() => a(() => nh(e, o)), M.hitDelayTicks);
}
function mu() {
    cu.afterEvents.itemStartUse.subscribe((e) => {
        du(e.itemStack) && Xn.set(e.source.id, Jn.currentTick);
    }),
        cu.afterEvents.itemReleaseUse.subscribe((e) => {
            if (!du(e.itemStack)) return;
            let t = e.source,
                n = Xn.get(t.id);
            if ((Xn.delete(t.id), n === void 0)) return;
            let r = Jn.currentTick - n;
            nu(r) && a(() => rh(t, r));
        });
}
function lu(e, t, n) {
    return dt.get(t.id) !== n.id || e.damageSource.cause !== uu.entityAttack
        ? !1
        : ((e.damage = M.damage), q("kick.shake", () => Xe(t, "kick")), !0);
}
function pu(e, t) {
    if (!(!fu(e) || !jo.has(E(e)))) return Xo(Qn.get(e.id), t, ne(e, M.cooldownTicks));
}
function gu(e) {
    Qn.delete(e), Xn.delete(e), dt.delete(e);
}
import {
    EntityDamageCause as wh,
    EquipmentSlot as Ih,
    GameMode as Hu,
    MolangVariableMap as vh,
    system as Ku,
    world as Th,
} from "@minecraft/server";
import { EntityDamageCause as Qo, GameMode as hu, system as ve } from "@minecraft/server";
var Jo = new Map(),
    oh = new Set(_.zombieVillagers);
function _u(e) {
    let t = a(() => e.getComponent("minecraft:type_family")?.hasTypeFamily("undead"));
    return t !== void 0 ? t : (a(() => e.matches({ families: ["undead"] })) ?? !1);
}
function bu(e) {
    return (
        a(
            () =>
                e.getComponent(
                    "minecraft:tameable"
                )?.isTamed
        ) ?? !1
    );
}
function ih(e, t, n) {
    return e + t - n;
}
function ah(e, t, n) {
    let r =
        e.getComponent(
            "minecraft:health"
        );
    if (!r) return !1;
    let o = ih(r.currentValue, t, n),
        i = r.effectiveMax * _.purifyRatio,
        s = o <= i;
    return s;
}
function yu(e) {
    let t = e.dimension;
    fxPositive(t, pe(e)), v(t, I.rise, Re(e)), v(t, I.regen, Re(e)), v(t, I.positiveRays, Re(e)), v(t, I.positiveSeal, Re(e, 0.08)), v(t, I.ringWaveMint, Re(e, 0.1));
}
function sh(e, t) {
    if (!t.isValid) return;
    let n = t.dimension,
        r = t.location,
        o = a(() => t.getRotation().y) ?? 0,
        i = t.nameTag;
    yu(t), z(n, w.cure, r), t.remove();
    let s = a(() => n.spawnEntity(_.cureInto, r, { initialRotation: o }));
    if ((s && i && a(() => (s.nameTag = i)), e?.isValid)) {
        a(() => Pe(e, _.purifyHeal));
        let c = k(e);
        c &&
            R(c.id) &&
            T(
                c,
                "cure",
                S.cure
            );
    }
}
function ch(e, t) {
    yu(t),
        z(t.dimension, w.purify, pe(t), 1.3),
        a(() => t.applyDamage(1e4, { cause: Qo.magic, damagingEntity: e })),
        e.isValid && a(() => Pe(e, _.purifyHeal));
}
function dh(e, t) {
    if (!t.isValid || !e.isValid || _.purifyImmune.includes(t.typeId)) return;
    let n = t.getComponent("minecraft:health");
    !n || n.currentValue <= 0 || (n.currentValue <= n.effectiveMax * _.purifyRatio && ch(e, t));
}
function xu(e) {
    let t = ve.currentTick,
        n = Jo.get(e.id) ?? 0;
    if (t < n) {
        return;
    }
    Jo.set(e.id, t + _.stabCooldown),
        a(() => e.playAnimation(fe.stab, { blendOutTime: 0.2, controller: fe.controller, stopExpression: fe.stop }));
}
var Zn = new Map();
function uh(e) {
    for (let [t, n] of Zn) e - n >= _.strikeFxGap && Zn.delete(t);
}
function Eu(e, t, n, r) {
    let o = ve.currentTick;
    o - (Zn.get(t) ?? -_.strikeFxGap) < _.strikeFxGap || (uh(o), Zn.set(t, o), e.isValid && xu(e), fxPositive(n, r));
}
function fh(e, t, n, r, o) {
    Eu(e, t.id, r, t.isValid ? pe(t) : o), n && e.isValid && go(e, "undead"), t.isValid && n && dh(e, t);
}
function ku(e) {
    let t = k(e.damagingEntity);
    if (!t || !X.has(t.id)) return;
    let n = e.hitEntity,
        r = a(() => pe(n));
    r && Eu(t, n.id, n.dimension, r);
}
function Su(e, t, n, r) {
    if (e.damageSource.cause !== Qo.entityAttack || !X.has(t.id)) return;
    let o = _u(n);
    if ((o && (e.damage = e.damage * V(t).positive), oh.has(n.typeId) && ah(n, r, e.damage))) {
        (e.cancel = !0),
            ve.run(() => {
                t.isValid && xu(t),
                    t.isValid &&
                        go(
                            t,
                            "cure"
                        ),
                    sh(t, n);
            });
        return;
    }
    let i = n.dimension,
        s = pe(n);
    ve.run(() => fh(t, n, o, i, s));
}
function mh(e, t) {
    return (
        a(() =>
            e.getEntities({
                location: t,
                maxDistance: _.slashRadius,
                excludeFamilies: ["inanimate"],
                excludeTypes: ["minecraft:item", "minecraft:xp_orb"],
            })
        ) ?? []
    );
}
function lh(e, t, n) {
    if (!t.getComponent("minecraft:health") || t.typeId === "minecraft:player" || bu(t)) return;
    let r = t.dimension,
        o = a(() => t.applyDamage(_.slashDamage, { cause: Qo.magic, damagingEntity: e }));
    a(() => t.applyKnockback({ x: n.x * _.slashKnockback, z: n.z * _.slashKnockback }, 0.3)),
        z(r, w.slashHit, pe(t)),
        v(r, I.inkSpark, pe(t)),
        v(r, I.slashCut, pe(t)),
        v(r, I.impactIce, pe(t)),
        v(r, I.shatterIce, pe(t)),
        v(r, I.iceArcs, pe(t));
}
function ph(e) {
    if (!_.slashCutsBlocks) return !1;
    let t = a(() => e.getGameMode());
    return t !== hu.Adventure && t !== hu.Spectator;
}
function gh(e, t, n) {
    let r = Math.floor(t.x),
        o = Math.floor(t.y),
        i = Math.floor(t.z),
        s = `${r}\
,${o},${i}`;
    if (n.done.has(s)) return n.blocked.has(s);
    n.done.add(s);
    let c = a(() => e.getBlock({ x: r, y: o, z: i }));
    return !c || c.isAir || c.isLiquid
        ? !1
        : !!!a(() => c.getComponent("minecraft:inventory")) &&
            !_.uncuttable.has(c.typeId) &&
            n.count < _.slashMaxBlocks &&
            hh(e, c, { x: r + 0.5, y: o + 0.5, z: i + 0.5 })
          ? (n.count++, !1)
          : (n.blocked.add(s), !0);
}
function hh(e, t, n) {
    let r = a(() => t.getItemStack(1, !1));
    return a(() => t.setType("minecraft:air")) === void 0 && !t.isAir
        ? !1
        : (r && a(() => e.spawnItem(r, n)), v(e, I.inkSpark, n), !0);
}
function wu(e) {
    let t = e.getHeadLocation(),
        n = Mr(e.getViewDirection()),
        r = Mr({ x: -n.z, y: 0, z: n.x });
    r.x === 0 && r.z === 0 && (r = { x: 1, y: 0, z: 0 });
    let o = { x: r.y * n.z - r.z * n.y, y: r.z * n.x - r.x * n.z, z: r.x * n.y - r.y * n.x };
    return { eye: t, forward: n, right: r, up: o };
}
function _h(e, t) {
    let n = a(() => e.getBlockFromViewDirection({ maxDistance: _.slashRange }));
    return n ? Math.min(_.slashRange, Li(t, W(n.block.location, n.faceLocation))) : _.slashRange;
}
function bh(e) {
    let t = _.trailTicks;
    for (let n = 0; n < t; n++)
        ge(_.slashWindup - t + n, () => {
            if (!e.isValid) return;
            let { eye: r, forward: o, right: i, up: s } = wu(e),
                c = e.dimension,
                d = -_.trailArc + (2 * _.trailArc * n) / t,
                u = -_.trailArc + (2 * _.trailArc * (n + 1)) / t;
            n === Math.floor(t / 2) && v(c, I.slashMoon, W(r, F(o, _.trailRadius + 0.6)));
            for (let m = d; m <= u + 1e-6; m += 0.07) {
                let b = -_.trailTilt * Math.sin(m),
                    y = W(W(F(o, Math.cos(m)), F(i, Math.sin(m))), F(s, b)),
                    K = W(r, F(y, _.trailRadius));
                v(c, I.slashTrail, K),
                    v(c, I.ink, W(K, W(F(s, -0.14), F(o, 0.12)))),
                    m + 0.07 > u + 1e-6 && v(c, I.slashSpark, K);
            }
        });
}
function yh(e) {
    if (!e.isValid || !Hi(e) || !X.has(e.id)) return;
    let t = e.dimension,
        { eye: n, forward: r, right: o } = wu(e),
        i = ph(e) ? { done: new Set(), blocked: new Set(), count: 0 } : void 0,
        s = i ? _.slashRange : _h(e, n),
        c = new Set([e.id]),
        d = _.slashStart,
        u = ve.runInterval(() => {
            try {
                let m = Math.min(s, d + _.slashSpeed);
                for (let y = d; y <= m && y <= s; y += 0.35) {
                    let K = W(n, F(r, y)),
                        U = _.slashWidth;
                    for (let oe = -U; oe <= U + 1e-6; oe += U / 5) {
                        let nn = F(r, -oe * oe * 0.22),
                            gr = W(W(K, F(o, oe)), nn);
                        v(t, I.slashTrail, gr),
                            v(t, I.ink, W(gr, F(r, -0.32))),
                            i && y >= _.slashCutStart && gh(t, gr, i) && Math.abs(oe) < 1e-6 && (s = Math.min(s, y));
                    }
                }
                m = Math.min(m, s);
                let b = W(n, F(r, m));
                v(t, I.inkSpark, W(b, F(o, _.slashWidth))), v(t, I.inkSpark, W(b, F(o, -_.slashWidth))), v(t, I.slashSpark, b), v(t, I.waveMoon, b), v(t, I.iceArcs, b);
                for (let y of mh(t, b)) c.has(y.id) || (c.add(y.id), lh(e, y, r));
                (d = m), d >= s && (fxPositive(t, b), v(t, I.inkSpark, b), v(t, I.shatterIce, b), v(t, I.impactIce, b), ve.clearRun(u));
            } catch (m) {
                A("sword.slashWave", m, { player: e.id }), ve.clearRun(u);
            }
        }, 1);
}
function Iu(e) {
    let t = e.source;
    if (!de(e.itemStack?.typeId) || t.isSneaking) return;
    let n = ve.currentTick;
    if (Y(t.id, n)) {
        return;
    }
    let r = tt.get(t.id) ?? 0;
    if (n < r) {
        se(t, "slash", r - n);
        return;
    }
    let o = ne(t, _.slashCooldown);
    tt.set(t.id, n + o),
        a(() => t.startItemCooldown(_.cooldownCategory, o)),
        a(() => t.playAnimation(fe.slash, { blendOutTime: 0.25, controller: fe.controller, stopExpression: fe.stop })),
        bh(t),
        ge(_.slashWindup, () => yh(t));
}
function vu(e) {
    return e.typeId === "minecraft:player" || bu(e);
}
function Tu(e) {
    tt.delete(e), Jo.delete(e);
}
import { world as $u } from "@minecraft/server";
var xh = ["mode", "cut", "keepOnDeath", "lowFx"],
    ft = ["starter", "crafting"],
    Au = "xvoid:world_config",
    Eh = 1,
    ut = { mode: "crafting", cut: !0, keepOnDeath: !1, lowFx: !1 },
    Wt,
    Ru = [];
function kh(e) {
    if (typeof e != "string") return { ...ut };
    try {
        let t = JSON.parse(e);
        return {
            mode: ft.includes(t.mode) ? t.mode : ut.mode,
            cut: typeof t.cut == "boolean" ? t.cut : ut.cut,
            keepOnDeath: typeof t.keepOnDeath == "boolean" ? t.keepOnDeath : ut.keepOnDeath,
            lowFx: typeof t.lowFx == "boolean" ? t.lowFx : ut.lowFx,
        };
    } catch (t) {
        return { ...ut };
    }
}
function Ut() {
    if (!Wt) {
        Wt = kh($u.getDynamicProperty(Au));
        let e = Wt;
    }
    return Wt;
}
function Gt(e) {
    return Ut()[e];
}
function Zo(e, t) {
    return xh.filter((n) => e[n] !== t[n]);
}
function er(e, t) {
    let n = Ut(),
        r = { ...n, ...e },
        o = Zo(r, n);
    if (!o.length) return o;
    (Wt = r),
        $u.setDynamicProperty(
            Au,
            JSON.stringify({
                v: Eh,
                ...r,
            })
        );
    for (let i of Ru) i(r, n, t);
    return o;
}
function jt(e) {
    Ru.push(e);
}
var H = {
        damage: 12,
        cooldownTicks: 200,
        windupTicks: 10,
        range: 12,
        radius: 1.3,
        knockback: 2,
        lift: 0.4,
        step: 0.5,
        ringEvery: 2,
    },
    ei = new Set(["attack", "balance"]),
    Pu = "xvoid.air_blast_charge",
    Mu = "xvoid.air_blast_fire",
    Cu = "xvoid:air_charge",
    Ou = "xvoid:air_ring",
    Du = "xvoid:air_streak",
    Nu = "variable.blast_dir",
    qt = {
        name: "animation.extermination_sword.air_blast",
        controller: "controller.xvoid.sword_air_blast",
        stop: "q.any_animation_finished",
        blendOut: 0.15,
    },
    Sh = new Set([
        "minecraft:short_grass",
        "minecraft:tall_grass",
        "minecraft:fern",
        "minecraft:large_fern",
        "minecraft:deadbush",
        "minecraft:snow_layer",
        "minecraft:web",
        "minecraft:dandelion",
        "minecraft:poppy",
        "minecraft:blue_orchid",
        "minecraft:allium",
        "minecraft:azure_bluet",
        "minecraft:red_tulip",
        "minecraft:orange_tulip",
        "minecraft:white_tulip",
        "minecraft:pink_tulip",
        "minecraft:oxeye_daisy",
        "minecraft:cornflower",
        "minecraft:lily_of_the_valley",
        "minecraft:wither_rose",
        "minecraft:torchflower",
        "minecraft:sunflower",
        "minecraft:lilac",
        "minecraft:rose_bush",
        "minecraft:peony",
        "minecraft:pink_petals",
    ]);
function Lu(e) {
    return Sh.has(e)
        ? !0
        : e === "minecraft:tinted_glass"
          ? !1
          : e.endsWith("glass") || e.endsWith("glass_pane") || e.endsWith("_leaves");
}
function ti(e, t, n = H.cooldownTicks) {
    return e === void 0 ? 0 : Math.max(0, e + n - t);
}
var tr = new Map();
function Fu(e) {
    return de(a(() => e.getComponent("minecraft:equippable")?.getEquipment(Ih.Mainhand)?.typeId));
}
function $h(e, t) {
    if (!ei.has(E(e))) return `mode ${E(e)}`;
    if (Y(e.id, t)) return "hand switch";
    let n = ti(tr.get(e.id), t, ne(e, H.cooldownTicks));
    if (n > 0) return se(e, "airBlast", n), `cooldown ${n}t`;
}
function zu(e) {
    let t = e.getHeadLocation(),
        n = e.getViewDirection();
    return {
        x: t.x + n.x * 0.4,
        y: t.y - 0.1 + n.y * 0.4,
        z: t.z + n.z * 0.4,
    };
}
function Ah(e) {
    if (!Gt("cut")) return !1;
    let t = a(() => e.getGameMode());
    return t !== Hu.Adventure && t !== Hu.Spectator;
}
function Rh(e, t, n) {
    let r = Ah(e),
        o = 0;
    for (let i = H.step; i <= H.range; i += H.step) {
        let s = { x: t.x + n.x * i, y: t.y + n.y * i, z: t.z + n.z * i },
            c = a(() => e.dimension.getBlock(s));
        if (!(!c || c.isAir || c.isLiquid)) {
            if (Lu(c.typeId)) {
                r && a(() => (c.setType("minecraft:air"), !0)) && o++;
                continue;
            }
            return { range: i, broken: o, stop: c.typeId };
        }
    }
    return {
        range: H.range,
        broken: o,
        stop: "none",
    };
}
function Ph(e, t, n, r) {
    let o = new vh();
    o.setVector3(Nu, n);
    let i = e.dimension;
    for (let s = 1; s <= r; s += 1) {
        let c = { x: t.x + n.x * s, y: t.y + n.y * s, z: t.z + n.z * s };
        a(() => fxSpawn(i, Du, c, o)), s % H.ringEvery === 0 && a(() => fxSpawn(i, Ou, c, o));
    }
    a(() => fxSpawn(i, I.airMuzzle, t, o)), v(i, I.shatterIce, t), v(i, I.iceArcs, t), a(() => i.playSound(Mu, t));
}
function Mh(e, t, n) {
    if (vu(t)) return `${t.typeId}:spared`;
    let r = H.damage,
        o = a(() => t.applyDamage(r, { cause: wh.sonicBoom, damagingEntity: e }));
    t.isValid && (v(t.dimension, I.impactIce, pe(t)), v(t.dimension, I.ringPopIce, pe(t)));
    if (t.isValid) {
        let i = ct(t),
            s = at({ x: 0, z: 0 }, n, H.knockback * i);
        return a(() => t.applyKnockback(s, H.lift * i)), `${t.typeId}:${r.toFixed(1)}${o ? "" : "(no hurt)"}:${st(t)}`;
    }
    return `${t.typeId}:${r.toFixed(1)}:died`;
}
function Ch(e) {
    if (!e.isValid) return;
    let t = zu(e),
        n = e.getViewDirection(),
        r = Rh(e, t, n);
    Ph(e, t, n, r.range), Xe(e, "airBlast");
    let o = a(() => e.dimension.getEntities({ location: t, maxDistance: r.range + H.radius + 1 })) ?? [],
        i = [];
    for (let s of o) {
        if (s.id === e.id || !a(() => s.getComponent("minecraft:health"))) continue;
        let c = s.location,
            d = { x: c.x, y: c.y + 0.9, z: c.z };
        Ud(t, n, d, r.range, H.radius) && i.push(Mh(e, s, n));
    }
}
function Oh(e) {
    if (!e.isSneaking || !Fu(e)) return;
    let t = Ku.currentTick,
        n = $h(e, t);
    if (n) {
        return;
    }
    tr.set(e.id, t),
        a(() => fxSpawn(e.dimension, Cu, zu(e))),
        v(e.dimension, I.airCore, zu(e)),
        v(e.dimension, I.airSpiral, zu(e)),
        a(() => {
            e.playAnimation(qt.name, { controller: qt.controller, stopExpression: qt.stop, blendOutTime: qt.blendOut });
        }),
        Ku.runTimeout(() => a(() => Ch(e)), H.windupTicks);
}
function Bu() {
    Th.afterEvents.itemUse.subscribe((e) => {
        de(e.itemStack?.typeId) && a(() => Oh(e.source));
    });
}
function Vu(e, t) {
    if (!(!Fu(e) || !ei.has(E(e)))) return ti(tr.get(e.id), t, ne(e, H.cooldownTicks));
}
function Wu(e) {
    tr.delete(e);
}
var ni = new Map();
function Yt(e, t) {
    let n = e.map.get(t.key);
    if ((n || ((n = { s: 0, n: t.spins, used: 0 }), e.map.set(t.key, n)), n.n !== t.spins)) {
        let r = `${n.s}/${n.n}`;
        (n.s = On(n.s, n.n, t.spins)), (n.n = t.spins), (e.dirty = !0);
    }
    return n;
}
function ri(e, t) {
    let n = e.pending.get(t);
    return n || ((n = wo()), e.pending.set(t, n)), n;
}
function oi(e, t, n, r, o, i, s = "hit", c) {
    let d = i.rate,
        u = ri(e, t),
        m = He(u),
        b = u.p;
    (u.weight += n), (u.taken += r);
    let y = c ? mc(c.raw, c.amplifier) : 0,
        K = lc(u, o, d, y);
    m || void 0, !(K <= 0) && ((e.dirty = !0), void 0);
}
function Lh(e, t, n, r, o) {
    let i = ri(e, t),
        s = He(i);
    (i.weight += n), (i.taken += r), (i.activeLeft = Le), s || void 0;
}
function or(e) {
    let t = Ad(e);
    return { rate: he(V(e).adaptRate * t.rate), armor: t.pieces };
}
function Hh(e, t, n) {
    if (n % ko !== 0) return;
    let r = or(e),
        o = r.rate;
    for (let [i, s] of t.pending) {
        let c = t.map.get(i);
        if (!c || c.s >= c.n) {
            t.pending.delete(i);
            continue;
        }
        let d = s.p,
            u = He(s),
            m = pc(s, o);
        m > 0 && (t.dirty = !0), m > 0 && _c(d, s.p, uc) && void 0, u && !He(s) && void 0;
    }
}
function qu(e, t) {
    let n = qa(t);
    if (n.length > 0) {
        for (let r of e.getEffects())
            if (n.includes(pn(r.typeId))) {
                if (rt(e, r.typeId, r)) {
                    continue;
                }
                a(() => e.removeEffect(r.typeId));
            }
    }
    (t === "env:lava" || fa.some((r) => t === `env:${r}`)) && a(() => e.extinguishFire(!1));
}
function Kh(e, t, n) {
    if (!ie.useSlots) return;
    let r = [...t.map.entries()].filter(([s, c]) => c.s >= c.n && s !== n);
    if (r.length < ie.slots) return;
    r.sort((s, c) => s[1].used - c[1].used);
    let [o, i] = r[0];
    (i.s = 0),
        ge(C.forgottenNoticeTicks, () => {
            e.isValid && T(e, "forgotten", S.forgotten(hn(o), bt(Ee(o))));
        });
}
function Fh(e, t) {
    let n = Tc(t);
    for (let r of Ac(t)) {
        let o = wt(r);
        if (!o) continue;
        let i = Yt(e, o),
            s = Math.floor(i.n / 2);
        if (n?.members.includes(r)) {
            if (i.s >= s) continue;
            let c = i.s;
            (i.s = s), (e.dirty = !0);
            continue;
        }
        i.s < s && i.s++;
    }
}
function zh(e, t, n) {
    for (let r of $c(n)) {
        let o = wt(r);
        if (!o) continue;
        let i = Yt(t, o);
        if (i.s >= i.n) continue;
        let s = i.s;
        (i.s = i.n), (i.used = Date.now()), t.pending.delete(r), (t.dirty = !0), qu(e, r);
    }
}
function Bh(e, t, n, r) {
    (r.used = Date.now()), Fh(t, n), zh(e, t, n), Kh(e, t, n), qu(e, n), T(e, "adapted", Ja(n));
}
function Vh(e) {
    if (!ie.useHunger) return;
    let t = e.getComponent("minecraft:player.exhaustion");
    t && a(() => t.setCurrentValue(Math.min(t.effectiveMax, t.currentValue + ie.spinExhaustion)));
}
function Wh(e) {
    if (!ie.useHunger) return !1;
    let t = a(
        () =>
            e.getComponent(
                "minecraft:player.hunger"
            )?.currentValue
    );
    return typeof t == "number" && t <= 0;
}
function ii(e) {
    let t = a(() => e.getComponent("minecraft:health"));
    return !t || t.currentValue <= 0 ? 0 : Math.max(0, t.effectiveMax - t.currentValue);
}
function Uh(e, t, n) {
    let r = ii(e),
        o = Math.min(r, r * Zc(e, Dt(t), n));
    o < 0.5 || (a(() => Pe(e, o)), z(e.dimension, w.heal, e.location), v(e.dimension, I.rise, Re(e)));
}
function Gh(e, t, n) {
    let r = ed(e, Dt(t));
    !r || n % r.every !== 0 || ii(e) <= 0 || (vd(e.id, n, V(e).regenPause) && a(() => Pe(e, r.amount)));
}
function jh(e, t) {
    let n = e.pending.get(t);
    if (!n) return;
    let r = hc(n, e.map.get(t)?.n ?? 1);
    (n.weight = 0), (n.taken = 0), (e.dirty = !0);
}
function qh(e, t, n) {
    let r = e.map.get(t);
    return r && r.s < r.n && r.s + 1 >= r.n
        ? "adapted"
        : Ic(e)
          ? "first"
          : t.startsWith("effect:")
            ? "adapting"
            : e.lastTurn?.key === t && n - e.lastTurn.at <= C.fastWindow
              ? "fast"
              : "adapting";
}
function Yu(e, t, n, r) {
    ce(e, "full"),
        Ki(e, () => Xe(e, "adapted")),
        (t.lastSpin = r + C.fullLock - C.spinInterval),
        (t.lastTurn = { key: n, at: r }),
        (t.landing = { key: n, at: r + $e.full, full: !0 });
}
function Xu(e, t, n, r, o = !1) {
    let i = t.map.get(n);
    if (!o && i && i.s < i.n && i.s + 1 >= i.n) {
        Yu(e, t, n, r);
        return;
    }
    (t.spin = (t.spin + 1) % C.handles), (t.lastKey = n), (t.lastKeyAt = r);
    let s = !!i && i.s < i.n;
    s && i.s++;
    let c = s && i.s >= i.n;
    c ? Bh(e, t, n, i) : s && i && T(e, "progress", S.progress(hn(n), bt(Ee(n)), i.s, i.n)),
        Uh(e, t, c),
        Vh(e),
        a(() => Dn(e, t));
}
function Yh(e, t, n, r) {
    let o = qh(t, n, r);
    if ((jh(t, n), o === "first")) {
        (t.lastSpin = r + C.firstLock - C.spinInterval),
            (t.firstSpin = {
                key: n,
                at: r + C.firstLock,
            }),
            ce(e, "first"),
            _t(e, w.first);
        return;
    }
    (t.lastSpin = r), (t.lastTurn = { key: n, at: r });
    let i = $e.spin;
    if (
        o ===
        "fast"
    )
        ce(e, "fast"), _t(e, w.fast), (i = $e.fast);
    else if (o === "adapting") ce(e, "spin"), _t(e, w.spin);
    else {
        Yu(e, t, n, r);
        return;
    }
    t.landing = { key: n, at: r + i, full: !1 };
}
function Xh(e, t, n) {
    let r = t.landing;
    !r || n < r.at || ((t.landing = void 0), Xu(e, t, r.key, n, r.full));
}
function Jh(e, t, n) {
    let r = t.firstSpin;
    !r || n < r.at || ((t.firstSpin = void 0), Xu(e, t, r.key, n));
}
var Qh = new Set([nr.void, nr.selfDestruct, nr.override]);
function Uu(e, t) {
    return Qh.has(e) || t >= ye.oneHit;
}
function Zh(e, t, n) {
    let r = a(() => e.getComponent("minecraft:health")?.currentValue);
    return typeof r == "number" && r + t - n < 1;
}
function e_(e, t, n, r) {
    bd(e, r, ye.cooldown),
        (t.graceUntil = r + ye.healDelay + ye.graceAfterHeal),
        (t.lastSpin = Math.max(t.lastSpin, r)),
        (t.spin = (t.spin + 1) % C.handles),
        (t.lastKey = n),
        (t.lastKeyAt = r),
        Be.run(() => {
            e.isValid &&
                (a(() => e.getComponent("minecraft:health")?.setCurrentValue(1)),
                ce(e, "spin"),
                _t(e, w.spin),
                fxUndying(e),
                z(e.dimension, w.undying, Ye(e)));
        }),
        ge(ye.healDelay, () => {
            !e.isValid ||
                !R(e.id) ||
                (Pe(e, ii(e)),
                v(e.dimension, I.rise, Re(e)),
                v(e.dimension, I.regen, Re(e)),
                v(e.dimension, I.positiveRays, Re(e)));
        });
}
function Gu(e) {
    let t = e.damageSource;
    return !!(a(() => t.damagingEntity) ?? a(() => t.damagingProjectile));
}
function t_(e, t, n) {
    (t.shieldTick = n), fd(e);
    let r = t.recentEffects.filter((o) => n - o.tick <= rn.effectWindow);
    (t.recentEffects = []),
        r.length &&
            Be.run(() => {
                if (e.isValid)
                    for (let o of r) {
                        let i = a(() => e.getEffect(o.typeId));
                        (i && rt(e, o.typeId, i)) || a(() => e.removeEffect(o.typeId));
                    }
            });
}
function n_(e, t, n, r) {
    e.isValid && (t && Fi(e, 0.4), n && (fxNullify(e, r), !vt(e.id, Be.currentTick) && ce(e, "react")));
}
function r_(e, t, n) {
    if (!e || a(() => e.id) === t.id) return;
    let r = a(() => e.typeId);
    r && Sa(e, qr(r), n);
}
function o_(e, t) {
    let n = a(() => e.damageSource.damagingProjectile?.typeId);
    if (!n) return;
    let r = gn(e.damageSource, !0),
        o = r ? a(() => r.typeId) : void 0;
    wa(n, o, o ? Me(o).spins : f.turn1, t);
}
function Ju(e, t, n = e.damage) {
    let r = Be.currentTick,
        o = ee(t),
        i = pd(e.damageSource, t, n);
    r_(gn(e.damageSource) ?? i, t, n), o_(e, n), woaBurnAttacker(e, t, o);
    let s = Ua(e.damageSource, t, i);
    if ((s || void 0, !s)) return;
    let c = e.damageSource.cause,
        d = n;
    if (r < o.graceUntil && !Uu(c, e.damage)) {
        e.cancel = !0;
        return;
    }
    let u = Yt(o, s);
    if (((o.hudKey = s.key), (o.hudKeyAt = r), u.s >= u.n)) {
        (u.used = Date.now()),
            Gu(e)
                ? ((e.damage = 0),
                  t_(t, o, r),
                  Nt(
                      t,
                      a(() => t.getVelocity())
                  ),
                  `${s.key}`,
                  void 0)
                : ((e.cancel = !0), void 0);
        woaNullified(e, t, o, s.key, d, r);
        let K = !Xa(s.key),
            U = K && kd(t.id, s.key, r),
            oe = K && r - o.lastFlash >= C.nullifyFlashInterval;
        let fxFrom = oe
            ? a(() => e.damageSource.damagingEntity?.location ?? e.damageSource.damagingProjectile?.location)
            : void 0;
        oe && (o.lastFlash = r), U && void 0, (U || oe) && Be.run(() => n_(t, U, oe, fxFrom));
        return;
    }
    e.damage = e.damage * (1 - ie.partialMax * (u.s / u.n));
    let m = e.damage;
    s.lingering
        ? Lh(o, s.key, Math.max(1, e.damage), m, e.damage)
        : oi(o, s.key, Math.max(1, e.damage), m, r, or(t), "hit", {
              raw: d,
              amplifier: cc.has(c)
                  ? void 0
                  : a(
                        () =>
                            t.getEffect(
                                "resistance"
                            )?.amplifier
                    ),
          }),
        cd(
            t,
            Gu(e),
            a(() => e.damageSource.damagingEntity?.location ?? e.damageSource.damagingProjectile?.location)
        );
    let b = Zh(t, d, m),
        y = r >= Kt(t, r);
    b && _d(t.id, y, Uu(c, m)) && ((e.cancel = !0), e_(t, o, s.key, r));
}
function i_(e) {
    return Math.min(on.maxLevelBonus, on.bonusPerLevel * e);
}
function a_(e, t) {
    return e.damageSource.cause === nr.entityAttack && t.typeId !== "minecraft:player";
}
var woa = {
        counterTicks: 60,
        counterMult: 1.5,
        attackBonus: 0.3,
        attackHits: 4,
        attackHitGap: 5,
        attackTurnGap: 40,
        attackPlayerTurns: 4,
        quakeMinDamage: 4,
        quakeRadius: 4,
        quakeDamageRatio: 0.5,
        quakeMaxDamage: 12,
        quakeKnockback: 1.6,
        quakeLift: 0.45,
        burnSeconds: 4,
        reflectRatio: 0.5,
        reflectRange: 32,
        reflectSpeedMin: 1.2,
        reflectSpeedMax: 3.5,
        reflectLife: 100,
        reflectTypes: new Set([
            "minecraft:arrow",
            "minecraft:fireball",
            "minecraft:small_fireball",
            "minecraft:dragon_fireball",
            "minecraft:wither_skull",
            "minecraft:wither_skull_dangerous",
            "minecraft:snowball",
            "minecraft:llama_spit",
            "minecraft:wind_charge_projectile",
            "minecraft:breeze_wind_charge_projectile",
        ]),
        healCut: 0.75,
        healCutTicks: 200,
        healFxGap: 20,
        healAcctTicks: 3,
        hudAtkTicks: 100,
        hudAtkSwap: 40,
        armorPierce: 1,
        armorPerPoint: 0.04,
        toughnessPerPoint: 0,
        armorMaxReduction: 0.8,
        pierceCap: 5,
    },
    woaQuiet = !1,
    woaReflected = new Map(),
    woaWounds = new Map();
function woaFull(e, t) {
    let n = e.map.get(t);
    return !!n && n.s >= n.n;
}
function woaAtkSave(e) {
    let t = {};
    for (let [n, r] of e.atk) (r.s > 0 || r.h > 0) && (t[n] = [r.s, r.n, r.h]);
    return t;
}
function woaAtkLoad(e, t) {
    if ((e.atk.clear(), !t || typeof t != "object")) return;
    for (let [n, r] of Object.entries(t))
        Array.isArray(r) &&
            typeof r[0] == "number" &&
            typeof r[1] == "number" &&
            r[1] >= 1 &&
            e.atk.set(n, { s: Math.min(r[0], r[1]), n: r[1], h: typeof r[2] == "number" ? r[2] : 0, at: -100 });
}
function woaAtkView(e, t) {
    return {
        key: e,
        entry: { s: t.s, n: t.n },
        hits: t.s >= t.n ? 0 : t.h,
        need: woa.attackHits,
        paused: !1,
        spinning: !1,
        completing: !1,
    };
}
function woaHudAtk(e, t, n) {
    let r = e.atkLast,
        o = r ? e.atk.get(r) : void 0;
    if (!(!o || t - e.atkLastAt > woa.hudAtkTicks || (n && Math.floor(t / woa.hudAtkSwap) % 2 === 0))) return woaAtkView(r, o);
}
function woaAtkList(e) {
    let t = [];
    for (let [n, r] of e.atk) (r.s > 0 || r.h > 0) && t.push({ view: woaAtkView(n, r), full: r.s >= r.n ? 1 : 0, at: r.at });
    return t.sort((n, r) => n.full - r.full || r.at - n.at).map((n) => n.view);
}
function woaAtkBonus(e) {
    return Math.round(woa.attackBonus * 100 * Math.min(1, e.entry.s / e.entry.n));
}
function woaAttackTurns(e, t) {
    let n = a(() => e.getComponent("minecraft:health")?.effectiveMax);
    return Math.max(Me(t).spins, Pl(n), t === "minecraft:player" ? woa.attackPlayerTurns : 1);
}
function woaAttackHit(e, t, n, r) {
    let o = a(() => n.typeId) ?? "unknown",
        i = St(o),
        s = t.atk.get(i);
    s || ((s = { s: 0, n: woaAttackTurns(n, o), h: 0, at: -100 }), t.atk.set(i, s)), (t.atkLast = i), (t.atkLastAt = r);
    let c = Math.min(1, s.s / s.n);
    if (s.s >= s.n || r - s.at < woa.attackHitGap) return c;
    if (((s.at = r), s.h++, (t.dirty = !0), s.h >= woa.attackHits && r - t.atkTurnAt >= woa.attackTurnGap)) {
        (s.h = 0), s.s++, (t.atkTurnAt = r);
        let d = s.s,
            u = s.n;
        Be.run(() => woaAttackTurn(e, i, d, u));
    }
    return c;
}
function woaAttackTurn(e, t, n, r) {
    if (!e.isValid || !R(e.id)) return;
    vt(e.id, Be.currentTick) || ce(e, "spin"), _t(e, w.spin);
    let o = [" \xA7f\xBB ", bt(Ee(t)), " \xA7f", hn(t)];
    if (n >= r) {
        let i = Ye(e);
        v(e.dimension, I.flare, i),
            v(e.dimension, I.sparks, i),
            Xe(e, "adapted"),
            T(e, "attackAdapted", x("\xA7p\xA7l", p("woa.toast.attack_adapted"), ...o));
    } else
        T(
            e,
            "attackProgress",
            x("\xA76\xA7l", p("woa.notice.attack_adapting"), ...o, ` \xA76\xA7l[\xA7f${n}/${r}\xA76\xA7l]`)
        );
    a(() => Dn(e, ee(e)));
}
function woaPierce(e, c) {
    let t = a(() => e.getEffect("resistance"))?.amplifier,
        n = typeof t != "number" || t < 0 || t >= 4 ? 1 : 1 / (1 - 0.2 * (t + 1));
    if (c !== nr.entityAttack && c !== nr.projectile) return n;
    let r = a(() => {
            let i = e.getComponent("minecraft:equippable");
            return i ? woa.armorPerPoint * i.totalArmor + woa.toughnessPerPoint * i.totalToughness : 0;
        }),
        o = typeof r == "number" && r > 0 ? 1 / (1 - Math.min(woa.armorMaxReduction, r) * woa.armorPierce) : 1;
    return Math.min(woa.pierceCap, n * o);
}
function woaCounterUse(e, t, n, r) {
    let o = t.counter;
    if (!o || o.id !== n.id) return 1;
    if (((t.counter = void 0), r > o.until)) return 1;
    let i = a(() => pe(n)),
        s = n.dimension;
    return i && Be.run(() => woaCounterFx(e, s, i)), woa.counterMult;
}
function woaCounterFx(e, t, n) {
    for (let r of [I.counterCut, I.kickBurst, I.kickRing, I.impactGold, I.shatterGold, I.arcs]) v(t, r, n);
    z(t, "xvoid.kick_hit", n, 1.25, 0.8),
        e.isValid && T(e, "counter", x("\xA76\xA7l\xAB ", p("woa.toast.counter"), " \xBB"));
}
function woaOffense(e, t, n, r) {
    if (woaQuiet || e.damage <= 0 || woaReflected.has(a(() => e.damageSource.damagingProjectile?.id))) return 1;
    let o = Be.currentTick,
        i = woaAttackHit(t, r, n, o),
        s = 1 + woa.attackBonus * i;
    return i > 0 && woaWound(n, o, i), i >= 1 && (s *= woaPierce(n, e.damageSource.cause)), s * woaCounterUse(t, r, n, o);
}
function woaWound(e, t, n) {
    let r = a(() => e.id),
        o = Math.min(1, woa.healCut * n);
    if (!r || o <= 0) return;
    let i = woaWounds.get(r),
        s = i && i.until >= t;
    if (
        (woaWounds.set(r, {
            until: t + woa.healCutTicks,
            cut: s ? Math.max(i.cut, o) : o,
            fxAt: s ? i.fxAt : -1e9,
            acct: s ? i.acct : 0,
            acctAt: s ? i.acctAt : -1e9,
        }),
        woaWounds.size > 128)
    )
        for (let [c, d] of woaWounds) d.until < t && woaWounds.delete(c);
}
function woaHealFx(e, t, n) {
    n - t.fxAt >= woa.healFxGap &&
        ((t.fxAt = n),
        Be.run(() => {
            e.isValid && (v(e.dimension, I.healSever, pe(e)), v(e.dimension, I.healCrackle, pe(e)));
        }));
}
function woaHealAcct(e, t) {
    return t - e.acctAt <= woa.healAcctTicks ? e.acct : 0;
}
function woaHealthUp(e) {
    if (woaWounds.size === 0) return;
    let t = e.newValue - e.oldValue;
    if (!(t > 0)) return;
    let n = e.entity,
        r = a(() => n.id),
        o = r ? woaWounds.get(r) : void 0;
    if (!o) return;
    let i = Be.currentTick;
    if (o.until < i) {
        woaWounds.delete(r);
        return;
    }
    let s = woaHealAcct(o, i),
        c = Math.min(t, s);
    o.acct = s - c;
    let d = (t - c) * o.cut;
    d < 0.01 ||
        k(n) ||
        (woaHealFx(n, o, i),
        Be.run(() => {
            if (!n.isValid) return;
            let u = a(() => n.getComponent("minecraft:health"));
            u && u.currentValue - d >= 1 && a(() => u.setCurrentValue(u.currentValue - d));
        }));
}
function woaHealCut(e) {
    if (woaWounds.size === 0) return;
    let t = e.healedEntity,
        n = a(() => t.id),
        r = n ? woaWounds.get(n) : void 0;
    if (!r) return;
    let o = Be.currentTick;
    if (r.until < o) {
        woaWounds.delete(n);
        return;
    }
    if (e.cancel || e.healing <= 0) return;
    if (e.healSource.cause !== "TotemOfUndying") {
        let i = e.healing * (1 - r.cut);
        i <= 0.001 ? (e.cancel = !0) : (e.healing = i), woaHealFx(t, r, o);
    }
    e.cancel || ((r.acct = woaHealAcct(r, o) + e.healing), (r.acctAt = o));
}
function woaBurnAttacker(e, t, n) {
    if (e.damageSource.cause !== nr.entityAttack) return;
    let r = a(() => e.damageSource.damagingEntity);
    !r ||
        a(() => r.id) === t.id ||
        !p_.some((o) => woaFull(n, o)) ||
        Be.run(() => {
            r.isValid && a(() => r.setOnFire(woa.burnSeconds, !0));
        });
}
function woaNullified(e, t, n, r, o, i) {
    let s = e.damageSource,
        c = Gu(e) ? gn(s) : void 0,
        d = a(() => s.damagingProjectile);
    if ((c && a(() => c.id) === t.id && (c = void 0), c && (n.counter = { id: c.id, until: i + woa.counterTicks }), c && d)) {
        let u = a(() => d.getVelocity()),
            m = { entity: d, type: a(() => d.typeId), speed: u ? Math.hypot(u.x, u.y, u.z) : 0 };
        Be.run(() => woaReflect(t, c, o, m));
    }
    r === "env:fall" && o >= woa.quakeMinDamage && Be.run(() => woaQuake(t, o));
}
function woaReflectDrop(e) {
    let t = woaReflected.get(e);
    t && (woaReflected.delete(e), a(() => t.isValid && t.remove()));
}
function woaReflectShoot(e, t, r, o, i) {
    let s = t.type;
    if (!s || !woa.reflectTypes.has(s)) return !1;
    let c = Math.max(woa.reflectSpeedMin, Math.min(woa.reflectSpeedMax, t.speed)),
        d = { x: r.x + o.x, y: r.y + 0.3 + o.y, z: r.z + o.z },
        u = e.dimension,
        m = a(() => u.spawnEntity(s, d));
    if (!m) return !1;
    let b = a(() => m.getComponent("minecraft:projectile")),
        y = b ? Math.min(1, Math.max(0, a(() => b.gravity) ?? 0) * Math.min(60, i / c) * 0.5) : 0;
    if (!b || a(() => ((b.owner = e), b.shoot({ x: o.x * c, y: o.y * c + y, z: o.z * c }), !0)) !== !0)
        return a(() => m.remove()), !1;
    let K = m.id;
    woaReflected.set(K, m), Be.runTimeout(() => woaReflectDrop(K), woa.reflectLife);
    for (let U = 0.6; U < 3.2; U += 1.2)
        fxDir(u, I.reflectBolt, { x: d.x + o.x * U, y: d.y + o.y * U, z: d.z + o.z * U }, "variable.ward_dir", o);
    return (v(u, I.guardFlash, d), v(u, I.ringPopGold, d)), z(u, "xvoid.guard.catch", d, 1.2, 0.8), a(() => t.entity.isValid && t.entity.remove()), !0;
}
function woaReflect(e, t, n, r) {
    if (!e.isValid || !t.isValid || e.dimension.id !== t.dimension.id) return;
    let i = pe(e),
        s = pe(t),
        c = { x: s.x - i.x, y: s.y - i.y, z: s.z - i.z },
        d = Math.hypot(c.x, c.y, c.z);
    if (d < 0.5 || d > woa.reflectRange) return;
    let u = { x: c.x / d, y: c.y / d, z: c.z / d };
    woaReflectShoot(e, r, i, u, d) || woaReflectDamage(e, t, n, i, s, u, d);
}
function woaReflectDamage(e, t, n, r, o, c, s) {
    let d = e.dimension;
    for (let u = 1; u < s; u += 1.5)
        fxDir(d, I.reflectBolt, { x: r.x + c.x * u, y: r.y + c.y * u, z: r.z + c.z * u }, "variable.ward_dir", c);
    v(d, I.goldHit, o), v(d, I.kickRing, o), v(d, I.shatterGold, o), v(d, I.arcs, o), (woaQuiet = !0);
    try {
        a(() => t.applyDamage(Math.max(1, n * woa.reflectRatio), { cause: nr.magic, damagingEntity: e }));
    } finally {
        woaQuiet = !1;
    }
}
function woaQuake(e, t) {
    if (!e.isValid) return;
    let n = e.dimension,
        r = e.location,
        o = Re(e, 0.08),
        i = Math.min(woa.quakeMaxDamage, t * woa.quakeDamageRatio),
        s =
            a(() =>
                n.getEntities({
                    location: r,
                    maxDistance: woa.quakeRadius,
                    excludeFamilies: ["inanimate"],
                    excludeTypes: ["minecraft:item", "minecraft:xp_orb"],
                })
            ) ?? [];
    v(n, I.quakeRing, o), v(n, I.quakeDust, o), v(n, I.quakeCrack, o), v(n, I.groundFlash, o), v(n, I.ringWave, o), v(n, I.dust, o), z(n, "mace.smash_ground", r, 0.9, 0.9), Xe(e, "kick"), (woaQuiet = !0);
    try {
        for (let c of s) {
            if (c.id === e.id || vu(c) || !a(() => c.getComponent("minecraft:health"))) continue;
            if ((a(() => c.applyDamage(i, { cause: nr.magic, damagingEntity: e })), !c.isValid)) continue;
            let d = ct(c);
            a(() => c.applyKnockback(at(r, c.location, woa.quakeKnockback * d), woa.quakeLift * d));
        }
    } finally {
        woaQuiet = !1;
    }
}
function Qu(e, t, n) {
    if (!R(t.id)) return;
    let r = ee(t),
        o = Dt(r),
        i = i_(o),
        s = Et(n.typeId),
        c = s ? Je(s) : St(n.typeId),
        d = r.map.get(c),
        u = d && d.s > 0 ? on.maxBonus * Math.min(1, d.s / d.n) : 0,
        m = a_(e, n) ? V(t).melee : 1,
        b = woaOffense(e, t, n, r);
    (i <= 0 && u <= 0 && m === 1 && b === 1) || (e.damage = e.damage * (1 + i) * (1 + u) * m * b);
}
function Zu(e, t) {
    Pa(e, t);
    let n = xe(t);
    if (!n) return;
    let r = ee(e),
        o = Be.currentTick;
    if (o - r.shieldTick <= rn.effectWindow) return { kind: "blocked" };
    let i = Yt(r, n);
    if (((r.hudKey = n.key), (r.hudKeyAt = o), i.s >= i.n)) return (i.used = Date.now()), { kind: "nullified" };
    let s = { kind: "partial", s: i.s, n: i.n };
    if (
        ((r.recentEffects = r.recentEffects.filter((d) => o - d.tick <= rn.effectWindow)),
        r.recentEffects.push({ typeId: t, tick: o }),
        !Wr(t))
    )
        return s;
    oi(r, n.key, 2, 0, o, or(e));
    let c = r.pending.get(n.key);
    return c && (c.lastPulse = o), s;
}
function ef(e) {
    let t = k(e.entity);
    if (!t) return;
    let n = Kn(e.effectType);
    if (n === void 0) {
        return;
    }
    if (Gn(t.id, n) || Po(t.id, n) || !R(t.id)) return;
    let r = e.duration,
        o = Zu(t, n);
    if (!o) return;
    let i = Be.currentTick;
    if (o.kind !== "partial") {
        e.cancel = !0;
        return;
    }
    if (r < 0) {
        return;
    }
    e.duration = Math.max(1, Math.round(r * (1 - ie.partialMax * (o.s / o.n))));
}
function tf(e) {
    let t = k(e.entity);
    if (!t) return;
    let n = e.effect;
    if (!n.isValid) {
        return;
    }
    let r = n.displayName;
    if (Kn(r) !== void 0) return;
    let o = Io(n.typeId);
    if (Gn(t.id, o) || Po(t.id, o) || !R(t.id)) return;
    let i = Zu(t, o);
    if (i) {
        if (i.kind !== "partial") {
            t.removeEffect(o);
            return;
        }
    }
}
function s_(e, t, n) {
    let r = n % ko === 0,
        o = a(
            () =>
                e.getComponent(
                    "minecraft:health"
                )?.currentValue
        );
    if (yc(o)) {
        r && void 0;
        return;
    }
    let i = a(() => e.getEffects()) ?? [];
    for (let s of i) {
        let c = a(() => s.typeId);
        if (!c) continue;
        let d = xe(c);
        if (!d) continue;
        let u = { amplifier: s.amplifier, duration: s.duration };
        if (rt(e, c, u) || Gn(e.id, c)) continue;
        let m = t.map.get(d.key);
        if (m && m.s >= m.n) {
            (m.used = Date.now()), a(() => e.removeEffect(c));
            continue;
        }
        if (!r) continue;
        let b = Yt(t, d),
            y = ri(t, d.key);
        (y.activeLeft = Le), bc(n, y.lastPulse) && ((y.lastPulse = n), oi(t, d.key, 2, 0, n, or(e), "pulse"), void 0);
    }
}
function nf(e) {
    if (!R(e.id)) return;
    kc(e);
    let t = ee(e);
    (t.lastKey = void 0),
        (t.hudKey = void 0),
        Lo(e),
        (t.graceUntil = 0),
        (t.firstSpin = void 0),
        (t.landing = void 0),
        (t.lastTurn = void 0);
}
function ju(e) {
    let t,
        n = -1,
        r,
        o = -1;
    for (let [i, s] of e.pending) {
        let c = e.map.get(i);
        if (!c || c.s >= c.n) {
            e.pending.delete(i);
            continue;
        }
        gc(s, c.n) && s.weight > n && ((n = s.weight), (t = i)), He(s) && s.p > o && ((o = s.p), (r = i));
    }
    return { ready: t, watching: r };
}
function rr(e, t) {
    let n = e.map.get(t);
    return !n || n.s >= n.n ? !1 : n.s > 0 || (e.pending.get(t)?.p ?? 0) > 0;
}
function c_(e, t) {
    let n = e.map.get(t);
    return !!n && n.s >= n.n;
}
function d_(e) {
    if (e.hudKey && rr(e, e.hudKey)) return e.hudKey;
    let t,
        n = -1;
    for (let [r, o] of e.map) {
        if (!rr(e, r)) continue;
        let i = o.s * 1e3 + (e.pending.get(r)?.p ?? 0);
        i > n && ((n = i), (t = r));
    }
    return t;
}
function rf(e, t) {
    if (!t || !rr(e, t)) return !1;
    let n = e.pending.get(t);
    return !n || !He(n);
}
function of(e, t) {
    return !!t && !!e.landing?.full && e.landing.key === t;
}
function ai(e) {
    let t = e.landing?.key ?? e.firstSpin?.key;
    return t && e.map.has(t) ? t : void 0;
}
function u_(e, t, n) {
    let r = ai(e);
    if (r)
        return {
            key: r,
            from: "spinning",
        };
    let o = e.hudKey && e.map.has(e.hudKey) && n - e.hudKeyAt <= Eo ? e.hudKey : void 0;
    if (o && !c_(e, o))
        return {
            key: o,
            from: "latest-hit",
        };
    if (t) return { key: t, from: "progress" };
    if (o) return { key: o, from: "latest-hit" };
    if (e.lastKey && n - e.lastKeyAt <= Eo) return { key: e.lastKey, from: "last" };
    let i = d_(e);
    return i ? { key: i, from: "paused" } : { key: void 0, from: void 0 };
}
function af(e) {
    let t = ee(e),
        n = ai(t),
        r = [];
    for (let [o, i] of t.map)
        r.push({
            key: o,
            entry: i,
            hits: t.pending.get(o)?.p ?? 0,
            need: Ze(i.n),
            paused: rf(t, o),
            spinning: n === o,
            completing: of(t, o),
        });
    return (r.atk = woaAtkList(t)), r;
}
function f_(e, t) {
    let n = 0;
    for (let r of e.map.keys()) r !== t && rr(e, r) && n++;
    return n;
}
function m_(e) {
    if (X.has(e.id)) return "sword";
    let t = a(() => e.getComponent("minecraft:equippable")?.getEquipment(Nh.Mainhand)?.typeId);
    return t && P.has(t) ? "barehand" : void 0;
}
function l_(e, t, n, r) {
    let o = u_(t, r, n),
        i = o.key;
    i !== t.hudShown && ((t.hudShown = i), void 0);
    let s = i ? t.map.get(i) : void 0,
        c = i ? t.pending.get(i) : void 0,
        d = X.has(e.id) ? Math.max(0, (tt.get(e.id) ?? 0) - n) : void 0,
        u = zd(e, n),
        m = pu(e, n),
        b = Vu(e, n);
    return {
        adapted: Dt(t),
        atk: woaHudAtk(t, n, !!s),
        slots: ie.useSlots ? ie.slots : void 0,
        key: s ? i : void 0,
        entry: s,
        hits: c?.p ?? 0,
        need: s ? Ze(s.n) : 0,
        paused: s ? rf(t, i) : !1,
        completing: of(t, i),
        spinning: !!i && ai(t) === i,
        others: f_(t, s ? i : void 0),
        swordTicks: d,
        dashTicks: u,
        kickTicks: m,
        blastTicks: b,
        hand: m_(e),
        undyingTicks: Math.max(0, Kt(e, n) - n),
        moveMsg: us(e.id, n, { dash: u, kick: m, airBlast: b, slash: d }),
        modeRefused: fs(e.id, n),
        active: !!r || vt(e.id, n),
        motion: xs(e.id, n),
        mode: E(e),
        modeCooldown: Ds(e, n),
    };
}
function sf(e, t) {
    let n = ee(e);
    Gh(e, n, t), Jh(e, n, t), Xh(e, n, t), s_(e, n, t), Hh(e, n, t);
    let r = ju(n);
    r.ready &&
        t - n.lastSpin >= C.spinInterval &&
        (Wh(e)
            ? t >= (ni.get(e.id) ?? 0) && (ni.set(e.id, t + 200), T(e, "starving", S.starving))
            : (Yh(e, n, r.ready, t), (r = ju(n)))),
        n.dirty && t % 100 === 0 && ((n.dirty = !1), a(() => Dn(e, n))),
        rs(e, l_(e, n, t, r.watching), t);
}
function si(e) {
    ni.delete(e);
}
var p_ = ["env:fire", "env:soul_fire", "env:lava", "env:magma", "env:sulfur_cube_magma"],
    cf = [
        {
            name: "waterBreathing",
            effect: "minecraft:water_breathing",
            triggers: ["env:drowning"],
            addTicks: 60,
            refreshTicks: 40,
        },
        {
            name: "nightVision",
            effect: "minecraft:night_vision",
            triggers: ["effect:darkness", "effect:blindness"],
            addTicks: 600,
            refreshTicks: 400,
        },
        {
            name: "fireRes",
            effect: "minecraft:fire_resistance",
            triggers: p_,
            addTicks: 60,
            refreshTicks: 40,
        },
    ];
function g_(e, t) {
    return e.amplifier === 0 && e.duration >= 0 && e.duration <= t.addTicks;
}
function df(e, t, n) {
    return e
        ? t
            ? t.duration < 0
                ? "keep"
                : t.duration <= n.refreshTicks
                  ? "give"
                  : "keep"
            : "give"
        : t && g_(t, n)
          ? "remove"
          : "keep";
}
function uf(e, t) {
    return e.triggers.find(t);
}
function ff(e, t) {
    if (!t.wearing) return "wheel off";
    if (e.name === "waterBreathing" && !t.inWater) return "out of water";
    if (e.name === "nightVision" && (t.light === void 0 || t.light > 7))
        return `light ${t.light ?? "?"}`;
}
var mf = 6,
    lf = ["env:starvation", "effect:hunger"];
function pf(e, t) {
    return e < t ? t : void 0;
}
function h_(e, t) {
    let n = a(() => e.getEffect(t));
    return n ? { amplifier: n.amplifier, duration: n.duration } : void 0;
}
function __(e) {
    return a(() => e.dimension.getLightLevel(e.getHeadLocation()));
}
function b_(e, t, n, r) {
    try {
        e.addEffect(t.effect, t.addTicks, { amplifier: 0, showParticles: !1 });
    } catch (o) {
        A(`rewards.${t.name}`, o, { effect: t.effect });
    }
}
function y_(e, t) {
    try {
        let n =
            e.getComponent(
                "minecraft:player.hunger"
            );
        if (!n) return;
        let r = n.currentValue,
            o = pf(r, mf);
        if (o === void 0) return;
        n.setCurrentValue(o);
    } catch (n) {
        A(
            "rewards.saturation",
            n,
            { trigger: t }
        );
    }
}
function hf(e) {
    let t = R(e.id),
        n = t ? ee(e) : void 0,
        r = (s) => {
            let c = n?.map.get(s);
            return !!c && c.s >= c.n;
        },
        o = { wearing: t, inWater: e.isInWater, light: void 0 };
    for (let s of cf) {
        let c = t ? uf(s, r) : void 0;
        s.name === "nightVision" && c && (o.light = __(e));
        let d = c ? ff(s, o) : "not adapted",
            u = h_(e, s.effect),
            m = df(d === void 0, u, s);
        m === "give" && c && b_(e, s, c, u),
            m ===
                "remove" &&
                u &&
                (a(() => e.removeEffect(s.effect)), void 0);
    }
    let i = t ? lf.find(r) : void 0;
    i && y_(e, i);
}
import { EquipmentSlot as ir, ItemLockMode as k_, ItemStack as S_, world as Ef } from "@minecraft/server";
var x_ = { switcher: 5, sword: 6, barehand: 6 };
function E_(e) {
    if (Z.has(e)) return "switcher";
    if (Se.has(e)) return "sword";
    if (P.has(e)) return "barehand";
}
function Xt(e) {
    let t = E_(e);
    return t ? Array.from({ length: x_[t] }, (n, r) => `woa.lore.${t}.${r + 1}`) : [];
}
function _f(e) {
    let t = Xt(e.typeId);
    if (!t.length) return e;
    try {
        e.setLore(t.map((n) => ({ translate: n })));
    } catch (n) {
        A("lore.set", n, { item: e.typeId });
    }
    return e;
}
function bf(e, t = 0) {
    return !e.locked && !e.keepOnDeath && e.loreLines === t;
}
function yf(e, t) {
    if (!e) return { keep: void 0, remove: t.map((r) => r.where), give: !1 };
    if (!t.length) return { keep: void 0, remove: [], give: !0 };
    let n = (t.find((r) => r.plain) ?? t[0]).where;
    return { keep: n, remove: t.filter((r) => r.where !== n).map((r) => r.where), give: !1 };
}
function ci(e, t) {
    return t || e % 20 === 0;
}
function xf(e) {
    let t = [];
    for (let n = -e; n <= e; n++)
        for (let r = -e; r <= e; r++) for (let o = -e; o <= e; o++) t.push({ x: n, y: r, z: o });
    return t;
}
var If = new Set([...Se, ...P]);
function w_(e) {
    return a(() => e.getComponent("minecraft:inventory")?.container?.getItem(e.selectedSlotIndex)?.typeId);
}
function vf(e) {
    return so(E(e), yo(e), w_(e), If);
}
var Tf = [{ ids: If, want: Cn }, { ids: Z, want: vf }, ...[...Ft].map((e) => ({ ids: new Set([e]), want: () => e, armor: !0 }))],
    $f = new Set(Tf.flatMap((e) => [...e.ids])),
    I_ = [ir.Offhand, ir.Chest, ir.Legs, ir.Feet],
    v_ = xf(6);
function kf(e) {
    return _f(new S_(e, 1));
}
function Af(e) {
    let t = a(() => e.getLore().length) ?? 0,
        n = Xt(e.typeId).length,
        r = bf({ locked: e.lockMode !== k_.none, keepOnDeath: e.keepOnDeath, loreLines: t }, n);
    return !r && t !== n && void 0, r;
}
function T_(e, t) {
    let n = [],
        r = new Map(),
        o = (c, d) => {
            !d || !t.has(d.typeId) || (n.push({ where: c, plain: Af(d) }), r.set(c, d));
        },
        i = e.getComponent("minecraft:inventory")?.container;
    if (i) for (let c = 0; c < i.size; c++) o(`slot:${c}`, i.getItem(c));
    let s = e.getComponent("minecraft:equippable");
    for (let c of I_)
        o(
            `equip:${c}`,
            a(() => s?.getEquipment(c))
        );
    return (
        o(
            "cursor",
            a(() => e.getComponent("minecraft:cursor_inventory")?.item)
        ),
        { copies: n, items: r }
    );
}
function Sf(e, t, n) {
    let [r, o] = t.split(":");
    if (r === "slot") {
        let i = e.getComponent("minecraft:inventory")?.container;
        return !!a(() => (i?.setItem(Number(o), n), !0));
    }
    return r === "equip"
        ? !!a(() => e.getComponent("minecraft:equippable")?.setEquipment(o, n))
        : r === "cursor"
          ? !!a(() => (n ? !1 : (e.getComponent("minecraft:cursor_inventory")?.clear(), !0)))
          : !1;
}
function $_(e, t, n) {
    let r = e.location,
        o = 0;
    for (let i of v_) {
        let s = { x: Math.floor(r.x) + i.x, y: Math.floor(r.y) + i.y, z: Math.floor(r.z) + i.z },
            c = a(() => e.dimension.getBlock(s)?.getComponent("minecraft:inventory")?.container);
        if (c)
            for (let d = 0; d < c.size; d++) {
                let u = c.getItem(d)?.typeId;
                if (!u || !t.has(u)) continue;
                let m = !!a(() => (c.setItem(d, void 0), !0));
                o++;
            }
    }
}
function A_(e, t, n) {
    let r = t.want(e),
        { copies: o, items: i } = T_(e, t.ids),
        s = yf(n, o);
    for (let m of s.remove) {
        let b = Sf(e, m, void 0);
    }
    let c = s.keep ? i.get(s.keep) : void 0;
    if (s.keep && c && (!Af(c) || c.typeId !== r)) {
        let m = Sf(e, s.keep, kf(r));
    }
    if (!s.give) return !0;
    let d = e.getComponent("minecraft:inventory")?.container;
    if (!d || d.emptySlotsCount === 0) return !1;
    $_(e, t.ids, r);
    let u = a(() => d.addItem(kf(r)));
    return !0;
}
function Ve(e, t) {
    let n = Tf.filter((r) => !A_(e, r, t && !(r.armor && woaArmorOff(e))));
    n.length && (T(e, "inventoryFull", S.inventoryFull), void 0);
}
function Rf(e) {
    In((t, n) => {
        let r = e(t);
        Ve(t, r);
    }),
        oc((t) => {
            let n = e(t);
            Ve(t, n);
        }),
        Vs((t) => {
            let n = e(t);
            Ve(t, n);
        }),
        Ef.afterEvents.playerHotbarSelectedSlotChange.subscribe((t) => {
            let n = t.player;
            e(n) && a(() => Ve(n, !0));
        }),
        Ef.afterEvents.playerInventoryItemChange.subscribe((t) => {
            let n = t.itemStack?.typeId;
            if (!n || !$f.has(n)) return;
            let r = e(t.player);
            a(() => Ve(t.player, r));
        });
}
function Pf(e) {
    if (e.typeId !== "minecraft:item") return;
    let t = a(() => e.getComponent("minecraft:item")?.itemStack);
    if (!t || !$f.has(t.typeId)) return;
    let n = e.location;
    e.remove();
}
import { CommandPermissionLevel as C_, CustomCommandStatus as Nf, system as O_ } from "@minecraft/server";
import { ActionFormData as D_, FormCancelationReason as N_ } from "@minecraft/server-ui";
var Mf = "woa:list";
function Cf(e) {
    return Math.max(1, Math.min(8, Math.round(e.n)));
}
function Of(e) {
    return e.entry.s >= e.entry.n;
}
function R_(e) {
    return !Of(e) && (e.spinning || e.entry.s > 0 || e.hits > 0);
}
function di(e) {
    return { analysing: e.filter(R_), adapted: e.filter(Of).reverse() };
}
function Df(e) {
    let t = e.analysing
        .map((n) => `${n.key}:${n.entry.s}/${n.entry.n}${n.spinning ? ",spinning" : n.paused ? ",paused" : ""}`)
        .join(" ");
    return `analysing=${e.analysing.length}${t ? ` [${t}]` : ""} adapted=${e.adapted.length}`;
}
var _e = {
    title: p("woa.list.title"),
    analysing: (e) => p("woa.list.analysing", String(e)),
    adapted: (e) => p("woa.list.adapted", String(e)),
    paused: x(" \xA77", p("woa.list.paused")),
    emptyAnalysing: x("\xA77", p("woa.list.empty_analysing")),
    emptyAdapted: x("\xA77", p("woa.list.empty_adapted")),
    close: p("woa.list.close"),
    attack: (e) => p("woa.list.attack", String(e)),
    emptyAttack: x("\xA77", p("woa.list.empty_attack")),
    pierce: x(" \xA76\xB7 ", p("woa.list.pierce")),
    tier: (e) => x("\xA76", p(`woa.tier.${Cf(e)}`)),
};
function Lf(e) {
    return x(`\xA7r${Ee(e.key)} \xA7f`, Qr(e.key), " ", _e.tier(e.entry));
}
function L_(e) {
    let t = to({ ...e, others: 0 });
    return x(
        Lf(e),
        `
`,
        t,
        ...(e.paused && !e.spinning ? [_e.paused] : [])
    );
}
function woaListAtk(e) {
    let t = e.entry.s >= e.entry.n,
        r = Math.round(Math.min(1, (woa.healCut * e.entry.s) / e.entry.n) * 100),
        n = x(
            `\xA7r${l.sword} ${Ee(e.key)} \xA7f`,
            Qr(e.key),
            ` \xA7${t ? "6" : "a"}+${woaAtkBonus(e)}%` + (r > 0 ? ` \xA7r${l.heartDim}\xA7c-${r}%` : "")
        );
    return t
        ? x(n, _e.pierce)
        : x(
              n,
              `
`,
              to(e)
          );
}
function H_(e) {
    let t = di(e),
        n = new D_().title(_e.title).header(_e.analysing(t.analysing.length));
    t.analysing.length || n.label(_e.emptyAnalysing);
    for (let r of t.analysing) n.label(L_(r));
    n.divider().header(_e.adapted(t.adapted.length)), t.adapted.length || n.label(_e.emptyAdapted);
    for (let r of t.adapted) n.label(Lf(r));
    let o = e.atk ?? [];
    n.divider().header(_e.attack(o.length)), o.length || n.label(_e.emptyAttack);
    for (let r of o) n.label(woaListAtk(r));
    return n.button(_e.close);
}
function Hf(e, t, n = 0) {
    let r = t();
    H_(r)
        .show(e)
        .then((o) => {
            if (o.cancelationReason === N_.UserBusy && n < 20) {
                le(
                    "list.retry",
                    10,
                    () => {
                        e.isValid && Hf(e, t, n + 1);
                    }
                );
                return;
            }
        })
        .catch((o) => A("list.show", o, { player: e.name }));
}
function Kf(e) {
    O_.beforeEvents.startup.subscribe((t) => {
        t.customCommandRegistry.registerCommand(
            {
                name: Mf,
                description:
                    "Wheel of Adaptation: list your adaptations (in analysis and adapted)",
                permissionLevel: C_.Any,
                cheatsRequired: !1,
            },
            qe("list.command", (n) => {
                let r = k(n.sourceEntity);
                return r
                    ? (q("list.run", () => Hf(r, () => e(r))), { status: Nf.Success })
                    : { status: Nf.Failure, message: "Run it as a player" };
            })
        );
    });
}
import {
    EntityDamageCause as K_,
    EntitySwingSource as F_,
    EquipmentSlot as z_,
    system as Ff,
    world as B_,
} from "@minecraft/server";
var ar = new Map(),
    ui = new Map();
function V_(e) {
    let t = a(() => e.getComponent("minecraft:equippable")?.getEquipment(z_.Mainhand)?.typeId);
    return !!t && P.has(t);
}
function W_(e, t) {
    if (!t.isValid) return;
    let n = ct(t),
        r = at(e.location, t.location, Ie.knockback * n);
    a(() => t.applyKnockback(r, Ie.lift * n));
}
function zf(e, t, n) {
    if (e.damageSource.cause !== K_.entityAttack || !V_(t)) return;
    let r = Ff.currentTick;
    if (Y(t.id, r)) {
        e.cancel = !0;
        return;
    }
    if (!Gd(ar.get(t.id), r)) {
        e.cancel = !0;
        return;
    }
    ar.set(t.id, r);
    let o = e.damage;
    e.damage = Ie.damage;
    let i = n.location;
    q("punch.hitFx", () => {
        a(() => fxSpawn(t.dimension, Vd, { x: i.x, y: i.y + 1, z: i.z })),
            v(t.dimension, I.punchBurst, { x: i.x, y: i.y + 1, z: i.z }),
            v(t.dimension, I.impactIce, { x: i.x, y: i.y + 1, z: i.z }),
            v(t.dimension, I.ringPopIce, { x: i.x, y: i.y + 1, z: i.z }),
            a(() => t.dimension.playSound(Uo, i)),
            W_(t, n);
    });
}
function U_(e, t, n) {
    if (t !== F_.Attack || !n || !P.has(n)) return;
    let r = Ff.currentTick;
    if (Y(e.id, r) || !Wd(ui.get(e.id), r)) return;
    ui.set(e.id, r);
    let o =
        a(
            () => (
                e.playAnimation(it.name, {
                    controller: it.controller,
                    stopExpression: it.stop,
                    blendOutTime: it.blendOut,
                }),
                !0
            )
        ) === !0;
}
function Bf() {
    B_.afterEvents.playerSwingStart.subscribe((e) => {
        a(() => U_(e.player, e.swingSource, e.heldItemStack?.typeId));
    });
}
function Vf(e) {
    ar.delete(e), ui.delete(e);
}
import { EntityDamageCause as tm, EquipmentSlot as q_, system as Zt, world as sr } from "@minecraft/server";
var G_ = { attack: 0.3, balance: 0.5, defense: 0.5 },
    mi = { attack: 0.55, balance: 0.55, defense: 1 },
    Wf = "xvoid.guard.block",
    Uf =
        "xvoid.guard.catch",
    Gf = {
        name: "animation.barehand.guard",
        short: "xvoid_guard",
        controller: "controller.animation.xvoid.barehand_guard",
        controllerShort:
            "xvoid_guard_controller",
    };
var jf = "xvoid:guard_spark",
    qf = "xvoid:guard_catch",
    Yf = new Set(["minecraft:thrown_trident"]),
    fi = 0.001,
    li = 20;
function Xf(e, t) {
    return e === void 0 ? 0 : Math.max(0, e + li - t);
}
function pi(e, t, n) {
    return e.x * (n.x - t.x) + e.z * (n.z - t.z) > 0;
}
function Jf(e, t) {
    return -(e.x * t.x + e.z * t.z) > 0;
}
function Qf(e, t) {
    return e * (1 - G_[t]);
}
function j_(e, t) {
    return Math.abs(e - t) > fi;
}
var Jt = "xvoid:guard_slow";
function Zf(e, t) {
    return e === void 0 ? "none" : j_(t, e) ? "clear" : "reset";
}
function em(e, t, n) {
    return e > t + fi ? "set" : e < t - fi && n !== void 0 ? "yield" : "keep";
}
var We = new Map(),
    hi = new Map(),
    en = new Map();
function cr(e) {
    return !!e && P.has(e.typeId);
}
function Y_(e) {
    let t = a(() => e.getComponent("minecraft:equippable")?.getEquipment(q_.Mainhand)?.typeId);
    return !!t && P.has(t);
}
function nm(e) {
    let t = a(() => e.getDynamicProperty(Jt));
    return typeof t == "number" ? t : void 0;
}
function gi(e) {
    let t = nm(e);
    if (t === void 0) return;
    let n = a(() =>
        e.getComponent(
            "minecraft:movement"
        )
    );
    if (!n) return;
    let r = Zf(t, n.currentValue);
    if (r === "none") return;
    if ((a(() => e.setDynamicProperty(Jt, void 0)), r === "clear")) {
        return;
    }
    let o = n.currentValue;
    a(() => n.resetToDefaultValue());
}
function rm(e, t) {
    let n = e.location,
        r = t.x - n.x,
        o = t.z - n.z,
        i = Math.hypot(r, o) || 1;
    return { x: n.x + (r / i) * 0.6, y: n.y + 1.3, z: n.z + (o / i) * 0.6 };
}
function X_(e) {
    let t = Zt.currentTick,
        n = Xf(hi.get(e.id), t);
    if (n > 0) {
        return;
    }
    We.set(e.id, t);
}
function Qt(e, t) {
    let n = We.get(e.id);
    if (n === void 0) return;
    We.delete(e.id), hi.set(e.id, Zt.currentTick), gi(e);
    let r = en.get(e.id) ?? 0;
    en.delete(e.id);
}
function om(e) {
    return We.has(e);
}
function im() {
    sr.afterEvents.itemStartUse.subscribe((e) => {
        cr(e.itemStack) && a(() => X_(e.source));
    }),
        sr.afterEvents.itemReleaseUse.subscribe((e) => {
            cr(e.itemStack) && a(() => Qt(e.source, "release"));
        }),
        sr.afterEvents.itemStopUse.subscribe((e) => {
            cr(e.itemStack) && a(() => Qt(e.source, "stop"));
        }),
        sr.afterEvents.itemCompleteUse.subscribe((e) => {
            cr(e.itemStack) && a(() => Qt(e.source, "complete"));
        });
}
function am(e) {
    if (!We.has(e.id)) {
        gi(e);
        return;
    }
    if (!Y_(e)) {
        Qt(e, "item left the hand");
        return;
    }
    let t = mi[E(e)];
    if (t >= 1) {
        gi(e);
        return;
    }
    let n = a(() => e.getComponent("minecraft:movement"));
    if (!n) return;
    let r = n.defaultValue * t,
        o = nm(e),
        i = em(n.currentValue, r, o);
    if (i === "keep") return;
    let s = n.currentValue;
    if (i === "yield") {
        a(() => e.setDynamicProperty(Jt, void 0));
        return;
    }
    if ((a(() => n.setCurrentValue(r)), a(() => e.setDynamicProperty(Jt, r)), o !== void 0)) {
        en.set(e.id, (en.get(e.id) ?? 0) + 1);
        return;
    }
}
function J_(e, t, n) {
    let r = t.getViewDirection(),
        o = a(() => n.getVelocity()),
        i = e.damageSource.damagingEntity;
    if (!(o && Math.hypot(o.x, o.z) > 0.01 ? Jf(r, o) : !!i && pi(r, t.location, i.location))) {
        return;
    }
    e.cancel = !0;
    let c = n.typeId,
        d = Yf.has(c),
        u = rm(t, n.location);
    Zt.run(() => {
        a(() => t.dimension.playSound(Uf, t.location)),
            a(() => fxSpawn(t.dimension, qf, u)),
            (v(t.dimension, I.guardFlash, u), v(t.dimension, I.ringPopGold, u)),
            !d && n.isValid && a(() => n.remove());
    });
}
function Q_(e, t, n) {
    if (!pi(t.getViewDirection(), t.location, n.location)) {
        return;
    }
    let r = E(t),
        o = e.damage;
    e.damage = Qf(o, r);
    let i = rm(t, n.location);
    Zt.run(() => {
        a(() => t.dimension.playSound(Wf, t.location)), a(() => fxSpawn(t.dimension, jf, i)), (v(t.dimension, I.guardFlash, i), v(t.dimension, I.ringPopGold, i));
    });
}
function sm(e, t) {
    if (!We.has(t.id)) return;
    let n = e.damageSource;
    if (n.cause === tm.projectile && n.damagingProjectile) {
        J_(e, t, n.damagingProjectile);
        return;
    }
    n.cause === tm.entityAttack && n.damagingEntity && Q_(e, t, n.damagingEntity);
}
function cm(e) {
    Qt(e, "reset");
}
function dm(e) {
    We.delete(e), hi.delete(e), en.delete(e);
}
import { EquipmentSlot as Ue, GameMode as lb, ItemLockMode as Ge, ItemStack as pb } from "@minecraft/server";
var _i = "novelty:xvoid:wheel_of_adaptation",
    um = { keepOnDeath: !0, locked: !1 };
function fm(e, t, n) {
    return e !== n.locked || t !== n.keepOnDeath;
}
function mm(e, t, n, r) {
    for (let o of e) if (t(o)) return !0;
    return n.includes(r);
}
import { system as mb, world as xm } from "@minecraft/server";
import {
    CommandPermissionLevel as hm,
    CustomCommandParamType as _m,
    CustomCommandStatus as ur,
    PlayerPermissionLevel as db,
    system as bm,
} from "@minecraft/server";
import { PlayerPermissionLevel as Z_, system as eb } from "@minecraft/server";
import { FormCancelationReason as tb, ModalFormData as nb } from "@minecraft/server-ui";
var lm = {
        mode: "woa.config.mode",
        cut: "woa.config.cut",
        keepOnDeath: "woa.config.keep_on_death",
        lowFx: "woa.config.low_fx",
    },
    J = {
        title: p("woa.config.title"),
        save: p("woa.config.save"),
        opsOnly: x(B("cross"), " \xA7c", p("woa.config.ops_only")),
        itemGiven: x(B("checkMark"), " \xA7a\xA7l", p("woa.config.item_given")),
        starter: p("woa.config.mode.starter"),
        crafting:
            p(
                "woa.config.mode.crafting"
            ),
        label: (e) => p(lm[e]),
        value: (e, t) => {
            let n = t[e];
            return e === "mode" ? p(`woa.config.mode.${n}`) : p(n ? "woa.config.on" : "woa.config.off");
        },
        chatValue: (e, t) => {
            let n = t[e];
            return e === "mode"
                ? p(`woa.config.value.${n}`)
                : p(
                      n
                          ? "woa.config.on"
                          : "woa.config.off"
                  );
        },
        changed: (e, t, n) => x("\xA7p\xA7l[WoA]\xA7r ", p("woa.config.changed", e, p(lm[t]), J.chatValue(t, n))),
    };
var dr = !1,
    rb = 10,
    ob = 20;
function ib(e) {
    return e.playerPermissionLevel === Z_.Operator;
}
function ab() {
    let e = Ut();
    return new nb()
        .title(J.title)
        .dropdown(J.label("mode"), [J.starter, J.crafting], { defaultValueIndex: ft.indexOf(e.mode) })
        .submitButton(J.save);
}
function sb(e, t) {
    let [n] = t;
    er({ mode: ft[typeof n == "number" ? n : 0] ?? "starter" }, e.name);
}
function tn(e, t = 0) {
    if (!ib(e)) {
        e.sendMessage(J.opsOnly);
        return;
    }
    ab()
        .show(e)
        .then((n) => {
            if (n.cancelationReason === tb.UserBusy && t < ob) {
                eb.runTimeout(() => tn(e, t + 1), rb);
                return;
            }
            !(n.canceled || !n.formValues || !e.isValid) && sb(e, n.formValues);
        })
        .catch((n) => void 0);
}
import { ItemStack as cb } from "@minecraft/server";
var bi = "xvoid:adaptation_config";
function pm(e) {
    let t = e.getComponent("minecraft:inventory")?.container,
        n = new cb(bi, 1),
        r = t ? t.addItem(n) : n;
    r && e.dimension.spawnItem(r, e.location), e.sendMessage(J.itemGiven);
}
function gm(e) {
    e.itemStack.typeId === bi && tn(e.source);
}
var ub = ["open", "item"];
function fb(e) {
    return e === void 0 || e === db.Operator;
}
function ym(e) {
    let t = e.customCommandRegistry;
    t.registerEnum("woa:item_mode", [...ft]),
        dr &&
            (t.registerEnum("woa:config_action", [...ub]),
            t.registerCommand(
                {
                    name: "woa:config",
                    description: "Wheel of Adaptation: open the world settings (open) or get the settings item (item)",
                    permissionLevel: hm.Admin,
                    cheatsRequired: !1,
                    optionalParameters: [{ name: "woa:config_action", type: _m.Enum }],
                },
                (n, r) => {
                    let o = k(n.sourceEntity);
                    return o
                        ? (bm.run(() => (r === "item" ? pm(o) : tn(o))), { status: ur.Success })
                        : { status: ur.Failure, message: "Run this command as a player." };
                }
            )),
        t.registerCommand(
            {
                name: "woa:mode",
                description:
                    "Wheel of Adaptation: item acquisition mode (starter = free items on spawn, crafting = craft them)",
                permissionLevel: hm.Any,
                cheatsRequired: !1,
                mandatoryParameters: [{ name: "woa:item_mode", type: _m.Enum }],
            },
            (n, r) => {
                let o = k(n.sourceEntity),
                    i = o?.playerPermissionLevel,
                    s = fb(i);
                if (!s)
                    return {
                        status: ur.Failure,
                        message:
                            "Only operators can change the item mode.",
                    };
                let c = o?.name ?? n.sourceBlock?.typeId ?? "server";
                return bm.run(() => er({ mode: r }, c)), { status: ur.Success, message: `Item mode: ${r}` };
            }
        );
}
function Em() {
    mb.beforeEvents.startup.subscribe((e) => ym(e)),
        dr &&
            xm.afterEvents.itemUse.subscribe((e) => {
                try {
                    gm(e);
                } catch (t) {}
            }),
        jt((e, t, n) => {
            for (let r of Zo(e, t)) xm.sendMessage(J.changed(n, r, e));
        });
}
var wm = (e) => be.has(e),
    yi = [{ id: Q, owns: wm, rule: um }],
    mr = [Ue.Head, Ue.Chest, Ue.Legs, Ue.Feet, Ue.Offhand];
function gb(e) {
    let t = new Set(),
        n = e.getComponent("minecraft:inventory")?.container;
    if (n)
        for (let i = 0; i < n.size; i++) {
            let s = n.getItem(i);
            s && t.add(s.typeId);
        }
    let r = e.getComponent("minecraft:equippable");
    for (let i of mr) {
        let s = a(() => r?.getEquipment(i));
        s && t.add(s.typeId);
    }
    let o = a(() => e.getComponent("minecraft:cursor_inventory")?.item);
    return o && t.add(o.typeId), t;
}
function hb(e) {
    let t = new pb(e.id, 1);
    return (
        lt.soulbound &&
            ((t.keepOnDeath = e.rule.keepOnDeath),
            (t.lockMode = e.rule.locked ? Ge.inventory : Ge.none),
            a(() => t.setLore([S.soulbound]))),
        t
    );
}
function _b(e, t) {
    let n = e.getComponent("minecraft:inventory")?.container,
        r = n ? n.addItem(t) : t;
    r && e.dimension.spawnItem(r, e.location);
}
function bb(e, t) {
    if (!lt.equipWheel) return !1;
    let n = e.getComponent("minecraft:equippable");
    return !n || n.getEquipment(Ue.Head) ? !1 : n.setEquipment(Ue.Head, t);
}
function fr(e) {
    return yi.some((t) => t.owns(e));
}
function km(e) {
    if (fr(e.typeId) && !(e.lockMode === Ge.none && !e.keepOnDeath))
        return (e.lockMode = Ge.none), (e.keepOnDeath = !1), a(() => e.setLore([])), e;
}
function xi(e) {
    if (!e.isValid) return;
    let t = 0,
        n = e.getComponent("minecraft:inventory")?.container;
    if (n)
        for (let o = 0; o < n.size; o++) {
            let i = n.getItem(o),
                s = i && km(i);
            s && a(() => (n.setItem(o, s), !0)) && t++;
        }
    let r = e.getComponent("minecraft:equippable");
    for (let o of mr) {
        let i = a(() => r?.getEquipment(o)),
            s = i && km(i);
        s && a(() => r?.setEquipment(o, s)) && t++;
    }
}
function Sm(e) {
    let t = yi.find((n) => n.owns(e.typeId));
    if (!(!t || !fm(e.lockMode !== Ge.none, e.keepOnDeath, t.rule)))
        return (e.lockMode = t.rule.locked ? Ge.inventory : Ge.none), (e.keepOnDeath = t.rule.keepOnDeath), e;
}
function yb(e) {
    let t = 0,
        n = e.getComponent("minecraft:inventory")?.container;
    if (n)
        for (let o = 0; o < n.size; o++) {
            let i = n.getItem(o),
                s = i && Sm(i);
            s && a(() => (n.setItem(o, s), !0)) && (t++, void 0);
        }
    let r = e.getComponent("minecraft:equippable");
    for (let o of mr) {
        let i = a(() => r?.getEquipment(o)),
            s = i && Sm(i);
        s && a(() => r?.setEquipment(o, s)) && (t++, void 0);
    }
    t && void 0;
}
function Im(e) {
    let t = e.getComponent("minecraft:inventory")?.container,
        n = [];
    if (t)
        for (let i = 0; i < t.size; i++) {
            let s = t.getItem(i);
            s && fr(s.typeId) && n.push(`${i}:${s.typeId}:keep=${s.keepOnDeath}`);
        }
    let r = e.getComponent("minecraft:equippable");
    for (let i of mr) {
        let s = a(() => r?.getEquipment(i));
        s && fr(s.typeId) && n.push(`${i}:${s.typeId}:keep=${s.keepOnDeath}`);
    }
    let o = a(
        () =>
            e.getComponent(
                "minecraft:cursor_inventory"
            )?.item
    );
    o && fr(o.typeId) && n.push(`cursor:${o.typeId}:keep=${o.keepOnDeath}`);
}
function Ei(e) {
    if (!e.isValid) return;
    if (Gt("mode") !== "starter") {
        xi(e);
        return;
    }
    if (a(() => e.getGameMode()) === lb.Spectator) return;
    yb(e);
    let t = gb(e),
        n = a(() => e.getTags()) ?? [];
    for (let r of yi) {
        let o = r.id === Q ? mm(t, wm, n, _i) : [...t].some(r.owns);
        if (o) continue;
        let i = hb(r);
        if (r.id === Q && bb(e, i)) {
            continue;
        }
        _b(e, i);
    }
}
import { EquipmentSlot as x$, ItemStack as E$, ItemTypes as k$, system as w$, world as I$ } from "@minecraft/server";
import {
    CommandPermissionLevel as H$,
    CustomCommandParamType as K$,
    CustomCommandStatus as F$,
    system as B$,
    world as V$,
} from "@minecraft/server";
import {
    CommandPermissionLevel as oA,
    CustomCommandParamType as iA,
    CustomCommandStatus as aA,
    system as cA,
    world as dA,
} from "@minecraft/server";
function vm(e, t) {
    (e.ms += t), (e.calls += 1), t > e.worst && (e.worst = t);
}
var Tm = new Map();
function j(e, t) {
    return t();
}
import { EquipmentSlot as xA, system as EA, world as kA } from "@minecraft/server";
import {
    CommandPermissionLevel as CA,
    CustomCommandParamType as OA,
    CustomCommandStatus as DA,
    system as NA,
    world as LA,
} from "@minecraft/server";
import {
    CommandPermissionLevel as jA,
    CustomCommandParamType as qA,
    CustomCommandStatus as YA,
    system as JA,
} from "@minecraft/server";
import { world as xb } from "@minecraft/server";
var ki = "1.3.5";
var $m = "xvoid.watermark";
function Am() {
    N(xb.afterEvents.playerSpawn, "watermark.playerSpawn", (e) => {
        e.initialSpawn && (e.player.sendMessage(p($m, ki)), void 0);
    });
}
import { EntityDamageCause as CR, GameMode as LR, system as KR, world as FR } from "@minecraft/server";
import { EquipmentSlot as iP, system as sP, world as cP } from "@minecraft/server";
import { EquipmentSlot as Sb, system as wb, world as Si } from "@minecraft/server";
var Eb = "entityAttack";
var kb = new Set(["Attack", "Mine"]),
    Rm = "crafter.fail",
    Pm = "woa.switcher.no_attack";
function lr(e, t) {
    return e !== void 0 && t.has(e);
}
function Mm(e, t, n) {
    return e === Eb && lr(t, n);
}
function Cm(e, t, n) {
    return kb.has(e) && lr(t, n);
}
function Om(e, t) {
    return e === void 0 || t - e >= 40;
}
var wi = new Map();
function Ib(e) {
    let t = k(e.damageSource.damagingEntity);
    if (!t) return;
    let n = a(
        () =>
            t
                .getComponent(
                    "minecraft:equippable"
                )
                ?.getEquipment(Sb.Mainhand)?.typeId
    );
    Mm(String(e.damageSource.cause), n, Z) && ((e.cancel = !0), void 0);
}
function vb(e) {
    let t = e.itemStack?.typeId;
    lr(t, Z) && ((e.cancel = !0), void 0);
}
function Tb(e) {
    let t = e.heldItemStack?.typeId,
        n = String(e.swingSource);
    if (!Cm(n, t, Z)) return;
    let r = e.player,
        o = wb.currentTick,
        i = wi.get(r.id),
        s = Om(i, o);
    s && (wi.set(r.id, o), T(r, "switcherHint", x(B("cross"), " \xA7c\xA7l", p(Pm))), a(() => r.playSound(Rm)));
}
function Dm() {
    N(Si.beforeEvents.entityHurt, "switcherLock.hit", Ib),
        N(Si.beforeEvents.playerBreakBlock, "switcherLock.break", vb),
        N(Si.afterEvents.playerSwingStart, "switcherLock.swing", Tb);
}
function Nm(e) {
    wi.delete(e);
}
Ar({ mod: "WOA", version: "1.3.5", build: "release", api: "2.11.0", echo: void 0 });
function pr(e, t) {
    try {
        t();
    } catch (n) {
        A(e, n);
    }
}
Nc();
Em();
Fs();
Kf(af);
Dm();
ac({ wearing: (e) => R(e.id), busy: (e) => (om(e.id) ? "guarding" : xn(e, Hm.currentTick)) });
im();
Bf();
Kd();
Id();
Am();
Zi();
mu();
Bu();
Rf((e) => R(e.id));
jt((e, t) => {
    if (e.mode !== t.mode) for (let n of re.getAllPlayers()) a(() => (e.mode === "starter" ? Ei(n) : xi(n)));
});
function $b(e) {
    Ot.add(e.id), Ec(e), z(e.dimension, w.equip, e.location), T(e, "equip", S.equip);
}
function Ab(e) {
    Ot.delete(e.id), sd(e), Sd(e.id), Hs(e), sc(e), cm(e), Sc(e), si(e.id), Do(e.id), os(e), T(e, "unequip", S.unequip);
}
function Rb(e, t) {
    let n = e.getComponent("minecraft:equippable");
    if (!n) return;
    let r = n.getEquipment(Lm.Mainhand);
    de(r?.typeId) ? X.add(e.id) : X.delete(e.id);
    let o = n.getEquipment(Lm.Head)?.typeId,
        i = !!o && be.has(o),
        s = R(e.id);
    i && !s ? $b(e) : !i && s && Ab(e),
        ci(t, i !== s) && j("boundItems", () => Ve(e, i)),
        j("undying", () => yd(e, t)),
        t % 20 === 0 && j("sanitize", () => ks(e)),
        t % 20 === 0 && j("rewards", () => hf(e)),
        !(!i || !o) &&
            (j("modes", () => ad(e, t)),
            j("guard", () => am(e)),
            j("weaponScan", () => na(e, t)),
            j("wheel", () => Es(e, o, t)),
            j("adaptation", () => sf(e, t)),
            j(
                "effectSnapshot",
                () => ud(e, t)
            ));
}
Pr("main.tick", 1, () => {
    let e = Hm.currentTick;
    j("tickTotal", () => {
        for (let t of re.getAllPlayers())
            try {
                Rb(t, e);
            } catch (n) {
                A("main.tickPlayer", n, { player: t.id, tick: e });
            }
    });
});
cn("main.tick");
N(
    re.beforeEvents.entityHurt,
    "combat.entityHurt",
    (e) =>
        j("entityHurt", () => {
            if (e.cancel || e.damage <= 0) return;
            let t = e.hurtEntity,
                n = e.damage,
                r = k(t);
            r && void 0;
            let o = k(e.damageSource.damagingEntity);
            o && o.id !== t.id && Pb(e, o, t, n),
                !(e.cancel || !r || !R(r.id)) &&
                    (e.damage !== n && void 0, Fd(e, r), e.cancel || sm(e, r), e.cancel || Ju(e, r, n));
        })
);
function Pb(e, t, n, r) {
    R(t.id) && !lu(e, t, n) && zf(e, t, n), !e.cancel && (Qu(e, t, n), Su(e, t, n, r));
}
N(re.beforeEvents.effectAdd, "adaptation.effectAdd", ef);
cn("adaptation.effectAdd");
N(
    re.afterEvents.effectAdd,
    "adaptation.effectAddAfter",
    tf,
    { entityTypes: ["minecraft:player"] }
);
N(re.afterEvents.entityDie, "adaptation.entityDie", (e) => {
    let t = e.deadEntity,
        n = k(t);
    woaWounds.size && woaWounds.delete(a(() => t.id));
    n && void 0,
        n && pr("starter.traceKitAtDeath", () => Im(n)),
        !(!n || !R(n.id)) && (pr("adaptation.playerDeath", () => nf(n)), T(n, "death", S.death));
});
N(re.afterEvents.playerSpawn, "starter.playerSpawn", (e) => {
    let t = e.player;
    le("starter.ensureKit", lt.delayTicks, () => Ei(t));
});
N(re.afterEvents.entitySpawn, "main.entitySpawn", (e) => {
    pr("wheel.sanitizeDrop", () => Ss(e.entity)),
        pr(
            "boundItems.removeDropped",
            () => Pf(e.entity)
        );
});
N(re.afterEvents.entityHitEntity, "sword.hit", ku);
re.beforeEvents.entityHeal && N(re.beforeEvents.entityHeal, "heal.cut", woaHealCut);
re.afterEvents.entityHealthChanged && N(re.afterEvents.entityHealthChanged, "heal.health", woaHealthUp);
N(re.afterEvents.projectileHitBlock, "reflect.hitBlock", (e) => {
    let t = a(() => e.projectile.id);
    t && woaReflected.has(t) && ((v(e.dimension, I.guardFlash, e.location), v(e.dimension, I.ringPopGold, e.location)), woaReflectDrop(t));
});
N(re.afterEvents.projectileHitEntity, "reflect.hitEntity", (e) => {
    let t = a(() => e.projectile.id);
    t &&
        woaReflected.has(t) &&
        (v(e.dimension, I.goldHit, e.location), v(e.dimension, I.kickRing, e.location), v(e.dimension, I.arcs, e.location), Be.run(() => woaReflectDrop(t)));
});
N(
    re.afterEvents.itemUse,
    "sword.itemUse",
    Iu
);
N(re.beforeEvents.playerLeave, "main.playerLeave", (e) => {
    let t = e.player.id;
    q("main.forgetPlayer", () => {
        wc(t),
            si(t),
            Do(t),
            xd(t),
            Tu(t),
            ws(t),
            xo(t),
            Vf(t),
            dm(t),
            Bd(t),
            Ca(t),
            Td(t),
            gu(t),
            Wu(t),
            Nm(t),
            $s(t),
            Us(t),
            zi(t),
            is(t),
            ms(t),
            Ls(t);
    });
});
