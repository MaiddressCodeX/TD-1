import { MEADOW_01 } from "../maps/meadow-01.js"; // เดิม
import { DESERT_01 } from "../maps/desert-01.js";
import { HARBOR_01 } from "../maps/harbor-01.js";

const MAPS = {
  "meadow-01": MEADOW_01,
  "desert-01": DESERT_01,
  "harbor-01": HARBOR_01
};

export function loadMap(id="meadow-01"){
  const m = MAPS[id] || MAPS["meadow-01"];
  // สร้างแผนที่พร้อมฟังก์ชันวาด/ตรวจน้ำ (กรณีคุณมีของเดิมแล้ว ใช้ของเดิมได้เลย)
  return {
    ...m,
    isWater(c,r){
      for (const box of (m.water||[])){
        const [x,y,w,h] = box;
        if (c>=x && c<x+w && r>=y && r<y+h) return true;
      }
      return false;
    },
    path: m.path
  };
}