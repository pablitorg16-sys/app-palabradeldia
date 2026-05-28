"use client";

import { useMemo, useState } from "react";
import type { CommunityPost } from "../types";

export type CommunityFeedMode = "popular" | "following";

function isFromLastTwoDays(post: CommunityPost) {
  const postDate = new Date(post.createdAt).getTime();
  const now = Date.now();
  const twoDays = 2 * 24 * 60 * 60 * 1000;

  return now - postDate <= twoDays;
}

export function useCommunityFeed(
  posts: CommunityPost[],
  followingIds: string[]
) {
  const [feedMode, setFeedMode] = useState<CommunityFeedMode>("popular");

  const sortedPosts = useMemo(() => {
    const clonedPosts = [...posts];

    if (feedMode === "following") {
      return clonedPosts
        .filter((post) => followingIds.includes(post.author.id))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
    }

    return clonedPosts
      .filter(isFromLastTwoDays)
      .sort((a, b) => b.likes + b.comments - (a.likes + a.comments));
  }, [posts, feedMode, followingIds]);

  return {
    feedMode,
    setFeedMode,
    sortedPosts,
  };
}