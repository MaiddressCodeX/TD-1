// ยูนิตฝ่ายเรา (จาก "ฐานทัพ") เดินจากเป้าหมาย→ย้อนกลับไปทาง Spawn และโจมตีระยะใกล้
import { GameState } from "./gamestate.js";

const A = {
  allies: [],        // {type,x,y,spd,range, dmg,interval,cd}
  timers: new WeakMap(), // basecamp inst -> {t1,t2,t3, q1,q2,q3}
  pathRev: null,     // path ย้อนกลับ
  tile: 48,
};

export function initAllies(map){
  const pts = map.path.map(([c,r])=>[c*map.grid.tile+map.grid.tile/2, r*map.grid.tile+map.grid.tile/2]);
  A.pathRev = pts.slice().reverse();
  A.tile = map.grid.tile;
  A.allies.length = 0;
  A.timers = new WeakMap();
}

function ensureTimer(inst){
  let t = A.timers.get(inst);
  if (!t){ t = { t1:0,t2:0,t3:0, q1:0,q2:0,q3:0 }; A.timers.set(inst,t); }
  return t;
}

function spawnAlly(kind){
  if (kind==="pistol")  A.allies.push({ type:"pistol", x:A.pathRev[0][0], y:A.pathRev[0][1], spd:2.2, range:0.6*A.tile, dmg:20, interval:0.7, cd:0 });
  if (kind==="smg")     A.allies.push({ type:"smg",    x:A.pathRev[0][0], y:A.pathRev[0][1], spd:2.0, range:0.6*A.tile, dmg:10, interval:0.2, cd:0 });
  if (kind==="tank")    A.allies.push({ type:"tank",   x:A.pathRev[0][0], y:A.pathRev[0][1], spd:1.4, range:0.8*A.tile, dmg:80, interval:1.0, cd:0 });
}

export function updateAllies(dt, enemies){
  // สปอนจาก basecamp ทุกใบ ตามระดับการอัปเกรด (ตีความตามสเปคให้เป็นเดโม่บาลานซ์ง่าย)
  for (const inst of GameState.allPlaced()){
    if (inst.id !== "basecamp") continue;
    const T = ensureTimer(inst);

    // ขั้น 1 (พก): 7 ตัวต่อ 30วิ ⇒ เฉลี่ย ~4.3วิ/ตัว + เพิ่มตามเลเวล p1/p2 เล็กน้อย
    T.t1 -= dt; if (T.t1 <= 0 && inst.p1 >= 1){
      spawnAlly("pistol");
      const bonus = Math.max(0, inst.p1-1) * 0.3; // ยิ่งอัป ยิ่งเร็วขึ้นนิดหน่อย
      T.t1 = Math.max(1.8, 4.3 - bonus);
      T.q1 = (T.q1+1) % (7 + Math.max(0,inst.p1-3)); // จำนวนรวมต่อคาบเพิ่มหลัง Lv สูง
    }
    // ขั้น 2 (SMG): 4 ตัว/45วิ ⇒ ~11.25วิ/ตัว เมื่อ p1>=2
    T.t2 -= dt; if (T.t2 <= 0 && inst.p1 >= 2){
      spawnAlly("smg");
      const bonus = Math.max(0, inst.p2) * 0.8;
      T.t2 = Math.max(4.5, 11.25 - bonus);
    }
    // ขั้น 3 (Tank): 2 ตัว/60วิ ⇒ 30วิ/ตัว เมื่อ p1>=3
    T.t3 -= dt; if (T.t3 <= 0 && inst.p1 >= 3){
      spawnAlly("tank");
      const bonus = Math.max(0, inst.p2-2) * 2.0;
      T.t3 = Math.max(10, 30 - bonus);
    }
  }

  // เดินตามเส้นย้อนกลับ
  for (const u of A.allies){
    // หา segment ปัจจุบันจาก "เป้าหมายต่อไป" แบบง่าย: เคลื่อนหา A.pathRev[1]
    const target = A.pathRev[1] ?? A.pathRev[0];
    const dx = target[0]-u.x, dy = target[1]-u.y;
    const len = Math.hypot(dx,dy) || 1;
    const step = u.spd * A.tile * dt;
    if (step >= len){ u.x = target[0]; u.y = target[1]; }
    else { u.x += dx/len*step; u.y += dy/len*step; }

    // โจมตีระยะใกล้ที่สุด
    u.cd -= dt;
    if (u.cd <= 0){
      let best=null, bd=1e9;
      for (const e of enemies){
        const d = Math.hypot(e.x-u.x, e.y-u.y);
        if (d < u.range && d < bd){ bd=d; best=e; }
      }
      if (best){
        best.hp -= u.dmg;
        u.cd = u.interval;
      } else {
        u.cd = 0.1;
      }
    }
  }
}

export function drawAllies(ctx){
  for (const u of A.allies){
    ctx.beginPath();
    ctx.fillStyle = "rgba(80,220,120,.95)";
    ctx.strokeStyle = "rgba(0,0,0,.35)";
    ctx.lineWidth = 2;
    ctx.arc(u.x, u.y, u.type==="tank"? 11 : 8, 0, Math.PI*2);
    ctx.fill(); ctx.stroke();
  }
}