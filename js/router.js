const routes = {};
let latestState = {};

async function render() {
  const root = document.getElementById("app");
  if (!root) return console.error("#app not found");
  const hash = location.hash.slice(1) || "/";
  const [path, qs] = hash.split("?");
  const state = qs ? JSON.parse(decodeURIComponent(qs)) : {};
  latestState = state;
  const scene = routes[path] || routes["/"];
  const el = await scene.render?.(state);
  root.innerHTML = "";
  root.appendChild(el || document.createTextNode("No scene"));
}

export const Router = {
  add(path, scene){ routes[path] = scene; },
  go(path, state={}){
    const q = Object.keys(state).length ? "?" + encodeURIComponent(JSON.stringify(state)) : "";
    location.hash = path + q;
  },
  start(){ window.addEventListener("hashchange", render); render(); },
  get state(){ return latestState; }
};
