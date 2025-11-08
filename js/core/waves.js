ลimport { waveDefFor } from "../data/waves.index.js";
import { cloneEnemy } from "../data/enemies.js";
import { spawnEnemyOnPath, moveEnemy } from "./movement.js";
import { Events } from "../events.js";
import { updateBossBehaviors } from "./bosses.js";

// ... ของเดิมคงไว้ ...

export function updateWaves(dt, gameTime){
  // spawn ตามคิว
  if (W.spawning){
    for (let i=W.spawnQueue.length-1;i>=0;i--){
      if (gameTime >= W.spawnQueue[i].at){
        const e = spawnEnemyOnPath(cloneEnemy(W.spawnQueue[i].type), W.map);
        const kBase = W.mode==="easy"? 0.08 : W.mode==="normal"? 0.10 : W.mode==="hard"? 0.14 : W.mode==="nightmare"? 0.18 : 0.20;
        e.hp *= (1 + W.wave * kBase); e.hpMax = e.hp;
        W.enemies.push(e); W.spawnQueue.splice(i,1);
      }
    }
    if (!W.spawnQueue.length) W.spawning = false;
  }

  // บอสพฤติกรรม
  updateBossBehaviors(dt, W.enemies, W.map);

  // เดิน
  const reached=[];
  for (let i=W.enemies.length-1;i>=0;i--){
    const e = W.enemies[i];
    const arrived = moveEnemy(e, dt, W.map);
    if (arrived){ reached.push(e); W.enemies.splice(i,1); }
  }
  return reached;
}