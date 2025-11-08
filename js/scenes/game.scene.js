import { createHUD } from "../ui/hud.js";
import { Time } from "../time.js";
import { createGameCanvas } from "../render/canvas.js";
import { loadMap } from "../core/map.js";
import { drawMap } from "../render/draw-map.js";
import { drawGhost, drawPlacedTowers } from "../render/draw-ui.js";
import { drawEnemies, drawProjectiles } from "../render/draw-entities.js";
import { Events } from "../events.js";
import { GameState } from "../core/gamestate.js";
import { createTowerBar } from "../ui/towerbar.js";
import { Placement } from "../core/placement.js";
import { DIFFICULTY } from "../config.js";
import { initWaves, startNextWave, updateWaves, getEnemies, isWaveOngoing, getWaveNumber, clearAllWaves, reapDeadAndBounty, justEndedWave } from "../core/waves.js";
import { updateCombat, resetRuntime } from "../core/combat.js";
import { Storage } from "../storage.js";
import { getProjectiles, updateProjectiles, clearProjectiles } from "../core/projectiles.js";
import { getTower } from "../data/towers.js";
import { computeEffective, sellValue } from "../core/upgrades.js";
import { initAllies, updateAllies, drawAllies } from "../core/allies.js";
import { startAC130, updateAC130, drawAC130 } from "../core/special.ac130.js";
import { isActive, activeLeft } from "../core/abilities.js";
import { Shop } from "../core/shop.js";

