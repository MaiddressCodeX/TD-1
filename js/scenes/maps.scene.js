import { Router } from "../router.js";
import { Storage } from "../storage.js";

const MAPS = [
  { id:"meadow-01", name:"Meadow 01", desc:"สนามหญ้า ทางคดเคี้ยวมาตรฐาน" },
  { id:"desert-01", name:"Desert 01", desc:"ทะเลทราย ทางเร็วขึ้นนิด + โค้งยาว" },
  { id:"harbor-01", name:"Harbor 01", desc:"ท่าเรือ มีพื้นที่น้ำกว้างสำหรับเรือรบ" },
];

export const MapsScene = {
  async render(){
    const s = Storage.get();
    const wrap = document.createElement("div");
    wrap.className = "container";
    wrap.innerHTML = `
      <div class="card">
        <div class="h1">เลือกแผนที่</div>
        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(240px,1fr)); gap:12px; margin-top:8px;">
          ${MAPS.map(m=>`
            <div class="card mini col" style="gap:6px">
              <div class="h2">${m.name}</div>
              <div class="muted">${m.desc}</div>
              <button class="btn-accent" data-pick="${m.id}">เล่นแผนที่นี้</button>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    wrap.querySelectorAll("[data-pick]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const mapId = btn.getAttribute("data-pick");
        Router.go("/game", { difficulty: s.lastDifficulty || "easy", map: mapId });
      });
    });
    return wrap;
  }
};