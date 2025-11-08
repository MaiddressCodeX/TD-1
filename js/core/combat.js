import { getTower } from "../data/towers.js";
import { computeEffective } from "./upgrades.js";
import { pickTarget } from "./targeting.js";
import { spawnBullet } from "./projectiles.js";
import { getBuffFor, applyBuffToEff } from "./buffs.js";
import { getTowerDebuff } from "./enemy_auras.js";

const towerRuntime = new Map();
function keyFor(t){ return `${t.c},${t.r}`; }
export function resetRuntime(){ towerRuntime.clear(); }

export function updateCombat(dt, map, towersPlaced, enemies){
  const tile = map.grid.tile;

  for (const inst of towersPlaced){
    const spec = getTower(inst.id);
    let eff = computeEffective(spec, inst);
    // บัฟฝั่งเรา
    const buff = getBuffFor(inst);
    eff = applyBuffToEff(eff, buff);
    // ดีบัฟจากบอส (ศัตรู)
    const bd = getTowerDebuff(inst, enemies, map);
    eff.interval *= bd.intervalMul;
    eff.dmg *= bd.dmgMul;
    inst.eff = eff;

    if (eff.dmg<=0 || eff.interval<=0) continue;

    const k = keyFor(inst);
    const rt = towerRuntime.get(k) ?? { cd: 0 };
    rt.cd -= dt;

    if (rt.cd <= 0){
      const target = pickTarget({ ...inst, spec, eff }, enemies, map, inst.target);
      if (target){
        const x0 = (inst.fx ?? inst.c*tile + tile/2);
        const y0 = (inst.fy ?? inst.r*tile + tile/2);
        spawnBullet({ x:x0, y:y0, tx:target.x, ty:target.y, dmg:eff.dmg, pierce:eff.pierce, speedPx:900, dtype:spec.dtype||"physical" });
        rt.cd = eff.interval;
      } else rt.cd = 0.05;
    }
    towerRuntime.set(k, rt);
  }
  return 0;
}