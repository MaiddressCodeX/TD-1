// Macro Recorder อย่างง่าย: บันทึกการวาง/อัป/สกิล/ย้าย — เล่นซ้ำตามเวลาเกม
import { Events } from "../events.js";
import { Time } from "../time.js";
import { GameState } from "./gamestate.js";
import { applyUpgrade } from "./upgrades.js";

let recording = false;
let t0 = 0;
let logs = []; // {t, type, data}

export function isRecording(){ return recording; }
export function getLogs(){ return logs.slice(); }
export function clearLogs(){ logs = []; }

export function startRecord(){
  recording = true; t0 = Time.time; logs = [];
}
export function stopRecord(){ recording = false; }

function rec(type, data){
  if (!recording) return;
  logs.push({ t: Time.time - t0, type, data });
}

// Hook เหตุการณ์
Events.on("tower:placed", ({ inst })=>{
  rec("place", { id:inst.id, c:inst.c, r:inst.r });
});
Events.on("tower:updated", ({ inst })=>{
  rec("upgrade", { id:inst.id, c:inst.c, r:inst.r, p1:inst.p1, p2:inst.p2 });
});
Events.on("tower:moved", ({ inst })=>{
  rec("move", { id:inst.id, c:inst.c, r:inst.r });
});
Events.on("skill:cast", ({ inst })=>{
  rec("skill", { id:inst.id });
});

// เล่นซ้ำแบบง่าย (พยายามตามงบ ถ้าเงินไม่พอจะข้าม)
export async function replay(){
  if (!logs.length) return;
  const start = Time.time;
  for (const item of logs){
    const wait = Math.max(0, (start + item.t) - Time.time);
    if (wait > 0) await sleep(wait*1000);
    const { type, data } = item;
    if (type === "place"){
      // ถ้าซ้อน/ทับ/เงินไม่พอ ให้ข้าม
      if (!GameState.isOccupied(data.c, data.r)){
        // ใช้ addTower โดยตรง — ถ้าอยากเช็คเงิน ให้เพิ่ม spend ตามราคาจริง
        GameState.addTower(data.id, data.c, data.r);
      }
    } else if (type === "upgrade"){
      const inst = GameState.allPlaced().find(t=> t.c===data.c && t.r===data.r && t.id===data.id);
      if (!inst) continue;
      while (inst.p1 < data.p1) if (!applyUpgrade(inst,"p1")) break;
      while (inst.p2 < data.p2) if (!applyUpgrade(inst,"p2")) break;
    } else if (type === "move"){
      const inst = GameState.allPlaced().find(t=> t.id===data.id);
      if (inst) GameState.moveTower(inst, data.c, data.r);
    } else if (type === "skill"){
      Events.emit("skill:cast", { inst: GameState.allPlaced().find(t=> t.id===data.id), until: Time.time+1 });
    }
  }
}

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }