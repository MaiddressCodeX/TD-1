// ค่าที่ใช้งาน: base + upgrades.p1/p2
// หมายเหตุ: ตัวเลขตั้งต้นบาลานซ์แบบหยาบเพื่อเดโม สามารถจูนภายหลังได้
export const TOWERS = [
  { id:"pistol", name:"ปืนพก", cost:50, placement:"land", limit:Infinity, canAir:false, acceptsBuffs:true, rangeTiles:3,
    base:{ dmg:25, interval:1.00 },
    upgrades:{
      p1:[ // ยิงเร็ว/เจาะ/ระยะ
        { cost:90,  intervalMul:0.88, rangeAdd:0.2 },
        { cost:140, intervalMul:0.88, rangeAdd:0.2 },
        { cost:220, intervalMul:0.86, pierceAdd:1 },
        { cost:320, intervalMul:0.84, rangeAdd:0.3 },
        { cost:450, intervalMul:0.82, pierceAdd:1 },
      ],
      p2:[ // ดาเมจหนัก
        { cost:120, dmgMul:1.4 },
        { cost:200, dmgMul:1.5 },
        { cost:380, dmgMul:1.5 },
        { cost:600, dmgMul:1.6 },
        { cost:900, dmgMul:1.7 },
      ]
    }
  },
  { id:"smg", name:"SMG", cost:120, placement:"land", limit:Infinity, canAir:true, acceptsBuffs:true, rangeTiles:3.2,
    base:{ dmg:7, interval:0.15 },
    upgrades:{
      p1:[ { cost:140, intervalMul:0.9, rangeAdd:0.2 },
           { cost:220, intervalMul:0.9, rangeAdd:0.2 },
           { cost:320, intervalMul:0.88, pierceAdd:1 },
           { cost:600, intervalMul:0.86 },
           { cost:900, intervalMul:0.84 } ],
      p2:[ { cost:160, dmgMul:1.35 },
           { cost:260, dmgMul:1.45 },
           { cost:520, dmgMul:1.5 },
           { cost:900, dmgMul:1.55 },
           { cost:1400, dmgMul:1.6 } ]
    }
  },
  { id:"minigun", name:"Minigun", cost:7250, placement:"land", limit:Infinity, canAir:false, acceptsBuffs:true, rangeTiles:4,
    base:{ dmg:15, interval:0.07 },
    upgrades:{
      p1:[ { cost:1800, intervalMul:0.92, rangeAdd:0.2 }, { cost:2600, intervalMul:0.92 },
           { cost:3600, intervalMul:0.9, pierceAdd:1 }, { cost:5200, intervalMul:0.9, rangeAdd:0.3 }, { cost:8000, intervalMul:0.88 } ],
      p2:[ { cost:2200, dmgMul:1.35 }, { cost:3600, dmgMul:1.45 }, { cost:5200, dmgMul:1.55 }, { cost:8000, dmgMul:1.6 }, { cost:12000, dmgMul:1.65 } ]
    }
  },
  { id:"farm", name:"ฟาร์ม", cost:700, placement:"land", limit:30, canAir:false, acceptsBuffs:true, rangeTiles:0,
    base:{ dmg:0, interval:0 },
    upgrades:{
      // แบบ 1: เน้นรายได้ต่อเวฟ — ตัน +7000/เวฟ/ฟาร์ม
      p1:[ { cost:350, incomeAdd:300 }, { cost:600, incomeAdd:800 }, { cost:900, incomeAdd:1600 }, { cost:1500, incomeAdd:3500 }, { cost:2500, incomeAdd:7000 } ],
      // แบบ 2: เพิ่ม HP ฐานทันที + ได้เงินต่อเวฟน้อยกว่าสาย1
      p2:[ { cost:400, baseHpAdd:10, incomeAdd:150 }, { cost:700, baseHpAdd:15, incomeAdd:250 }, { cost:1200, baseHpAdd:25, incomeAdd:400 }, { cost:2200, baseHpAdd:35, incomeAdd:600 }, { cost:3800, baseHpAdd:50, incomeAdd:900 } ]
    }
  },
  { id:"flame", name:"ปืนไฟ", cost:300, placement:"land", limit:Infinity, canAir:false, acceptsBuffs:true, rangeTiles:2.2,
    base:{ dmg:3, interval:0.06 },
    upgrades:{
      p1:[ { cost:180, intervalMul:0.92, rangeAdd:0.1 }, { cost:280, intervalMul:0.92 }, { cost:400, intervalMul:0.9, pierceAdd:1 }, { cost:620, intervalMul:0.88 }, { cost:900, intervalMul:0.86 } ],
      p2:[ { cost:220, dmgMul:1.5 }, { cost:360, dmgMul:1.5 }, { cost:620, dmgMul:1.6 }, { cost:1000, dmgMul:1.6 }, { cost:1600, dmgMul:1.7 } ]
    }
  },
  { id:"commander", name:"ผู้บัญชาการ", cost:800, placement:"land", limit:Infinity, canAir:false, acceptsBuffs:true, rangeTiles:3, base:{ dmg:0, interval:0 }, upgrades:{ p1:[], p2:[] } },
  { id:"dj", name:"DJ", cost:1200, placement:"land", limit:Infinity, canAir:false, acceptsBuffs:true, rangeTiles:3.5, base:{ dmg:0, interval:0 }, upgrades:{ p1:[], p2:[] } },
  { id:"turret", name:"ป้อมปืน", cost:6000, placement:"land", limit:Infinity, canAir:true, acceptsBuffs:false, rangeTiles:4,
    base:{ dmg:30, interval:0.12 },
    upgrades:{
      p1:[ { cost:1800, intervalMul:0.9, rangeAdd:0.2 }, { cost:2600, intervalMul:0.9 }, { cost:3600, intervalMul:0.9, pierceAdd:1 }, { cost:5200, intervalMul:0.88 }, { cost:7800, intervalMul:0.86 } ],
      p2:[ { cost:2200, dmgMul:1.35 }, { cost:3600, dmgMul:1.45 }, { cost:5200, dmgMul:1.5 }, { cost:8200, dmgMul:1.55 }, { cost:12000, dmgMul:1.6 } ]
    }
  },
  { id:"heli", name:"ฮอริคอปเตอร์", cost:13000, placement:"land", limit:30, canAir:true, acceptsBuffs:false, rangeTiles:5, base:{ dmg:35, interval:0.10 }, upgrades:{ p1:[], p2:[] } },
  { id:"ac130", name:"ฐาน AC-130", cost:40000, placement:"land", limit:7, canAir:false, acceptsBuffs:false, rangeTiles:0, base:{ dmg:0, interval:0 }, upgrades:{ p1:[], p2:[] } },
  { id:"battleship", name:"เรือรบ", cost:70000, placement:"water", limit:2, canAir:true, acceptsBuffs:false, rangeTiles:999,
    base:{ dmg:80, interval:0.40 },
    upgrades:{
      p1:[ { cost:12000, intervalMul:0.92 }, { cost:16000, intervalMul:0.9 }, { cost:22000, intervalMul:0.9, pierceAdd:2 }, { cost:30000, intervalMul:0.88 }, { cost:42000, intervalMul:0.86 } ],
      p2:[ { cost:14000, dmgMul:1.35 }, { cost:20000, dmgMul:1.45 }, { cost:28000, dmgMul:1.55 }, { cost:38000, dmgMul:1.6 }, { cost:50000, dmgMul:1.65 } ]
    }
  },
  { id:"basecamp", name:"ฐานทัพ", cost:100000, placement:"land", limit:4, canAir:false, acceptsBuffs:false, rangeTiles:0, base:{ dmg:0, interval:0 }, upgrades:{ p1:[], p2:[] } },
];

