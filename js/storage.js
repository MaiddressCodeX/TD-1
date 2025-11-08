const KEY = "td.settings.v1";
const defaultSettings = {
  theme: "light",          // 'light' | 'dark'
  accent: "#ff8a00",
  autoSkip: false
};

export const Storage = {
  get() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...defaultSettings, ...JSON.parse(raw) } : { ...defaultSettings };
    } catch {
      return { ...defaultSettings };
    }
  },
  set(patch) {
    const merged = { ...Storage.get(), ...patch };
    localStorage.setItem(KEY, JSON.stringify(merged));
    return merged;
  },
  reset() {
    localStorage.removeItem(KEY);
  }
};
const KEY = "td-settings";
const DEF = { autoSkip:false, theme:"dark", accent:"#5b9cff" };
export const Storage = {
  get(){ try{ return { ...DEF, ...(JSON.parse(localStorage.getItem(KEY)||"{}")) }; }catch{ return { ...DEF }; } },
  set(v){ localStorage.setItem(KEY, JSON.stringify(v)); }
};