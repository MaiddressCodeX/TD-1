// จัดการสกิลที่กดใช้: ผู้บัญชาการ + DJ
import { Time } from "../time.js";
import { Events } from "../events.js";

const SKILL = {
  commander: { cd: 30, dur: 8 }, // วินาที (ตามสเปค CD 30 วิ)
  dj:        { cd: 30, dur: 8 }
};

const skillMap = new WeakMap(); // inst -> { cdEnd, activeUntil }

export function isSkillUnlocked(inst){
  if (inst.id === "commander") return inst.p1 >= 3;
  if (inst.id === "dj")        return inst.p1 >= 3; // สาย 1 ขั้น 3
  return false;
}

function getState(inst){
  let s = skillMap.get(inst);
  if (!s){ s = { cdEnd: 0, activeUntil: 0 }; skillMap.set(inst, s); }
  return s;
}

export function canCast(inst){
  if (!isSkillUnlocked(inst)) return false;
  const now = Time.time;
  const s = getState(inst);
  return now >= s.cdEnd; // ไม่ติดคูลดาวน์
}

export function castSkill(inst){
  if (!canCast(inst)) return false;
  const now = Time.time;
  const cfg = SKILL[inst.id];
  if (!cfg) return false;
  const s = getState(inst);
  s.activeUntil = now + cfg.dur;
  s.cdEnd = now + cfg.cd;
  Events.emit("skill:cast", { inst, until: s.activeUntil });
  return true;
}

export function isActive(inst){
  const now = Time.time;
  const s = getState(inst);
  return now < s.activeUntil;
}

export function cooldownLeft(inst){
  const now = Time.time;
  const s = getState(inst);
  return Math.max(0, s.cdEnd - now);
}

export function activeLeft(inst){
  const now = Time.time;
  const s = getState(inst);
  return Math.max(0, s.activeUntil - now);
}