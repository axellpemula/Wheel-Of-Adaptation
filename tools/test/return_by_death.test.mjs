import * as L from "./lib.mjs";
const logs = [];
for (const k of ["log", "warn", "error", "info"]) { const o = console[k].bind(console); console[k] = (...a) => { const s = a.join(" "); if (s.startsWith("[WOA")) { if (!/ (boot|reg|perf|stat) /.test(s)) logs.push(s); } else o(...a); }; }
const M = await import(process.env.WOA_MAIN);
const { ItemStack, overworld: W, Player, Entity, hurt, tick, fire } = { ...L };
let fails = 0;
const ok = (c, m, extra) => { if (!c) { fails++; console.log("  FAIL", m, extra ?? ""); } else console.log("  ok  ", m); };
const eq = (a, b, m) => ok(JSON.stringify(a) === JSON.stringify(b), m, `got ${JSON.stringify(a)} want ${JSON.stringify(b)}`);
const near = (a, b, m, eps = 0.01) => ok(Math.abs(a - b) <= eps, m, `got ${a} want ${b}`);
const hp = (e) => e.getComponent("minecraft:health");
const pos = (e) => [e.location.x, e.location.y, e.location.z].map((v) => Math.round(v * 100) / 100);
function wear(p) { p.gear.Head = new ItemStack(M.Q); tick(2); }
function arm(p, n = 8) { const s = M.ee(p); s.map.clear(); for (let i = 0; i < n; i++) s.map.set(["kind:zombie", "kind:spider", "kind:skeleton", "kind:slime", "kind:animal", "kind:bug", "kind:sting", "kind:tool", "kind:sword"][i], { s: 1, n: 1, used: Date.now() + i, e: 0 }); }
const stone = { type: { id: "minecraft:stone" }, getState: () => undefined };
const chestPerm = { type: { id: "minecraft:chest" }, getState: () => undefined };
function reset() { for (const p of [...L.worldState.players]) { fire("before.playerLeave", { player: p }); p.isValid = false; } L.worldState.players.length = 0; for (const e of [...W.entities]) e.isValid = false; W.entities.length = 0; W.blocks.clear(); tick(30); }

