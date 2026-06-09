"use client";

import { useCallback, useEffect, useState } from "react";
import type { CommunityPost } from "../types";
import { supabase } from "../lib/supabaseClient";
import { getGlobalCommunityPosts } from "../utils/communitySupabase";
import { getFollowingIds } from "../utils/follows";

const PAGE_SIZE = 10;

export function useCommunityPosts(
  isAuthenticated: boolean,
  currentUserId?: string
) {
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasLoadedCommunity, setHasLoadedCommunity] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);

  const refreshCommunityPosts = useCallback(
    async (showLoading = false) => {
      if (!isAuthenticated || !currentUserId) {
        setCommunityPosts([]);
        setFollowingIds([]);
        setHasLoadedCommunity(false);
        setHasMore(false);
        setPage(0);
        return;
      }

      if (showLoading) setIsLoadingCommunity(true);

      const [{ posts, hasMore: more }, followedIds] = await Promise.all([
        getGlobalCommunityPosts(currentUserId, 0, PAGE_SIZE),
        getFollowingIds(currentUserId),
      ]);

      setCommunityPosts(posts);
      setFollowingIds(followedIds);
      setHasMore(more);
      setPage(0);
      setHasLoadedCommunity(true);

      if (showLoading) setIsLoadingCommunity(false);
    },
    [isAuthenticated, currentUserId]
  );

  async function loadMorePosts() {
    if (!currentUserId || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = page + 1;

    const { posts: morePosts, hasMore: more } = await getGlobalCommunityPosts(
      currentUserId,
      nextPage,
      PAGE_SIZE
    );

    setCommunityPosts((current) => [...current, ...morePosts]);
    setHasMore(more);
    setPage(nextPage);
    setIsLoadingMore(false);
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void refreshCommunityPosts(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [refreshCommunityPosts]);

  useEffect(() => {
    if (!isAuthenticated || !currentUserId) return;

    const channel = supabase
      .channel(`community-feed-${currentUserId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "reflections" },
        async () => { await refreshCommunityPosts(false); })
      .on("postgres_changes", { event: "*", schema: "public", table: "reflection_likes" },
        async () => { await refreshCommunityPosts(false); })
      .on("postgres_changes", { event: "*", schema: "public", table: "reflection_comments" },
        async () => { await refreshCommunityPosts(false); })
      .on("postgres_changes", { event: "*", schema: "public", table: "follows" },
        async () => { await refreshCommunityPosts(false); })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isAuthenticated, currentUserId, refreshCommunityPosts]);

  // Reconectar cuando el usuario vuelve a la app
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void refreshCommunityPosts(false);
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [refreshCommunityPosts]);

  return {
    communityPosts,
    followingIds,
    isLoadingCommunity: isLoadingCommunity && !hasLoadedCommunity,
    isLoadingMore,
    hasMore,
    loadMorePosts,
    refreshCommunityPosts,
  };
}