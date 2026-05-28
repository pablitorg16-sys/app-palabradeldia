import { supabase } from "../lib/supabaseClient";
import type { User } from "../types";

export async function usernameExistsForAnotherUser({
  username,
  currentUserId,
}: {
  username: string;
  currentUserId: string;
}) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .neq("id", currentUserId)
    .maybeSingle();

  if (error) {
    return { exists: false, error };
  }

  return { exists: !!data, error: null };
}

export async function updateUserProfile(user: User) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        name: user.name,
        username: user.username,
        bio: user.bio ?? "",
        avatar_url: user.avatarUrl ?? null,
      },
      { onConflict: "id" }
    )
    .select("id, name, username, avatar_url, bio")
    .single();

  return { data, error };
}
