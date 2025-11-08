import { getTower } from "../data/towers.js";
import { Events } from "../events.js";
import { GameState } from "./gamestate.js";
import { getUpgradeDiscountFor } from "./buffs.js";
import { Time } from "../time.js";

export function makeTowerInstance(spec, c, r){
  return { id: spec.id, c, r, p1: 0, p2: 0, spent: spec.cost, target: "first", placedAt: Time.time };
}

export function sellValue(inst){
  const age = Math.max(0, Time.time - (inst.placedAt||0)); // วัดเป็น "เวลาเกม"
  // ภายใน 10 วิ ได้ 90% ; 10-60 วิ ได้ 60% ; มากกว่า 60 วิ ได้ 45%
  const rate = age < 10 ? 0.90 : age < 60 ? 0.60 : 0.45;
  return Math.floor(inst.spent * rate);
}
export function sellRate(inst){
  const age = Math.max(0, Time.time - (inst.placedAt||0));
  return age < 10 ? 0.90 : age < 60 ? 0.60 : 0.45;
}

// ===== (ฟังก์ชันอัปฯ อื่น ๆ คงเดิม) =====
export function canUpgrade(inst, path){
  const spec = getTower(inst.id);
  const other = path === "p1" ? inst.p2 : inst.p1;
  const cur   = inst[path];
  const max   = (spec.upgrades[path]?.length || 0);
  if (cur >= max) return false;
  const next = cur + 1;
  if (next > 3 && other > 2) return false;
  if (other > 3 && next > 2) return false;
  return true;
}
export function nextUpgradeCost(inst, path){
  const spec = getTower(inst.id);
  const lvl = inst[path];
  const arr = spec.upgrades[path] || [];
  return arr[lvl]?.cost ?? null;
}
export function applyUpgrade(inst, path){
  if (!canUpgrade(inst, path)) return false;
  const baseCost = nextUpgradeCost(inst, path);
  if (baseCost == null) return false;
  const discount = Math.min(0.5, getUpgradeDiscountFor(inst) + (window.__shopGlobalDisc||0));
  const finalCost = Math.max(0, Math.ceil(baseCost * (1 - discount)));
  if (!GameState.spend(finalCost)) return false;
  inst[path] += 1; inst.spent += finalCost;
  Events.emit("tower:updated", { inst });
  return true;
}
export function computeEffective(spec, inst){
  const eff = { dmg: spec.base.dmg, interval: spec.base.interval, rangeTiles: spec.rangeTiles, pierce: 0 };
  const applyArr = (arr, n)=>{
    for (let i=0;i<n;i++){
      const u = arr[i]; if (!u) break;
      if (u.dmgMul) eff.dmg *= u.dmgMul;
      if (u.dmgAdd) eff.dmg += u.dmgAdd;
      if (u.intervalMul) eff.interval *= u.intervalMul;
      if (u.rangeAdd) eff.rangeTiles += u.rangeAdd;
      if (u.pierceAdd) eff.pierce += u.pierceAdd;
    }
  };
  applyArr(spec.upgrades?.p1 || [], inst.p1);
  applyArr(spec.upgrades?.p2 || [], inst.p2);
  eff.dmg = Math.max(0, +eff.dmg.toFixed(2));
  eff.interval = Math.max(0.02, +eff.interval.toFixed(3));
  eff.rangeTiles = Math.max(0, +eff.rangeTiles.toFixed(2));
  return eff;
}