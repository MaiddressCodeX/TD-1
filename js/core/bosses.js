// พฤติกรรมบอสตามโหมด: heal pulse / summon / shield / dash + ออร่าแรง
import { cloneEnemy } from "../data/enemies.js";

const B = new WeakMap(); // enemy -> state {t1,t2,shield, dash}

function st(e){ let s=B.get(e); if(!s){s={t1:2,t2:6,shield:0,dash:0}; B.set(e,s);} return s; }

export function updateBossBehaviors(dt, enemies, map){
  const tile = map.grid.tile;
  for (const e of enemies){
    if (!e || !e.type || !e.type.startsWith("boss")) continue;
    const s = st(e);
    // easy: heal pulse
    if (e.type==="boss_easy"){
      s.t1-=dt; if (s.t1<=0){ s.t1=6; e.hp = Math.min(e.hpMax, e.hp + 150); }
    }
    // normal: summon grunts near
    if (e.type==="boss_normal"){
      s.t1-=dt; if (s.t1<=0){ s.t1=7.5; summonNear(e, enemies, map, "grunt", 3); }
    }
    // hard: toggle shield
    if (e.type==="boss_hard"){
      s.t1-=dt; if (s.t1<=0){ s.t1=12; s.shield=3.0; }
      if (s.shield>0) s.shield-=dt;
      e.shield = s.shield>0;
    }
    // nightmare: dash + strong aura (set in enemy def)
    if (e.type==="boss_night"){
      s.t1-=dt; if (s.t1<=0){ s.t1=9; s.dash=1.2; }
      if (s.dash>0){
        s.dash -= dt;
        e.speedTiles = e.baseSpeed * 2.4;
      } else {
        e.speedTiles = e.baseSpeed;
      }
    }
  }
}

function summonNear(boss, enemies, map, type, count){
  for (let i=0;i<count;i++){
    const nb = cloneEnemy(type);
    // วางตรงตำแหน่งบอส แล้วให้มัน "ยึดคืบหน้า" เท่ากับบอส
    nb.x = boss.x; nb.y = boss.y;
    nb.pathPts = boss.pathPts; nb.seg = boss.seg; nb.segT = boss.segT;
    nb.hpMax = nb.hp;
    enemies.push(nb);
  }
}