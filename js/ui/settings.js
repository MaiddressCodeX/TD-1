import { Storage } from "../storage.js";
import { startRecord, stopRecord, isRecording, clearLogs, replay, getLogs } from "../core/macro.js";

export function buildSettingsButton(){
  const btn = document.createElement("button");
  btn.className = "btn-ghost";
  btn.textContent = "⚙️";
  btn.addEventListener("click", openSettings);
  return btn;
}

function openSettings(){
  const s = Storage.get();
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-card">
      <div class="h2">ตั้งค่า</div>
      <div class="col" style="gap:10px;margin-top:8px">
        <label class="row" style="justify-content:space-between;gap:10px">
          <span>Auto-skip wave</span>
          <input type="checkbox" data-autoskip ${s.autoSkip?"checked":""}>
        </label>
        <label class="row" style="justify-content:space-between;gap:10px">
          <span>ธีม: <span class="muted">สว่าง/มืด</span></span>
          <select data-theme>
            <option value="light" ${s.theme==="light"?"selected":""}>สว่าง</option>
            <option value="dark" ${s.theme==="dark"?"selected":""}>มืด</option>
          </select>
        </label>
        <label class="row" style="justify-content:space-between;gap:10px">
          <span>สี Accent</span>
          <input type="color" data-accent value="${s.accent||'#5b9cff'}">
        </label>

        <div class="hr"></div>
        <div class="h2">Macro</div>
        <div class="row" style="gap:8px;flex-wrap:wrap">
          <button class="btn-accent" data-macro-toggle>${isRecording()?"⏹ หยุดบันทึก":"⏺ เริ่มบันทึก"}</button>
          <button class="btn-ghost" data-macro-play ${getLogs().length? "":"disabled"}>▶ เล่นซ้ำ</button>
          <button class="btn-ghost" data-macro-clear ${getLogs().length? "":"disabled"}>ล้าง</button>
        </div>

        <div class="hr"></div>
        <button class="btn-ghost" data-close>ปิด</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector("[data-autoskip]").addEventListener("change", (e)=>{
    s.autoSkip = !!e.target.checked; Storage.set(s);
  });
  modal.querySelector("[data-theme]").addEventListener("change", (e)=>{
    s.theme = e.target.value; Storage.set(s);
    document.documentElement.dataset.theme = s.theme;
  });
  modal.querySelector("[data-accent]").addEventListener("input", (e)=>{
    s.accent = e.target.value; Storage.set(s);
    document.documentElement.style.setProperty("--accent", s.accent);
  });

  modal.querySelector("[data-macro-toggle]").addEventListener("click", ()=>{
    if (isRecording()) stopRecord(); else startRecord();
    modal.remove(); openSettings(); // refresh view ปุ่ม
  });
  modal.querySelector("[data-macro-play]").addEventListener("click", async ()=>{
    await replay();
  });
  modal.querySelector("[data-macro-clear]").addEventListener("click", ()=>{
    clearLogs(); modal.remove(); openSettings();
  });

  modal.querySelector("[data-close]").addEventListener("click", ()=> modal.remove());
}