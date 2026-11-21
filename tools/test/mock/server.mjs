const enumOf = (name) => new Proxy({}, { get: (_, k) => (typeof k === "symbol" ? undefined : k) });
export const EquipmentSlot = enumOf(), EntityDamageCause = enumOf(), CameraShakeType = enumOf(), CommandPermissionLevel = enumOf(),
    CustomCommandParamType = enumOf(), CustomCommandStatus = enumOf(), ButtonState = enumOf(), InputButton = enumOf(), GameMode = enumOf(),
    ItemLockMode = enumOf(), EntitySwingSource = enumOf(), PlayerPermissionLevel = enumOf(), InputPermissionCategory = enumOf();
export const signals = new Map();
function signal(name) {
    let s = signals.get(name);
    if (!s) {
        s = { subs: [], subscribe(fn, opts) { s.subs.push({ fn, opts }); return fn; }, unsubscribe(fn) { s.subs = s.subs.filter((x) => x.fn !== fn); },
              fire(ev) { for (const x of [...s.subs]) x.fn(ev); return ev; } };
        signals.set(name, s);
    }
    return s;
}
const bag = (prefix) => new Proxy({}, { get: (_, k) => (typeof k === "symbol" ? undefined : signal(prefix + "." + k)) });
export const fire = (name, ev) => signal(name).fire(ev);
const st = { tick: 0, queue: [], timers: [], intervals: [], nextId: 1 };
export const system = {
    get currentTick() { return st.tick; },
    run(fn) { st.queue.push(fn); return st.nextId++; },
    runTimeout(fn, t = 0) { const id = st.nextId++; st.timers.push({ id, at: st.tick + Math.max(1, t), fn }); return id; },
    runInterval(fn, n = 1) { const id = st.nextId++; st.intervals.push({ id, n: Math.max(1, n), fn, from: st.tick }); return id; },
    runJob() { return st.nextId++; },
    clearRun(id) { st.timers = st.timers.filter((x) => x.id !== id); st.intervals = st.intervals.filter((x) => x.id !== id); },
    clearJob() {},
    beforeEvents: bag("sysBefore"), afterEvents: bag("sysAfter"),
    sendScriptEvent() {}, waitTicks: async () => {},
};
export const errors = [];
const guard = (fn) => { try { fn(); } catch (e) { errors.push(e); } };
export function tick(n = 1) {
    for (let i = 0; i < n; i++) {
        st.tick++;
        const q = st.queue; st.queue = [];
        for (const fn of q) guard(fn);
        const due = st.timers.filter((x) => x.at <= st.tick); st.timers = st.timers.filter((x) => x.at > st.tick);
        for (const x of due) guard(x.fn);
        for (const x of [...st.intervals]) if ((st.tick - x.from) % x.n === 0) guard(x.fn);
    }
}
export function flush() { const q = st.queue; st.queue = []; for (const fn of q) guard(fn); }
const props = new Map();
export const dims = new Map();
export const worldState = { time: 6000, players: [] };
export const world = {
    beforeEvents: bag("before"), afterEvents: bag("after"),
    getAllPlayers: () => worldState.players.filter((p) => p.isValid),
    getPlayers: () => worldState.players.filter((p) => p.isValid),
    getDimension: (id) => dims.get(id) ?? dims.get("minecraft:" + id),
    getDynamicProperty: (k) => props.get(k), setDynamicProperty: (k, v) => (v === undefined ? props.delete(k) : props.set(k, v)),
    getDynamicPropertyIds: () => [...props.keys()], getDynamicPropertyTotalByteCount: () => 0,
    getTimeOfDay: () => worldState.time, setTimeOfDay: (t) => { worldState.time = t; }, getAbsoluteTime: () => st.tick, getDay: () => 0,
    sendMessage() {}, playSound() {}, playMusic() {}, getEntity: (id) => { for (const d of dims.values()) for (const e of d.entities) if (e.id === id) return e; },
    gameRules: new Proxy({}, { get: () => false, set: () => true }),
    scoreboard: new Proxy({}, { get: () => () => undefined }),
    structureManager: new Proxy({}, { get: () => () => undefined }),
    isHardcore: false,
};
export class MolangVariableMap { setFloat() {} setVector3() {} setColorRGB() {} setColorRGBA() {} setSpeedAndDirection() {} }
export const enchantMax = { protection: 4, respiration: 3, aqua_affinity: 1, thorns: 3, blast_protection: 4, fire_protection: 4, projectile_protection: 4, unbreaking: 3, mending: 1, binding: 1, vanishing: 1, sharpness: 5 };
const exclusive = [["protection", "blast_protection", "fire_protection", "projectile_protection"]];
export class EnchantmentType { constructor(id) { this.id = String(id).replace("minecraft:", ""); this.maxLevel = enchantMax[this.id] ?? 1; } }
class Enchantable {
    constructor(slots) { this.slots = slots; this.list = []; }
    idOf(t) { return String(t?.id ?? t).replace("minecraft:", ""); }
    getEnchantments() { return this.list.map((e) => ({ type: e.type, level: e.level })); }
    getEnchantment(t) { const e = this.list.find((x) => x.type.id === this.idOf(t)); return e && { type: e.type, level: e.level }; }
    hasEnchantment(t) { return !!this.getEnchantment(t); }
    canAddEnchantment(e) {
        const id = this.idOf(e.type);
        if (this.slots.includes("ArmorHead") && id === "sharpness") return false;
        if (e.level > (enchantMax[id] ?? 1)) return false;
        const cur = this.list.find((x) => x.type.id === id);
        if (cur) return e.level > cur.level;
        for (const g of exclusive) if (g.includes(id) && this.list.some((x) => g.includes(x.type.id))) return false;
        return true;
    }
    addEnchantment(e) { if (!this.canAddEnchantment(e)) throw new Error("cannot add " + this.idOf(e.type)); const id = this.idOf(e.type); this.list = this.list.filter((x) => x.type.id !== id); this.list.push({ type: new EnchantmentType(id), level: e.level }); }
    addEnchantments(l) { for (const e of l) this.addEnchantment(e); }
    removeEnchantment(t) { const id = this.idOf(t); this.list = this.list.filter((x) => x.type.id !== id); }
    removeAllEnchantments() { this.list = []; }
}
export const itemSlots = (id) => (/wheel_of_adaptation|_helmet$/.test(id) ? ["ArmorHead"] : /sword/.test(id) ? ["Sword"] : null);
export class ItemStack {
    constructor(typeId, amount = 1) {
        this.typeId = String(typeId?.id ?? typeId); this.amount = amount; this.nameTag = undefined; this.keepOnDeath = false; this.lockMode = "none";
        this.lore = []; this.props = new Map(); this.maxAmount = 64; this.isStackable = !itemSlots(this.typeId);
        const s = itemSlots(this.typeId); this.ench = s ? new Enchantable(s) : undefined;
    }
    get type() { return { id: this.typeId }; }
    getLore() { return [...this.lore]; } getRawLore() { return [...this.lore]; } setLore(l) { this.lore = [...(l ?? [])]; }
    getComponent(id) { if (id === "minecraft:enchantable" || id === "enchantable") return this.ench; return undefined; }
    hasComponent(id) { return !!this.getComponent(id); } getComponents() { return this.ench ? [this.ench] : []; }
    hasTag() { return false; } getTags() { return []; } matches(id) { return this.typeId === id; }
    getDynamicProperty(k) { return this.props.get(k); } setDynamicProperty(k, v) { v === undefined ? this.props.delete(k) : this.props.set(k, v); }
    getDynamicPropertyIds() { return [...this.props.keys()]; } isStackableWith(o) { return o.typeId === this.typeId; }
    clone() { const c = new ItemStack(this.typeId, this.amount); c.nameTag = this.nameTag; c.keepOnDeath = this.keepOnDeath; c.lockMode = this.lockMode; c.lore = [...this.lore];
        c.props = new Map(this.props); if (this.ench) c.ench.list = this.ench.list.map((e) => ({ ...e })); return c; }
}
export const BlockPermutation = { resolve: (id, states = {}) => ({ type: { id }, states, getState: (k) => states[k], getAllStates: () => ({ ...states }), matches: (x) => x === id, withState(k, v) { return BlockPermutation.resolve(id, { ...states, [k]: v }); } }) };
export const EntityTypes = { get: (id) => ({ id }), getAll: () => [] };
export const ItemTypes = { get: (id) => ({ id }), getAll: () => [] };
export const BlockTypes = { get: (id) => ({ id }), getAll: () => [] };
export const TicksPerSecond = 20;
