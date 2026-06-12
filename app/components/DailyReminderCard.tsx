"use client";

import { useEffect, useState } from "react";
import { getThemeClasses } from "../utils/theme";

const REMINDER_ENABLED_KEY  = "palabradeldia_reminder_enabled";
const REMINDER_TIME_KEY     = "palabradeldia_reminder_time";
const LAST_NOTIFICATION_KEY = "palabradeldia_last_notification_date";

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function isWithinOneMinute(currentHHMM: string, targetHHMM: string): boolean {
  return Math.abs(toMinutes(currentHHMM) - toMinutes(targetHHMM)) <= 1;
}

function isIOS(): boolean {
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

export default function DailyReminderCard() {
  const theme = getThemeClasses();

  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(REMINDER_ENABLED_KEY) === "true";
  });
  const [time, setTime] = useState(() => {
    if (typeof window === "undefined") return "09:00";
    return localStorage.getItem(REMINDER_TIME_KEY) || "09:00";
  });
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return "default";
    return Notification.permission;
  });

  useEffect(() => {
    localStorage.setItem(REMINDER_ENABLED_KEY, String(enabled));
    localStorage.setItem(REMINDER_TIME_KEY, time);
  }, [enabled, time]);

  useEffect(() => {
    if (!enabled || permission !== "granted") return;

    const interval = window.setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const lastDate = localStorage.getItem(LAST_NOTIFICATION_KEY);

      if (isWithinOneMinute(currentTime, time) && lastDate !== today) {
        new Notification("PalabradelDía", {
          body: "El Evangelio de hoy ya está disponible.",
          icon: "/icon.svg",
        });
        localStorage.setItem(LAST_NOTIFICATION_KEY, today);
      }
    }, 30_000);

    return () => window.clearInterval(interval);
  }, [enabled, time, permission]);

  async function handleToggle() {
    if (!("Notification" in window)) {
      alert("Tu navegador no soporta notificaciones.");
      return;
    }
    if (!enabled && Notification.permission !== "granted") {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== "granted") return;
    }
    setEnabled((c) => !c);
  }

  return (
    <section className={`rounded-2xl border px-4 py-3 shadow-sm backdrop-blur ${theme.softCard}`}>
      <div className="flex items-center gap-3">
        <span className="text-lg">🔔</span>
        <p className={`flex-1 text-sm font-semibold ${theme.primaryText}`}>
          Recordatorio diario
        </p>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold outline-none transition ${theme.pill}`}
        />
        <button
          onClick={handleToggle}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${enabled ? theme.button : theme.pill}`}
        >
          {enabled ? "Activado" : "Activar"}
        </button>
      </div>

      {enabled && isIOS() && (
        <p className={`mt-2 text-xs ${theme.mutedText}`}>
          En iPhone, el aviso solo llega si la app está abierta en ese momento.
        </p>
      )}
    </section>
  );
}