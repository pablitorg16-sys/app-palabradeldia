"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

import {
  getNotifications,
  markNotificationsAsRead,
  type AppNotification,
} from "../utils/notifications";

import FaithAvatar from "./FaithAvatar";

type Theme = {
  mutedButton: string;
  accentText: string;
  primaryText: string;
  bodyText: string;
  mutedText: string;
  card: string;
  innerCard: string;
  mode?: string;
};

type NotificationBellProps = {
  userId: string;
  theme: Theme;
};

function getNotificationText(notification: AppNotification) {
  if (notification.type === "like") {
    return "ha dado me gusta a tu reflexión.";
  }

  if (notification.type === "comment") {
    return "ha comentado tu reflexión.";
  }

  return "ha empezado a seguirte.";
}

export default function NotificationBell({ userId, theme }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const loadNotifications = useCallback(async () => {
    if (!userId || userId === "guest-user") {
      setNotifications([]);
      return;
    }

    const loadedNotifications = await getNotifications(userId);
    setNotifications(loadedNotifications);
  }, [userId]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadNotifications();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadNotifications]);

  useEffect(() => {
    if (!userId || userId === "guest-user") return;

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${userId}`,
        },
        async () => {
          await loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, loadNotifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!userId || userId === "guest-user") {
    return null;
  }

  async function handleToggleOpen() {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);

    if (nextOpen && unreadCount > 0) {
      await markNotificationsAsRead(userId);
      await loadNotifications();
    }
  }

  function handleNotificationClick(notification: AppNotification) {
    setIsOpen(false);

    if (notification.type === "follow") {
      return;
    }

    const targetId = notification.reflectionId;

    if (!targetId) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent("palabradeldia:open-reflection", { detail: { reflectionId: targetId } })
    );

    const target = document.getElementById(`reflection-${targetId}`);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    window.location.hash = `reflection-${targetId}`;
  }

  return (
    <div ref={menuRef} className="relative z-[120]">
      <button
        onClick={handleToggleOpen}
        className={`relative rounded-full border px-4 py-2 text-sm font-semibold transition ${theme.mutedButton}`}
      >
        🔔

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d9e2cf] px-1 text-xs font-bold text-[#202822]">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
        className={`fixed left-3 right-3 top-24 z-[400] max-h-[calc(100vh-8rem)] overflow-y-auto rounded-[2rem] border p-4 shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-14 sm:max-h-[32rem] sm:w-[24rem] ${
  theme.mode === "night"
    ? "border-[#d9e2cf]/15 bg-[#151b17] text-[#edf3e8]"
    : "border-[#d8d1c0] bg-[#f8f4ea] text-[#26351f]"
}`}>
          <p className={`mb-4 text-sm font-semibold uppercase tracking-[0.2em] ${theme.accentText}`}>
            Notificaciones
          </p>

          {notifications.length === 0 ? (
            <p className={`rounded-2xl p-4 text-sm ${theme.innerCard} ${theme.bodyText}`}>
              Todavía no tienes notificaciones.
            </p>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const clickable = notification.type !== "follow" && !!notification.reflectionId;

                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleNotificationClick(notification)}
                    disabled={!clickable}
                    className={`flex w-full gap-3 rounded-2xl p-3 text-left transition ${theme.innerCard} ${
                      clickable ? "hover:scale-[1.01]" : "cursor-default"
                    } ${notification.read ? "opacity-80" : "opacity-100"}`}
                  >
                    <FaithAvatar
                      avatarId={notification.actor.avatarUrl}
                      fallbackName={notification.actor.name}
                      size="sm"
                    />

                    <div className="min-w-0">
                      <p className={`text-sm leading-6 ${theme.bodyText}`}>
                        <span className={`font-semibold ${theme.primaryText}`}>
                          {notification.actor.name}
                        </span>{" "}
                        {getNotificationText(notification)}
                      </p>

                      <p className={`mt-1 truncate text-xs ${theme.accentText}`}>
                        @{notification.actor.username}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
