"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { getServerTheme, getTheme, setTheme, subscribeTheme } from "@/lib/theme";

export function ThemeSwitch() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);

  return (
    <div className="theme-switch" role="group" aria-label="Aparência">
      <button type="button" aria-label="Usar tema claro" aria-pressed={theme === "light"} title="Tema claro" onClick={() => setTheme("light")}><Sun size={16} strokeWidth={1.7} aria-hidden="true" /><span>Claro</span></button>
      <button type="button" aria-label="Usar tema escuro" aria-pressed={theme === "dark"} title="Tema escuro" onClick={() => setTheme("dark")}><Moon size={16} strokeWidth={1.7} aria-hidden="true" /><span>Escuro</span></button>
    </div>
  );
}
