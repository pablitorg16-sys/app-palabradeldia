"use client";

import { useCallback, useEffect, useState } from "react";

import type { CommunityPost } from "../types";

import { supabase } from "../lib/supabaseClient";
import { getGlobalCommunityPosts } from "../utils/communitySupabase";
import { getFollowingIds } from "../utils/follows";

export function useCommunityPosts(
  isAuthenticated: boolean,
  currentUserId?: string
) {
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(false);
  const [hasLoadedCommunity, setHasLoadedCommunity] = useState(false);

  const refreshCommunityPosts = useCallback(
    async (showLoading = false) => {
      if (!isAuthenticated || !currentUserId) {
        setCommunityPosts([]);
        setFollowingIds([]);
        setHasLoadedCommunity(false);
        return;
      }

      if (showLoading) {
        setIsLoadingCommunity(true);
      }

      const [posts, followedIds] = await Promise.all([
        getGlobalCommunityPosts(currentUserId),
        getFollowingIds(currentUserId),
      ]);

      setCommunityPosts(posts);
      setFollowingIds(followedIds);
      setHasLoadedCommunity(true);

      if (showLoading) {
        setIsLoadingCommunity(false);
      }
    },
    [isAuthenticated, currentUserId]
  );

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
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reflections",
        },
        async () => {
          await refreshCommunityPosts(false);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reflection_likes",
        },
        async () => {
          await refreshCommunityPosts(false);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reflection_comments",
        },
        async () => {
          await refreshCommunityPosts(false);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "follows",
        },
        async () => {
          await refreshCommunityPosts(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated, currentUserId, refreshCommunityPosts]);

  return {
    communityPosts,
    followingIds,
    isLoadingCommunity: isLoadingCommunity && !hasLoadedCommunity,
    refreshCommunityPosts,
  };
}