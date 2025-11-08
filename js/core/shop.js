// ร้าน “แพ็คอัปเกรด” ระดับโกลบอลต่อรอบ (Run) — ซื้อด้วยเงินในเกม
// ผลรวมเข้าไปเป็นโบนัสถาวรจนจบเกม (สแตกตามที่ระบุ)
import { GameState } from "./gamestate.js";
import { Events } from "../events.js";

const SHOP = {
  packs: [
    { id:"pack_ballistics", name:"Ballistics Lab", desc:"+10% DMG ป้อมกายภาพ", price:1800, max:3, type:"stat", effects:{ dmgMulPhysical:0.10 } },
    { id:"pack_pyro",       name:"Thermochem",      desc:"+12% DMG ป้อมไฟ",     price:1600, max:3, type:"stat", effects:{ dmgMulFire:0.12 } },
    { id:"pack_logi",       name:"Logistics",       desc:"-8% ค่าอัปทั่วทั้งทีม", price:2200, max:4, type:"meta", effects:{ upgDiscountGlobal:0.08 } },
    { id:"pack_quick",      name:"Rapid Training",  desc:"โจมตีเร็วขึ้น 6%",   price:2400, max:3, type:"stat", effects:{ intervalMulAll:-0.06 } },
    { id:"pack_aero",       name:"Aerial Suite",    desc:"+0.5 ช่องระยะยิง (ป้อมยิงอากาศได้)", price:2000, max:2, type:"stat", effects:{ rangeAddAir:0.5 } },
    { id:"pack_econ",       name:"Economy+",        desc:"+15% รายได้ฟาร์มต่อเวฟ", price:2500, max:3, type:"econ", effects:{ farmIncomeMul:0.15 } },
  ]
};

const State = {
  owned: new Map(), // id -> level
};

export const Shop = {
  list(){ return SHOP.packs.map(p => ({ ...p, level: State.owned.get(p.id) || 0 })); },
  canBuy(id){
    const p = SHOP.packs.find(x=>x.id===id); if (!p) return false;
    const lv = State.owned.get(id) || 0;
    return lv < p.max && GameState.canAfford(p.price);
  },
  buy(id){
    const p = SHOP.packs.find(x=>x.id===id); if (!p) return false;
    const lv = State.owned.get(id) || 0;
    if (lv >= p.max) return false;
    if (!GameState.spend(p.price)) return false;
    State.owned.set(id, lv+1);
    Events.emit("shop:buy", { id, level: lv+1 });
    return true;
  },
  // ===== ผลกระทบ =====
  // 1) บัฟค่า Stat ของป้อม (คูณรวม)
  statBonusFor(inst, spec, eff){
    let dmgMul = 0, intervalMul = 1, rangeAdd = 0;
    for (const [id,lv] of State.owned){
      const p = SHOP.packs.find(x=>x.id===id); if (!p || lv<=0) continue;
      const effs = p.effects;
      for (let i=0;i<lv;i++){
        if (effs.dmgMulPhysical && spec.dtype==="physical") dmgMul += effs.dmgMulPhysical;
        if (effs.dmgMulFire && spec.dtype==="fire") dmgMul += effs.dmgMulFire;
        if (effs.intervalMulAll) intervalMul *= (1 + effs.intervalMulAll); // effs.intervalMulAll เป็นค่าลบเพื่อให้เร็วขึ้น
        if (effs.rangeAddAir && spec.canAir) rangeAdd += effs.rangeAddAir;
      }
    }
    return { dmgMul, intervalMul, rangeAdd };
  },
  // 2) ส่วนลดอัปเกรด “ทั่วทั้งทีม”
  globalUpgradeDiscount(){
    let disc = 0;
    for (const [id,lv] of State.owned){
      const p = SHOP.packs.find(x=>x.id===id); if (!p || lv<=0) continue;
      if (p.effects.upgDiscountGlobal) disc += p.effects.upgDiscountGlobal * lv;
    }
    return Math.min(0.5, disc);
  },
  // 3) ตัวคูณรายได้ฟาร์มต่อเวฟ
  farmIncomeMultiplier(){
    let mul = 1;
    for (const [id,lv] of State.owned){
      const p = SHOP.packs.find(x=>x.id===id); if (!p || lv<=0) continue;
      if (p.effects.farmIncomeMul) mul *= (1 + p.effects.farmIncomeMul * lv);
    }
    return mul;
  },
  reset(){ State.owned.clear(); }
};