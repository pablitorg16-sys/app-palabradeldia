import type { DiaryEntry, User } from "../types";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";

type HeaderTheme = {
  mutedButton: string;
  accentText: string;
  bodyText: string;
  primaryText: string;
  card: string;
  innerCard: string;
  mutedText: string;
  mode?: string;
};

type HeaderProps = {
  user: User;
  theme: HeaderTheme;
  diaryEntries: DiaryEntry[];
  isAuthenticated: boolean;
  onOpenAuth: (mode: "signup" | "login") => void;
  onOpenProfileSettings: () => void;
  onSignOut: () => void;
};

export default function Header({
  user,
  theme,
  diaryEntries,
  isAuthenticated,
  onOpenAuth,
  onOpenProfileSettings,
  onSignOut,
}: HeaderProps) {
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
          <>
            <div data-tour="user-area" className="flex shrink-0 items-center gap-2">
              <NotificationBell userId={user.id} theme={theme} />
              <UserMenu
                user={user}
                diaryEntries={diaryEntries}
                theme={theme}
                onOpenProfileSettings={onOpenProfileSettings}
                onSignOut={onSignOut}
              />
            </div>

            
          </>
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