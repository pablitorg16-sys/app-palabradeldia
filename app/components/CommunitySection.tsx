"use client";

import { useEffect, useMemo, useState } from "react";
import { normalizeDate } from "../utils/diary";
import type { CommunityPost, Gospel, User } from "../types";
import CommunityPostCard from "./CommunityPost";
import CommunitySkeleton from "./skeletons/CommunitySkeleton";
import {
  useCommunityFeed,
  type CommunityFeedMode,
} from "../hooks/useCommunityFeed";

import { getLiturgicalDaysByDates } from "../utils/liturgicalDays";

type Theme = {
  mode?: string;
  card: string;
  softCard: string;
  innerCard: string;
  mutedButton: string;
  input: string;
  accentText: string;
  primaryText: string;
  bodyText: string;
  mutedText: string;
  pill: string;
  button: string;
};

type CommunitySectionProps = {
  posts: CommunityPost[];
  gospels: Gospel[];
  currentUser: User;
  followingIds: string[];
  theme: Theme;
  onToggleLike: (post: CommunityPost) => void;
  onSaveToDiary: (post: CommunityPost) => void;
  onFollowChange: () => void;
  onCommentChange: () => void;
};

export default function CommunitySection({
  posts,
  gospels,
  currentUser,
  followingIds,
  theme,
  onToggleLike,
  onSaveToDiary,
  onFollowChange,
  onCommentChange,
}: CommunitySectionProps) {
  const [supabaseGospels, setSupabaseGospels] = useState<Gospel[]>([]);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(true);
  const { feedMode, setFeedMode, sortedPosts } = useCommunityFeed(
    posts,
    followingIds
  );

  const gospelDates = useMemo(() => {
  return Array.from(
    new Set(posts.map((post) => normalizeDate(post.gospelDate)).filter(Boolean))
  );
}, [posts]);

  useEffect(() => {
  setIsLoadingCommunity(true);

  const timeout = window.setTimeout(() => {
    setIsLoadingCommunity(false);
  }, 450);

  return () => window.clearTimeout(timeout);
}, [feedMode, posts.length]);

  useEffect(() => {
    let isMounted = true;

    async function loadAssociatedGospels() {
      const loadedGospels = await getLiturgicalDaysByDates(gospelDates);

      if (!isMounted) return;

      setSupabaseGospels(loadedGospels);
    }

    void loadAssociatedGospels();

    return () => {
      isMounted = false;
    };
  }, [gospelDates]);

  const availableGospels = useMemo(() => {
  const byDate = new Map<string, Gospel>();

  [...supabaseGospels, ...gospels].forEach((gospel) => {
    byDate.set(normalizeDate(gospel.date), gospel);
  });

  return Array.from(byDate.values());
}, [supabaseGospels, gospels]);

  function renderFeedButton(mode: CommunityFeedMode, label: string) {
    const isActive = feedMode === mode;

    return (
      <button
        type="button"
        onClick={() => setFeedMode(mode)}
        className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
          isActive
            ? theme.mode === "night"
              ? "border-[#d9e2cf]/55 bg-[#d9e2cf] text-[#202822]"
              : "border-[#26351f] bg-[#26351f] text-white"
            : theme.mutedButton
        }`}
      >
        {label}
      </button>
    );
  }
if (isLoadingCommunity) {
  return <CommunitySkeleton theme={theme} />;
}
  return (
    <section data-tour="community-section" className="space-y-5">
      <div>
        <p
          className={`text-xs font-semibold uppercase tracking-[0.35em] ${theme.accentText}`}
        >
          Comunidad
        </p>

        <p className={`mt-2 text-sm leading-6 ${theme.bodyText}`}>
          Lee meditaciones compartidas por otros usuarios y guarda las que
          quieras llevar a tu diario.
        </p>
      </div>

      <div
        className={`inline-flex rounded-full border p-1 shadow-sm ${theme.innerCard}`}
      >
        {renderFeedButton("popular", "Populares")}
        {renderFeedButton("following", "Siguiendo")}
      </div>

      {sortedPosts.length === 0 ? (
        <p
          className={`rounded-[2rem] border border-dashed p-6 leading-7 ${theme.innerCard} ${theme.bodyText}`}
        >
          Todavía no hay reflexiones compartidas en esta vista.
        </p>
      ) : (
        <div className="space-y-5">
          {sortedPosts.map((post) => (
            <CommunityPostCard
              key={post.id}
              post={post}
              gospels={availableGospels}
              theme={theme}
              currentUserId={currentUser.id}
              isOwnPost={post.author.id === currentUser.id}
              onToggleLike={onToggleLike}
              onSaveToDiary={onSaveToDiary}
              onFollowChange={onFollowChange}
              onCommentChange={onCommentChange}
            />
          ))}
        </div>
      )}
    </section>
  );
}