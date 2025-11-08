import { Shop } from "../core/shop.js";

export function buildShopButton(){
  const btn = document.createElement("button");
  btn.className = "btn-ghost";
  btn.textContent = "ร้านค้า";
  btn.addEventListener("click", openShop);
  return btn;
}

function openShop(){
  const modal = document.createElement("div");
  modal.className = "modal";
  const packs = Shop.list();
  modal.innerHTML = `
    <div class="modal-card">
      <div class="h2">ร้านอัปเกรด (แพ็ค)</div>
      <div class="col" style="gap:10px; max-height:60vh; overflow:auto;">
        ${packs.map(p=>`
          <div class="card mini row" style="justify-content:space-between; align-items:center;">
            <div class="col" style="gap:6px">
              <div><b>${p.name}</b> <span class="muted mono">Lv. ${p.level}/${p.max}</span></div>
              <div class="muted">${p.desc}</div>
            </div>
            <button class="btn-accent" data-buy="${p.id}" ${p.level>=p.max?"disabled":""}>ซื้อ ${p.price.toLocaleString()} G</button>
          </div>
        `).join("")}
      </div>
      <div class="hr"></div>
      <button class="btn-ghost" data-close>ปิด</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelectorAll("[data-buy]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-buy");
      if (Shop.buy(id)) { modal.remove(); openShop(); }
    });
  });
  modal.querySelector("[data-close]").addEventListener("click", ()=> modal.remove());
}