export function getTower(id){ return TOWERS.find(t=>t.id===id); }
// ... (รายการตัวอื่นคงเดิม) ...
  { id:"commander", name:"ผู้บัญชาการ", cost:800, placement:"land", limit:Infinity, canAir:false, acceptsBuffs:true,  rangeTiles:3,
    base:{ dmg:0, interval:0 },
    // สาย 1: เน้น "สกิล" (ปลดใช้เมื่อ Lv.3) — เพิ่มพลังสกิลเล็กน้อยตามเลเวล
    // สาย 2: ขยายระยะออร่าของสกิล/ความครอบคลุม
    upgrades:{
      p1:[ { cost:400 }, { cost:600 }, { cost:900 }, { cost:1200 }, { cost:1600 } ],
      p2:[ { cost:350 }, { cost:550, }, { cost:800 }, { cost:1100 }, { cost:1500 } ]
    }
  },
  { id:"dj", name:"DJ", cost:1200, placement:"land", limit:Infinity, canAir:false, acceptsBuffs:true,  rangeTiles:3.5,
    base:{ dmg:0, interval:0 },
    // สาย 1: เพิ่ม DMG+AS ของป้อมในระยะ (Lv.3 ปลดสกิลเร่ง AS)
    // สาย 2: ลดค่าอัปเกรดของป้อมในระยะ + ขยายระยะบัฟ + เพิ่มระยะยิงให้ป้อมเป้าเล็กน้อย
    upgrades:{
      p1:[ { cost:500 }, { cost:750 }, { cost:1000 }, { cost:1400 }, { cost:2000 } ],
      p2:[ { cost:600 }, { cost:900 }, { cost:1300 }, { cost:1800 }, { cost:2400 } ]
    }
  },
