// Event Bus ง่าย ๆ ใช้สำหรับสื่อสารระหว่างโมดูล
const map = new Map();
export const Events = {
  on(type, fn) {
    if (!map.has(type)) map.set(type, new Set());
    map.get(type).add(fn);
    return () => map.get(type)?.delete(fn);
  },
  emit(type, payload) {
    map.get(type)?.forEach(fn => fn(payload));
  }
};