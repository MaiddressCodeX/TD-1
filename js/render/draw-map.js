import { tileToPx } from "../core/map.js";

export function drawMap(ctx, map, viewportSize) {
  const { cols, rows, tile } = map.grid;

  // พื้น
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--surface");
  ctx.fillRect(0, 0, viewportSize.w, viewportSize.h);

  // พื้นหญ้าอ่อน
  ctx.fillStyle = "rgba(110,175,120,.2)";
  ctx.fillRect(0, 0, cols * tile, rows * tile);

  // น้ำ
  ctx.fillStyle = "rgba(64,140,255,.26)";
  for (const [x, y, w, h] of map.water) {
    ctx.fillRect(x * tile, y * tile, w * tile, h * tile);
  }

  // ทางเดิน
  ctx.lineWidth = 10;
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(180,120,60,.85)";
  ctx.beginPath();
  const [sx, sy] = tileToPx(map.path[0], tile);
  ctx.moveTo(sx + tile / 2, sy + tile / 2);
  for (let i = 1; i < map.path.length; i++) {
    const [px, py] = tileToPx(map.path[i], tile);
    ctx.lineTo(px + tile / 2, py + tile / 2);
  }
  ctx.stroke();

  // จุด spawn/goal
  ctx.fillStyle = "rgba(0,0,0,.5)";
  drawDot(ctx, tileToPx(map.spawn, tile), tile, "Spawn");
  drawDot(ctx, tileToPx(map.goal, tile), tile, "Goal");

  // เส้นกริดอ่อน ๆ
  ctx.strokeStyle = "rgba(0,0,0,.12)";
  ctx.lineWidth = 1;
  for (let c = 0; c <= cols; c++) {
    ctx.beginPath();
    ctx.moveTo(c * tile, 0);
    ctx.lineTo(c * tile, rows * tile);
    ctx.stroke();
  }
  for (let r = 0; r <= rows; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * tile);
    ctx.lineTo(cols * tile, r * tile);
    ctx.stroke();
  }
}

function drawDot(ctx, [x, y], tile, label) {
  ctx.beginPath();
  ctx.arc(x + tile / 2, y + tile / 2, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "12px ui-sans-serif, system-ui";
  ctx.textBaseline = "top";
  ctx.fillText(label, x + tile / 2 + 10, y + tile / 2 - 6);
}