// ... (ที่เหลือคงเดิม) ...
// เติม dtype: "physical" | "fire" | "explosive"
export const TOWERS = [
  { id:"pistol", name:"ปืนพก", cost:50, placement:"land", limit:Infinity, canAir:false, acceptsBuffs:true, rangeTiles:3,   base:{ dmg:25, interval:1.00 }, dtype:"physical", upgrades:{ /* ...ของเดิม... */ } },
  { id:"smg",    name:"SMG",   cost:120,placement:"land", limit:Infinity, canAir:true,  acceptsBuffs:true, rangeTiles:3.2, base:{ dmg:7,  interval:0.15 }, dtype:"physical", upgrades:{ /* ... */ } },
  { id:"minigun",name:"Minigun",cost:7250,placement:"land",limit:Infinity,canAir:false, acceptsBuffs:true, rangeTiles:4,   base:{ dmg:15, interval:0.07 }, dtype:"physical", upgrades:{ /* ... */ } },
  { id:"farm",   name:"ฟาร์ม", cost:700, placement:"land", limit:30, canAir:false, acceptsBuffs:true,  rangeTiles:0, base:{ dmg:0, interval:0 }, dtype:"physical", upgrades:{ /* ... */ } },
  { id:"flame",  name:"ปืนไฟ", cost:300, placement:"land", limit:Infinity, canAir:false, acceptsBuffs:true, rangeTiles:2.2, base:{ dmg:3, interval:0.06 }, dtype:"fire", upgrades:{ /* ... */ } },
  { id:"commander", name:"ผู้บัญชาการ", cost:800, placement:"land", limit:Infinity, canAir:false, acceptsBuffs:true, rangeTiles:3, base:{ dmg:0, interval:0 }, dtype:"physical", upgrades:{ /* ... */ } },
  { id:"dj",     name:"DJ",    cost:1200,placement:"land", limit:Infinity, canAir:false, acceptsBuffs:true, rangeTiles:3.5, base:{ dmg:0, interval:0 }, dtype:"physical", upgrades:{ /* ... */ } },
  { id:"turret", name:"ป้อมปืน", cost:6000, placement:"land", limit:Infinity, canAir:true, acceptsBuffs:false, rangeTiles:4, base:{ dmg:30, interval:0.12 }, dtype:"physical", upgrades:{ /* ... */ } },
  { id:"heli",   name:"ฮอริคอปเตอร์", cost:13000, placement:"land", limit:30, canAir:true, acceptsBuffs:false, rangeTiles:5, base:{ dmg:35, interval:0.10 }, dtype:"physical", upgrades:{ /* ... */ } },
  { id:"ac130",  name:"ฐาน AC-130", cost:40000, placement:"land", limit:7, canAir:false, acceptsBuffs:false, rangeTiles:0, base:{ dmg:0, interval:0 }, dtype:"explosive", upgrades:{ p1:[], p2:[] } },
  { id:"battleship", name:"เรือรบ", cost:70000, placement:"water", limit:2, canAir:true, acceptsBuffs:false, rangeTiles:999, base:{ dmg:80, interval:0.40 }, dtype:"explosive", upgrades:{ /* ... */ } },
  { id:"basecamp", name:"ฐานทัพ", cost:100000, placement:"land", limit:4, canAir:false, acceptsBuffs:false, rangeTiles:0, base:{ dmg:0, interval:0 }, dtype:"physical", upgrades:{ p1:[], p2:[] } },
];