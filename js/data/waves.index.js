// โรงงานสร้างสูตรเวฟสำหรับแต่ละโหมด
export function waveDefFor(mode){
  if (mode === "normal")   return normalWave;
  if (mode === "hard")     return hardWave;
  if (mode === "nightmare")return nightmareWave;
  if (mode === "infinite") return infiniteWave;
  return easyWave;
}

function easyWave(n){ // 30 เวฟ
  const packs=[]; addBase(packs,n,1.0);
  if (n===30) packs.push({type:"boss",count:1,interval:0,delay:6});
  return packs;
}
function normalWave(n){ // 60 เวฟ
  const packs=[]; addBase(packs,n,1.15);
  if (n%10===0) packs.push({type:"flyer",count:8+Math.floor(n/5),interval:0.5,delay:2});
  if (n%15===0) packs.push({type:"tank",count:2+Math.floor(n/6),interval:1.1,delay:4});
  if (n===60) packs.push({type:"boss_aura",count:1,interval:0,delay:8});
  return packs;
}
function hardWave(n){ // 40 เวฟ (โหดขึ้น)
  const packs=[]; addBase(packs,n,1.35);
  packs.push({type:"fast",count:4+Math.floor(n/2),interval:0.34,delay:1.5});
  if (n%5===0) packs.push({type:"flyer",count:10+Math.floor(n/2),interval:0.46,delay:2});
  if (n%8===0) packs.push({type:"tank",count:3+Math.floor(n/4),interval:1.0,delay:4});
  if (n===40) packs.push({type:"boss_aura",count:1,interval:0,delay:8});
  return packs;
}
function nightmareWave(n){ // 100 เวฟ
  const packs=[]; addBase(packs,n,1.6);
  packs.push({type:"fast",count:6+Math.floor(n/2),interval:0.3,delay:1.2});
  if (n%4===0) packs.push({type:"flyer",count:12+Math.floor(n/2),interval:0.42,delay:2});
  if (n%6===0) packs.push({type:"tank",count:4+Math.floor(n/3),interval:0.95,delay:3.5});
  if (n%20===0) packs.push({type:"boss_aura",count:1,interval:0,delay:8});
  return packs;
}
function infiniteWave(n){ // ไร้ที่สิ้นสุด — สเกลขึ้นเรื่อย ๆ
  const packs=[]; addBase(packs,n,1.5);
  packs.push({type:"fast",count:4+Math.floor(n/2),interval:0.34,delay:1.5});
  if (n%3===0) packs.push({type:"flyer",count:8+Math.floor(n/2),interval:0.46,delay:2});
  if (n%5===0) packs.push({type:"tank",count:2+Math.floor(n/3),interval:1.0,delay:3});
  if (n%7===0) packs.push({type:"boss_aura",count:1,interval:0,delay:8});
  return packs;
}

// ===== helpers =====
function addBase(packs,n,scale){
  const add = (type,count,intv,delay=0)=>packs.push({type,count,interval:intv,delay});
  add("grunt",12+Math.floor(n*scale),0.5);
  add("fast", 4+Math.floor(n*0.4*scale),0.4,1.6);
  if (n>=6) add("tank",1+Math.floor(n*0.1*scale),1.15,3.5);
  if (n>=8) add("flyer",6+Math.floor(n*0.35*scale),0.52,2.2);
}// ...เดิมคงไว้...
function easyWave(n){
  const packs=[]; addBase(packs,n,1.0);
  if (n===30) packs.push({type:"boss_easy",count:1,interval:0,delay:6});
  return packs;
}
function normalWave(n){
  const packs=[]; addBase(packs,n,1.15);
  if (n%10===0) packs.push({type:"flyer",count:8+Math.floor(n/5),interval:0.5,delay:2});
  if (n%15===0) packs.push({type:"tank",count:2+Math.floor(n/6),interval:1.1,delay:4});
  if (n===60) packs.push({type:"boss_normal",count:1,interval:0,delay:8});
  return packs;
}
function hardWave(n){
  const packs=[]; addBase(packs,n,1.35);
  packs.push({type:"fast",count:4+Math.floor(n/2),interval:0.34,delay:1.5});
  if (n%5===0) packs.push({type:"flyer",count:10+Math.floor(n/2),interval:0.46,delay:2});
  if (n%8===0) packs.push({type:"tank",count:3+Math.floor(n/4),interval:1.0,delay:4});
  if (n===40) packs.push({type:"boss_hard",count:1,interval:0,delay:8});
  return packs;
}
function nightmareWave(n){
  const packs=[]; addBase(packs,n,1.6);
  packs.push({type:"fast",count:6+Math.floor(n/2),interval:0.3,delay:1.2});
  if (n%4===0) packs.push({type:"flyer",count:12+Math.floor(n/2),interval:0.42,delay:2});
  if (n%6===0) packs.push({type:"tank",count:4+Math.floor(n/3),interval:0.95,delay:3.5});
  if (n%20===0) packs.push({type:"boss_night",count:1,interval:0,delay:8});
  return packs;
}