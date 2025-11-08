export const APP_NAME = "TD — Maiddress";
export const VERSION = "0.1.0-pre";

export const DIFFICULTY = {
  easy:      { label: "Easy",      waves: 30,  startMoney: 1000,  desc: "เริ่มต้นสบาย ๆ 30 เวฟ" },
  normal:    { label: "Normal",    waves: 60,  startMoney: 1200,  desc: "มาตรฐาน 60 เวฟ" },
  hard:      { label: "Hard",      waves: 40,  startMoney: 4000,  desc: "ยากขึ้นแต่เวฟน้อยลง" },
  nightmare: { label: "Nightmare", waves: 100, startMoney: 5000,  desc: "ท้าทายสุด 100 เวฟ" },
  infinite:  { label: "Infinite",  waves: Infinity, startMoney: 3000, desc: "เวฟไม่จำกัด สเกลขึ้นเรื่อย ๆ" }
};