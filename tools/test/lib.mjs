import { ItemStack, BlockPermutation, dims, worldState, fire, tick, flush, system, errors } from "./mock/server.mjs";
export { ItemStack, fire, tick, flush, system, errors, worldState };
let nextId = 1;
const dist2 = (a, b) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2;
class Attr {
    constructor(v, max = v, min = 0) { this.currentValue = v; this.effectiveMax = max; this.effectiveMin = min; this.defaultValue = max; }
    setCurrentValue(v) { this.currentValue = Math.max(this.effectiveMin, Math.min(this.effectiveMax, v)); return true; }
    resetToMaxValue() { this.currentValue = this.effectiveMax; } resetToDefaultValue() { this.currentValue = this.defaultValue; } resetToMinValue() { this.currentValue = this.effectiveMin; }
}
class Container {
    constructor(size) { this.size = size; this.slots = new Array(size).fill(undefined); }
    getItem(i) { return this.slots[i]?.clone(); } setItem(i, it) { this.slots[i] = it ? it.clone() : undefined; }
    get emptySlotsCount() { return this.slots.filter((x) => !x).length; }
    addItem(it) { const i = this.slots.findIndex((x) => !x); if (i < 0) return it; this.slots[i] = it.clone(); return undefined; }
    getSlot(i) { const c = this; return { getItem: () => c.getItem(i), setItem: (x) => c.setItem(i, x), get typeId() { return c.slots[i]?.typeId; }, hasItem: () => !!c.slots[i] }; }
    clearAll() { this.slots.fill(undefined); }
    count(id) { return this.slots.filter((x) => x?.typeId === id).reduce((a, x) => a + x.amount, 0); }
}
export class Block {
    constructor(dim, x, y, z) { this.dimension = dim; this.location = { x, y, z }; this.x = x; this.y = y; this.z = z; this.permutation = BlockPermutation.resolve("minecraft:air"); this.container = undefined; }
    get typeId() { return this.permutation.type.id; } get type() { return this.permutation.type; }
    get isAir() { return this.typeId === "minecraft:air"; } get isLiquid() { return false; } get isSolid() { return !this.isAir; } get isValid() { return true; }
    setPermutation(p) { this.permutation = p; this.container = /chest|barrel/.test(p.type.id) ? new Container(27) : undefined; }
    setType(id) { this.setPermutation(BlockPermutation.resolve(String(id?.id ?? id))); }
    getComponent(id) { return id === "minecraft:inventory" && this.container ? { container: this.container } : undefined; }
    hasTag() { return false; } getTags() { return []; } matches(id) { return this.typeId === id; }
    offset(v) { return this.dimension.getBlock({ x: this.x + v.x, y: this.y + v.y, z: this.z + v.z }); }
    above(n = 1) { return this.offset({ x: 0, y: n, z: 0 }); } below(n = 1) { return this.offset({ x: 0, y: -n, z: 0 }); }
    north(n = 1) { return this.offset({ x: 0, y: 0, z: -n }); } south(n = 1) { return this.offset({ x: 0, y: 0, z: n }); }
    east(n = 1) { return this.offset({ x: n, y: 0, z: 0 }); } west(n = 1) { return this.offset({ x: -n, y: 0, z: 0 }); }
    center() { return { x: this.x + 0.5, y: this.y + 0.5, z: this.z + 0.5 }; } bottomCenter() { return { x: this.x + 0.5, y: this.y, z: this.z + 0.5 }; }
}
export class Dimension {
    constructor(id) { this.id = id; this.entities = []; this.blocks = new Map(); this.sounds = []; this.particles = []; this.heightRange = { min: -64, max: 320 }; dims.set(id, this); }
    getBlock(p) { const x = Math.floor(p.x), y = Math.floor(p.y), z = Math.floor(p.z), k = `${x},${y},${z}`; let b = this.blocks.get(k); if (!b) this.blocks.set(k, (b = new Block(this, x, y, z))); return b; }
    getEntities(o = {}) {
        return this.entities.filter((e) => {
            if (!e.isValid) return false;
            if (o.type && e.typeId !== o.type) return false;
            if (o.excludeTypes?.includes(e.typeId)) return false;
            if (o.families && !o.families.every((f) => e.families.includes(f))) return false;
            if (o.excludeFamilies?.some((f) => e.families.includes(f))) return false;
            if (o.location && o.maxDistance !== undefined && dist2(e.location, o.location) > o.maxDistance ** 2) return false;
            if (o.location && o.volume) { const l = e.location, a = o.location, v = o.volume; if (l.x < a.x || l.y < a.y || l.z < a.z || l.x > a.x + v.x || l.y > a.y + v.y || l.z > a.z + v.z) return false; }
            return true;
        });
    }
    getPlayers(o) { return this.getEntities(o).filter((e) => e.typeId === "minecraft:player"); }
    spawnParticle(id, loc) { this.particles.push(id); } playSound(id, loc, o) { this.sounds.push(id); }
    spawnEntity(type, loc) { const e = new Entity(String(type), this, loc, { tame: /wolf|cat|horse/.test(String(type)) }); fire("after.entitySpawn", { entity: e, cause: "Spawned" }); return e; }
    spawnItem(stack, loc) { const e = new Entity("minecraft:item", this, loc, { item: stack.clone() }); fire("after.entitySpawn", { entity: e, cause: "Spawned" }); return e; }
    getBlockFromRay() { return undefined; } getEntitiesFromRay() { return []; } getTopmostBlock() { return undefined; }
    runCommand() { return { successCount: 0 }; } createExplosion() { return true; } getWeather() { return "Clear"; } setBlockType(p, id) { this.getBlock(p).setType(id); }
    isChunkLoaded() { return true; } getBlockAbove() {} getBlockBelow() {}
}
export class Entity {
    constructor(typeId, dim, loc, o = {}) {
        this.id = `e${nextId++}`; this.typeId = typeId; this.dimension = dim; this.location = { ...loc }; this.isValid = true; this.rot = { x: 0, y: 0 };
        this.families = o.families ?? (typeId === "minecraft:item" ? ["inanimate"] : ["mob"]); this.nameTag = ""; this.props = new Map(); this.effects = new Map(); this.tags = new Set();
        this.comps = new Map(); this.calls = []; this.armor = 1; this.absorb = 0; this.isOnGround = true; this.isSneaking = false; this.isSprinting = false; this.fire = 0;
        if (typeId === "minecraft:item") { const me = this; this.stack = o.item; this.comps.set("minecraft:item", { get itemStack() { return me.stack.clone(); } }); }
        else this.comps.set("minecraft:health", new Attr(o.hp ?? 20, o.hp ?? 20));
        if (o.tame) this.comps.set("minecraft:tameable", { isTamed: false, tamedToPlayerId: undefined, tame: (p) => { const t = this.comps.get("minecraft:tameable"); t.isTamed = true; t.tamedToPlayerId = p.id; return true; } });
        dim.entities.push(this);
    }
    getComponent(id) { return this.comps.get(id.includes(":") ? id : "minecraft:" + id); } hasComponent(id) { return !!this.getComponent(id); } getComponents() { return [...this.comps.values()]; }
    getRotation() { return { ...this.rot }; } setRotation(r) { this.rot = { ...r }; }
    getHeadLocation() { return { x: this.location.x, y: this.location.y + 1.62, z: this.location.z }; }
    getViewDirection() { const y = (this.rot.y * Math.PI) / 180; return { x: -Math.sin(y), y: 0, z: Math.cos(y) }; }
    getVelocity() { return { x: 0, y: 0, z: 0 }; } clearVelocity() {} applyImpulse() {} applyKnockback() {}
    teleport(loc, o = {}) { if (!this.isValid) throw new Error("invalid"); this.location = { x: loc.x, y: loc.y, z: loc.z }; if (o.dimension && o.dimension !== this.dimension) { this.dimension.entities = this.dimension.entities.filter((e) => e !== this); this.dimension = o.dimension; o.dimension.entities.push(this); } if (o.rotation) this.rot = { ...o.rotation }; this.calls.push(["teleport"]); }
    tryTeleport(l, o) { this.teleport(l, o); return true; }
    remove() { if (!this.isValid) throw new Error("invalid"); this.isValid = false; this.dimension.entities = this.dimension.entities.filter((e) => e !== this); }
    kill() { const h = this.getComponent("minecraft:health"); if (h) h.currentValue = 0; die(this, { cause: "selfDestruct" }); return true; }
    addEffect(id, dur, o = {}) { const t = String(id?.id ?? id).replace("minecraft:", ""); const ev = fire("before.effectAdd", { cancel: false, entity: this, effectType: t, duration: dur, amplifier: o.amplifier ?? 0 }); if (ev.cancel) return undefined; const fx = { typeId: t, duration: ev.duration, amplifier: o.amplifier ?? 0, displayName: t, isValid: true }; this.effects.set(t, fx); fire("after.effectAdd", { entity: this, effect: fx }); return fx; }
    getEffect(id) { return this.effects.get(String(id?.id ?? id).replace("minecraft:", "")); } getEffects() { return [...this.effects.values()]; }
    removeEffect(id) { return this.effects.delete(String(id?.id ?? id).replace("minecraft:", "")); }
    getDynamicProperty(k) { return this.props.get(k); } setDynamicProperty(k, v) { v === undefined ? this.props.delete(k) : this.props.set(k, v); } getDynamicPropertyIds() { return [...this.props.keys()]; }
    hasTag(t) { return this.tags.has(t); } addTag(t) { this.tags.add(t); return true; } removeTag(t) { return this.tags.delete(t); } getTags() { return [...this.tags]; }
    extinguishFire() { this.fire = 0; return true; } setOnFire(s) { this.fire = s; return true; }
    applyDamage(amount, o = {}) { return hurt(this, amount, o.cause ?? "entityAttack", o.damagingEntity); }
    matches(o = {}) { return !o.type || o.type === this.typeId; } getBlockFromViewDirection() {} getEntitiesFromViewDirection() { return []; }
    playAnimation(name, o) { this.calls.push(["anim", name, o]); } triggerEvent() {} runCommand() { return { successCount: 0 }; } lookAt() {}
    getProperty() {} setProperty() {} isInWater = false; isFalling = false; isClimbing = false; isSwimming = false; isSleeping = false; target = undefined;
}
export class Player extends Entity {
    constructor(name, dim, loc) {
        super("minecraft:player", dim, loc, { families: ["player"] });
        this.name = name; this.level = 0; this.xpEarnedAtCurrentLevel = 0; this.totalXpNeededForNextLevel = 7; this.selectedSlotIndex = 0; this.mode = "Survival";
        this.playerPermissionLevel = "Member"; this.commandPermissionLevel = "Any"; this.bars = []; this.sounds = []; this.locks = {};
        this.inv = new Container(36); this.cursor = undefined; this.gear = {};
        const p = this;
        this.comps.set("minecraft:inventory", { container: this.inv, inventorySize: 36 });
        this.comps.set("minecraft:equippable", {
            getEquipment: (s) => (s === "Mainhand" ? p.inv.getItem(p.selectedSlotIndex) : p.gear[s]?.clone()),
            setEquipment: (s, it) => { if (s === "Mainhand") p.inv.setItem(p.selectedSlotIndex, it); else p.gear[s] = it ? it.clone() : undefined; return true; },
            getEquipmentSlot: (s) => ({ getItem: () => p.gear[s]?.clone(), setItem: (it) => { p.gear[s] = it?.clone(); }, hasItem: () => !!p.gear[s], get typeId() { return p.gear[s]?.typeId; } }),
            totalArmor: 0, totalToughness: 0,
        });
        this.comps.set("minecraft:cursor_inventory", { get item() { return p.cursor?.clone(); }, clear() { p.cursor = undefined; } });
        this.comps.set("minecraft:player.hunger", new Attr(20, 20)); this.comps.set("minecraft:player.saturation", new Attr(5, 20)); this.comps.set("minecraft:player.exhaustion", new Attr(0, 4));
        this.camera = { calls: [], isValid: true, setCamera: (...a) => p.camera.calls.push(["set", ...a]), clear: () => p.camera.calls.push(["clear"]), fade: (...a) => p.camera.calls.push(["fade", ...a]), addShake: () => {}, stopShaking: () => {}, setFov() {}, setDefaultCamera() {} };
        this.inputPermissions = { setPermissionCategory: (c, v) => { p.locks[c] = !v; }, isPermissionCategoryEnabled: (c) => !p.locks[c], cameraEnabled: true, movementEnabled: true };
        this.onScreenDisplay = { setActionBar: (t) => p.bars.push(JSON.stringify(t)), setTitle() {}, updateSubtitle() {}, isValid: true, setHudVisibility() {}, hideAllExcept() {}, resetHudElementsVisibility() {} };
        this.inputInfo = { getButtonState: () => "Released", getMovementVector: () => ({ x: 0, y: 0 }), lastInputModeUsed: "KeyboardAndMouse", touchOnlyAffectsHotbar: false };
        this.clientSystemInfo = { platformType: "Desktop", maxRenderDistance: 12, memoryTier: 4 }; this.graphicsMode = "Fancy";
        worldState.players.push(this);
    }
    getGameMode() { return this.mode; } setGameMode(m) { this.mode = m; } sendMessage() {} playSound(id) { this.sounds.push(id); } stopMusic() {} playMusic() {}
    resetLevel() { this.level = 0; this.xpEarnedAtCurrentLevel = 0; } addLevels(n) { this.level += n; return this.level; } addExperience(n) { this.xpEarnedAtCurrentLevel += n; return n; } getTotalXp() { return this.level * 10 + this.xpEarnedAtCurrentLevel; }
    startItemCooldown() {} getItemCooldown() { return 0; } spawnParticle() {} getSpawnPoint() {} setSpawnPoint() {} isOp() { return true; } isEmoting = false; isFlying = false; isGliding = false; isJumping = false;
    last() { return this.bars[this.bars.length - 1] ?? ""; }
}
export function die(e, src = {}) { fire("after.entityDie", { deadEntity: e, damageSource: src }); if (e.typeId !== "minecraft:player") { e.isValid = false; e.dimension.entities = e.dimension.entities.filter((x) => x !== e); } }
// damage pipeline: before event (raw), then armour factor, absorption, health, after event (final)
export function hurt(e, damage, cause = "entityAttack", attacker, opts = {}) {
    const src = { cause, damagingEntity: attacker, damagingProjectile: opts.projectile };
    const ev = fire("before.entityHurt", { cancel: false, damage, damageSource: src, hurtEntity: e });
    const out = { cancel: ev.cancel, event: ev.damage, final: 0 };
    if (ev.cancel || !(ev.damage > 0)) return out;
    let final = ev.damage * (opts.blocked ? 0 : (e.armor ?? 1));
    out.final = final;
    const h = e.getComponent("minecraft:health"); let left = final;
    if (e.absorb > 0) { const a = Math.min(e.absorb, left); e.absorb -= a; left -= a; if (e.absorb <= 0) e.effects.delete("absorption"); }
    h.currentValue = Math.max(0, h.currentValue - left);
    fire("after.entityHurt", { damage: final, damageSource: src, hurtEntity: e });
    if (h.currentValue <= 0) die(e, src);
    return out;
}
export const overworld = new Dimension("minecraft:overworld"); new Dimension("minecraft:nether"); new Dimension("minecraft:the_end");
