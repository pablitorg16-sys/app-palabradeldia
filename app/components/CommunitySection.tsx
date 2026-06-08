"use client";

import { useEffect, useMemo, useState } from "react";
import { normalizeDate } from "../utils/diary";
import type { CommunityPost, Gospel, User } from "../types";
import CommunityPostCard from "./CommunityPost";
import CommunitySkeleton from "./skeletons/CommunitySkeleton";
import { useCommunityFeed, type CommunityFeedMode } from "../hooks/useCommunityFeed";
import { getLiturgicalDaysByDates } from "../utils/liturgicalDays";
import { useTheme } from "../context/ThemeContext";
import { getThemeClasses } from "../utils/theme";
import { Users, UserPlus } from "lucide-react";

type CommunitySectionProps = {
  posts: CommunityPost[];
  gospels: Gospel[];
  currentUser: User;
  followingIds: string[];
  onToggleLike: (post: CommunityPost) => void;
  onSaveToDiary: (post: CommunityPost) => void;
  onFollowChange: () => void;
  onCommentChange: () => void;
  onGoToGospel?: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
};

export default function CommunitySection({
  posts,
  gospels,
  currentUser,
  followingIds,
  onToggleLike,
  onSaveToDiary,
  onFollowChange,
  onCommentChange,
  onGoToGospel,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: CommunitySectionProps) {
  const { theme: dayPeriod } = useTheme();
  const theme = getThemeClasses();
  const isNight = dayPeriod === "night";

  const [supabaseGospels, setSupabaseGospels] = useState<Gospel[]>([]);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(true);
  const { feedMode, setFeedMode, sortedPosts } = useCommunityFeed(posts, followingIds);

  const gospelDates = useMemo(() => {
    return Array.from(new Set(posts.map((p) => normalizeDate(p.gospelDate)).filter(Boolean)));
  }, [posts]);

  useEffect(() => {
    setIsLoadingCommunity(true);
    const timeout = window.setTimeout(() => setIsLoadingCommunity(false), 450);
    return () => window.clearTimeout(timeout);
  }, [feedMode, posts.length]);

  useEffect(() => {
    let isMounted = true;
    async function loadAssociatedGospels() {
      const loaded = await getLiturgicalDaysByDates(gospelDates);
      if (!isMounted) return;
      setSupabaseGospels(loaded);
    }
    void loadAssociatedGospels();
    return () => { isMounted = false; };
  }, [gospelDates]);

  const availableGospels = useMemo(() => {
    const byDate = new Map<string, Gospel>();
    [...supabaseGospels, ...gospels].forEach((g) => byDate.set(normalizeDate(g.date), g));
    return Array.from(byDate.values());
  }, [supabaseGospels, gospels]);

  const activeClass = isNight
    ? "border-[#d9e2cf]/55 bg-[#d9e2cf] text-[#202822]"
    : "border-[#26351f] bg-[#26351f] text-white";

  function renderFeedButton(mode: CommunityFeedMode, label: string) {
    return (
      <button
        type="button"
        onClick={() => setFeedMode(mode)}
        className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
          feedMode === mode ? activeClass : theme.mutedButton
        }`}
      >
        {label}
      </button>
    );
  }

  if (isLoadingCommunity) return <CommunitySkeleton />;

  return (
    <section data-tour="community-section" className="space-y-5">
      <div>
        <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${theme.accentText}`}>
          Comunidad
        </p>
        <p className={`mt-2 text-sm leading-6 ${theme.bodyText}`}>
          Lee meditaciones compartidas por otros usuarios y guarda las que quieras llevar a tu diario.
        </p>
      </div>

      <div className={`inline-flex rounded-full border p-1 shadow-sm ${theme.innerCard}`}>
        {renderFeedButton("popular", "Populares")}
        {renderFeedButton("following", "Siguiendo")}
      </div>

      {sortedPosts.length === 0 ? (
        <div className={`rounded-[2rem] border p-7 shadow-sm ${theme.card}`}>
          <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-[1.1rem] border ${theme.innerCard}`}>
            {feedMode === "following" ? (
              <UserPlus size={24} className={theme.accentText} />
            ) : (
              <Users size={24} className={theme.accentText} />
            )}
          </div>

          <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${theme.accentText}`}>
            {feedMode === "following" ? "Siguiendo" : "Populares"}
          </p>

          <h3 className={`mt-2 text-xl font-bold ${theme.primaryText}`}>
            {feedMode === "following"
              ? "Todavía no sigues a nadie"
              : "Aún no hay reflexiones compartidas"}
          </h3>

          <p className={`mt-3 text-sm leading-7 ${theme.bodyText}`}>
            {feedMode === "following"
              ? "Explora las reflexiones populares y sigue a las personas cuya forma de ver el Evangelio te inspire."
              : "Sé el primero. Cuando guardes una reflexión puedes compartirla con la comunidad con un solo tap."}
          </p>

          <button
            type="button"
            onClick={() => feedMode === "following" ? setFeedMode("popular") : onGoToGospel?.()}
            className={`mt-6 w-full rounded-2xl border px-5 py-3 text-sm font-semibold transition ${theme.mutedButton}`}
          >
            {feedMode === "following"
              ? "Explorar reflexiones populares"
              : "Escribir mi primera reflexión"}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {sortedPosts.map((post) => (
            <CommunityPostCard
              key={post.id}
              post={post}
              gospels={availableGospels}
              currentUserId={currentUser.id}
              isOwnPost={post.author.id === currentUser.id}
              onToggleLike={onToggleLike}
              onSaveToDiary={onSaveToDiary}
              onFollowChange={onFollowChange}
              onCommentChange={onCommentChange}
            />
          ))}

          {hasMore && (
            <button
              type="button"
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className={`mx-auto mt-2 block rounded-full border px-5 py-3 text-sm font-semibold shadow-sm transition disabled:opacity-50 ${theme.mutedButton}`}
            >
              {isLoadingMore ? "Cargando..." : "Cargar más reflexiones"}
            </button>
          )}
        </div>
      )}
    </section>
  );
}