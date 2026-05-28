import { supabase } from "../lib/supabaseClient";

export async function getFollowingIds(userId: string) {
  const { data, error } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", userId);

  if (error || !data) {
    console.error("Error loading follows:", error);
    return [];
  }

  return data.map((follow) => follow.following_id);
}

export async function isFollowingUser({
  currentUserId,
  targetUserId,
}: {
  currentUserId: string;
  targetUserId: string;
}) {
  const { data, error } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", currentUserId)
    .eq("following_id", targetUserId)
    .maybeSingle();

  if (error) {
    console.error("Error checking follow:", error);
    return false;
  }

  return !!data;
}

export async function followUser({
  currentUserId,
  targetUserId,
}: {
  currentUserId: string;
  targetUserId: string;
}) {
  const { error } = await supabase.from("follows").insert({
    follower_id: currentUserId,
    following_id: targetUserId,
  });

  return { error };
}

export async function unfollowUser({
  currentUserId,
  targetUserId,
}: {
  currentUserId: string;
  targetUserId: string;
}) {
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", currentUserId)
    .eq("following_id", targetUserId);

  return { error };
}