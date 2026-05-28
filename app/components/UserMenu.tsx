"use client";

import { useEffect, useRef, useState } from "react";
import type { DiaryEntry, User } from "../types";
import FaithAvatar from "./FaithAvatar";
import {
  getFollowerProfiles,
  getFollowingProfiles,
  getProfileFollowStats,
} from "../utils/profiles";

type HeaderTheme = {
  mode?: string;
  mutedButton: string;
  accentText: string;
  bodyText: string;
  primaryText: string;
  card: string;
  innerCard: string;
  mutedText: string;
};

type UserMenuProps = {
  user: User;
  diaryEntries: DiaryEntry[];
  theme: HeaderTheme;
  onOpenProfileSettings: () => void;
  onSignOut: () => void;
};

export default function UserMenu({
  user,
  diaryEntries,
  theme,
  onOpenProfileSettings,
  onSignOut,
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [openFollowList, setOpenFollowList] = useState<
    "followers" | "following" | null
  >(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadFollowData() {
      const [stats, followerProfiles, followingProfiles] = await Promise.all([
        getProfileFollowStats(user.id),
        getFollowerProfiles(user.id),
        getFollowingProfiles(user.id),
      ]);

      if (!isMounted) return;

      setFollowersCount(stats.followersCount);
      setFollowingCount(stats.followingCount);
      setFollowers(followerProfiles);
      setFollowing(followingProfiles);
    }

    void loadFollowData();

    return () => {
      isMounted = false;
    };
  }, [user.id]);

  function handleOpenSettings() {
    setIsOpen(false);
    onOpenProfileSettings();
  }

  return (
    <div ref={menuRef} className="relative z-[120]">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex items-center gap-3 rounded-full border px-3 py-2 text-sm font-semibold transition ${theme.mutedButton}`}
      >
        <FaithAvatar
          avatarId={user.avatarUrl}
          fallbackName={user.name}
          size="sm"
        />

        <span className="hidden max-w-32 truncate sm:block">{user.name}</span>
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 top-16 z-[300] max-h-[calc(100vh-7rem)] w-[min(calc(100vw-1.5rem),25rem)] overflow-y-auto rounded-[2rem] border p-5 shadow-2xl ${
            theme.mode === "night"
              ? "border-[#d9e2cf]/15 bg-[#151b17] text-[#edf3e8]"
              : "border-[#d8d1c0] bg-[#f8f4ea] text-[#26351f]"
          }`}
        >
          <div className="mb-5">
            <div className="mb-3 flex min-w-0 items-center gap-3">
              <FaithAvatar
                avatarId={user.avatarUrl}
                fallbackName={user.name}
                size="md"
              />

              <div className="min-w-0">
                <p
                  className={`truncate text-lg font-bold ${theme.primaryText}`}
                >
                  {user.name}
                </p>

                <p
                  className={`truncate text-sm font-semibold ${theme.accentText}`}
                >
                  @{user.username}
                </p>
              </div>
            </div>

            {user.bio && (
              <p className={`mt-3 text-sm leading-6 ${theme.bodyText}`}>
                {user.bio}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <button
              type="button"
              onClick={() =>
                setOpenFollowList((current) =>
                  current === "followers" ? null : "followers"
                )
              }
              className="text-left"
            >
              <ProfileMiniStat
                label="Seguidores"
                value={followersCount}
                theme={theme}
              />
            </button>

            <button
              type="button"
              onClick={() =>
                setOpenFollowList((current) =>
                  current === "following" ? null : "following"
                )
              }
              className="text-left"
            >
              <ProfileMiniStat
                label="Siguiendo"
                value={followingCount}
                theme={theme}
              />
            </button>
          </div>

          {openFollowList && (
            <div
              className={`mt-4 rounded-2xl border p-4 ${
                theme.mode === "night"
                  ? "border-[#d9e2cf]/15 bg-[#202822]"
                  : "border-[#d8d1c0] bg-[#fffaf0]"
              }`}
            >
              <p className={`mb-3 text-sm font-bold ${theme.primaryText}`}>
                {openFollowList === "followers" ? "Seguidores" : "Siguiendo"}
              </p>

              {(openFollowList === "followers" ? followers : following)
                .length === 0 ? (
                <p className={`text-sm ${theme.mutedText}`}>
                  Todavía no tienes seguidores.
                </p>
              ) : (
                <div className="space-y-3">
                  {(openFollowList === "followers"
                    ? followers
                    : following
                  ).map((profile) => (
                    <div key={profile.id} className="flex items-center gap-3">
                      <FaithAvatar
                        avatarId={profile.avatarUrl}
                        fallbackName={profile.name}
                        size="sm"
                      />

                      <div className="min-w-0">
                        <p
                          className={`truncate text-sm font-bold ${theme.primaryText}`}
                        >
                          {profile.name}
                        </p>

                        <p
                          className={`truncate text-xs font-semibold ${theme.accentText}`}
                        >
                          @{profile.username}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div
            className={`my-5 border-t ${
              theme.mode === "night"
                ? "border-[#d9e2cf]/10"
                : "border-[#d8d1c0]"
            }`}
          />

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleOpenSettings}
              className={`w-full rounded-2xl border px-4 py-4 text-sm font-semibold transition ${theme.mutedButton}`}
            >
              Ajustes de perfil
            </button>

            <button
              type="button"
              onClick={onSignOut}
              className={`w-full rounded-2xl border px-4 py-4 text-sm font-semibold transition ${
                theme.mode === "night"
                  ? "border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/20"
                  : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileMiniStat({
  label,
  value,
  theme,
}: {
  label: string;
  value: number;
  theme: HeaderTheme;
}) {
  return (
    <article className={`rounded-2xl border px-3 py-4 ${theme.innerCard}`}>
      <p className={`text-xl font-bold leading-none ${theme.primaryText}`}>
        {value}
      </p>

      <p
        className={`mt-2 text-xs font-semibold leading-tight ${theme.accentText}`}
      >
        {label}
      </p>
    </article>
  );
}