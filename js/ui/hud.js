import { buildSettingsButton } from "./settings.js";
import { buildPauseButton } from "./pause.js";
import { Time } from "../time.js";
import { Events } from "../events.js";
import { buildSettingsButton } from "./settings.js";
import { buildPauseButton } from "./pause.js";
import { buildShopButton } from "./shop.js";

function formatTime(sec){ const s=Math.floor(sec%60).toString().padStart(2,"0"); const m=Math.floor(sec/60).toString().padStart(2,"0"); return `${m}:${s}`; }

export function createHUD(){
  const hud=document.createElement("div"); hud.className="hud";
  // ซ้าย
  const left=document.createElement("div"); left.className="left";
  const startWave=document.createElement("button"); startWave.className="btn-accent btn-start-wave"; startWave.textContent="► เริ่มเวฟ";
  startWave.addEventListener("click", ()=>{ Events.emit("wave:start"); });
  const moneyTag=document.createElement("div"); moneyTag.className="tag mono"; moneyTag.textContent="เงิน 0 G";
  const livesTag=document.createElement("div"); livesTag.className="tag mono"; livesTag.textContent="♥ 0";
  left.append(startWave, moneyTag, livesTag);
  const unMoney=Events.on("money:change", (m)=> moneyTag.textContent=`เงิน ${m.toLocaleString()} G`);
  const unLives=Events.on("lives:change", (v)=> livesTag.textContent=`♥ ${v}`);

  // กลาง
  const center=document.createElement("div"); center.className="center";
  const timer=document.createElement("div"); timer.className="tag mono"; timer.textContent="เวลาเกม 00:00";
  const waveTag=document.createElement("div"); waveTag.className="tag mono"; waveTag.textContent="Wave 0";
  center.append(timer, waveTag);
  const unsubTick=Time.onTick(({gameTime,multiplier})=>{ timer.textContent=`เวลาเกม ${formatTime(gameTime)}  ×${multiplier}`; });
  const unWave=Events.on("wave:change", (w)=> waveTag.textContent=`Wave ${w}`);

  // ขวา
  const right=document.createElement("div"); right.className="right";
  const speeds=[1,2,3,4].map(n=>{ const b=document.createElement("button"); b.textContent=`${n}x`; b.className="btn-ghost"; b.addEventListener("click", ()=>{ Time.setMultiplier(n); updateActive(n); }); return b; });
  function updateActive(n){ speeds.forEach((b,i)=> b.classList.toggle("active", (i+1)===n)); } updateActive(1);
  right.append(buildSettingsButton(), buildPauseButton(), ...speeds);

  hud.append(left, center, right);
  hud.cleanup=()=>{ unsubTick(); unMoney(); unLives(); unWave(); };
  return hud;
// ...ของเดิมคงไว้...
  const right=document.createElement("div"); right.className="right";
  const speeds=[1,2,3,4].map(n=>{ const b=document.createElement("button"); b.textContent=`${n}x`; b.className="btn-ghost"; b.addEventListener("click", ()=>{ Time.setMultiplier(n); updateActive(n); }); return b; });
  function updateActive(n){ speeds.forEach((b,i)=> b.classList.toggle("active", (i+1)===n)); } updateActive(1);
  right.append(buildSettingsButton(), buildPauseButton(), buildShopButton(), ...speeds);
// ...
}