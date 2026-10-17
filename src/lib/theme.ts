import { siteConfig } from "@/config/site";

export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "sued-theme-v1";
export const DEFAULT_THEME: Theme = siteConfig.theme.default;

const themeColors: Record<Theme, string> = { light: "#F6F4EE", dark: "#0B0B0D" };

export function getServerTheme(): Theme {
  return DEFAULT_THEME;
}

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  let meta = document.querySelector<HTMLMetaElement>('meta[data-sued-theme-color]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.dataset.suedThemeColor = "";
    document.head.append(meta);
  }
  meta.content = themeColors[theme];
}

export function setTheme(theme: Theme) {
  applyTheme(theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // A escolha continua funcionando quando o navegador bloqueia armazenamento.
  }
  window.dispatchEvent(new Event("sued-theme-change"));
}

export function subscribeTheme(onChange: () => void) {
  function syncStorage(event: StorageEvent) {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
    applyTheme(event.newValue === "dark" || event.newValue === "light" ? event.newValue : DEFAULT_THEME);
    onChange();
  }
  window.addEventListener("sued-theme-change", onChange);
  window.addEventListener("storage", syncStorage);
  return () => {
    window.removeEventListener("sued-theme-change", onChange);
    window.removeEventListener("storage", syncStorage);
  };
}

/** Só valores constantes locais; executa antes da pintura/hidratação. */
export const themeBootstrap = `(()=>{let t=${JSON.stringify(DEFAULT_THEME)};try{const v=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(v==="light"||v==="dark")t=v}catch{}const r=document.documentElement;r.dataset.theme=t;r.style.colorScheme=t;let m=document.querySelector('meta[data-sued-theme-color]');if(!m){m=document.createElement("meta");m.name="theme-color";m.dataset.suedThemeColor="";document.head.append(m)}m.content=t==="dark"?"#0B0B0D":"#F6F4EE"})()`;