console.log("A. probe: armour makes a 'lethal looking' hit survivable -> no Return by Death, exact damage");
{
    const p = new Player("Axel", W, { x: 0, y: 64, z: 0 }); wear(p); arm(p); ok(M.R(p.id), "wheel detected");
    tick(260);
    ok(M.woaRbdFrames.length > 20, "frames recorded", M.woaRbdFrames.length);
    ok(!!M.woaRbdTarget(p, L.system.currentTick), "target frame exists");
    hp(p).currentValue = 6; p.armor = 0.25;                 // 20 raw -> 5 after armour: survives with 1
    const r = hurt(p, 20, "magic"); L.flush(); tick(1);
    near(hp(p).currentValue, 1, "health = 6 - 20*0.25", 0.05);
    ok(!M.woaRbdRuns.size, "no session");
    eq(M.Dt(M.ee(p)), 8, "adaptations untouched");
    // small hit: untouched by the probe
    hp(p).currentValue = 20; const r2 = hurt(p, 5, "magic"); eq(r2.event <= 5, true, "small hit not capped"); tick(1);
    // shield block: zero damage dealt
    hp(p).currentValue = 4; p.armor = 1; hurt(p, 30, "magic", undefined, { blocked: true }); tick(1);
    near(hp(p).currentValue, 4, "blocked hit costs nothing"); ok(!M.woaRbdRuns.size, "no session after block");
    // absorption hearts soak it
    hp(p).currentValue = 4; p.absorb = 8; p.effects.set("absorption", { typeId: "absorption", amplifier: 1, duration: 100 }); hurt(p, 6, "magic"); tick(1);
    ok(hp(p).currentValue > 0 && !M.woaRbdRuns.size, "absorption: survives, no session", hp(p).currentValue);
    p.absorb = 0; p.effects.clear();
    // totem in hand: left to vanilla
    hp(p).currentValue = 4; p.gear.Offhand = new ItemStack("minecraft:totem_of_undying"); const r3 = hurt(p, 30, "magic");
    eq(r3.event, 30, "totem: hit not touched"); p.gear.Offhand = undefined; hp(p).currentValue = 20; tick(1);
    reset();
}
console.log("B. full scene");
{
    const p = new Player("Axel", W, { x: 0, y: 64, z: 0 }), o = new Player("Budi", W, { x: 4, y: 64, z: 4 }), far = new Player("Cici", W, { x: 300, y: 64, z: 0 });
    wear(p); arm(p);
    p.inv.setItem(0, new ItemStack("minecraft:diamond", 5)); p.inv.setItem(1, new ItemStack("minecraft:stone", 32)); p.level = 12; p.xpEarnedAtCurrentLevel = 3;
    o.inv.setItem(0, new ItemStack("minecraft:apple", 9)); far.inv.setItem(0, new ItemStack("minecraft:apple", 1));
    const z = new Entity("minecraft:zombie", W, { x: 3, y: 64, z: 0 }), cow = new Entity("minecraft:cow", W, { x: 5, y: 64, z: 5 }, { hp: 10 });
    const wolf = new Entity("minecraft:wolf", W, { x: 2, y: 64, z: 2 }, { hp: 8, tame: true }); wolf.getComponent("minecraft:tameable").tame(p); wolf.nameTag = "Doggo";
    const gem = W.spawnItem(new ItemStack("minecraft:emerald", 3), { x: 1, y: 64, z: -2 });
    const coal = W.spawnItem(new ItemStack("minecraft:coal", 6), { x: -1, y: 64, z: -2 }), stick = W.spawnItem(new ItemStack("minecraft:stick", 2), { x: -1, y: 64, z: -3 });
    const chest = W.getBlock({ x: 2, y: 64, z: 2 }); chest.setPermutation(chestPerm); chest.container.setItem(0, new ItemStack("minecraft:gold_ingot", 7));
    const wall = W.getBlock({ x: -3, y: 64, z: 0 }); wall.setPermutation(stone);
    const box = W.getBlock({ x: -2, y: 64, z: 3 }); box.setPermutation(chestPerm); box.container.setItem(3, new ItemStack("minecraft:iron_ingot", 4));
    L.worldState.time = 6000;
    const cowsNow = () => W.entities.filter((e) => e.typeId === "minecraft:cow");
    const adv = (n) => { for (let i = 0; i < n; i++) { L.worldState.time++; tick(1); } };
    adv(259);
    while (L.system.currentTick % 20 !== 0) adv(1);        // sit exactly on a full snapshot
    const T0 = L.system.currentTick, time0 = L.worldState.time;
    adv(3);
    // ---- the 10 seconds that get undone ----
    for (let i = 1; i <= 10; i++) { p.location = { x: i, y: 64, z: 0 }; z.location = { x: 3 + i * 0.5, y: 64, z: 1 }; o.location = { x: 4, y: 64, z: 4 + i }; adv(8); }
    const placed = W.getBlock({ x: 9, y: 64, z: 1 }); placed.setPermutation(stone); p.inv.setItem(1, new ItemStack("minecraft:stone", 31)); fire("after.playerPlaceBlock", { block: placed, player: p, dimension: W });
    fire("before.playerBreakBlock", { block: chest, player: p, dimension: W, cancel: false }); chest.setPermutation({ type: { id: "minecraft:air" }, getState: () => undefined });
    const drop = W.spawnItem(new ItemStack("minecraft:gold_ingot", 7), { x: 2, y: 64, z: 2 }), dropChest = W.spawnItem(new ItemStack("minecraft:chest", 1), { x: 2, y: 64, z: 2 });
    fire("before.explosion", { cancel: false, dimension: W, getImpactedBlocks: () => [wall] }); wall.setPermutation({ type: { id: "minecraft:air" }, getState: () => undefined });
    fire("after.blockContainerOpened", { block: box, dimension: W }); box.container.setItem(3, undefined); o.inv.setItem(1, new ItemStack("minecraft:iron_ingot", 4));
    gem.remove(); p.inv.setItem(2, new ItemStack("minecraft:emerald", 3));              // picked up
    coal.stack.amount = 10;                              // merged with a later drop
    drop.remove(); p.inv.setItem(3, new ItemStack("minecraft:gold_ingot", 7));
    hurt(cow, 50, "entityAttack", p); const beef = W.spawnItem(new ItemStack("minecraft:beef", 2), { x: 5, y: 64, z: 5 });
    hurt(wolf, 50, "entityAttack", z);
    const orb = W.spawnEntity("minecraft:xp_orb", { x: 5, y: 64, z: 5 }); const creeper = W.spawnEntity("minecraft:creeper", { x: 12, y: 64, z: 0 });
    p.inv.setItem(0, new ItemStack("minecraft:diamond", 1)); p.level = 13; p.addEffect("poison", 200, { amplifier: 1 }); o.inv.setItem(0, new ItemStack("minecraft:apple", 2));
    p.getComponent("minecraft:player.hunger").currentValue = 11; p.cursor = new ItemStack("minecraft:diamond", 4);
    { const hm = new ItemStack("minecraft:iron_helmet"); hm.ench.list.push({ type: { id: "respiration", maxLevel: 3 }, level: 2 }); p.inv.setItem(8, hm); p.selectedSlotIndex = 8;
      fire("before.itemUse", { cancel: false, source: p, itemStack: p.inv.getItem(8) }); adv(1); ok(p.gear.Head.ench.list.length === 1 && !p.inv.getItem(8), "helmet merged inside the window"); p.selectedSlotIndex = 0; }
    adv(90);
    ok(L.system.currentTick - T0 >= 170 && L.system.currentTick - T0 <= 220, "timeline spans the window", L.system.currentTick - T0);
    while ((L.system.currentTick + 1 - T0) < 205) adv(1);
    hp(z).currentValue = 9;
    // ---- lethal hit ----
    hp(p).currentValue = 5; p.armor = 0.5;
    const before = L.system.currentTick;
    const r = hurt(p, 40, "magic", creeper);
    ok(hp(p).currentValue >= 1, "player did not die on the hit", hp(p).currentValue);
    adv(1);
    ok(M.woaRbdRuns.has(p.id), "session started");
    eq(M.Dt(M.ee(p)), 0, "adaptations burned");
    ok(M.woaRbdHeld.has(p.id) && M.woaRbdHeld.has(o.id) && !M.woaRbdHeld.has(far.id), "host and nearby player held, far player not");
    ok(p.locks.Movement && p.locks.Camera && o.locks.Movement && !o.locks.Camera, "input locks");
    eq(p.gear.Head.typeId, "xvoid:wheel_of_adaptation_rewind", "wheel shows the rewind variant");
    ok(p.calls.some((c) => c[0] === "anim" && c[1] === "animation.xvoid.rbd.fall"), "fall animation");
    ok(p.camera.calls[0]?.[0] === "set" && p.camera.calls[0][1] === "minecraft:free", "camera cut");
    const hit = hurt(p, 99, "entityAttack", z); ok(hit.cancel, "host cannot be hurt during the scene");
    ok(hurt(z, 5, "entityAttack", o).cancel, "tracked mob cannot be hurt during the scene");
    fire("before.playerBreakBlock", { block: placed, player: o, dimension: W, cancel: false });
    adv(40);
    ok(p.camera.calls.some((c) => c[0] === "set" && c[2]?.easeOptions), "camera ease");
    adv(26);
    ok(z.location.x < 8 && z.location.x > 3, "zombie is being moved back", pos(z));
    ok(cowsNow().length === 1 && wall.typeId === "minecraft:stone", "mid-scene: cow already back, wall already rebuilt");
    adv(10);
    ok(p.camera.calls.some((c) => c[0] === "fade"), "fade");
    adv(2);
    // ---- restored ----
    eq(pos(p), [0, 64, 0], "host back at the old position");
    eq(pos(o), [4, 64, 4], "other player back");
    eq(pos(far), [300, 64, 0], "far player untouched"); eq(far.inv.count("minecraft:apple"), 1, "far inventory untouched");
    eq(pos(z), [3, 64, 0], "zombie back"); near(hp(z).currentValue, 20, "zombie health back");
    eq([p.inv.count("minecraft:diamond"), p.inv.count("minecraft:stone"), p.inv.count("minecraft:emerald"), p.inv.count("minecraft:gold_ingot")], [5, 32, 0, 0], "host inventory back");
    eq([o.inv.count("minecraft:apple"), o.inv.count("minecraft:iron_ingot")], [9, 0], "other inventory back");
    eq([p.level, p.xpEarnedAtCurrentLevel], [12, 3], "xp back"); ok(!p.getEffect("poison"), "poison gone");
    near(p.getComponent("minecraft:player.hunger").currentValue, 20, "hunger back"); near(hp(p).currentValue, 20, "health back");
    ok(!p.cursor, "cursor cleared");
    eq([p.gear.Head.ench.list.length, p.gear.Head.typeId], [0, "xvoid:wheel_of_adaptation_rewind"], "merged enchantment undone, wheel still in its rewind look");
    eq(placed.typeId, "minecraft:air", "placed block removed"); eq(wall.typeId, "minecraft:stone", "exploded block back");
    eq(chest.typeId, "minecraft:chest", "broken chest back"); eq(chest.container?.count("minecraft:gold_ingot"), 7, "chest contents back");
    eq(box.container.count("minecraft:iron_ingot"), 4, "opened chest contents back");
    const items = W.entities.filter((e) => e.typeId === "minecraft:item").map((e) => `${e.getComponent("minecraft:item").itemStack.typeId}x${e.getComponent("minecraft:item").itemStack.amount}`).sort();
    eq(items, ["minecraft:coalx6", "minecraft:emeraldx3", "minecraft:stickx2"], "ground items exactly as before"); ok(stick.isValid && !coal.isValid, "untouched drop left alone, merged drop replaced");
    ok(!orb.isValid && !creeper.isValid && !beef.isValid && !dropChest.isValid, "things spawned in the window are gone");
    const cows = W.entities.filter((e) => e.typeId === "minecraft:cow"), wolves = W.entities.filter((e) => e.typeId === "minecraft:wolf");
    eq(cows.length, 1, "cow is alive again"); eq(pos(cows[0]), [5, 64, 5], "cow at old position"); near(hp(cows[0]).currentValue, 10, "cow health");
    eq(wolves.length, 1, "wolf alive again"); eq([wolves[0].nameTag, wolves[0].getComponent("minecraft:tameable")?.tamedToPlayerId === p.id], ["Doggo", true], "wolf keeps name and owner");
    near(L.worldState.time, time0, "time of day back", 3);
    ok(p.camera.calls.some((c) => c[0] === "clear"), "camera cleared"); ok(p.calls.some((c) => c[1] === "animation.xvoid.rbd.rise"), "rise animation");
    ok(hurt(p, 99, "entityAttack", z).cancel, "grace right after");
    adv(14);
    ok(!M.woaRbdRuns.size && !M.woaRbdHeld.size, "session closed"); ok(!p.locks.Movement && !p.locks.Camera && !o.locks.Movement, "input unlocked");
    adv(12); eq(p.gear.Head.typeId, M.Q, "wheel back to normal");
    const cd = M.woaRbdCdOf(p, L.system.currentTick) - L.system.currentTick; ok(cd > 17800 && cd <= 18000, "cooldown 15 min", cd);
    ok(JSON.stringify(M.woaRbdLine(p)).includes("woa.rbd.menu.cooldown"), "menu line shows cooldown");
    adv(80); arm(p); adv(300); hp(p).currentValue = 3; p.armor = 1; hurt(p, 40, "magic"); adv(1);
    ok(!M.woaRbdRuns.size && hp(p).currentValue <= 0, "on cooldown: dies normally", hp(p).currentValue);
    reset();
}
console.log("C. helmet merge");
{
    const p = new Player("Axel", W, { x: 0, y: 64, z: 0 }); wear(p);
    const w0 = p.gear.Head; w0.ench.addEnchantment({ type: { id: "protection" }, level: 2 }); p.gear.Head = w0;
    const h = new ItemStack("minecraft:netherite_helmet");
    for (const [id, lv] of [["protection", 2], ["respiration", 3], ["blast_protection", 4], ["mending", 1], ["unbreaking", 3], ["binding", 1], ["aqua_affinity", 1]]) { h.ench.list.push({ type: { id, maxLevel: { protection: 4, respiration: 3, blast_protection: 4, aqua_affinity: 1 }[id] ?? 1 }, level: lv }); }
    p.inv.setItem(0, h); p.selectedSlotIndex = 0;
    const ev = fire("before.itemUse", { cancel: false, source: p, itemStack: p.inv.getItem(0) }); ok(ev.cancel, "use is intercepted"); tick(1);
    const got = Object.fromEntries(p.gear.Head.ench.list.map((e) => [e.type.id, e.level]));
    eq(got, { protection: 3, respiration: 3, aqua_affinity: 1 }, "enchantments merged (equal level +1, incompatible and useless ones skipped)");
    ok(!p.inv.getItem(0), "helmet consumed");
    const plain = new ItemStack("minecraft:iron_helmet"); p.inv.setItem(0, plain);
    ok(!fire("before.itemUse", { cancel: false, source: p, itemStack: plain }).cancel, "plain helmet: vanilla behaviour");
    const dull = new ItemStack("minecraft:iron_helmet"); dull.ench.list.push({ type: { id: "protection", maxLevel: 4 }, level: 1 }); p.inv.setItem(0, dull);
    ok(fire("before.itemUse", { cancel: false, source: p, itemStack: dull }).cancel, "weaker helmet intercepted"); tick(1);
    ok(!!p.inv.getItem(0) && p.last().includes("woa.helm.none"), "nothing to absorb: helmet kept");
    const sw = new ItemStack("minecraft:diamond_sword"); ok(!fire("before.itemUse", { cancel: false, source: p, itemStack: sw }).cancel, "other items untouched");
    reset();
}
console.log("D. exact lethality, host leaving, dead bystander, stale lock");
{
    const p = new Player("Axel", W, { x: 0, y: 64, z: 0 }), o = new Player("Budi", W, { x: 3, y: 64, z: 0 }), d = new Player("Dedi", W, { x: -3, y: 64, z: 0 });
    wear(p); arm(p); d.inv.setItem(0, new ItemStack("minecraft:diamond", 9)); tick(300);
    hp(p).currentValue = 5; p.armor = 0.5; hurt(p, 9, "magic"); tick(1);
    near(hp(p).currentValue, 0.5, "9 raw * 0.5 leaves half a heart"); ok(!M.woaRbdRuns.size, "not lethal -> no session");
    hp(p).currentValue = 5; hurt(p, 10, "magic"); tick(1);
    ok(M.woaRbdRuns.has(p.id), "10 raw * 0.5 = 5 is lethal -> session"); ok(o.locks.Movement, "bystander locked");
    fire("before.playerLeave", { player: p }); p.isValid = false; L.worldState.players.splice(L.worldState.players.indexOf(p), 1); tick(3);
    ok(!M.woaRbdRuns.size && !M.woaRbdHeld.size && !o.locks.Movement, "host left: scene dropped, bystander freed");
    // second run with a bystander who is dead at restore time
    const q = new Player("Eko", W, { x: 0, y: 64, z: 0 }); wear(q); arm(q); tick(300);
    d.location = { x: -9, y: 64, z: 0 }; d.inv.setItem(0, undefined); hp(d).currentValue = 0;      // died and dropped everything
    hp(q).currentValue = 2; q.armor = 1; hurt(q, 30, "magic"); tick(1); ok(M.woaRbdRuns.has(q.id), "session 2");
    tick(80); ok(M.woaRbdPending.has(d.id), "dead bystander queued"); eq(pos(o), [3, 64, 0], "living bystander restored");
    hp(d).currentValue = 20; d.location = { x: 100, y: 70, z: 100 }; fire("after.playerSpawn", { player: d, initialSpawn: false }); tick(8);
    eq([pos(d), d.inv.count("minecraft:diamond")], [[-3, 64, 0], 9], "restored after respawn");
    tick(30); ok(!M.woaRbdRuns.size, "session 2 closed");
    o.setDynamicProperty("xvoid:rbd_lock", true); o.locks.Movement = true; o.locks.Camera = true; tick(21);
    ok(!o.locks.Movement && !o.locks.Camera && !o.getDynamicProperty("xvoid:rbd_lock"), "stale lock released");
    reset();
}
console.log("E. partial conditions");
{
    const p = new Player("Axel", W, { x: 0, y: 64, z: 0 }); wear(p); arm(p, 7); tick(300);
    eq(M.woaRbdFrames.length, 0, "7 adaptations: nothing recorded");
    ok(JSON.stringify(M.woaRbdLine(p)).includes("woa.rbd.menu.need"), "menu shows the requirement");
    hp(p).currentValue = 3; hurt(p, 30, "magic"); tick(1); ok(hp(p).currentValue <= 0 && !M.woaRbdRuns.size, "7 adaptations: dies");
    hp(p).currentValue = 20; arm(p, 8); tick(25);
    hp(p).currentValue = 3; hurt(p, 30, "magic"); tick(1); ok(hp(p).currentValue <= 0 && !M.woaRbdRuns.size, "armed for 1 s only: no history yet, dies");
    hp(p).currentValue = 20; arm(p, 8); tick(80); ok(JSON.stringify(M.woaRbdLine(p)).includes("woa.rbd.menu.ready"), "menu shows ready");
    ok(p.bars.some((b) => b.includes("woa.rbd.armed")), "armed notice shown");
    hp(p).currentValue = 3; hurt(p, 30, "magic"); tick(1); ok(M.woaRbdRuns.has(p.id), "armed for 4 s: short rewind allowed"); tick(100);
    ok(p.last().includes("woa.rbd.done"), "done notice", p.last());
    // a big crowd: timing of one recording pass
    arm(p); M.woaRbdCd.set(p.id, 0); for (let i = 0; i < 150; i++) new Entity("minecraft:sheep", W, { x: (i % 15) - 7, y: 64, z: Math.floor(i / 15) - 5 });
    const t0 = performance.now(); tick(400); const ms = (performance.now() - t0) / 400;
    ok(ms < 2, `400 ticks with 150 mobs nearby: ${ms.toFixed(3)} ms per tick (mock)`); ok([...M.woaRbdFrames].every((f) => f.mobs.size <= 96), "mob cap respected");
    reset();
}
console.log(fails ? `\n${fails} FAILED` : "\nALL OK");
if (L.errors.length) console.log("uncaught:", L.errors.map((e) => e.stack.split("\n").slice(0, 4).join(" | ")));
const bad = logs.filter((x) => / (swallow|err) /.test(x));
if (bad.length) console.log("addon errors:\n" + [...new Set(bad)].slice(0, 20).join("\n"));
process.exit(fails || L.errors.length || bad.length ? 1 : 0);
