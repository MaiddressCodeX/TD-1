import { tileToPx } from "./map.js";

// เตรียม enemy ให้พร้อมเดินบนเส้น path
export function spawnEnemyOnPath(enemy, map){
  const tile = map.grid.tile;
  const pts = map.path.map(([c,r]) => [c*tile+tile/2, r*tile+tile/2]);
  const [x, y] = pts[0];
  return {
    ...enemy,
    x, y,
    pathPts: pts,
    seg: 0,     // index จุดเริ่ม → ไปจุดถัดไป
    segT: 0     // อัตราคืบหน้า 0..1 ที่ segment ปัจจุบัน
  };
}

export function moveEnemy(e, dt, map){
  const speedPx = e.speedTiles * map.grid.tile; // px/s
  let remain = speedPx * dt;

  while (remain > 0 && e.seg < e.pathPts.length - 1){
    const [x1,y1] = e.pathPts[e.seg];
    const [x2,y2] = e.pathPts[e.seg+1];
    const dx = x2 - x1, dy = y2 - y1;
    const segLen = Math.hypot(dx,dy);
    const advance = Math.min(remain, segLen - e.segT * segLen);
    const ratio = advance / segLen;
    e.segT += ratio;
    e.x = x1 + (dx * e.segT);
    e.y = y1 + (dy * e.segT);
    remain -= advance;

    if (e.segT >= 1){
      e.seg++; e.segT = 0;
      // snap to point
      const [nx, ny] = e.pathPts[e.seg];
      e.x = nx; e.y = ny;
    }
  }

  // ถึงปลายทาง?
  return (e.seg >= e.pathPts.length - 1);
}