import { supabase } from "../lib/supabaseClient";
import type { CommunityPost, ReflectionTag, User } from "../types";

type ReflectionRow = {
  id: string;
  user_id: string;
  text: string;
  gospel_date: string;
  gospel_reference: string;
  tags: ReflectionTag[] | null;
  created_at: string;
};

type ProfileRow = {
  id: string;
  name: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
};

type LikeRow = {
  reflection_id: string;
  user_id: string;
};

type CommentCountRow = {
  reflection_id: string;
};

export async function getGlobalCommunityPosts(
  currentUserId?: string
): Promise<CommunityPost[]> {
  const { data: reflections, error: reflectionsError } = await supabase
    .from("reflections")
    .select("id, user_id, text, gospel_date, gospel_reference, tags, created_at")
    .eq("shared", true)
    .order("created_at", { ascending: false });

  if (reflectionsError || !reflections) {
    console.error("Error loading community reflections:", reflectionsError);
    return [];
  }

  if (reflections.length === 0) return [];

  const reflectionIds = reflections.map(
    (reflection: ReflectionRow) => reflection.id
  );

  const userIds = Array.from(
    new Set(reflections.map((reflection: ReflectionRow) => reflection.user_id))
  );

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name, username, avatar_url, bio")
    .in("id", userIds);

  const { data: likes } = await supabase
    .from("reflection_likes")
    .select("reflection_id, user_id")
    .in("reflection_id", reflectionIds);

  const { data: comments } = await supabase
    .from("reflection_comments")
    .select("reflection_id")
    .in("reflection_id", reflectionIds);

  const profilesMap = new Map<string, ProfileRow>();
  const likesCountMap = new Map<string, number>();
  const commentsCountMap = new Map<string, number>();
  const likedByMeSet = new Set<string>();

  profiles?.forEach((profile: ProfileRow) => {
    profilesMap.set(profile.id, profile);
  });

  likes?.forEach((like: LikeRow) => {
    likesCountMap.set(
      like.reflection_id,
      (likesCountMap.get(like.reflection_id) ?? 0) + 1
    );

    if (currentUserId && like.user_id === currentUserId) {
      likedByMeSet.add(like.reflection_id);
    }
  });

  comments?.forEach((comment: CommentCountRow) => {
    commentsCountMap.set(
      comment.reflection_id,
      (commentsCountMap.get(comment.reflection_id) ?? 0) + 1
    );
  });

  return reflections.map((reflection: ReflectionRow) => {
    const profile = profilesMap.get(reflection.user_id);

    const author: User = {
      id: reflection.user_id,
      name: profile?.name ?? "Usuario",
      username: profile?.username ?? "usuario",
      avatarUrl: profile?.avatar_url ?? undefined,
      bio: profile?.bio ?? undefined,
    };

    const createdAt = new Date(reflection.created_at);

    return {
      id: reflection.id,
      author,
      text: reflection.text,
      date: createdAt.toLocaleDateString("es-ES"),
      time: createdAt.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: reflection.created_at,
      gospelDate: reflection.gospel_date,
      gospelReference: reflection.gospel_reference,
      likes: likesCountMap.get(reflection.id) ?? 0,
      comments: commentsCountMap.get(reflection.id) ?? 0,
      isLikedByMe: likedByMeSet.has(reflection.id),
      isSavedByMe: false,
      tags: reflection.tags ?? [],
      sourceDiaryEntryId: reflection.id,
    };
  });
}

export async function toggleReflectionLike({
  reflectionId,
  userId,
  isLikedByMe,
}: {
  reflectionId: string | number;
  userId: string;
  isLikedByMe: boolean;
}) {
  if (isLikedByMe) {
    const { error } = await supabase
      .from("reflection_likes")
      .delete()
      .eq("reflection_id", reflectionId)
      .eq("user_id", userId);

    return { error };
  }

  const { error } = await supabase.from("reflection_likes").insert({
    reflection_id: reflectionId,
    user_id: userId,
  });

  return { error };
}