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
    <header className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
      <div>
        <div className="flex items-center gap-2.5">
          <svg
            width="26"
            height="26"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ color: "var(--accent)", flexShrink: 0 }}
          >
            <path d="M256 365C223 322 174 306 105 326V171C167 153 218 167 256 211V365Z" stroke="currentColor" strokeWidth="22" strokeLinejoin="round" />
            <path d="M256 365C289 322 338 306 407 326V171C345 153 294 167 256 211V365Z" stroke="currentColor" strokeWidth="22" strokeLinejoin="round" />
            <path d="M256 211V376" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
            <path d="M256 118V210" stroke="currentColor" strokeWidth="20" strokeLinecap="round" />
            <path d="M221 159H291" stroke="currentColor" strokeWidth="20" strokeLinecap="round" />
            <path d="M151 123L179 154" stroke="currentColor" strokeWidth="13" strokeLinecap="round" />
            <path d="M361 123L333 154" stroke="currentColor" strokeWidth="13" strokeLinecap="round" />
            <path d="M256 78V98" stroke="currentColor" strokeWidth="13" strokeLinecap="round" />
            <path d="M191 95L207 126" stroke="currentColor" strokeWidth="13" strokeLinecap="round" />
            <path d="M321 95L305 126" stroke="currentColor" strokeWidth="13" strokeLinecap="round" />
          </svg>
          <h1
            className={`text-[1.45rem] font-medium italic leading-none sm:text-[1.7rem] ${theme.primaryText}`}
            style={{ fontFamily: "var(--font-display, Georgia, serif)" }}
          >
            PalabradelD&#237;a
          </h1>
        </div>
        <p
          className={`mt-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] ${theme.mutedText}`}
          style={{ fontFamily: "var(--font-ui, sans-serif)" }}
        >
          beta
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {isAuthenticated && user.id !== "guest-user" ? (
          <div data-tour="user-area" className="flex shrink-0 items-center gap-2">
            <NotificationBell userId={user.id}></NotificationBell>
            <UserMenu
              user={user}
              diaryEntries={diaryEntries}
              onOpenProfileSettings={onOpenProfileSettings}
              onSignOut={onSignOut}
            ></UserMenu>
          </div>
        ) : (
          <button
            onClick={() => onOpenAuth("login")}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${theme.mutedButton}`}
            style={{ fontFamily: "var(--font-ui, sans-serif)" }}
          >
            Entrar
          </button>
        )}
      </div>
    </header>
  );
}