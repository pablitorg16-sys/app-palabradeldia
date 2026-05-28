"use client";

import { useEffect, useState } from "react";
import { getThemeClasses } from "../utils/theme";
type Theme = ReturnType<typeof getThemeClasses>;

type DailyReminderCardProps = {
  theme: Theme;
};

const REMINDER_ENABLED_KEY = "palabradeldia_reminder_enabled";
const REMINDER_TIME_KEY = "palabradeldia_reminder_time";
const LAST_NOTIFICATION_KEY = "palabradeldia_last_notification_date";

export default function DailyReminderCard({ theme }: DailyReminderCardProps) {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return false;

    return localStorage.getItem(REMINDER_ENABLED_KEY) === "true";
  });
  const [time, setTime] = useState(() => {
    if (typeof window === "undefined") return "09:00";

    return localStorage.getItem(REMINDER_TIME_KEY) || "09:00";
  });
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "default";
    }

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
      const currentTime = now.toTimeString().slice(0, 5);
      const today = now.toISOString().slice(0, 10);
      const lastNotificationDate = localStorage.getItem(LAST_NOTIFICATION_KEY);

      if (currentTime === time && lastNotificationDate !== today) {
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

    setEnabled((current) => !current);
  }

  return (
    <section
      className={`rounded-2xl border p-5 shadow-sm backdrop-blur ${theme.softCard}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p
            className={`text-sm font-semibold uppercase tracking-[0.18em] ${theme.accentText}`}
          >
            Recordatorio diario
          </p>

          <h2 className={`mt-1 text-lg font-bold ${theme.primaryText}`}>
            Leer el Evangelio sin presión
          </h2>

          <p className={`mt-1 text-sm ${theme.bodyText}`}>
            Recibe un aviso suave cuando quieras dedicar un momento al Evangelio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold outline-none transition ${theme.pill}`}
          />

          <button
            onClick={handleToggle}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              enabled ? theme.button : theme.pill
            }`}
          >
            {enabled ? "Activado" : "Activar"}
          </button>
        </div>
      </div>
    </section>
  );
}