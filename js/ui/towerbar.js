import { TOWERS, getTower } from "../data/towers.js";
import { GameState } from "../core/gamestate.js";
import { Placement } from "../core/placement.js";
import { Events } from "../events.js";

export function createTowerBar({ map, view }) {
  const wrap = document.createElement("div");
  wrap.className = "towerbar";

  const toggle = document.createElement("button");
  toggle.className = "towerbar-toggle btn-accent";
  toggle.textContent = "ยูนิต ▸";
  toggle.addEventListener("click", ()=> wrap.classList.toggle("open"));
  wrap.appendChild(toggle);

  const panel = document.createElement("div");
  panel.className = "towerbar-panel card";
  panel.innerHTML = `
    <div class="h2">เลือกยูนิต</div>
    <div class="muted" style="margin-bottom:8px">คลิกเพื่อเข้าสู่โหมดวาง</div>
    <div class="tb-grid"></div>
  `;
  wrap.appendChild(panel);

  const grid = panel.querySelector(".tb-grid");

  function renderButtons(){
    grid.innerHTML = "";
    const money = GameState.money;

    for (const t of TOWERS) {
      const count = GameState.count(t.id);
      const reached = count >= t.limit;
      const btn = document.createElement("button");
      btn.className = "tb-item";
      btn.innerHTML = `
        <div class="tb-row1">
          <b>${t.name}</b>
          <span class="mono">${t.cost.toLocaleString()} G</span>
        </div>
        <div class="tb-row2 muted">
          ${iconForPlacement(t.placement)} • ${t.limit===Infinity ? "∞" : `จำกัด ${t.limit}`}
        </div>
      `;
      btn.disabled = reached || money < t.cost || Placement.isPlacing();
      btn.addEventListener("click", ()=>{
        if (btn.disabled) return;
        Placement.begin(t.id, map, view);
        updateDisabled();
        // เปิดปุ่มยกเลิก/วางด้านล่าง (มีใน game.scene.js)
      });
      grid.appendChild(btn);
    }
  }

  function updateDisabled(){
    const buttons = grid.querySelectorAll(".tb-item");
    const money = GameState.money;
    TOWERS.forEach((t, idx)=>{
      const btn = buttons[idx];
      const reached = GameState.count(t.id) >= t.limit;
      btn.disabled = reached || money < t.cost || Placement.isPlacing();
    });
  }

  function iconForPlacement(p){
    if (p === "water") return "🌊 น้ำ";
    if (p === "land") return "🌿 บก";
    return "🛰️ ใดๆ";
  }

  // ฟังเหตุการณ์เปลี่ยนเงิน/วาง
  const un1 = Events.on("money:change", renderButtons);
  const un2 = Events.on("tower:placed", renderButtons);

  renderButtons();
  wrap.cleanup = ()=> { un1(); un2(); };

  return wrap;
}