"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type DayPeriod = "sunrise" | "day" | "sunset" | "night";
export type ThemePreference = "auto" | DayPeriod;

function getCurrentDayPeriod(): DayPeriod {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 9) return "sunrise";
  if (hour >= 18 && hour < 21) return "sunset";
  if (hour >= 21 || hour < 6) return "night";
  return "day";
}

function resolveTheme(preference: ThemePreference): DayPeriod {
  if (preference !== "auto") return preference;
  return getCurrentDayPeriod();
}

// Lee la preferencia inicial ANTES de que React monte
// para evitar que el useEffect sobreescriba el script del <head>
function getInitialPreference(): ThemePreference {
  if (typeof window === "undefined") return "auto";
  try {
    const saved = localStorage.getItem("palabradeldia_theme_preference");
    const valid = ["auto", "sunrise", "day", "sunset", "night"];
    if (saved && valid.includes(saved)) return saved as ThemePreference;
  } catch {}
  return "auto";
}

type ThemeContextValue = {
  preference: ThemePreference;
  theme: DayPeriod;
  setPreference: (pref: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Inicializar con el valor correcto desde el principio
  const [preference, setPreferenceState] = useState<ThemePreference>(getInitialPreference);

  // Sincronizar data-theme solo cuando cambia la preferencia por acción del usuario
  // NO en el mount inicial — el script del <head> ya lo hizo
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Solo actuar después del mount y cuando cambia la preferencia
    if (!isMounted) return;
    const theme = resolveTheme(preference);
    document.documentElement.setAttribute("data-theme", theme);
  }, [preference, isMounted]);

  // Actualizar automáticamente cada minuto si está en modo auto
  useEffect(() => {
    if (preference !== "auto") return;
    const interval = setInterval(() => {
      const theme = getCurrentDayPeriod();
      document.documentElement.setAttribute("data-theme", theme);
    }, 60_000);
    return () => clearInterval(interval);
  }, [preference]);

  function setPreference(pref: ThemePreference) {
    localStorage.setItem("palabradeldia_theme_preference", pref);
    setPreferenceState(pref);
    // Aplicar inmediatamente sin esperar al useEffect
    document.documentElement.setAttribute("data-theme", resolveTheme(pref));
  }

  const theme = resolveTheme(preference);

  return (
    <ThemeContext.Provider value={{ preference, theme, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return ctx;
}