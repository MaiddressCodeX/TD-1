// Router แบบซีนเดียว (SPA)
const SCENES = new Map();
let current = null;
let node = null;

export const Router = {
  mount(el) { node = el; },
  register(name, mod) { SCENES.set(name, mod); },
  async go(name, payload) {
    const mod = SCENES.get(name);
    if (!mod) throw new Error(`Scene "${name}" not found`);
    node.innerHTML = "";
    const el = await mod.render(payload);
    el.classList.add("page-enter");
    node.appendChild(el);
    current = { name, mod, el };
    if (mod.onMount) mod.onMount(payload);
  },
  get current() { return current?.name ?? null; }
};