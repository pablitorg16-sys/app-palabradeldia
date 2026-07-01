"use client";

import { useEffect, useState } from "react";
import type { CommunityPost, User } from "../types";
import { getFollowerProfiles, getFollowingProfiles, getProfileFollowStats, getPublicProfilePosts } from "../utils/profiles";
import { followUser, isFollowingUser, unfollowUser } from "../utils/follows";
import { createNotification } from "../utils/notifications";
import FaithAvatar from "./FaithAvatar";
import { useTheme } from "../context/ThemeContext";
import { getThemeClasses } from "../utils/theme";

type ProfileModalProps = {
  user: User;
  currentUserId?: string;
  onFollowChange?: () => void;
  onClose: () => void;
};

export default function ProfileModal({ user, currentUserId, onFollowChange, onClose }: ProfileModalProps) {
  const { theme: dayPeriod } = useTheme();
  const theme = getThemeClasses();
  const isNight = dayPeriod === "night";

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [openFollowList, setOpenFollowList] = useState<"followers" | "following" | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  // Sub-profile navigation (inline, dentro del mismo modal)
  const [subProfileUser, setSubProfileUser] = useState<User | null>(null);
  const [subProfilePosts, setSubProfilePosts] = useState<CommunityPost[]>([]);
  const [subProfileStats, setSubProfileStats] = useState({ followersCount: 0, followingCount: 0 });
  const [isLoadingSubProfile, setIsLoadingSubProfile] = useState(false);

  const isOwnProfile = currentUserId === user.id;
  const activeFollowClass = isNight ? "bg-[#d9e2cf] text-[#202822]" : "bg-[#26351f] text-white";

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      const [profilePosts, followStats, followerProfiles, followingProfiles] = await Promise.all([
        getPublicProfilePosts(user.id),
        getProfileFollowStats(user.id),
        getFollowerProfiles(user.id),
        getFollowingProfiles(user.id),
      ]);
      setPosts(profilePosts);
      setFollowersCount(followStats.followersCount);
      setFollowingCount(followStats.followingCount);
      setFollowers(followerProfiles);
      setFollowing(followingProfiles);
      if (currentUserId && !isOwnProfile) {
        const result = await isFollowingUser({ currentUserId, targetUserId: user.id });
        setIsFollowing(result);
      }
      setIsLoading(false);
    }
    void loadProfile();
  }, [user.id, currentUserId, isOwnProfile]);

  useEffect(() => {
    if (!subProfileUser) return;
    setIsLoadingSubProfile(true);
    setSubProfilePosts([]);
    void Promise.all([
      getPublicProfilePosts(subProfileUser.id),
      getProfileFollowStats(subProfileUser.id),
    ]).then(([subPosts, subStats]) => {
      setSubProfilePosts(subPosts);
      setSubProfileStats(subStats);
      setIsLoadingSubProfile(false);
    });
  }, [subProfileUser]);

  async function handleFollowToggle() {
    if (!currentUserId || isOwnProfile || isFollowLoading) return;
    const nextFollowing = !isFollowing;
    setIsFollowing(nextFollowing);
    setIsFollowLoading(true);
    if (nextFollowing) {
      const { error } = await followUser({ currentUserId, targetUserId: user.id });
      if (error) { setIsFollowing(false); }
      else {
        await createNotification({ recipientId: user.id, actorId: currentUserId, type: "follow" });
        setFollowersCount((c) => c + 1);
        onFollowChange?.();
      }
    } else {
      const { error } = await unfollowUser({ currentUserId, targetUserId: user.id });
      if (error) { setIsFollowing(true); }
      else {
        setFollowersCount((c) => Math.max(0, c - 1));
        onFollowChange?.();
      }
    }
    setIsFollowLoading(false);
  }

  const sharedCount = posts.length;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
    >
      <section
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border p-5 shadow-2xl sm:p-6 ${theme.card}`}
      >
        {subProfileUser ? (
          /* ── Vista de sub-perfil ── */
          <div>
            <button
              type="button"
              onClick={() => setSubProfileUser(null)}
              className={`mb-5 text-sm font-semibold transition hover:opacity-70 ${theme.accentText}`}
            >
              &#8592; Volver
            </button>

            <div className="mb-5 flex min-w-0 items-start gap-4">
              <FaithAvatar avatarId={subProfileUser.avatarUrl} fallbackName={subProfileUser.name} size="lg" />
              <div className="min-w-0">
                <h2 className={`truncate text-xl font-bold ${theme.primaryText}`}>{subProfileUser.name}</h2>
                <p className={`mt-0.5 text-sm font-semibold ${theme.accentText}`}>@{subProfileUser.username}</p>
                {subProfileUser.bio && (
                  <p className={`mt-2 text-sm leading-6 ${theme.bodyText}`}>{subProfileUser.bio}</p>
                )}
              </div>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-3">
              <ProfileStat label="Seguidores" value={subProfileStats.followersCount} />
              <ProfileStat label="Reflexiones" value={subProfilePosts.length} />
            </div>

            <div className={`mb-5 h-px ${theme.divider}`} />

            <div className="space-y-4">
              {isLoadingSubProfile ? (
                <div className={`rounded-2xl p-5 text-sm font-semibold ${theme.innerCard} ${theme.primaryText}`}>
                  Cargando perfil...
                </div>
              ) : subProfilePosts.length === 0 ? (
                <div className={`rounded-2xl p-5 text-sm ${theme.innerCard} ${theme.bodyText}`}>
                  Este usuario todav&#237;a no ha compartido reflexiones.
                </div>
              ) : (
                subProfilePosts.map((post) => (
                  <article key={post.id} className={`rounded-2xl border p-5 ${theme.innerCard}`}>
                    <div className="mb-3">
                      <p className={`text-sm font-semibold ${theme.accentText}`}>{post.gospelReference}</p>
                      <p className={`mt-1 text-xs ${theme.mutedText}`}>{post.date} &#183; {post.time}</p>
                    </div>
                    <p className={`leading-7 ${theme.bodyText}`}>{post.text}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        ) : (
          /* ── Vista principal ── */
          <>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 gap-4">
                <FaithAvatar avatarId={user.avatarUrl} fallbackName={user.name} size="lg" />
                <div className="min-w-0">
                  <h2 className={`truncate text-2xl font-bold ${theme.primaryText}`}>{user.name}</h2>
                  <p className={`mt-1 text-sm font-semibold ${theme.accentText}`}>@{user.username}</p>
                  {user.bio && (
                    <p className={`mt-3 max-w-xl text-sm leading-7 ${theme.bodyText}`}>{user.bio}</p>
                  )}
                  {currentUserId && !isOwnProfile && (
                    <button
                      type="button"
                      onClick={handleFollowToggle}
                      disabled={isFollowLoading}
                      className={`mt-4 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${
                        isFollowing ? activeFollowClass : theme.mutedButton
                      }`}
                    >
                      {isFollowLoading ? "..." : isFollowing ? "Siguiendo" : "Seguir"}
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className={`self-end rounded-full px-3 py-1 text-sm font-bold sm:self-start ${theme.mutedButton}`}
              >
                &#x2715;
              </button>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setOpenFollowList((c) => (c === "followers" ? null : "followers"))}
                className="text-left"
              >
                <ProfileStat label="Seguidores" value={followersCount} />
              </button>
              <button
                type="button"
                onClick={() => setOpenFollowList((c) => (c === "following" ? null : "following"))}
                className="text-left"
              >
                <ProfileStat label="Siguiendo" value={followingCount} />
              </button>
              <ProfileStat label="Reflexiones" value={sharedCount} />
            </div>

            {openFollowList && (
              <div className={`mb-5 rounded-2xl border p-4 ${theme.innerCard}`}>
                <p className={`mb-3 text-sm font-bold ${theme.primaryText}`}>
                  {openFollowList === "followers" ? "Seguidores" : "Siguiendo"}
                </p>
                {(openFollowList === "followers" ? followers : following).length === 0 ? (
                  <p className={`text-sm ${theme.mutedText}`}>Todav&#237;a no hay usuarios en esta lista.</p>
                ) : (
                  <div className="space-y-1">
                    {(openFollowList === "followers" ? followers : following).map((profile) => (
                      <button
                        key={profile.id}
                        type="button"
                        onClick={() => { setSubProfileUser(profile); setOpenFollowList(null); }}
                        className={`flex w-full items-center gap-3 rounded-[var(--radius-panel)] px-2 py-2 text-left transition hover:bg-[var(--soft-bg)] ${theme.primaryText}`}
                      >
                        <FaithAvatar avatarId={profile.avatarUrl} fallbackName={profile.name} size="sm" />
                        <div className="min-w-0">
                          <p className={`truncate text-sm font-bold ${theme.primaryText}`}>{profile.name}</p>
                          <p className={`truncate text-xs font-semibold ${theme.accentText}`}>@{profile.username}</p>
                        </div>
                        <span className={`ml-auto text-xs ${theme.mutedText}`}>&#8594;</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className={`mb-5 h-px ${theme.divider}`} />

            <div className="space-y-4">
              {isLoading ? (
                <div className={`rounded-2xl p-5 text-sm font-semibold ${theme.innerCard} ${theme.primaryText}`}>
                  Cargando perfil...
                </div>
              ) : posts.length === 0 ? (
                <div className={`rounded-2xl p-5 text-sm ${theme.innerCard} ${theme.bodyText}`}>
                  Este usuario todav&#237;a no ha compartido reflexiones.
                </div>
              ) : (
                posts.map((post) => (
                  <article key={post.id} className={`rounded-2xl border p-5 ${theme.innerCard}`}>
                    <div className="mb-3">
                      <p className={`text-sm font-semibold ${theme.accentText}`}>{post.gospelReference}</p>
                      <p className={`mt-1 text-xs ${theme.mutedText}`}>{post.date} &#183; {post.time}</p>
                    </div>
                    <p className={`leading-7 ${theme.bodyText}`}>{post.text}</p>
                  </article>
                ))
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function ProfileStat({ label, value }: { label: string; value: number }) {
  const theme = getThemeClasses();
  return (
    <article className={`rounded-2xl border px-4 py-5 ${theme.innerCard}`}>
      <p className={`text-2xl font-bold leading-none ${theme.primaryText}`}>{value}</p>
      <p className={`mt-2 text-sm font-semibold leading-tight ${theme.accentText}`}>{label}</p>
    </article>
  );
}
