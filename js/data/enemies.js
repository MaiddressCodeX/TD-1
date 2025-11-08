export const ENEMY_TYPES = {
  grunt: { name:"ธรรมดา",  hp:60,   speedTiles:1.2, bounty:15, flying:false, armor:0 },
  fast:  { name:"วิ่งไว",   hp:40,   speedTiles:2.0, bounty:12, flying:false, armor:0 },
  tank:  { name:"เกราะ",    hp:260,  speedTiles:0.85,bounty:40, flying:false, armor:18, resists:{ phys:0.85, fire:1.1, expl:1.0 } },
  flyer: { name:"บิน",      hp:80,   speedTiles:1.6, bounty:18, flying:true,  armor:2 },
  boss_easy:   { name:"บอส (Easy)",   hp:2600, speedTiles:1.0, bounty:320, flying:false, armor:24 },
  boss_normal: { name:"บอส (Normal)", hp:3600, speedTiles:1.0, bounty:480, flying:false, armor:26 },
  boss_hard:   { name:"บอส (Hard)",   hp:4800, speedTiles:1.0, bounty:650, flying:false, armor:28 },
  boss_night:  { name:"บอส (Night)",  hp:6800, speedTiles:1.05,bounty:900, flying:false, armor:30, aura:{ radiusTiles:5, slow:0.25, weaken:0.15 } },
  boss_aura:   { name:"บอสออร่า",    hp:4000, speedTiles:0.95,bounty:550, flying:false, armor:30, resists:{ phys:0.85, fire:0.9, expl:0.85 }, aura:{ radiusTiles:4.5, slow:0.25, weaken:0.15 } }
};

export function cloneEnemy(typeKey){
  const t = ENEMY_TYPES[typeKey]; if (!t) throw new Error(`Unknown enemy type: ${typeKey}`);
  return {
    type:typeKey, name:t.name, hp:t.hp, hpMax:t.hp,
    speedTiles:t.speedTiles, baseSpeed:t.speedTiles,
    bounty:t.bounty, flying:t.flying, armor:t.armor||0,
    resists:t.resists||null, aura:t.aura||null, shield:false
  };
}