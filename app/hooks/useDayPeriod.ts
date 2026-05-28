"use client";

import { useEffect, useState } from "react";

export type DayPeriod = "sunrise" | "day" | "sunset" | "night";
export type ThemePreference = "auto" | DayPeriod;

function getCurrentDayPeriod(): DayPeriod {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 9) return "sunrise";
  if (hour >= 18 && hour < 21) return "sunset";
  if (hour >= 21 || hour < 6) return "night";

  return "day";
}

export function useDayPeriod(preference: ThemePreference = "auto") {
  const [automaticDayPeriod, setAutomaticDayPeriod] = useState<DayPeriod>(
    getCurrentDayPeriod
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setAutomaticDayPeriod(getCurrentDayPeriod());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  if (preference !== "auto") return preference;

  return automaticDayPeriod;
}
