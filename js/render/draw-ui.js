import { getTower } from "../data/towers.js";
import { GameState } from "../core/gamestate.js";
import { computeEffective } from "../core/upgrades.js";

export function drawPlacedTowers(ctx, map, selected=null){
  const tile = map.grid.tile;
  for (const inst of GameState.allPlaced()){
    const spec = getTower(inst.id);
    const eff = computeEffective(spec, inst);

    const x = inst.c * tile + tile/2;
    const y = inst.r * tile + tile/2;

    // วงยิงอ่อน ๆ
    if (eff.rangeTiles > 0){
      ctx.beginPath();
      ctx.arc(x, y, (inst.eff?.rangeTiles ?? eff.rangeTiles) * tile, 0, Math.PI*2);
      ctx.strokeStyle = "rgba(0,0,0,.18)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // จุดป้อม
    ctx.beginPath();
    ctx.arc(x, y, Math.max(8, tile*0.28), 0, Math.PI*2);
    ctx.fillStyle = "rgba(255,255,255,.92)";
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,.35)";
    ctx.stroke();

    if (selected && selected===inst){
      // ไฮไลต์เลือก
      ctx.beginPath();
      ctx.arc(x, y, Math.max(12, tile*0.34), 0, Math.PI*2);
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--accent");
      ctx.lineWidth = 3; ctx.setLineDash([6,6]); ctx.stroke(); ctx.setLineDash([]);

      // แสดงออร่า DJ/Commander เมื่อเลือก
      if (inst.id === "dj"){
        const aura = spec.rangeTiles + (0.6 * inst.p2);
        ctx.beginPath();
        ctx.arc(x, y, aura * tile, 0, Math.PI*2);
        ctx.strokeStyle = "rgba(100,180,255,.7)";
        ctx.lineWidth = 2; ctx.setLineDash([4,6]); ctx.stroke(); ctx.setLineDash([]);
      }
      if (inst.id === "commander"){
        const aura = spec.rangeTiles;
        ctx.beginPath();
        ctx.arc(x, y, aura * tile, 0, Math.PI*2);
        ctx.strokeStyle = "rgba(255,200,80,.7)";
        ctx.lineWidth = 2; ctx.setLineDash([4,6]); ctx.stroke(); ctx.setLineDash([]);
      }
    }
  }
}

export function drawGhost(ctx, map, active){
  if (!active) return;
  const tile = map.grid.tile;
  const { spec, c, r, valid } = active;
  const x = c * tile + tile/2;
  const y = r * tile + tile/2;

  const rangeTiles = spec.rangeTiles;
  if (rangeTiles > 0){
    ctx.beginPath();
    ctx.arc(x, y, rangeTiles * tile, 0, Math.PI*2);
    ctx.strokeStyle = valid ? "rgba(120,200,255,.65)" : "rgba(255,80,80,.6)";
    ctx.setLineDash([6,6]); ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
  }

  ctx.beginPath();
  ctx.arc(x, y, Math.max(10, tile*0.3), 0, Math.PI*2);
  ctx.fillStyle = valid ? "rgba(120,200,255,.35)" : "rgba(255,80,80,.35)";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = valid ? "rgba(120,200,255,.9)" : "rgba(255,80,80,.9)";
  ctx.stroke();
}