import { Events } from "../events.js";
import { makeTowerInstance } from "./upgrades.js";

const S = {
  money: 0, lives: 100, wave: 0,
  placed: [], occ: new Set(),
};

export const GameState = {
  init({ startMoney = 1000, lives = 100 } = {}) {
    S.money = startMoney; S.lives = lives; S.wave = 0;
    S.placed = []; S.occ = new Set();
    Events.emit("money:change", S.money);
    Events.emit("lives:change", S.lives);
    Events.emit("wave:change", S.wave);
  },
  get money(){ return S.money; }, get lives(){ return S.lives; },
  setWave(n){ S.wave = n; Events.emit("wave:change", S.wave); },
  addLives(x){ S.lives += x; Events.emit("lives:change", S.lives); },
  damageBase(x){ S.lives = Math.max(0, S.lives - x); Events.emit("lives:change", S.lives); },
  canAfford(x){ return S.money >= x; },
  spend(x){ if (S.money >= x){ S.money -= x; Events.emit("money:change", S.money); return true; } return false; },
  earn(x){ S.money += x; Events.emit("money:change", S.money); },

  addTower(id, c, r){
    const inst = makeTowerInstance({ id }, c, r);
    S.placed.push(inst);
    S.occ.add(`${c},${r}`);
    Events.emit("tower:placed", { inst, count: this.count(id) });
  },
  moveTower(inst, newC, newR){
    const old = `${inst.c},${inst.r}`;
    const nw = `${newC},${newR}`;
    S.occ.delete(old);
    S.occ.add(nw);
    inst.c = newC; inst.r = newR;
    Events.emit("tower:moved", { inst });
  },
  sellTower(inst){
    const k = `${inst.c},${inst.r}`;
    for (let i=S.placed.length-1;i>=0;i--) if (S.placed[i]===inst){ S.placed.splice(i,1); break; }
    S.occ.delete(k);
    Events.emit("tower:removed", { inst });
  },
  isOccupied(c, r){ return S.occ.has(`${c},${r}`); },
  count(id){ return S.placed.filter(t=>t.id===id).length; },
  allPlaced(){ return S.placed.slice(); }
};