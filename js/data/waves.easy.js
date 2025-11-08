// สูตรเวฟสำหรับโหมด Easy (30 เวฟ)
export function easyWaveDef(n){
  // n: เริ่มที่ 1
  const packs = [];
  const add = (type, count, interval=0.6, delay=0)=> packs.push({ type, count, interval, delay });
  // สเกลพื้นฐาน
  if (n <= 5) {
    add("grunt", 6 + n*2, 0.55);
    if (n >= 4) add("fast", 3 + n, 0.45, 2);
  } else if (n <= 10) {
    add("grunt", 12 + n, 0.5);
    add("fast", 6 + Math.floor(n/2), 0.4, 2);
    if (n === 10) add("flyer", 8, 0.55, 3);
  } else if (n <= 20) {
    add("grunt", 14 + n, 0.5);
    add("fast", 8 + Math.floor(n/2), 0.38, 1.8);
    if (n % 3 === 0) add("tank", 2 + Math.floor(n/4), 1.2, 4);
    if (n % 5 === 0) add("flyer", 6 + Math.floor(n/2), 0.5, 2.5);
  } else if (n < 30) {
    add("grunt", 18 + Math.floor(n*1.3), 0.46);
    add("fast", 12 + Math.floor(n/2), 0.34, 1.5);
    add("tank", 3 + Math.floor(n/3), 1.1, 4);
    add("flyer", 10 + Math.floor(n/2), 0.48, 2.5);
  } else {
    // wave 30 — mini boss
    add("tank", 10, 1.1);
    add("flyer", 16, 0.48, 3);
    add("boss", 1, 0.0, 8);
  }
  return packs;
}