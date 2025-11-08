import { Router } from "../router.js";
import { DIFFICULTY } from "../config.js";
import { Router } from "../router.js";
import { Storage } from "../storage.js";

function createCurtain(){
  const c = document.createElement("div");
  c.className = "curtain";
  c.innerHTML = `
    <div class="col center" style="gap:14px">
      <div class="spinner"></div>
      <div class="muted">กำลังโหลดแผนที่…</div>
    </div>
  `;
  document.body.appendChild(c);
  return c;
}
function pick(mode, startMoney){
  const s = Storage.get(); s.lastDifficulty = mode; Storage.set(s);
  Router.go("/maps");

export const DifficultyScene = {
  async render() {
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <header class="header container">
        <button class="btn-ghost" data-back>← กลับ</button>
        <div class="brand">เลือกความยาก</div>
        <div></div>
      </header>
      <main class="container">
        <div class="card">
          <div class="diff-grid">
            ${Object.entries(DIFFICULTY).map(([key, v])=>`
              <div class="diff-card card">
                <div class="h2">${v.label}</div>
                <div class="meta">${v.desc}</div>
                <div class="meta">เริ่มเงิน: <b class="mono">${v.startMoney.toLocaleString()}</b></div>
                <button class="btn-accent" data-diff="${key}">เลือก</button>
              </div>
            `).join("")}
          </div>
        </div>
      </main>
    `;

    wrap.querySelector("[data-back]").addEventListener("click", ()=> Router.go("menu"));

    wrap.querySelectorAll("[data-diff]").forEach(btn=>{
      btn.addEventListener("click", async ()=>{
        const key = btn.getAttribute("data-diff");
        const curtain = createCurtain();
        curtain.classList.add("open");
        // จำลองโหลด 1.2 วิ
        setTimeout(()=> {
          curtain.remove();
          Router.go("game", { difficulty: key });
        }, 1200);
      });
    });

    return wrap;
  }
};