import { Time } from "../time.js";
import { Router } from "../router.js";

export function buildPauseButton(){
  const btn = document.createElement("button");
  btn.className = "btn-ghost";
  btn.textContent = "เมนู";
  btn.addEventListener("click", openPause);
  return btn;
}

function openPause(){
  const wasRunning = Time.isRunning?.();
  Time.stop();

  const overlay = document.createElement("div");
  overlay.className = "modal";
  overlay.innerHTML = `
    <div class="modal-card">
      <div class="h2">เมนู</div>
      <div class="col" style="gap:10px;margin-top:8px">
        <button class="btn-accent" data-resume>▶ เล่นต่อ</button>
        <button class="btn-ghost" data-exit>ออกเกม</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelector("[data-resume]").addEventListener("click", ()=>{
    overlay.remove();
    if (wasRunning) Time.start();
  });
  overlay.querySelector("[data-exit]").addEventListener("click", ()=>{
    overlay.remove();
    Router.go("/"); // กลับหน้าแรก
  });
}