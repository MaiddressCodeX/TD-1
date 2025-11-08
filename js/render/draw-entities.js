export function drawEnemies(ctx, enemies){
  for (const e of enemies){
    ctx.beginPath();
    ctx.fillStyle = e.flying ? "rgba(120,160,255,.92)" : "rgba(255,120,80,.92)";
    ctx.strokeStyle = "rgba(0,0,0,.35)";
    ctx.lineWidth = 2;
    ctx.arc(e.x, e.y, 10, 0, Math.PI*2);
    ctx.fill(); ctx.stroke();

    const w = 28, h = 5;
    const px = e.x - w/2, py = e.y - 18;
    const ratio = Math.max(0, e.hp / e.hpMax);
    ctx.fillStyle = "rgba(0,0,0,.35)";
    ctx.fillRect(px, py, w, h);
    ctx.fillStyle = "rgba(50,220,90,.9)";
    ctx.fillRect(px, py, w * ratio, h);
    ctx.strokeStyle = "rgba(0,0,0,.45)";
    ctx.strokeRect(px, py, w, h);
  }
}

export function drawProjectiles(ctx, bullets){
  ctx.fillStyle = "rgba(255,255,255,.95)";
  for (const b of bullets){
    if (!b.alive) continue;
    ctx.beginPath();
    ctx.arc(b.x, b.y, 2.8, 0, Math.PI*2);
    ctx.fill();
  }
}