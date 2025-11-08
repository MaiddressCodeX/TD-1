// ตัวช่วยสร้าง <canvas> สำหรับเกม + รองรับจอ Retina/Resize
export function createGameCanvas(mountEl) {
  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  canvas.style.borderRadius = "12px";
  canvas.style.background = "linear-gradient(180deg, rgba(0,0,0,.05), transparent)";
  mountEl.appendChild(canvas);

  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });

  function resize() {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // วาดด้วยพิกเซลตรรกะ
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  function destroy() {
    ro.disconnect();
    mountEl.removeChild(canvas);
  }

  return { canvas, ctx, resize, destroy };
}