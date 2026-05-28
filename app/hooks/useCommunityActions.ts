"use client";

import type { CommunityPost } from "../types";
import { toggleReflectionLike } from "../utils/communitySupabase";
import { createNotification } from "../utils/notifications";

export function useCommunityActions({
  userId,
  onAfterChange,
}: {
  userId?: string;
  onAfterChange?: () => void;
}) {
  async function toggleLike(post: CommunityPost) {
    if (!userId) return;

    const { error } = await toggleReflectionLike({
      reflectionId: post.id,
      userId,
      isLikedByMe: post.isLikedByMe,
    });

    if (error) {
      console.error("Error toggling like:", error.message);
      return;
    }

    if (!post.isLikedByMe && post.author.id !== userId) {
      await createNotification({
        recipientId: post.author.id,
        actorId: userId,
        type: "like",
        reflectionId: post.id,
      });
    }

    onAfterChange?.();
  }

  return {
    toggleLike,
  };
}