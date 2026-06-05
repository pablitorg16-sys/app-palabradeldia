"use client";

import { getThemeClasses } from "../utils/theme";
import type { DiaryEntry, User } from "../types";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";

type HeaderProps = {
  user: User;
  diaryEntries: DiaryEntry[];
  isAuthenticated: boolean;
  onOpenAuth: (mode: "signup" | "login") => void;
  onOpenProfileSettings: () => void;
  onSignOut: () => void;
};

export default function Header({
  user,
  diaryEntries,
  isAuthenticated,
  onOpenAuth,
  onOpenProfileSettings,
  onSignOut,
}: HeaderProps) {
  const theme = getThemeClasses();

  return (
    <header className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
      <div className="flex min-h-12 items-center">
        <p className={`text-sm font-semibold uppercase tracking-[0.14em] sm:text-base sm:tracking-[0.22em] ${theme.accentText}`}>
          PalabradelDía.BETA
        </p>
        <p className={`ml-3 hidden text-sm sm:block ${theme.bodyText}`}>
          La comunidad de reflexión diaria basada en el Evangelio
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {isAuthenticated && user.id !== "guest-user" ? (
          <div data-tour="user-area" className="flex shrink-0 items-center gap-2">
            <NotificationBell userId={user.id} />
            <UserMenu
              user={user}
              diaryEntries={diaryEntries}
              onOpenProfileSettings={onOpenProfileSettings}
              onSignOut={onSignOut}
            />
          </div>
        ) : (
          <button
            onClick={() => onOpenAuth("login")}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${theme.mutedButton}`}
          >
            Entrar
          </button>
        )}
      </div>
    </header>
  );
}