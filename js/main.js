import { installCrashOverlay } from "./dev/crash-overlay.js";
import { Router } from "./router.js";

// กันหน้าขาว: โชว์ error บนจอเสมอ
installCrashOverlay();

// ธีมเบื้องต้น
document.documentElement.dataset.theme = "dark";
document.documentElement.style.setProperty("--accent", "#5b9cff");

// ฉากตัวอย่างให้รันได้ทันที
const HomeScene = {
  render(){
    const wrap = document.createElement("div");
    wrap.style.padding = "16px";
    wrap.innerHTML = `
      <div class="card" style="max-width:720px;margin:auto">
        <div class="h1">Maidy TD (Boot OK)</div>
        <p class="muted">ถ้าเห็นหน้านี้ แปลว่า Router + Module ทำงานแล้ว 🎉</p>
        <div class="row" style="gap:8px;margin-top:8px">
          <a class="btn-accent" href="#/game">เริ่มเกม (mock)</a>
          <a class="btn-ghost" href="#/maps">เลือกแผนที่ (mock)</a>
        </div>
      </div>
    `;
    return wrap;
  }
};

const MockGame = {
  render(){
    const el = document.createElement("div");
    el.style.padding = "16px";
    el.innerHTML = `
      <div class="card"><div class="h2">หน้าเกม (mock)</div>
      <p>นี่คือฉากทดสอบ — ต่อสายจริงเข้ามาที่นี่ได้เลย</p>
      <a class="btn-ghost" href="#/">กลับหน้าแรก</a></div>`;
    return el;
  }
};
const MockMaps = {
  render(){
    const el = document.createElement("div");
    el.style.padding = "16px";
    el.innerHTML = `
      <div class="card"><div class="h2">เลือกแผนที่ (mock)</div>
      <p>เมื่อพร้อม ให้ Router.go("/game", {difficulty:"easy", map:"meadow-01"})</p>
      <a class="btn-ghost" href="#/">กลับหน้าแรก</a></div>`;
    return el;
  }
};

// ลงเส้นทางขั้นต่ำ
Router.add("/", HomeScene);
Router.add("/game", MockGame);
Router.add("/maps", MockMaps);
Router.start();
