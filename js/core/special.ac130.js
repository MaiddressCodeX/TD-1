import { Time } from "../time.js";
import { Events } from "../events.js";

const SKILL = {
  commander: { cd: 30, dur: 8 },
  dj:        { cd: 30, dur: 8 },
  ac130:     { cd: 70, dur: 80 } // ตามสเปค: บิน 1:20 แล้ว CD 70 วิ
};

const skillMap = new WeakMap();

export function isSkillUnlocked(inst){
  if (inst.id === "commander") return inst.p1 >= 3;
  if (inst.id === "dj")        return inst.p1 >= 3;
  if (inst.id === "ac130")     return true;
  if (inst.id === "heli")      return true; // ย้ายตำแหน่งได้เสมอ (ไม่มีเวลา/คูลดาวน์ในระบบนี้)
  return false;
}

function getState(inst){
  let s = skillMap.get(inst);
  if (!s){ s = { cdEnd: 0, activeUntil: 0 }; skillMap.set(inst, s); }
  return s;
}

export function canCast(inst){
  if (inst.id === "heli") return true; // ใช้โหมดกำหนดตำแหน่ง ไม่ใช่สกิลติดเวลา
  const now = Time.time; const s = getState(inst);
  return now >= s.cdEnd;
}

export function castSkill(inst){
  if (inst.id === "heli"){ Events.emit("heli:relocate:start", { inst }); return true; }
  const cfg = SKILL[inst.id]; if (!cfg) return false;
  if (!canCast(inst)) return false;
  const now = Time.time; const s = getState(inst);
  s.activeUntil = now + cfg.dur;
  s.cdEnd = now + cfg.cd;
  Events.emit("skill:cast", { inst, until: s.activeUntil });
  return true;
}

export function isActive(inst){
  if (inst.id === "heli") return false;
  const now = Time.time; const s = getState(inst); return now < s.activeUntil;
}
export function cooldownLeft(inst){
  if (inst.id === "heli") return 0;
  const now = Time.time; const s = getState(inst); return Math.max(0, s.cdEnd - now);
}
export function activeLeft(inst){
  if (inst.id === "heli") return 0;
  const now = Time.time; const s = getState(inst); return Math.max(0, s.activeUntil - now);
}