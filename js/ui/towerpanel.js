import { Events } from "../events.js";
import { getTower } from "../data/towers.js";
import { applyUpgrade, canUpgrade, nextUpgradeCost, computeEffective, sellValue } from "../core/upgrades.js";
import { TARGET_MODES } from "../core/targeting.js";
import { getUpgradeDiscountFor } from "../core/buffs.js";
import { isSkillUnlocked, canCast, castSkill, cooldownLeft, isActive, activeLeft } from "../core/abilities.js";
import { Time } from "../time.js";
import { sellRate } from "../core/upgrades.js";

export function createTowerPanel(){
  const wrap = document.createElement("div");
  wrap.className = "panel-left card";
  wrap.innerHTML = `
    <div class="panel-head">
      <div class="h2">รายละเอียด</div>
      <button class="btn-ghost" data-close>ปิด</button>
    </div>
    <div class="hr"></div>
    <div class="panel-body"><div class="meta muted">ยังไม่ได้เลือกยูนิต</div></div>
  `;

  let selected = null;
  let unTick = null;

  function render(inst){
    const spec = getTower(inst.id);
    const eff = computeEffective(spec, inst);
    const discount = getUpgradeDiscountFor(inst);
    const p1Cost = nextUpgradeCost(inst,"p1");
    const p2Cost = nextUpgradeCost(inst,"p2");
    const p1Final = p1Cost==null? null : Math.ceil(p1Cost*(1-discount));
    const p2Final = p2Cost==null? null : Math.ceil(p2Cost*(1-discount));
    const ratePct = Math.round(sellRate(inst)*100);
wrap.querySelector(".panel-body").innerHTML = `
  <!-- ...ของเดิม... -->
  <div class="hr"></div>
  <div class="row" style="justify-content:space-between">
    <div class="muted">ขายคืน ~${ratePct}%: <b class="mono">${sellValue(inst).toLocaleString()}</b> G</div>
    <button class="btn-ghost" data-sell>ขาย</button>
  </div>
`;
    
    wrap.querySelector(".panel-body").innerHTML = `
      <div class="col" style="gap:10px">
        <div class="row" style="justify-content:space-between">
          <div><b>${spec.name}</b> <span class="muted mono">(${inst.id})</span></div>
          <div class="mono">ตำแหน่ง: ${inst.c},${inst.r}</div>
        </div>

        <div class="row" style="gap:10px">
          <div class="stat">DMG <b class="mono">${eff.dmg}</b></div>
          <div class="stat">Interval <b class="mono">${eff.interval}s</b></div>
          <div class="stat">Range <b class="mono">${eff.rangeTiles}t</b></div>
          <div class="stat">Pierce <b class="mono">${eff.pierce||0}</b></div>
        </div>

        <div class="row" style="gap:10px; align-items:center;">
          <div>เป้า:</div>
          <select data-target class="mono">
            ${TARGET_MODES.map(m=>`<option ${inst.target===m?"selected":""} value="${m}">${m}</option>`).join("")}
          </select>
        </div>

        ${renderSkillBlock(inst)}

        <div class="hr"></div>
        <div class="h2">อัปเกรด</div>
        <div class="muted">ส่วนลดอัปเกรดในระยะ: <b>${Math.round(discount*100)}%</b></div>

        <div class="row" style="gap:12px; align-items:flex-start;">
          <div class="card mini">
            <div><b>สาย 1</b></div>
            <div class="muted">Lv. ${inst.p1}/5</div>
            <button class="btn-accent" data-up="p1" ${!canUpgrade(inst,"p1")?"disabled":""}>
              อัป 1 ขั้น — <span data-cost-p1>${fmt(p1Final)}</span> G
            </button>
          </div>
          <div class="card mini">
            <div><b>สาย 2</b></div>
            <div class="muted">Lv. ${inst.p2}/5</div>
            <button class="btn-accent" data-up="p2" ${!canUpgrade(inst,"p2")?"disabled":""}>
              อัป 1 ขั้น — <span data-cost-p2>${fmt(p2Final)}</span> G
            </button>
          </div>
        </div>

        <div class="hr"></div>
        <div class="row" style="justify-content:space-between">
          <div class="muted">ขายคืน ~60%: <b class="mono">${sellValue(inst).toLocaleString()}</b> G</div>
          <button class="btn-ghost" data-sell>ขาย</button>
        </div>
      </div>
    `;

    wrap.querySelector("[data-up='p1']")?.addEventListener("click", ()=>{ if (applyUpgrade(inst,"p1")) update(inst); });
    wrap.querySelector("[data-up='p2']")?.addEventListener("click", ()=>{ if (applyUpgrade(inst,"p2")) update(inst); });
    wrap.querySelector("[data-sell]")?.addEventListener("click", ()=>{
      if (!confirm("ขายยูนิตนี้หรือไม่?")) return;
      const refund = sellValue(inst);
      Events.emit("tower:sell", { inst, refund });
    });
    wrap.querySelector("[data-target]")?.addEventListener("change", (e)=>{
      inst.target = e.target.value; Events.emit("tower:updated", { inst });
    });

    unTick?.(); unTick = Time.onTick(()=> updateSkillUI(inst));
  }

  function renderSkillBlock(inst){
    // commander/dj: เหมือนตอน 6 — heli/ac130: เพิ่มพิเศษ
    if (inst.id === "heli"){
      return `
        <div class="hr"></div>
        <div class="h2">สกิล</div>
        <div class="row" style="gap:8px; align-items:center;">
          <button class="btn-accent" data-cast>ย้ายตำแหน่ง</button>
          <div class="muted" data-skill-status>คลิกเพื่อกำหนดตำแหน่งใหม่บนแผนที่</div>
        </div>
      `;
    }
    if (inst.id === "ac130"){
      return `
        <div class="hr"></div>
        <div class="h2">สกิล</div>
        <div class="row" style="gap:8px; align-items:center;">
          <button class="btn-accent" data-cast>เรียก AC-130</button>
          <div class="muted" data-skill-status>พร้อมใช้งาน</div>
        </div>
        <div class="muted" style="font-size:12px">เครื่องบินจะบินรอบแมพ ~80 วิ แล้วคูลดาวน์ 70 วิ</div>
      `;
    }
    // เดิม (commander/dj)
    const unlocked = isSkillUnlocked(inst);
    const label = inst.id==="commander" ? "คำสั่งรุก (เร่ง AS/DMG)" : "บีทเร่ง (เร่ง AS เพิ่มเติม)";
    return `
      <div class="hr"></div>
      <div class="h2">สกิล</div>
      <div class="row" style="gap:8px; align-items:center;">
        <button class="btn-accent" data-cast ${!unlocked?"disabled":""}>ใช้สกิล</button>
        <div class="muted" data-skill-status>${unlocked? "พร้อมใช้งาน" : "ปลดเมื่ออัป สาย 1 ขั้น 3"}</div>
      </div>
      <div class="muted" style="font-size:12px">${label}</div>
    `;
  }

  function updateSkillUI(inst){
    const el = wrap.querySelector("[data-skill-status]");
    const btn = wrap.querySelector("[data-cast]");
    if (!el || !btn) return;

    if (inst.id === "heli"){
      btn.onclick = ()=> { castSkill(inst); el.textContent = "กำลังรอคลิกตำแหน่งใหม่บนแผนที่…"; };
      return;
    }

    if (inst.id === "ac130"){
      const cd = cooldownLeft(inst);
      if (isActive(inst)){
        btn.disabled = true; el.textContent = `กำลังปฏิบัติการ เหลือ ${activeLeft(inst).toFixed(1)}s`;
      } else if (cd > 0){
        btn.disabled = true; el.textContent = `คูลดาวน์ ${cd.toFixed(1)}s`;
      } else {
        btn.disabled = false; el.textContent = "พร้อมใช้งาน";
      }
      btn.onclick = ()=> { if (castSkill(inst)) updateSkillUI(inst); };
      return;
    }

    // commander/dj เดิม
    const unlocked = isSkillUnlocked(inst);
    if (!unlocked){ btn.disabled = true; el.textContent = "ปลดเมื่ออัป สาย 1 ขั้น 3"; return; }
    if (isActive(inst)){ btn.disabled = true; el.textContent = `กำลังทำงาน เหลือ ${activeLeft(inst).toFixed(1)}s`; return; }
    const cd = cooldownLeft(inst);
    if (cd > 0){ btn.disabled = true; el.textContent = `คูลดาวน์ ${cd.toFixed(1)}s`; }
    else { btn.disabled = false; el.textContent = "พร้อมใช้งาน"; }
    btn.onclick = ()=> { if (castSkill(inst)) updateSkillUI(inst); };
  }

  function update(inst){ if (!inst){ clear(); return; } selected = inst; render(inst); }
  function clear(){ selected = null; unTick?.(); unTick=null; wrap.querySelector(".panel-body").innerHTML = `<div class="meta muted">ยังไม่ได้เลือกยูนิต</div>`; }

  wrap.querySelector("[data-close]").addEventListener("click", clear);
  wrap.setSelected = update; wrap.clear = clear; return wrap;
}
function fmt(x){ return x==null? "—" : x.toLocaleString(); }