// โปรเจกไทล์แบบง่าย: ยิงเป็นจุดเคลื่อนที่ตรง ๆ ชนแล้วทำดาเมจ
const P = {
  bullets: [] // {x,y, vx,vy, dmg, pierce, alive}
};

export function clearProjectiles(){ P.bullets.length = 0; }

export function spawnBullet({x,y, tx,ty, dmg, pierce=0, speedPx=900 }){
  const dx = tx - x, dy = ty - y;
  const len = Math.hypot(dx,dy) || 1;
  const vx = (dx/len) * speedPx;
  const vy = (dy/len) * speedPx;
  P.bullets.push({ x, y, vx, vy, dmg, pierce, alive: true });
}

export function updateProjectiles(dt, enemies){
  for (const b of P.bullets){
    if (!b.alive) continue;
    b.x += b.vx * dt;
    b.y += b.vy * dt;

    // ชนศัตรู (วงกลมรัศมี ~10)
    for (const e of enemies){
      if (e.hp <= 0) continue;
      const d = Math.hypot(e.x - b.x, e.y - b.y);
      if (d <= 12){
        e.hp -= b.dmg;
        if (b.pierce > 0){ b.pierce -= 1; }
        else { b.alive = false; break; }
      }
    }
  }
  // ล้างที่ตาย/หลุดจอ (จำกัดจำนวน)
  if (P.bullets.length > 800){
    P.bullets = P.bullets.filter(b=>b.alive);
  } else {
    for (let i=P.bullets.length-1;i>=0;i--) if (!P.bullets[i].alive) P.bullets.splice(i,1);
  }
}

export function getProjectiles(){ return P.bullets; }
import { applyDamage } from "./damage.js";
const P = { bullets: [] };

export function spawnBullet({x,y, tx,ty, dmg, pierce=0, speedPx=900, dtype="physical"}){
  const dx=tx-x, dy=ty-y, len=Math.hypot(dx,dy)||1;
  P.bullets.push({ x, y, vx:(dx/len)*speedPx, vy:(dy/len)*speedPx, dmg, pierce, dtype, alive:true });
}
export function updateProjectiles(dt, enemies){
  for (const b of P.bullets){
    if (!b.alive) continue;
    b.x += b.vx*dt; b.y += b.vy*dt;
    for (const e of enemies){
      if (e.hp<=0) continue;
      const d = Math.hypot(e.x-b.x, e.y-b.y);
      if (d<=12){
        applyDamage(e, { dmg:b.dmg, dtype:b.dtype });
        if (b.pierce>0) b.pierce -= 1; else { b.alive=false; break; }
      }
    }
  }
  for (let i=P.bullets.length-1;i>=0;i--) if (!P.bullets[i].alive) P.bullets.splice(i,1);
}
export function getProjectiles(){ return P.bullets; }
export function clearProjectiles(){ P.bullets.length=0; }