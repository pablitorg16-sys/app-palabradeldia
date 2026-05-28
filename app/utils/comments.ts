import { supabase } from "../lib/supabaseClient";
import type { CommunityComment, User } from "../types";

type CommentRow = {
  id: string;
  reflection_id: string;
  user_id: string;
  text: string;
  created_at: string;
};

type ProfileRow = {
  id: string;
  name: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
};

export async function getCommentsForReflection(
  reflectionId: string | number
): Promise<CommunityComment[]> {
  const { data: comments, error } = await supabase
    .from("reflection_comments")
    .select("id, reflection_id, user_id, text, created_at")
    .eq("reflection_id", reflectionId)
    .order("created_at", { ascending: true });

  if (error || !comments) {
    console.error("Error loading comments:", error);
    return [];
  }

  const userIds = Array.from(
    new Set(comments.map((comment: CommentRow) => comment.user_id))
  );

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name, username, avatar_url, bio")
    .in("id", userIds);

  const profilesMap = new Map<string, ProfileRow>();

  profiles?.forEach((profile: ProfileRow) => {
    profilesMap.set(profile.id, profile);
  });

  return comments.map((comment: CommentRow) => {
    const profile = profilesMap.get(comment.user_id);
    const createdAt = new Date(comment.created_at);

    const author: User = {
      id: comment.user_id,
      name: profile?.name ?? "Usuario",
      username: profile?.username ?? "usuario",
      avatarUrl: profile?.avatar_url ?? undefined,
      bio: profile?.bio ?? undefined,
    };

    return {
      id: comment.id,
      reflectionId: comment.reflection_id,
      author,
      text: comment.text,
      date: createdAt.toLocaleDateString("es-ES"),
      time: createdAt.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: comment.created_at,
    };
  });
}

export async function createComment({
  reflectionId,
  userId,
  text,
}: {
  reflectionId: string | number;
  userId: string;
  text: string;
}) {
  const { error } = await supabase.from("reflection_comments").insert({
    reflection_id: reflectionId,
    user_id: userId,
    text,
  });

  return { error };
}

export async function deleteComment(commentId: string) {
  const { error } = await supabase
    .from("reflection_comments")
    .delete()
    .eq("id", commentId);

  return { error };
}