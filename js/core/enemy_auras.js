// ดีบัฟจาก "บอส" ใกล้ ๆ: เพิ่ม interval และลด DMG ของป้อมในระยะ
export function getTowerDebuff(inst, enemies, map){
  let intervalMul = 1, dmgMul = 1; // คูณผลลัพธ์สุดท้าย
  const tile = map.grid.tile;
  const tx = inst.c*tile + tile/2, ty = inst.r*tile + tile/2;

  for (const e of enemies){
    if (!e.aura) continue;
    const d = Math.hypot(e.x - tx, e.y - ty);
    if (d <= e.aura.radiusTiles * tile){
      intervalMul *= (1 + (e.aura.slow || 0)); // ช้าลง
      dmgMul *= (1 - (e.aura.weaken || 0));    // เบาลง
    }
  }
  return { intervalMul, dmgMul };
}