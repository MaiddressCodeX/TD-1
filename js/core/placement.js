import { GameState } from "./gamestate.js";
import { getTower } from "../data/towers.js";

// สถานะภายในของโหมดวาง
const P = {
  active: null,   // {spec, c, r, valid}
  map: null,
  view: null,     // {canvas, ctx, resize}
  tile: 48,
  listeners: []
};

export const Placement = {
  begin(towerId, map, view){
    const spec = getTower(towerId);
    if (!spec) return;
    P.map = map; P.view = view; P.tile = map.grid.tile;
    P.active = { spec, c: 0, r: 0, valid: false };
    this._attachListeners();
  },
  cancel(){
    this._detachListeners();
    P.active = null;
  },
  confirm(){
    if (!P.active?.valid) return false;
    const { spec, c, r } = P.active;
    if (!GameState.spend(spec.cost)) return false;
    GameState.addTower(spec.id, c, r);
    this.cancel();
    return true;
  },
  isPlacing(){ return !!P.active; },
  getActive(){ return P.active; },
  // === internals ===
  _attachListeners(){
    const wrap = P.view.canvas; // ใช้ canvas จับ event
    const onMove = (e)=>{
      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const c = Math.floor(x / P.tile);
      const r = Math.floor(y / P.tile);
      P.active.c = c; P.active.r = r;
      P.active.valid = validateTile(c, r, P.map, P.active.spec);
    };
    const onClick = (e)=>{
      if (!P.active) return;
      e.preventDefault();
      // คลิกบนแคนวาส = ลองวาง
      this.confirm();
    };
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("click", onClick);
    P.listeners = [
      ["mousemove", onMove],
      ["click", onClick],
    ];
  },
  _detachListeners(){
    const wrap = P.view?.canvas;
    if (wrap){
      for (const [t, fn] of P.listeners) wrap.removeEventListener(t, fn);
    }
    P.listeners = [];
  }
};

// ===== helpers =====
function inWater(c, r, map){
  const t = map.grid.tile;
  for (const [x,y,w,h] of map.water){
    if (c >= x && c < x+w && r >= y && r < y+h) return true;
  }
  return false;
}
function nearPath(c, r, map){
  // ถือว่า tile ที่ "center" อยู่ใกล้เส้นทางภายในระยะ tile*0.45 คือทางเดิน
  const tile = map.grid.tile;
  const cx = c * tile + tile/2;
  const cy = r * tile + tile/2;
  const pts = map.path.map(([pc, pr]) => [pc*tile+tile/2, pr*tile+tile/2]);

  for (let i=0;i<pts.length-1;i++){
    const d = distPointToSegment(cx, cy, pts[i][0], pts[i][1], pts[i+1][0], pts[i+1][1]);
    if (d <= tile * 0.45) return true;
  }
  return false;
}
function distPointToSegment(px, py, x1, y1, x2, y2){
  const dx = x2-x1, dy = y2-y1;
  if (dx===0 && dy===0) return Math.hypot(px-x1, py-y1);
  const t = Math.max(0, Math.min(1, ((px-x1)*dx + (py-y1)*dy) / (dx*dx + dy*dy)));
  const x = x1 + t*dx, y = y1 + t*dy;
  return Math.hypot(px-x, py-y);
}
function validateTile(c, r, map, spec){
  const { cols, rows } = map.grid;
  if (c < 0 || r < 0 || c >= cols || r >= rows) return false;
  // ห้ามทับทาง
  if (nearPath(c, r, map)) return false;
  // ตรวจบก/น้ำ
  const water = inWater(c, r, map);
  if (spec.placement === "land" && water) return false;
  if (spec.placement === "water" && !water) return false;
  // ตรวจการซ้อน
  if (GameState.isOccupied(c, r)) return false;
  // ตรวจ limit
  if (GameState.count(spec.id) >= spec.limit) return false;
  // ตรวจเงิน
  if (!GameState.canAfford(spec.cost)) return false;

  return true;
}