export const GameScene = {
  async render({ difficulty, map } = {}) {
    const wrap = document.createElement("div");

    // โหมด & สถานะเริ่ม
    const diffKey = difficulty ?? "easy";
    Shop.reset(); // เริ่มรอบใหม่ เคลียร์ร้าน
    const diff = DIFFICULTY[diffKey] ?? DIFFICULTY.easy;
    GameState.init({ startMoney: diff.startMoney, lives: 100 });

    // HUD
    const hud = createHUD();
    wrap.appendChild(hud);

    // พื้นที่เกม + แคนวาส
    const main = document.createElement("main");
    main.className = "container";
    const card = document.createElement("div");
    card.className = "card"; card.style.margin = "10px 0 14px"; card.style.position = "relative";
    card.innerHTML = `
      <div class="h2">แผนที่: Meadow 01</div>
      <div class="muted">โหมด: <b class="mono">${diffKey}</b> — เงินเริ่ม ${diff.startMoney.toLocaleString()} G</div>
      <div class="canvas-wrap" id="canvas-wrap"></div>
      <div class="place-controls" id="place-ctrls">
        <button class="btn-ghost" data-cancel>ยกเลิก</button>
        <button class="btn-accent" data-place>วาง</button>
      </div>
    `;
    main.appendChild(card);
    wrap.appendChild(main);

    const canvasWrap = card.querySelector("#canvas-wrap");
    const view = createGameCanvas(canvasWrap);
    const mapId = map || "meadow-01";
    const mapObj = loadMap(mapId);
    const map = mapObj;

    // Waves + Systems
    initWaves(map, diffKey);
    initAllies(map);
    GameState.setWave(0);
    resetRuntime(); clearProjectiles();

    // TowerBar + Panel
    const towerbar = createTowerBar({ map, view });
    wrap.appendChild(towerbar);

    const { createTowerPanel } = await import("../ui/towerpanel.js");
    const panel = createTowerPanel();
    wrap.appendChild(panel);

    // ปุ่มวาง/ยกเลิก
    const ctrls = card.querySelector("#place-ctrls");
    ctrls.querySelector("[data-cancel]").addEventListener("click", ()=> { Placement.cancel(); ctrls.classList.remove("show"); });
    ctrls.querySelector("[data-place]").addEventListener("click", ()=> { if (Placement.confirm()) ctrls.classList.remove("show"); });
    const showControlsIfPlacing = ()=> { if (Placement.isPlacing()) ctrls.classList.add("show"); };
    canvasWrap.addEventListener("mouseenter", showControlsIfPlacing);
    document.addEventListener("click", showControlsIfPlacing, { capture: true });

    // เลือกยูนิตบนแคนวาส
    let selected = null;
    view.canvas.addEventListener("click", (e)=>{
      if (Placement.isPlacing()) return;
      // ถ้าอยู่โหมด "ย้ายฮ." จะถูกจับใน listener ด้านล่าง
      const rect = view.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      const tile = map.grid.tile; const c = Math.floor(x/tile); const r = Math.floor(y/tile);
      selected = GameState.allPlaced().find(t=> t.c===c && t.r===r) || null;
      panel.setSelected(selected);
    });

    // ขายจาก panel
    const unSell = Events.on("tower:sell", ({ inst, refund })=>{
      GameState.earn(refund);
      GameState.sellTower(inst);
      if (selected === inst) { selected = null; panel.clear(); }
    });

    // Heli relocate
    let heliReloc = null;
    const unHeliStart = Events.on("heli:relocate:start", ({ inst })=>{
      heliReloc = inst;
      // โอเวอร์เลย์บอกสถานะสั้น ๆ
      canvasWrap.style.outline = "2px dashed var(--accent)";
    });
    view.canvas.addEventListener("click", (e)=>{
      if (!heliReloc) return;
      const rect = view.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      const tile = map.grid.tile; const c = Math.floor(x/tile); const r = Math.floor(y/tile);
      // ห้ามทับป้อมอื่น
      if (GameState.isOccupied(c,r) && !(heliReloc.c===c && heliReloc.r===r)) return;
      // ตั้งเป้าหมายแบบตำแหน่ง px (ลอย)
      heliReloc.fx = heliReloc.c*tile + tile/2;
      heliReloc.fy = heliReloc.r*tile + tile/2;
      heliReloc._move = { tx: c*tile+tile/2, ty: r*tile+tile/2, speed: 4*tile }; // 4 tiles/s
      heliReloc._updOcc = { c, r }; // เมื่อถึง จะอัป occ
      heliReloc = null;
      canvasWrap.style.outline = "none";
    });

    // AC-130 เมื่อ cast แล้วเริ่มทำงานทันที (update ที่ loop)
    const unSkill = Events.on("skill:cast", ({ inst, until })=>{
      if (inst.id === "ac130"){ startAC130(until - Time.time); }
    });

    // Auto next wave
    const settings = Storage.get();
    let pendingAuto = false, lastWaveEnded = false;
    const tryAutoNext = ()=>{
      if (!settings.autoSkip) return;
      if (!isWaveOngoing() && GameState.lives > 0){
        pendingAuto = true;
        setTimeout(()=>{ if (pendingAuto) Events.emit("wave:start"); }, 800);
      }
    };
    const unStart = Events.on("wave:start", ()=>{
      pendingAuto = false;
      if (!isWaveOngoing()){
        startNextWave(diffKey);
        GameState.setWave(getWaveNumber());
        Time.start();
      }
    });

    // per-frame
    const off = Time.onTick(({ dt, gameTime })=>{
      view.resize();
      const { width, height } = view.canvas.getBoundingClientRect();

      // อัปฮ.อิสระ
      for (const inst of GameState.allPlaced()){
        if (inst.id !== "heli" || !inst._move) continue;
        const dx = inst._move.tx - inst.fx, dy = inst._move.ty - inst.fy;
        const len = Math.hypot(dx,dy) || 1;
        const step = inst._move.speed * dt;
        if (step >= len){
          inst.fx = inst._move.tx; inst.fy = inst._move.ty;
          // อัปตำแหน่ง tile ใน state (ปล่อย occ เก่า)
          const tile = map.grid.tile;
          const nc = Math.floor(inst.fx / tile), nr = Math.floor(inst.fy / tile);
          GameState.moveTower(inst, nc, nr);
          inst._move = null;
        } else {
          inst.fx += dx/len*step; inst.fy += dy/len*step;
        }
      }

      // เวฟ & เดิน
      const reached = updateWaves(dt, gameTime);
      for (const e of reached) GameState.damageBase(1);

      // Allies (ฐานทัพ)
      updateAllies(dt, getEnemies());

      // เก็บเงินจากศัตรูที่ตาย
      const bounty = reapDeadAndBounty();
      if (bounty > 0) GameState.earn(bounty);

      // คอมแบต/โปรเจกไทล์
      updateCombat(dt, map, GameState.allPlaced(), getEnemies());
      updateProjectiles(dt, getEnemies());

      // AC-130
      updateAC130(dt, getEnemies(), { w: width, h: height });

      // จบเวฟ → ฟาร์ม/HP (เหมือนตอน 5)
      if (justEndedWave()){
        if (!lastWaveEnded){
          let income = 0, hpAdd = 0;
          for (const inst of GameState.allPlaced()){
            if (inst.id !== "farm") continue;
            const spec = getTower("farm");
            for (let i=0;i<inst.p1;i++) income += spec.upgrades.p1[i]?.incomeAdd || 0;
            for (let i=0;i<inst.p2;i++){ income += spec.upgrades.p2[i]?.incomeAdd || 0; hpAdd += spec.upgrades.p2[i]?.baseHpAdd || 0; }
          }
          if (income>0) GameState.earn(Math.floor(income * (Shop.farmIncomeMultiplier())));
          if (hpAdd>0) GameState.addLives(hpAdd);
        }
        lastWaveEnded = true;
        Time.stop(); tryAutoNext();
      } else lastWaveEnded = false;

      // วาด
      drawMap(view.ctx, map, { w: width, h: height });
      drawPlacedTowers(view.ctx, map, selected);
      drawEnemies(view.ctx, getEnemies());
      drawAllies(view.ctx);
      drawGhost(view.ctx, map, Placement.getActive?.());
      drawProjectiles(view.ctx, getProjectiles());
      drawAC130(view.ctx);

      // GAME OVER
      if (GameState.lives <= 0){
        view.ctx.fillStyle = "rgba(0,0,0,.55)";
        view.ctx.fillRect(0,0,width,height);
        view.ctx.fillStyle = "#fff";
        view.ctx.font = "bold 28px ui-sans-serif";
        view.ctx.fillText("GAME OVER", width/2-90, height/2);
        clearAllWaves(); Time.stop();
      }
    });

    // เริ่มสถานะ: หยุดจนกดเริ่มเวฟ
    Time.reset(); Time.stop();

    // cleanup
    wrap.onRemove = () => {
      pendingAuto = false;
      Time.stop();
      off(); unStart(); unSell(); unHeliStart(); unSkill();
      hud.cleanup?.(); towerbar.cleanup?.(); panel.clear?.();
      clearAllWaves(); clearProjectiles();
    };

    return wrap;
  }
};
// แก้เฉพาะสองจุดที่เรียก initWaves / startNextWave ให้ส่ง key ความยาก
// ...
import { initWaves, startNextWave, updateWaves, getEnemies, isWaveOngoing, getWaveNumber, clearAllWaves, reapDeadAndBounty, justEndedWave } from "../core/waves.js";
// ...
initWaves(map, diffKey);
// ...
const unStart = Events.on("wave:start", ()=>{
  pendingAuto = false;
  if (!isWaveOngoing()){
    startNextWave(diffKey);
    GameState.setWave(getWaveNumber());
    Time.start();
  }
});