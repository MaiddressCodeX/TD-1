// โหมดเลือกเป้า: first(ใกล้ปลายทาง), last(เพิ่งออก), closest, strongest(HP สูง)
export const TARGET_MODES = ["first","last","closest","strongest"];

export function pickTarget(towerWorld, enemies, map, mode="first"){
  const tile = map.grid.tile;
  const tx = towerWorld.c*tile + tile/2;
  const ty = towerWorld.r*tile + tile/2;
  const range = towerWorld.eff.rangeTiles * tile;
  let best = null, score = -Infinity;

  for (const e of enemies){
    if (e.flying && !towerWorld.spec.canAir) continue;
    const dx = e.x - tx, dy = e.y - ty;
    const d2 = dx*dx + dy*dy;
    if (d2 > range*range) continue;

    let s = 0;
    if (mode === "first")      s = e.seg + e.segT;
    else if (mode === "last")  s = -(e.seg + e.segT);
    else if (mode === "closest") s = -Math.sqrt(d2);
    else if (mode === "strongest") s = e.hp;
    if (s > score) { score = s; best = e; }
  }
  return best;
}