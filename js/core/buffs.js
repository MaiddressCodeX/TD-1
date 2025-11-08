import { GameState } from "./gamestate.js";
import { getTower } from "../data/towers.js";
import { isActive } from "./abilities.js";
import { Shop } from "./shop.js";

function distTile(a,b){ return Math.hypot(a.c-b.c, a.r-b.r); }

export function getBuffFor(targetInst){
  const towers = GameState.allPlaced();
  const specTarget = getTower(targetInst.id);
  if (!specTarget.acceptsBuffs) return { dmgMul:0, intervalMul:1, rangeAdd:0, upgDiscount:0 };

  let dmgMul = 0, intervalMul = 1, rangeAdd = 0, upgDiscount = 0;

  // DJ / Commander (เหมือนตอน 6)
  for (const src of towers){
    if (src===targetInst) continue;
    const spec = getTower(src.id);
    if (src.id==="dj"){
      let aura = spec.rangeTiles + (0.6*src.p2);
      if (distTile(src, targetInst) <= aura){
        if (src.p1>0){ const as=0.06*src.p1, dm=0.06*src.p1; intervalMul *= (1-as); dmgMul += dm; }
        if (src.p2>0){ upgDiscount += 0.06*src.p2; rangeAdd += 0.20*src.p2; }
        if (isActive(src)) intervalMul *= 0.70;
      }
    }
    if (src.id==="commander" && isActive(src)){
      if (distTile(src, targetInst) <= spec.rangeTiles){ intervalMul *= 0.75; dmgMul += 0.25; }
    }
  }

  // ร้านค้า (โกลบอล)
  const s = Shop.statBonusFor(targetInst, specTarget, {});
  dmgMul += s.dmgMul; intervalMul *= s.intervalMul; rangeAdd += s.rangeAdd;

  // ส่วนลดร้านค้าโกลบอล → ไปบวกเพิ่มตอนคำนวณอัปเกรด (ผ่าน window hook)
  window.__shopGlobalDisc = Shop.globalUpgradeDiscount();

  upgDiscount = Math.min(0.5, upgDiscount); // จาก DJ (ส่วนของร้านถูกนับแยกตอนคิดราคา)
  return { dmgMul, intervalMul, rangeAdd, upgDiscount };
}
export function getUpgradeDiscountFor(inst){
  const b = getBuffFor(inst);
  return b.upgDiscount;
}
export function applyBuffToEff(eff, buff){
  eff = { ...eff };
  eff.dmg *= (1 + buff.dmgMul);
  eff.interval *= buff.intervalMul;
  eff.rangeTiles += buff.rangeAdd;
  eff.dmg = +eff.dmg.toFixed(2);
  eff.interval = Math.max(0.02, +eff.interval.toFixed(3));
  eff.rangeTiles = +eff.rangeTiles.toFixed(2);
  return eff;
}