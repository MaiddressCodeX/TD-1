import { Router } from "../router.js";
import { APP_NAME } from "../config.js";
import { hydrateThemeFromStorage } from "../ui/settings.js";

export const MenuScene = {
  async render() {
    hydrateThemeFromStorage();

    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <header class="header container">
        <div class="brand">${APP_NAME} <span class="dot">●</span></div>
      </header>
      <main class="container">
        <div class="card" style="margin: 10vh 0;">
          <div class="col" style="gap:18px">
            <div class="h1">Tower Defense</div>
            <div class="muted">โหมดเล่นเดี่ยว (Prototype) — HTML/CSS/JS</div>
            <div class="menu-grid">
              <div class="menu-card card">
                <div class="h2">เริ่มเกม</div>
                <p class="muted">ไปหน้าเลือกความยาก</p>
                <button class="btn-accent" data-start>เริ่มเกม</button>
              </div>
              <div class="menu-card card">
                <div class="h2">ตั้งค่า</div>
                <p class="muted">ธีม, สีเน้น, Auto-skip</p>
                <button class="btn-ghost" data-settings>เปิดตั้งค่า</button>
              </div>
              <div class="menu-card card">
                <div class="h2">ออกเกม</div>
                <p class="muted">ปิดแท็บหรือกลับหน้าแรก</p>
                <button class="btn-ghost" data-exit>ออกเกม</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer>© ${new Date().getFullYear()} Maiddress — โปรเจกต์สอน/เดโม่</footer>
    `;

    // ปุ่ม
    wrap.querySelector("[data-start]").addEventListener("click", ()=> Router.go("difficulty"));
    wrap.querySelector("[data-settings]").addEventListener("click", ()=>{
      import("../ui/settings.js").then(m => m.default ?? m).then(()=> {
        // เรียกผ่านฟังก์ชันในไฟล์ settings (ปุ่มจะมีใน HUD ฉากเกมด้วย)
        // ที่นี่เราแค่เปิดอย่างไว:
        const evt = new Event("click");
        // สร้างปุ่มชั่วคราวเพื่อ reuse logic
        import("../ui/settings.js").then(({ buildSettingsButton })=>{
          const btn = buildSettingsButton(); document.body.appendChild(btn); btn.click(); btn.remove();
        });
      });
    });
    wrap.querySelector("[data-exit]").addEventListener("click", ()=>{
      if (confirm("ออกเกมหรือไม่?")) {
        // เว็บปิดแท็บอัตโนมัติอาจถูกบล็อก — แสดงข้อความแทน
        alert("คุณสามารถปิดแท็บนี้ได้เลย ขอบคุณที่เล่น!");
      }
    });

    return wrap;
  }
};