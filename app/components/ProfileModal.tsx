"use client";

import { useEffect, useState } from "react";

import type { CommunityPost, User } from "../types";

import {
  getFollowerProfiles,
  getFollowingProfiles,
  getProfileFollowStats,
  getPublicProfilePosts,
} from "../utils/profiles";

import {
  followUser,
  isFollowingUser,
  unfollowUser,
} from "../utils/follows";

import { createNotification } from "../utils/notifications";

import FaithAvatar from "./FaithAvatar";

type Theme = {
  mode?: string;
  card: string;
  innerCard: string;
  mutedButton: string;
  accentText: string;
  primaryText: string;
  bodyText: string;
  mutedText: string;
  button: string;
};

type ProfileModalProps = {
  user: User;
  currentUserId?: string;
  theme?: Theme;
  onFollowChange?: () => void;
  onClose: () => void;
};

export default function ProfileModal({
  user,
  currentUserId,
  theme,
  onFollowChange,
  onClose,
}: ProfileModalProps) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [openFollowList, setOpenFollowList] = useState<
    "followers" | "following" | null
  >(null);

  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const isOwnProfile = currentUserId === user.id;

  const modalCard = theme?.card ?? "border-[#5f6f52]/25 bg-[#f4f1e8]";
  const innerCard = theme?.innerCard ?? "border-[#5f6f52]/20 bg-white/60";
  const primaryText = theme?.primaryText ?? "text-[#26351f]";
  const accentText = theme?.accentText ?? "text-[#4f6740]";
  const bodyText = theme?.bodyText ?? "text-stone-700";
  const mutedText = theme?.mutedText ?? "text-stone-500";
  const mutedButton = theme?.mutedButton ?? "border border-[#5f6f52]/25 bg-white/70 text-[#26351f]";
  const activeFollow = theme?.mode === "night" ? "bg-[#d9e2cf] text-[#202822]" : "bg-[#26351f] text-white";

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
        const following = await isFollowingUser({
          currentUserId,
          targetUserId: user.id,
        });

        setIsFollowing(following);
      }

      setIsLoading(false);
    }

    loadProfile();
  }, [user.id, currentUserId, isOwnProfile]);

  async function handleFollowToggle() {
    if (!currentUserId || isOwnProfile || isFollowLoading) return;

    const nextFollowing = !isFollowing;
    setIsFollowing(nextFollowing);
    setIsFollowLoading(true);

    if (nextFollowing) {
      const { error } = await followUser({
        currentUserId,
        targetUserId: user.id,
      });

      if (error) {
        setIsFollowing(false);
      } else {
        await createNotification({
          recipientId: user.id,
          actorId: currentUserId,
          type: "follow",
        });

        setFollowersCount((count) => count + 1);
        onFollowChange?.();
      }
    } else {
      const { error } = await unfollowUser({
        currentUserId,
        targetUserId: user.id,
      });

      if (error) {
        setIsFollowing(true);
      } else {
        setFollowersCount((count) => Math.max(0, count - 1));
        onFollowChange?.();
      }
    }

    setIsFollowLoading(false);
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
    >
      <section
        onClick={(event) => event.stopPropagation()}
        className={`max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border p-5 shadow-2xl sm:p-6 ${modalCard}`}
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-4">
            <FaithAvatar
              avatarId={user.avatarUrl}
              fallbackName={user.name}
              size="lg"
            />

            <div className="min-w-0">
              <h2 className={`truncate text-2xl font-bold ${primaryText}`}>
                {user.name}
              </h2>

              <p className={`mt-1 text-sm font-semibold ${accentText}`}>
                @{user.username}
              </p>

              {user.bio && (
                <p className={`mt-4 max-w-xl leading-7 ${bodyText}`}>
                  {user.bio}
                </p>
              )}
              {currentUserId && !isOwnProfile && (
  <button
    type="button"
    onClick={handleFollowToggle}
    disabled={isFollowLoading}
    className={`mt-4 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${
      isFollowing ? activeFollow : mutedButton
    }`}
  >
    {isFollowLoading ? "..." : isFollowing ? "Siguiendo" : "Seguir"}
  </button>
)}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 self-end sm:self-start">
           
            <button
              onClick={onClose}
              className={`rounded-full px-3 py-1 text-sm font-bold ${mutedButton}`}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 text-center">
  <button
    type="button"
    onClick={() =>
      setOpenFollowList((current) =>
        current === "followers" ? null : "followers"
      )
    }
    className="text-left"
  >
    <ProfileStat
      label="Seguidores"
      value={followersCount}
      theme={{ innerCard, primaryText, accentText }}
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
    <ProfileStat
      label="Siguiendo"
      value={followingCount}
      theme={{ innerCard, primaryText, accentText }}
    />
  </button>
</div>

{openFollowList && (
  <div className={`mb-5 rounded-2xl border p-4 ${innerCard}`}>
    <p className={`mb-3 text-sm font-bold ${primaryText}`}>
      {openFollowList === "followers" ? "Seguidores" : "Siguiendo"}
    </p>

    {(openFollowList === "followers" ? followers : following).length === 0 ? (
      <p className={`text-sm ${mutedText}`}>
        Todavía no hay usuarios en esta lista.
      </p>
    ) : (
      <div className="space-y-3">
        {(openFollowList === "followers" ? followers : following).map(
          (profile) => (
            <div key={profile.id} className="flex items-center gap-3">
              <FaithAvatar
                avatarId={profile.avatarUrl}
                fallbackName={profile.name}
                size="sm"
              />

              <div className="min-w-0">
                <p className={`truncate text-sm font-bold ${primaryText}`}>
                  {profile.name}
                </p>

                <p className={`truncate text-xs font-semibold ${accentText}`}>
                  @{profile.username}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    )}
  </div>
)}

        <div className="space-y-4">
          {isLoading ? (
            <div className={`rounded-2xl p-5 text-sm font-semibold ${innerCard} ${primaryText}`}>
              Cargando perfil...
            </div>
          ) : posts.length === 0 ? (
            <div className={`rounded-2xl p-5 text-sm ${innerCard} ${bodyText}`}>
              Este usuario todavía no ha compartido reflexiones.
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className={`rounded-2xl border p-5 ${innerCard}`}
              >
                <div className="mb-3">
                  <p className={`text-sm font-semibold ${accentText}`}>
                    {post.gospelReference}
                  </p>

                  <p className={`mt-1 text-xs ${mutedText}`}>
                    {post.date} · {post.time}
                  </p>
                </div>

                <p className={`leading-7 ${bodyText}`}>{post.text}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}


function ProfileStat({
  label,
  value,
  theme,
}: {
  label: string;
  value: number;
  theme: { innerCard: string; primaryText: string; accentText: string };
}) {
  return (
    <article className={`rounded-2xl border px-4 py-5 ${theme.innerCard}`}>
      <p className={`text-2xl font-bold leading-none ${theme.primaryText}`}>
        {value}
      </p>

      <p className={`mt-2 text-sm font-semibold leading-tight ${theme.accentText}`}>
        {label}
      </p>
    </article>
  );
}
