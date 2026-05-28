import { supabase } from "../lib/supabaseClient";
import type { CommunityPost, User } from "../types";

export async function getPublicProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    console.error("Error loading public profile:", error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    username: data.username,
    avatarUrl: data.avatar_url ?? undefined,
    bio: data.bio ?? undefined,
  };
}

export async function getPublicProfilePosts(
  userId: string
): Promise<CommunityPost[]> {
  const { data, error } = await supabase
    .from("reflections")
    .select("*")
    .eq("user_id", userId)
    .eq("shared", true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error loading public profile posts:", error);
    return [];
  }

  const profile = await getPublicProfile(userId);

  if (!profile) return [];

  return data.map((row) => {
    const createdAt = new Date(row.created_at);

    return {
      id: row.id,
      author: profile,
      text: row.text,
      date: createdAt.toLocaleDateString("es-ES"),
      time: createdAt.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: row.created_at,
      gospelDate: row.gospel_date,
      gospelReference: row.gospel_reference,
      likes: 0,
      comments: 0,
      isLikedByMe: false,
      isSavedByMe: false,
      tags: row.tags ?? [],
      sourceDiaryEntryId: row.id,
    };
  });
}

export async function getProfileFollowStats(userId: string) {
  const [{ count: followersCount }, { count: followingCount }] = await Promise.all([
    supabase
      .from("follows")
      .select("follower_id", { count: "exact", head: true })
      .eq("following_id", userId),
    supabase
      .from("follows")
      .select("following_id", { count: "exact", head: true })
      .eq("follower_id", userId),
  ]);

  return {
    followersCount: followersCount ?? 0,
    followingCount: followingCount ?? 0,
  };
}
export async function getFollowerProfiles(userId: string): Promise<User[]> {
  const { data, error } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("following_id", userId);

  if (error || !data) {
    console.error("Error loading followers:", error);
    return [];
  }

  const ids = data.map((row) => row.follower_id);

  if (ids.length === 0) return [];

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .in("id", ids);

  if (profilesError || !profiles) {
    console.error("Error loading follower profiles:", profilesError);
    return [];
  }

  return profiles.map((profile) => ({
    id: profile.id,
    name: profile.name,
    username: profile.username,
    avatarUrl: profile.avatar_url ?? undefined,
    bio: profile.bio ?? undefined,
  }));
}

export async function getFollowingProfiles(userId: string): Promise<User[]> {
  const { data, error } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", userId);

  if (error || !data) {
    console.error("Error loading following:", error);
    return [];
  }

  const ids = data.map((row) => row.following_id);

  if (ids.length === 0) return [];

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .in("id", ids);

  if (profilesError || !profiles) {
    console.error("Error loading following profiles:", profilesError);
    return [];
  }

  return profiles.map((profile) => ({
    id: profile.id,
    name: profile.name,
    username: profile.username,
    avatarUrl: profile.avatar_url ?? undefined,
    bio: profile.bio ?? undefined,
  }));
}