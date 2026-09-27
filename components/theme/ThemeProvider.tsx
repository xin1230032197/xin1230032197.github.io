"use client";
import { createContext, useContext, useSyncExternalStore } from "react";
export const themes = [
  { id: "ink", number: "01", name: "Ink", label: "墨夜秘典" },
  { id: "zen", number: "02", name: "Zen", label: "金箔和纸" },
  { id: "aurora", number: "03", name: "Aurora", label: "星野圣殿" },
] as const;
type Theme = (typeof themes)[number]["id"];
export const themeScript = `(function(){var t;try{t=localStorage.getItem('codex-theme')}catch(e){}if(!['ink','zen','aurora'].includes(t)){t=['ink','zen','aurora'][Math.floor(Math.random()*3)];try{localStorage.setItem('codex-theme',t)}catch(e){}}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t==='zen'?'light':'dark';})();`;
const ThemeContext = createContext<{
  theme: Theme;
  changeTheme: (t: Theme | "random") => void;
}>({ theme: "ink", changeTheme: () => {} });
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribeTheme, readTheme, serverTheme);
  const theme = snapshot || "ink";
  const ready = snapshot !== null;
  function changeTheme(value: Theme | "random") {
    const t =
      value === "random"
        ? themes[Math.floor(Math.random() * themes.length)].id
        : value;
    document.documentElement.dataset.theme = t;
    document.documentElement.style.colorScheme = t === "zen" ? "light" : "dark";
    try {
      localStorage.setItem("codex-theme", t);
    } catch {
      /* Storage may be unavailable. */
    }
  }
  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
      {ready && (
        <div className="theme-indicator" aria-hidden="true">
          THEME / {themes.find((t) => t.id === theme)?.number}
          <br />
          {theme.toUpperCase()}
        </div>
      )}
    </ThemeContext.Provider>
  );
}
// The pre-hydration script owns the initial DOM theme. Subscribe to that
// external source so hydration has a stable snapshot without an effect render.
function readTheme(): Theme {
  const value = document.documentElement.dataset.theme;
  return themes.find((t) => t.id === value)?.id || "ink";
}
function serverTheme() {
  return null;
}
function subscribeTheme(notify: () => void) {
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}
export function ThemeSwitcher() {
  const { theme, changeTheme } = useContext(ThemeContext);
  return (
    <div className="theme-switcher">
      <span className="utility-title">
        ◐ <span>Theme</span>
      </span>
      <div className="theme-options" aria-label="配色主题">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => changeTheme(t.id)}
            aria-pressed={theme === t.id}
            title={t.label}
          >
            <i data-swatch={t.id} />
            {t.name}
          </button>
        ))}
        <button onClick={() => changeTheme("random")} title="重新随机选择主题">
          ↻ Random
        </button>
      </div>
    </div>
  );
}
