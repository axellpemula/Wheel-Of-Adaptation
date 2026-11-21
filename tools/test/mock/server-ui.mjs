function form() {
    const calls = [];
    const f = new Proxy({ calls, show: async () => ({ canceled: true, cancelationReason: "UserClosed" }) }, {
        get(t, k) { if (k in t) return t[k]; if (typeof k === "symbol") return undefined; return (...a) => (calls.push([k, ...a]), f); },
    });
    return f;
}
export class ActionFormData { constructor() { return form(); } }
export class ModalFormData { constructor() { return form(); } }
export class MessageFormData { constructor() { return form(); } }
export const FormCancelationReason = { UserBusy: "UserBusy", UserClosed: "UserClosed" };
