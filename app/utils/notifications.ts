import { supabase } from "../lib/supabaseClient";
import type { User } from "../types";

export type AppNotification = {
  id: string;
  type: "like" | "comment" | "follow";
  read: boolean;
  createdAt: string;
  actor: User;
  reflectionId?: string;
};

type NotificationRow = {
  id: string;
  type: "like" | "comment" | "follow";
  read: boolean;
  created_at: string;
  actor_id: string;
  reflection_id: string | null;
};

type ProfileRow = {
  id: string;
  name: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
};

export async function createNotification({
  recipientId,
  actorId,
  type,
  reflectionId,
  commentId,
}: {
  recipientId: string;
  actorId: string;
  type: "like" | "comment" | "follow";
  reflectionId?: string | number;
  commentId?: string;
}) {
  if (recipientId === actorId) {
    return { error: null };
  }

  const { error } = await supabase.from("notifications").insert({
    recipient_id: recipientId,
    actor_id: actorId,
    type,
    reflection_id: reflectionId ?? null,
    comment_id: commentId ?? null,
  });

  return { error };
}

export async function getNotifications(userId: string) {
  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("id, type, read, created_at, actor_id, reflection_id")
    .eq("recipient_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !notifications) {
    console.error("Error loading notifications:", error);
    return [];
  }

  const actorIds = Array.from(
    new Set(notifications.map((item: NotificationRow) => item.actor_id))
  );

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name, username, avatar_url, bio")
    .in("id", actorIds);

  const profilesMap = new Map<string, ProfileRow>();

  profiles?.forEach((profile: ProfileRow) => {
    profilesMap.set(profile.id, profile);
  });

  return notifications.map((item: NotificationRow): AppNotification => {
    const profile = profilesMap.get(item.actor_id);

    return {
      id: item.id,
      type: item.type,
      read: item.read,
      createdAt: item.created_at,
      reflectionId: item.reflection_id ?? undefined,
      actor: {
        id: item.actor_id,
        name: profile?.name ?? "Usuario",
        username: profile?.username ?? "usuario",
        avatarUrl: profile?.avatar_url ?? undefined,
        bio: profile?.bio ?? undefined,
      },
    };
  });
}

export async function markNotificationsAsRead(userId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("recipient_id", userId)
    .eq("read", false);

  return { error };
}