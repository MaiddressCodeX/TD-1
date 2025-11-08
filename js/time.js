// ตัวจับเวลาเกม (จะใช้จริงในฉาก GAME) — ตอนนี้เอาไว้โชว์ตัวอย่าง
export const Time = (() => {
  let last = 0, raf = 0;
  let running = false;
  let multiplier = 1;
  let gameTime = 0; // วินาที "เวลาเกม"

  const listeners = new Set();

  function loop(t) {
    if (!running) return;
    const dt = Math.min(0.05, (t - last) / 1000);
    last = t;
    gameTime += dt * multiplier;
    listeners.forEach(fn => fn({ dt, gameTime, multiplier }));
    raf = requestAnimationFrame(loop);
  }

  return {
    start() { if (!running){ running = true; last = performance.now(); raf = requestAnimationFrame(loop); } },
    stop() { running = false; cancelAnimationFrame(raf); },
    setMultiplier(m) { multiplier = Math.max(1, Math.min(4, m)); },
    get multiplier() { return multiplier; },
    get time() { return gameTime; },
    reset() { gameTime = 0; },
    onTick(fn) { listeners.add(fn); return () => listeners.delete(fn); }
  };
})();