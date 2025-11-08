export function applyDamage(enemy, { dmg, dtype="physical" }){
  if (enemy.shield) return; // โล่อยู่ — ไม่ได้รับดาเมจ
  let eff = Math.max(1, dmg - (enemy.armor || 0));
  const res = enemy.resists || {};
  if (dtype==="physical") eff *= (res.phys ?? 1.0);
  else if (dtype==="fire") eff *= (res.fire ?? 1.0);
  else if (dtype==="explosive") eff *= (res.expl ?? 1.0);
  enemy.hp -= eff;
}